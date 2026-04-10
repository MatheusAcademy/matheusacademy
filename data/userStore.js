/**
 * ============================================================
 * MATHEUS ACADEMY — USERSTORE.JS v4
 * CORREÇÃO: Registra acesso a cada visita (não só no login)
 * ============================================================
 *
 * PROBLEMA CORRIGIDO NA v4:
 * - ultimo_acesso, streak_atual, dias_ativos não atualizavam
 * - MA_DB.registrarAcesso() só era chamado no login
 * - Visitas subsequentes (sessão mantida) não contabilizavam
 *
 * MUDANÇA v4:
 * - Auto-sync agora chama MA_DB.registrarAcesso() 1x por sessão
 * - Usa sessionStorage para evitar writes duplicados
 * - Garante que todo acesso ao portal é contabilizado
 *
 * ============================================================
 */

var MAStore = (function() {

  /* ══════════════════════════════════════════════════════════
     CACHE LOCAL — apenas para performance, NÃO é fonte de verdade
     ══════════════════════════════════════════════════════════ */
  var _cache = { user: null, userData: null, lastSync: 0 };
  var CACHE_TTL = 30000; // 30 segundos

  /* ══════════════════════════════════════════════════════════
     HELPERS INTERNOS
     ══════════════════════════════════════════════════════════ */
  function _get(key, def) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch(e) { return def; }
  }
  function _set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch(e) { return false; }
  }
  function _remove(key) {
    try { localStorage.removeItem(key); return true; } catch(e) { return false; }
  }

  function _waitFirebase() {
    return new Promise(function(resolve) {
      if (window.__maFirebaseReady && window.maAuth && window.maDb) { resolve(true); return; }
      var timeout = setTimeout(function() {
        console.warn('[MAStore] Firebase timeout - usando fallback');
        resolve(false);
      }, 5000);
      document.addEventListener('maFirebaseReady', function() {
        clearTimeout(timeout);
        resolve(true);
      }, { once: true });
    });
  }

  function _isCacheValid() {
    return _cache.userData && (Date.now() - _cache.lastSync) < CACHE_TTL;
  }

  /* ══════════════════════════════════════════════════════════
     USUÁRIO — Dados do Firebase Auth + Firestore
     ══════════════════════════════════════════════════════════ */
  async function getUser() {
    var ready = await _waitFirebase();
    if (!ready || !window.maAuth) {
      return _get('ma_user', null);
    }

    var authUser = window.maAuth.currentUser;
    if (!authUser) {
      _cache.user = null;
      _cache.userData = null;
      return null;
    }

    if (_isCacheValid() && _cache.user && _cache.user.uid === authUser.uid) {
      return _cache.userData;
    }

    try {
      var userData = await MA_DB.getUsuario(authUser.uid);
      if (userData) {
        _cache.user = authUser;
        _cache.userData = userData;
        _cache.lastSync = Date.now();

        _set('ma_user', {
          uid: authUser.uid,
          name: userData.nome || authUser.displayName || '',
          email: userData.email || authUser.email || '',
          foto: userData.foto || authUser.photoURL || '',
          plano: userData.plano || 'gratuito',
          cursos: userData.cursos_comprados || [],
          xp_total: userData.xp_total || 0
        });

        _remove('ma_points');
        return userData;
      }
    } catch(e) {
      console.error('[MAStore] Erro ao buscar usuário:', e);
    }

    return _get('ma_user', null);
  }

  async function isLoggedIn() {
    var user = await getUser();
    return user !== null;
  }

  function setCurrentUser(u) {
    _cache.userData = u;
    _cache.lastSync = Date.now();
    return _set('ma_user', u);
  }

  async function logout() {
    _cache.user = null;
    _cache.userData = null;
    _cache.lastSync = 0;
    if (window.MA_AUTH) {
      try { await MA_AUTH.logout(); } catch(e) { console.error('[MAStore] Erro no logout:', e); }
    }
    _remove('ma_user');
    _remove('ma_points');
  }

  /* ══════════════════════════════════════════════════════════
     PONTOS / XP — 100% Firebase
     ══════════════════════════════════════════════════════════ */
  async function getTotalPoints() {
    var user = await getUser();
    if (!user) return 0;
    return user.xp_total || 0;
  }

  async function addPoints(source, pts) {
    var ready = await _waitFirebase();
    if (!ready || !window.maAuth || !window.maAuth.currentUser) {
      console.warn('[MAStore] addPoints: usuário não autenticado');
      return 0;
    }
    var uid = window.maAuth.currentUser.uid;
    try {
      await MA_DB.addXP(uid, pts, source);
      _cache.lastSync = 0;
      var userData = await MA_DB.getUsuario(uid);
      var newTotal = userData ? userData.xp_total : 0;
      if (_cache.userData) { _cache.userData.xp_total = newTotal; }
      var local = _get('ma_user', {});
      local.xp_total = newTotal;
      _set('ma_user', local);
      _dispatchPointsUpdate(newTotal, pts, source);
      console.log('[MAStore] +' + pts + ' XP (' + source + ') = ' + newTotal + ' total');
      return newTotal;
    } catch(e) {
      console.error('[MAStore] Erro ao adicionar pontos:', e);
      return 0;
    }
  }

  async function getPoints() {
    var total = await getTotalPoints();
    return { total: total, history: [] };
  }

  function _dispatchPointsUpdate(total, added, source) {
    var event = new CustomEvent('ma:pointsUpdate', {
      detail: { total: total, added: added, source: source }
    });
    document.dispatchEvent(event);
    if (window.MA_onPointsUpdate) {
      window.MA_onPointsUpdate(total, added, source);
    }
  }

  /* ══════════════════════════════════════════════════════════
     ACESSO A CURSOS — 100% Firebase
     ══════════════════════════════════════════════════════════ */
  async function hasCourseAccess(ak) {
    if (!ak || ak === 'free') return true;
    var user = await getUser();
    if (!user) return false;
    if (user.plano === 'master' || user.plano === 'anual' || user.plano === 'mensal') return true;
    var cursos = user.cursos_comprados || [];
    var course = (typeof MA_COURSES !== 'undefined')
      ? MA_COURSES.find(function(c) { return c.ak === ak; }) : null;
    var courseKey = course ? (course.courseKey || course.id) : ak.replace('_auth', '');
    return cursos.indexOf(courseKey) >= 0 || cursos.indexOf(ak) >= 0;
  }

  async function unlockAllCourses(email, code, type, expiry) {
    var ready = await _waitFirebase();
    if (!ready || !window.maAuth || !window.maAuth.currentUser) return;
    var uid = window.maAuth.currentUser.uid;
    var plano = type === 'monthly' ? 'mensal' : 'master';
    try {
      await MA_DB.updateUsuario(uid, { plano: plano });
      _cache.lastSync = 0;
      var user = _get('ma_user', {});
      user.plano = plano;
      _set('ma_user', user);
    } catch(e) { console.error('[MAStore] Erro ao liberar todos os cursos:', e); }
  }

  async function unlockCourse(ak, email, code, type, expiry) {
    var ready = await _waitFirebase();
    if (!ready || !window.maAuth || !window.maAuth.currentUser) return;
    var uid = window.maAuth.currentUser.uid;
    var course = (typeof MA_COURSES !== 'undefined')
      ? MA_COURSES.find(function(c) { return c.ak === ak; }) : null;
    var courseKey = course ? (course.courseKey || course.id) : ak.replace('_auth', '');
    try {
      await MA_DB.liberarCurso(uid, courseKey, 'individual');
      _cache.lastSync = 0;
      var user = _get('ma_user', {});
      if (!user.cursos) user.cursos = [];
      if (user.cursos.indexOf(courseKey) < 0) user.cursos.push(courseKey);
      _set('ma_user', user);
    } catch(e) { console.error('[MAStore] Erro ao liberar curso:', e); }
  }

  /* ══════════════════════════════════════════════════════════
     PROGRESSO DOS CURSOS — 100% Firebase
     ══════════════════════════════════════════════════════════ */
  async function saveProgress(courseKey, dados) {
    var ready = await _waitFirebase();
    if (!ready || !window.maAuth || !window.maAuth.currentUser) return;
    var uid = window.maAuth.currentUser.uid;
    try {
      await MA_DB.salvarProgresso(uid, courseKey, dados);
      console.log('[MAStore] Progresso salvo:', courseKey);
    } catch(e) { console.error('[MAStore] Erro ao salvar progresso:', e); }
  }

  async function getProgress(courseKey) {
    var user = await getUser();
    if (!user || !user.progresso) return {};
    return user.progresso[courseKey] || {};
  }

  async function getAllProgress() {
    var user = await getUser();
    if (!user || !user.progresso) return {};
    return user.progresso;
  }

  async function markTopicDone(courseKey, moduleIdx, topicIdx) {
    var progress = await getProgress(courseKey);
    if (!progress.topicos_concluidos) { progress.topicos_concluidos = []; }
    var topicId = moduleIdx + '_' + topicIdx;
    if (progress.topicos_concluidos.indexOf(topicId) < 0) {
      progress.topicos_concluidos.push(topicId);
    }
    await saveProgress(courseKey, progress);
  }

  /* ══════════════════════════════════════════════════════════
     STREAK E SESSÕES — 100% Firebase
     ══════════════════════════════════════════════════════════ */
  async function getStreak() {
    var user = await getUser();
    if (!user) return 0;
    return user.streak_atual || 0;
  }

  async function getSessions() {
    var user = await getUser();
    if (!user) return { streak: 0, count: 0 };
    return {
      streak: user.streak_atual || 0,
      record: user.streak_record || 0,
      diasAtivos: user.dias_ativos || 0
    };
  }

  /* ══════════════════════════════════════════════════════════
     MISSÕES DIÁRIAS
     ══════════════════════════════════════════════════════════ */
  function getMissions() {
    var today = new Date().toLocaleDateString('pt-BR');
    var ms = _get('ma_missions', {});
    if (!ms.done || ms.date !== today) { ms = { date: today, done: {} }; }
    return ms;
  }
  function setMissions(ms) { return _set('ma_missions', ms); }
  async function completeMission(missionKey, pointsReward) {
    var ms = getMissions();
    if (ms.done[missionKey]) return false;
    ms.done[missionKey] = true;
    setMissions(ms);
    if (pointsReward) { await addPoints('Missão: ' + missionKey, pointsReward); }
    return true;
  }

  /* ══════════════════════════════════════════════════════════
     CURSOS RECENTES
     ══════════════════════════════════════════════════════════ */
  function getRecent() { return _get('ma_recent', []); }
  function addRecent(courseId, courseName) {
    var rec = getRecent();
    rec = rec.filter(function(r) { return r.id !== courseId; });
    rec.unshift({ id: courseId, name: courseName, ts: Date.now() });
    if (rec.length > 10) rec = rec.slice(0, 10);
    _set('ma_recent', rec);
  }

  /* ══════════════════════════════════════════════════════════
     TEMPO DE ESTUDO
     ══════════════════════════════════════════════════════════ */
  async function getTotalMins() {
    var user = await getUser();
    if (!user) return 0;
    return user.total_minutos_estudo || 0;
  }

  async function addStudyMins(mins) {
    var ready = await _waitFirebase();
    if (!ready || !window.maAuth || !window.maAuth.currentUser) return;
    var uid = window.maAuth.currentUser.uid;
    try {
      await MA_DB.updateUsuario(uid, {
        total_minutos_estudo: firebase.firestore.FieldValue.increment(mins)
      });
      _cache.lastSync = 0;
    } catch(e) { console.error('[MAStore] Erro ao adicionar minutos:', e); }
  }

  /* ══════════════════════════════════════════════════════════
     LOJA / BADGES
     ══════════════════════════════════════════════════════════ */
  function getShopOwned() { return _get('mae_shop_owned', []); }
  function setShopOwned(o) { return _set('mae_shop_owned', o); }
  function getShopStock() { return _get('mae_shop_stock', {}); }
  function setShopStock(s) { return _set('mae_shop_stock', s); }
  function getTrailBadges() { return _get('mae_trail_badges', []); }
  function addTrailBadge(b) {
    var badges = getTrailBadges();
    if (!badges.includes(b)) { badges.push(b); _set('mae_trail_badges', badges); return true; }
    return false;
  }

  /* ══════════════════════════════════════════════════════════
     UTILITÁRIOS
     ══════════════════════════════════════════════════════════ */
  async function syncFromFirebase() {
    _cache.lastSync = 0;
    await getUser();
    console.log('[MAStore] Cache sincronizado com Firebase');
  }
  function invalidateCache() { _cache.lastSync = 0; }
  function resetLocalCache() {
    ['ma_missions', 'ma_recent', 'mae_shop_owned', 'mae_shop_stock', 'mae_trail_badges'].forEach(function(k) { _remove(k); });
    _cache.user = null; _cache.userData = null; _cache.lastSync = 0;
  }

  /* ══════════════════════════════════════════════════════════
     COMPATIBILIDADE COM CÓDIGO LEGADO
     ══════════════════════════════════════════════════════════ */
  function getUserSync() { return _cache.userData || _get('ma_user', null); }

  function getTotalPointsSync() {
    if (_cache.userData && typeof _cache.userData.xp_total === 'number') {
      return _cache.userData.xp_total;
    }
    var user = _get('ma_user', null);
    if (user && typeof user.xp_total === 'number') { return user.xp_total; }
    return 0;
  }

  function getUsers() { return _get('ma_users', {}); }
  function setUsers(users) { return _set('ma_users', users); }
  function getAccess() { return _get('ma_access', {}); }
  function setAccess(a) { return _set('ma_access', a); }
  function setPoints(p) { /* Ignorado */ }
  function setSessions(s) { /* Ignorado */ }

  /* ══════════════════════════════════════════════════════════
     API PÚBLICA
     ══════════════════════════════════════════════════════════ */
  return {
    getUser: getUser, isLoggedIn: isLoggedIn, setCurrentUser: setCurrentUser, logout: logout,
    getUserSync: getUserSync,
    getTotalPoints: getTotalPoints, addPoints: addPoints, getPoints: getPoints,
    getTotalPointsSync: getTotalPointsSync,
    hasCourseAccess: hasCourseAccess, unlockAllCourses: unlockAllCourses, unlockCourse: unlockCourse,
    saveProgress: saveProgress, getProgress: getProgress, getAllProgress: getAllProgress, markTopicDone: markTopicDone,
    getStreak: getStreak, getSessions: getSessions,
    getMissions: getMissions, setMissions: setMissions, completeMission: completeMission,
    getRecent: getRecent, addRecent: addRecent,
    getTotalMins: getTotalMins, addStudyMins: addStudyMins,
    getShopOwned: getShopOwned, setShopOwned: setShopOwned,
    getShopStock: getShopStock, setShopStock: setShopStock,
    getTrailBadges: getTrailBadges, addTrailBadge: addTrailBadge,
    syncFromFirebase: syncFromFirebase, invalidateCache: invalidateCache, resetLocalCache: resetLocalCache,
    getUsers: getUsers, setUsers: setUsers,
    getAccess: getAccess, setAccess: setAccess,
    setPoints: setPoints, setSessions: setSessions,
    _get: _get, _set: _set, _remove: _remove
  };
})();

