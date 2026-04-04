/**
 * ============================================================
 * MATHEUS ACADEMY — POINTS-FIX.JS v1
 * Correção universal de pontos para TODAS as páginas.
 *
 * PROBLEMA CORRIGIDO:
 *   Todas as páginas liam pontos de localStorage 'ma_points'
 *   (chave legada NUNCA populada pelo Firebase v3).
 *   O Firebase v3 salva em: ma_user.xp_total
 *
 * COMO USAR: adicione antes de </body> em qualquer página:
 *   <script src="shared/points-fix.js"></script>
 *
 * O script faz TUDO automaticamente:
 *   1. Lê pontos corretos de ma_user.xp_total
 *   2. Atualiza TODOS os elementos de XP na página
 *   3. Aguarda Firebase e sincroniza novamente
 *   4. Popula foto de perfil do Google Auth automaticamente
 * ============================================================
 */
(function () {
  'use strict';

  /* ── Helpers ── */
  function _get(k, def) {
    try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; }
  }
  function _set(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { }
  }

  /* ── Lê pontos da fonte CORRETA: ma_user.xp_total ── */
  function _getPoints() {
    // Prioridade 1: cache MAStore em memória
    if (window.MAStore && typeof MAStore.getTotalPointsSync === 'function') {
      var cached = MAStore.getTotalPointsSync();
      if (cached > 0) return cached;
    }
    // Prioridade 2: ma_user.xp_total (onde Firestore salva)
    var user = _get('ma_user', null);
    if (user && typeof user.xp_total === 'number') return user.xp_total;
    // Prioridade 3: ma_points legado (fallback)
    var pts = _get('ma_points', { total: 0 });
    return pts.total || 0;
  }

  /* ── Atualiza TODOS os elementos de pontos na página ── */
  function _updateAllPoints(pts) {
    var selectors = [
      '#maTbPtsN', '#maTbPtsNum', '#maPtsNum', '#hdrPtsNum',
      '.ma-tb-ptsn', '.ma-tb-pts-num', '.maTbPtsN',
      '#heroPts', '#sPts', '#fBadgeN',
      '.pts-display', '.xp-display', '#user-points', '#topbar-points',
      '#maMenuPts', '.ma-mu-pts-val'
    ];
    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        // Não sobrescrever se o elemento tiver texto não-numérico (ex: ícone embutido)
        if (el.tagName === 'SPAN' || el.tagName === 'DIV' || el.tagName === 'B') {
          el.textContent = pts.toLocaleString('pt-BR');
        }
      });
    });

    // Atualiza saldo na loja.html
    var saldoEl = document.getElementById('shopBalance');
    if (saldoEl) saldoEl.textContent = pts.toLocaleString('pt-BR') + ' pts';

    var saldoEl2 = document.querySelector('.pts-banner-num');
    if (saldoEl2) saldoEl2.textContent = pts.toLocaleString('pt-BR');

    // Atualiza menu dropdown
    var muPts = document.querySelector('.ma-mu-pts');
    var user = _get('ma_user', null);
    if (muPts && user) {
      muPts.innerHTML = '<b>' + pts.toLocaleString('pt-BR') + '</b> XP';
    }

    // Também preenche ma_points legado para compatibilidade com código antigo
    var legacy = _get('ma_points', { total: 0, history: [] });
    if (legacy.total !== pts) {
      legacy.total = pts;
      _set('ma_points', legacy);
    }
  }

  /* ── Sincronização principal ── */
  function _sync() {
    var pts = _getPoints();
    _updateAllPoints(pts);
  }

  /* ── Foto de perfil do Google Auth ── */
  function _syncProfilePhoto() {
    // Só executa se não houver foto customizada salva
    var savedAv = localStorage.getItem('ma_avatar');
    if (savedAv) return; // foto customizada prevalece

    // Tenta pegar do Firebase Auth
    var photoURL = null;

    // Método 1: Firebase Auth currentUser
    if (window.firebase && firebase.auth && firebase.auth().currentUser) {
      photoURL = firebase.auth().currentUser.photoURL;
    }

    // Método 2: MA_AUTH
    if (!photoURL && window.MA_AUTH && typeof MA_AUTH.getUser === 'function') {
      var fbUser = MA_AUTH.getUser ? MA_AUTH.getUser() : null;
      if (fbUser && fbUser.photoURL) photoURL = fbUser.photoURL;
    }

    // Método 3: ma_user.foto
    if (!photoURL) {
      var u = _get('ma_user', null);
      if (u && u.foto) photoURL = u.foto;
    }

    if (photoURL) {
      _applyPhoto(photoURL);
    }
  }

  function _applyPhoto(url) {
    if (!url) return;
    // Salva para uso em perfil.html
    localStorage.setItem('ma_avatar', url);

    // Aplica em todos os avatares conhecidos
    var avatarSelectors = [
      '#heroAv', '#profAvEl', '.prof-av', '.hero-av',
      '#profilePhoto', '.user-avatar'
    ];
    avatarSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (!el.querySelector('img')) {
          el.innerHTML = '<img src="' + url + '" alt="Foto de perfil" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block">';
        }
      });
    });
  }

  /* ── Aguarda Firebase e re-sincroniza ── */
  function _onFirebaseReady() {
    // Sincroniza foto
    _syncProfilePhoto();

    // Registra observer de auth para sincronizar pontos quando usuário logar
    if (window.MA_AUTH && typeof MA_AUTH.onAuthChange === 'function') {
      MA_AUTH.onAuthChange(function (authUser) {
        if (authUser) {
          // Pega foto do Google
          if (authUser.photoURL) _applyPhoto(authUser.photoURL);

          // Aguarda dados do Firestore
          if (window.MAStore && typeof MAStore.getUser === 'function') {
            MAStore.getUser().then(function (userData) {
              if (userData) {
                var pts = userData.xp_total || 0;
                _updateAllPoints(pts);
                _syncProfilePhoto();
              }
            }).catch(function () { });
          }
        }
      });
    }

    // Também faz sync imediato após Firebase pronto
    setTimeout(_sync, 500);
  }

  /* ── Polling periódico ── */
  function _startPolling() {
    var _lastPts = -1;
    setInterval(function () {
      var pts = _getPoints();
      if (pts !== _lastPts) {
        _lastPts = pts;
        _updateAllPoints(pts);
      }
    }, 2000);
  }

  /* ── INIT ── */
  // 1. Sync imediato com o que está no cache
  _sync();
  _syncProfilePhoto();

  // 2. Sync quando DOM carregar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      _sync();
      _syncProfilePhoto();
    });
  } else {
    setTimeout(function () { _sync(); _syncProfilePhoto(); }, 100);
  }

  // 3. Aguarda Firebase
  if (window.__maFirebaseReady) {
    _onFirebaseReady();
  } else {
    document.addEventListener('maFirebaseReady', _onFirebaseReady, { once: true });
  }

  // 4. Polling contínuo
  _startPolling();

  // 5. Escuta evento de atualização de pontos
  document.addEventListener('ma:pointsUpdate', function (e) {
    if (e.detail && typeof e.detail.total === 'number') {
      _updateAllPoints(e.detail.total);
    }
  });

  // 6. Escuta eventos legados
  window.addEventListener('ma-points-synced', function (e) {
    if (e.detail && e.detail.points) _updateAllPoints(e.detail.points);
  });
  window.addEventListener('ma-points-added', function (e) {
    if (e.detail && e.detail.total) _updateAllPoints(e.detail.total);
  });

  // Expõe globalmente
  window.MA_syncPoints = _sync;
  window.MA_applyPhoto = _applyPhoto;

  console.log('[points-fix.js v1] ✅ Carregado — sincronização universal de pontos ativa');
})();
