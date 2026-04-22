// ================================================================
// MATHEUS ACADEMY — Admin Guard
// ================================================================
// Protege o painel admin: garante que SOMENTE administradores
// listados em ADMIN_EMAILS consigam carregar a pagina.
//
// COMO USAR:
// 1. Salve este arquivo no repositorio: shared/admin-guard.js
// 2. No <head> do admin-cursos.html, ANTES de qualquer outro script,
//    adicione:
//      <script src="firebase-config.js"></script>
//      <script src="shared/admin-guard.js"></script>
//
// 3. Faca commit e push.
// ================================================================

(function () {
  'use strict';

  // ⚠️ EDITE AQUI a lista de emails que podem acessar o admin
  const ADMIN_EMAILS = [
    'matheushenry1998@gmail.com',
    'portal.matheushenry@gmail.com'
  ];

  const LOGIN_URL = 'index.html'; // pagina de login do site

  // Mostra uma tela de bloqueio enquanto verifica
  function blockUI(msg) {
    var overlay = document.createElement('div');
    overlay.id = '__ma_admin_guard';
    overlay.style.cssText = [
      'position:fixed','inset:0','z-index:999999',
      'background:#080c14','color:#f0f4ff',
      'display:flex','flex-direction:column',
      'align-items:center','justify-content:center',
      'font-family:system-ui,-apple-system,sans-serif',
      'padding:24px','text-align:center'
    ].join(';');
    overlay.innerHTML =
      '<div style="font-size:44px;margin-bottom:16px">🔐</div>' +
      '<div id="__ma_guard_msg" style="font-size:16px;font-weight:600;margin-bottom:10px">' + msg + '</div>' +
      '<div style="font-size:13px;color:#8899bb;max-width:380px">Aguarde a verificacao de permissao...</div>';
    document.documentElement.appendChild(overlay);
  }

  function updateMsg(msg) {
    var el = document.getElementById('__ma_guard_msg');
    if (el) el.textContent = msg;
  }

  function unblock() {
    var overlay = document.getElementById('__ma_admin_guard');
    if (overlay) overlay.remove();
  }

  function denyAndRedirect(motivo) {
    updateMsg('❌ Acesso negado: ' + motivo);
    var sub = document.querySelector('#__ma_admin_guard div:last-child');
    if (sub) sub.textContent = 'Redirecionando para login em 3 segundos...';
    setTimeout(function () {
      window.location.href = LOGIN_URL;
    }, 3000);
  }

  // Esperar Firebase Auth ficar pronto
  function waitForAuth() {
    return new Promise(function (resolve) {
      function check() {
        if (window.maAuth) { resolve(window.maAuth); return; }
        if (window.firebase && firebase.auth) { resolve(firebase.auth()); return; }
        setTimeout(check, 100);
      }
      check();
    });
  }

  // Bloquear UI imediatamente
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { blockUI('Verificando autenticacao...'); });
  } else {
    blockUI('Verificando autenticacao...');
  }

  // Iniciar verificacao
  waitForAuth().then(function (auth) {
    updateMsg('Verificando login...');

    // onAuthStateChanged eh o mais confiavel
    var unsub = auth.onAuthStateChanged(function (user) {
      try { unsub(); } catch (e) {}

      if (!user) {
        denyAndRedirect('Voce precisa fazer login primeiro');
        return;
      }

      var email = (user.email || '').toLowerCase();
      var allowed = ADMIN_EMAILS.map(function (e) { return e.toLowerCase(); });

      if (allowed.indexOf(email) === -1) {
        console.warn('[Admin Guard] Email nao autorizado:', email);
        denyAndRedirect('Esta conta nao tem privilegios de administrador');
        return;
      }

      // Tudo OK
      console.log('[Admin Guard] ✅ Acesso autorizado para:', email);
      unblock();

      // Disparar evento para o resto do admin saber que esta ok
      document.dispatchEvent(new CustomEvent('maAdminReady', {
        detail: { uid: user.uid, email: email }
      }));
    });
  }).catch(function (err) {
    console.error('[Admin Guard] Erro:', err);
    denyAndRedirect('Erro ao carregar Firebase Auth');
  });

})();