window.MAStore = MAStore;

/* ══════════════════════════════════════════════════════════
   FUNÇÕES GLOBAIS — Compatibilidade com código existente
   ══════════════════════════════════════════════════════════ */
window.MA_addPoints = async function(source, pts) {
  return await MAStore.addPoints(source, pts);
};

window.MA_getPoints = function() {
  var total = MAStore.getTotalPointsSync();
  return { total: total, history: [] };
};

document.addEventListener('ma:pointsUpdate', function(e) {
  var detail = e.detail;
  document.querySelectorAll('#maPtsNum, .ma-tb-pts-num, .pts-display').forEach(function(el) {
    el.textContent = detail.total.toLocaleString('pt-BR');
  });
  document.querySelectorAll('#maPtsLive, .ma-tb-pts-block').forEach(function(block) {
    block.classList.remove('bump');
    void block.offsetWidth;
    block.classList.add('bump');
    setTimeout(function() { block.classList.remove('bump'); }, 500);
  });
});

/* ══════════════════════════════════════════════════════════
   AUTO-SYNC v4 — Registra acesso + mantém UI sincronizada
   ══════════════════════════════════════════════════════════ */
(function() {

  // Anti-flash: mostra cache local imediatamente
  (function _showCacheImmediate() {
    try {
      var _u = JSON.parse(localStorage.getItem('ma_user')||'null');
      if (_u && typeof _u.xp_total === 'number' && _u.xp_total > 0) {
        var _xp = _u.xp_total;
        document.querySelectorAll('#maPtsNum, .ma-tb-pts-num, .maTbPtsN, #maTbPtsN, #hdrPtsNum').forEach(function(el) {
          el.textContent = _xp.toLocaleString('pt-BR');
        });
      }
    } catch(e) {}
  })();

  function _onFirebaseReady() {
    console.log('[MAStore v4] Firebase pronto, configurando observer de auth...');

    if (window.MA_AUTH) {
      MA_AUTH.onAuthChange(async function(authUser) {
        if (authUser) {

          // ★★★ CORREÇÃO v4: Registrar acesso a CADA VISITA (não só no login) ★★★
          // Usa sessionStorage para garantir apenas 1 write por sessão de navegador
          var sessionKey = 'ma_acesso_registrado_' + authUser.uid;
          if (!sessionStorage.getItem(sessionKey)) {
            try {
              await MA_DB.registrarAcesso(authUser.uid);
              sessionStorage.setItem(sessionKey, Date.now().toString());
              console.log('[MAStore v4] ✅ Acesso registrado para:', authUser.uid);
            } catch(e) {
              console.warn('[MAStore v4] Erro ao registrar acesso:', e);
            }
          } else {
            console.log('[MAStore v4] Acesso já registrado nesta sessão');
          }

          // Mostra cache enquanto busca dados frescos
          try {
            var _cached = JSON.parse(localStorage.getItem('ma_user')||'null');
            if (_cached && typeof _cached.xp_total === 'number' && _cached.xp_total > 0) {
              document.querySelectorAll('#maPtsNum, .ma-tb-pts-num, .maTbPtsN, #maTbPtsN, #hdrPtsNum').forEach(function(el) {
                el.textContent = _cached.xp_total.toLocaleString('pt-BR');
              });
            }
          } catch(e2) {}

          // Busca dados frescos do Firestore
          var user = await MAStore.getUser();
          if (user) {
            var total = user.xp_total || 0;
            document.querySelectorAll('#maPtsNum, .ma-tb-pts-num, .maTbPtsN, #maTbPtsN, #hdrPtsNum').forEach(function(el) {
              el.textContent = total.toLocaleString('pt-BR');
            });
            if (window.ptSyncFromFirebase) ptSyncFromFirebase();
            if (window.updTopbar) window.updTopbar();
            console.log('[MAStore v4] Auth OK —', user.nome, '| XP:', total, '| Streak:', user.streak_atual || 0);
          }
        } else {
          MAStore.invalidateCache();
          document.querySelectorAll('#maPtsNum, .ma-tb-pts-num, .maTbPtsN, #maTbPtsN, #hdrPtsNum').forEach(function(el) {
            el.textContent = '0';
          });
        }
      });
    } else {
      console.warn('[MAStore v4] MA_AUTH não disponível no maFirebaseReady');
    }
  }

  if (window.__maFirebaseReady) {
    _onFirebaseReady();
  } else {
    document.addEventListener('maFirebaseReady', _onFirebaseReady, { once: true });
  }

})();

console.log('[MAStore v4] ✅ Carregado - Fix: registra acesso a cada visita');
