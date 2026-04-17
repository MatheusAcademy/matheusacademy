/* ══════════════════════════════════════════════════════════════
   MATHEUS ACADEMY — PORTAL TOPBAR v3 (Firebase Edition)
   ══════════════════════════════════════════════════════════════
   
   MUDANÇAS NA v3:
   - Busca pontos do Firebase (via MAStore) ao invés do localStorage
   - Escuta evento 'ma:pointsUpdate' para atualizar em tempo real
   - Mantém compatibilidade com código existente
   
   COMO USAR:
     No <head> de cada página do portal:
     <script src="firebase-config.js"></script>
     <script src="data/courses.js"></script>
     <script src="data/userStore.js"></script>
     <script src="shared/portal-topbar.js"></script>
   ══════════════════════════════════════════════════════════════ */

(function injectPortalTopbar() {

  /* ── Mapa automático de páginas ── */
  var PAGE_NAMES = {
    'index.html'       : '🏠 Início',
    'painel.html'      : '📊 Meu Painel',
    'ranking.html'     : '🏆 Ranking',
    'perfil.html'      : '👤 Meu Perfil',
    'indicacoes.html'  : '🤝 Indicações',
    'trilhas.html'     : '🗺️ Trilhas',
    'loja.html'        : '🛒 Loja de XP',
    'mural.html'       : '📌 Mural',
    'planos.html'      : '💎 Planos',
    'admin-codigos.html': '🔑 Admin'
  };

  var currentFile = window.location.pathname.split('/').pop() || 'index.html';
  var autoName = PAGE_NAMES[currentFile] || '';
  var pageName = (window.PORTAL_PAGE && window.PORTAL_PAGE.title) || autoName;

  /* ── CSS da topbar ── */
  var style = document.createElement('style');
  style.textContent = `
    :root {
      --topbar-h: 56px;
      --bg:    #08080f;
      --bg2:   #111122;
      --brd:   #1e1e35;
      --pri:   #5b7fff;
      --txt:   #e8e8f0;
      --txt2:  #8888a8;
      --font:  'Outfit', sans-serif;
    }
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap');

    body { padding-top: var(--topbar-h); }

    /* ══ TOPBAR ══ */
    .ma-topbar {
      position: fixed; top: 0; left: 0; right: 0;
      height: var(--topbar-h);
      background: rgba(4,4,10,.99);
      border-bottom: 1px solid rgba(91,127,255,.15);
      display: flex; align-items: center;
      /* Safe-area: respeita notch/ilha lateral do iPhone */
      padding: 0 max(12px, env(safe-area-inset-right)) 0 max(12px, env(safe-area-inset-left));
      gap: 5px;
      z-index: 9999; font-family: var(--font);
      box-sizing: border-box;
      overflow: hidden;
    }
    .ma-topbar::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1.5px;
      background: linear-gradient(90deg, transparent 0%, #4A7EFF 30%, #00d4ff 65%, transparent 100%);
      opacity: .75;
    }
    .ma-tb-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
    /* Logo menor no mobile */
    .ma-tb-logo svg { display: block; flex-shrink: 0; width: 90px; height: 26px; }
    @media(min-width:480px){ .ma-tb-logo svg { width: 130px; height: 38px; } }
    .ma-tb-sep { width: 1px; height: 20px; background: rgba(255,255,255,.1); flex-shrink: 0; }
    .ma-tb-page-name { font-size: .62rem; font-weight: 700; color: var(--txt2); white-space: nowrap; flex-shrink: 0; overflow: hidden; text-overflow: ellipsis; max-width: 90px; }
    @media(min-width:400px){ .ma-tb-page-name { max-width: 120px; } }
    @media(min-width:480px){ .ma-tb-page-name { max-width: 180px; } }
    .ma-tb-spacer { flex: 1; min-width: 0; }

    /* Bloco troféu + pontos */
    .ma-tb-pts-block {
      display: flex; align-items: center; gap: 5px;
      text-decoration: none; flex-shrink: 0;
      padding: 4px 9px 4px 8px; border-radius: 20px;
      border: 1px solid rgba(255,255,255,.1);
      background: rgba(255,255,255,.04); transition: all .2s; cursor: pointer;
      white-space: nowrap;
    }
    .ma-tb-pts-block:hover { border-color: rgba(255,255,255,.25); background: rgba(255,255,255,.08); }
    .ma-tb-pts-block.bump { animation: ptsBump .45s cubic-bezier(.2,0,.3,1); }
    @keyframes ptsBump { 0%{transform:scale(1)} 35%{transform:scale(1.2)} 65%{transform:scale(.95)} 100%{transform:scale(1)} }
    .ma-tb-trophy { display: flex; align-items: center; justify-content: center; color: #f59e0b; flex-shrink: 0; }
    .ma-tb-trophy svg { width: 14px; height: 14px; stroke: #f59e0b; }
    .ma-tb-pts-num {
      font-size: .78rem; font-weight: 900; color: #fff;
      font-variant-numeric: tabular-nums; letter-spacing: .02em;
      min-width: 22px; text-align: right; line-height: 1; transition: color .3s;
    }
    .ma-tb-pts-block.bump .ma-tb-pts-num { color: #f59e0b; }

    /* Botão tema */
    .ma-tb-theme-btn {
      width: 32px; height: 32px; border-radius: 9px;
      border: 1px solid var(--brd); background: var(--bg2); color: #f59e0b;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: all .2s; padding: 0;
    }
    .ma-tb-theme-btn svg { width: 15px; height: 15px; stroke: currentColor; pointer-events: none; }
    .ma-tb-theme-btn:hover { border-color: rgba(245,158,11,.5); background: rgba(245,158,11,.08); }

    /* Botão menu 3 pontos */
    .ma-tb-menu-btn {
      width: 32px; height: 32px; border-radius: 9px;
      border: 1px solid var(--brd); background: var(--bg2); color: #8888a8;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: all .2s; padding: 0;
    }
    .ma-tb-menu-btn svg { width: 15px; height: 15px; stroke: currentColor; pointer-events: none; }
    .ma-tb-menu-btn:hover { border-color: rgba(255,255,255,.3); color: #fff; }

    /* Menu dropdown — alinhado dentro da safe-area */
    .ma-menu-overlay { position: fixed; inset: 0; z-index: 10000; display: none; }
    .ma-menu-overlay.open { display: block; }
    .ma-menu-dd {
      position: fixed; top: calc(var(--topbar-h) + 6px);
      right: max(10px, env(safe-area-inset-right));
      background: #0f0f1e; border: 1px solid #252540; border-radius: 14px;
      min-width: 220px; max-width: calc(100vw - 20px);
      z-index: 10001; box-shadow: 0 16px 56px rgba(0,0,0,.75);
      overflow-y: auto; max-height: 65vh; opacity: 0;
      transform: scale(.88) translateY(-12px); pointer-events: none;
      transition: all .22s cubic-bezier(.2,0,.3,1); transform-origin: top right;
    }
    .ma-menu-dd.open { opacity: 1; transform: scale(1) translateY(0); pointer-events: all; }
    .ma-menu-user { padding: 10px 14px 0; border-bottom: 1px solid #1e1e35; }
    .ma-mu-name { font-size: .78rem; font-weight: 800; color: #fff; display: block; margin-bottom: 2px; }
    .ma-mu-badge { display: inline-block; font-size: .55rem; font-weight: 700; color: #f59e0b; background: rgba(245,158,11,.12); border: 1px solid rgba(245,158,11,.25); border-radius: 8px; padding: 1px 7px; margin-top: 2px; }
    .ma-mu-pts { font-size: .6rem; color: #8888a8; margin-top: 4px; margin-bottom: 8px; }
    .ma-mu-pts b { color: #5b7fff; }
    .ma-menu-sec { padding: 3px 0; }
    .ma-menu-sec + .ma-menu-sec { border-top: 1px solid #1e1e35; }
    .ma-mi {
      display: flex; align-items: center; gap: 8px; padding: 7px 14px;
      font-size: .72rem; font-weight: 600; color: #8888a8; text-decoration: none;
      cursor: pointer; border: none; background: transparent;
      font-family: var(--font); width: 100%; text-align: left; transition: background .15s;
    }
    .ma-mi:hover { background: #161628; color: #e8e8f0; }
    .ma-mi-icon { font-size: .85rem; width: 20px; text-align: center; flex-shrink: 0; }
    .ma-mi.gold { color: #f59e0b; }
    .ma-mi.red  { color: #ef4444; }

    /* ══ TEMA CLARO ══ */
    body.light .ma-topbar { background: rgba(240,242,248,.98); border-bottom-color: rgba(91,127,255,.2); }
    body.light .ma-topbar::before { opacity: .5; }
    body.light .ma-tb-page-name { color: #5a5a7a; }
    body.light .ma-tb-pts-block { border-color: rgba(0,0,0,.15); background: rgba(0,0,0,.04); }
    body.light .ma-tb-pts-num { color: #1a1a2e; }
    body.light .ma-tb-theme-btn { color: #5b7fff; }
    body.light .ma-tb-theme-btn:hover { border-color: rgba(91,127,255,.4); background: rgba(91,127,255,.08); }
    body.light .ma-tb-menu-btn { background: #f0f2f8; border-color: #d0d4e8; color: #5a5a7a; }
    body.light .ma-menu-dd { background: #ffffff; border-color: #d0d4e8; box-shadow: 0 16px 56px rgba(0,0,0,.15); }
    body.light .ma-menu-user { border-bottom-color: #e8eaf2; }
    body.light .ma-mu-name { color: #1a1a2e; }
    body.light .ma-mi { color: #5a5a7a; }
    body.light .ma-mi:hover { background: #f0f2f8; color: #1a1a2e; }
    body.light .ma-menu-sec + .ma-menu-sec { border-top-color: #e8eaf2; }
    body.light .ma-mu-badge { background: rgba(245,158,11,.08); border-color: rgba(245,158,11,.2); }

    /* ══ BOTÃO PLANOS — oculto em telas pequenas ══ */
    .ma-tb-plans-btn {
      display: flex; align-items: center; gap: 5px;
      padding: 4px 10px; border-radius: 20px; flex-shrink: 0;
      font-size: .65rem; font-weight: 700; letter-spacing: .04em;
      text-decoration: none; color: #f59e0b;
      border: 1px solid rgba(245,158,11,.35);
      background: rgba(245,158,11,.08);
      transition: all .2s; white-space: nowrap;
    }
    .ma-tb-plans-btn:hover { background: rgba(245,158,11,.18); border-color: rgba(245,158,11,.6); }
    /* Oculta totalmente em telas muito pequenas */
    @media (max-width: 380px) { .ma-tb-plans-btn { display: none !important; } }
    @media (max-width: 480px) { .ma-tb-plans-btn span.ma-tb-plans-label { display: none; } }
  `;
  document.head.appendChild(style);

  /* ── Lê XP em cache ANTES de gerar HTML (evita flash de 0) ── */
  var _cachedXP = 0;
  try {
    var _cu = JSON.parse(localStorage.getItem('ma_user') || 'null');
    if (_cu && typeof _cu.xp_total === 'number') {
      _cachedXP = _cu.xp_total;
    }
  } catch(e) {}
  var _cachedXPStr = _cachedXP.toLocaleString('pt-BR');

  /* ── HTML da topbar ── */
  var html = `
<nav class="ma-topbar">

  <!-- LOGO SVG horizontal — M branco + linha dupla azul + ACADEMY -->
  <a class="ma-tb-logo" href="index.html">
    <svg viewBox="0 0 260 76" xmlns="http://www.w3.org/2000/svg">
      <text x="36" y="52" text-anchor="middle" fill="#FFFFFF"
            font-family="Arial Black,sans-serif" font-weight="900" font-size="56" letter-spacing="-2">M</text>
      <line x1="4" y1="60" x2="70" y2="60" stroke="#4A7EFF" stroke-width="2.2"/>
      <line x1="4" y1="65" x2="70" y2="65" stroke="#4A7EFF" stroke-width="1" opacity=".4"/>
      <line x1="84" y1="12" x2="84" y2="66" stroke="rgba(74,126,255,0.35)" stroke-width="1"/>
      <text x="175" y="49" text-anchor="middle" fill="#4A7EFF"
            font-family="Arial,sans-serif" font-weight="400" font-size="20" letter-spacing="7">ACADEMY</text>
    </svg>
  </a>

  <div class="ma-tb-sep"></div>
  <span class="ma-tb-page-name" id="tbPageName">${pageName}</span>
  <div class="ma-tb-spacer"></div>

  <!-- BOTÃO PLANOS — visível sempre na topbar -->
  <a class="ma-tb-plans-btn" href="planos.html" id="maTopbarPlansBtn">
    💎 <span class="ma-tb-plans-label">Planos</span>
  </a>

  <!-- TROFÉU + PONTOS -->
  <a class="ma-tb-pts-block" id="maPtsLive" href="painel.html">
    <span class="ma-tb-trophy">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 9H4a2 2 0 0 1-2-2V5h4"/>
        <path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/>
        <path d="M8 21h8"/><path d="M12 17v4"/>
        <path d="M6 5v4a6 6 0 0 0 12 0V5H6z"/>
      </svg>
    </span>
    <span class="ma-tb-pts-num" id="maPtsNum">${_cachedXPStr}</span>
  </a>

  <!-- BOTÃO TEMA -->
  <button class="ma-tb-theme-btn" id="ptThemeBtn" onclick="ptToggleTheme()" title="Alternar tema">
    <svg id="ptIconMoon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" style="display:block">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
    <svg id="ptIconSun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" style="display:none">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  </button>

  <!-- MENU 3 PONTOS -->
  <button class="ma-tb-menu-btn" onclick="ptToggleMenu()">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <circle cx="12" cy="5"  r="1" fill="currentColor"/>
      <circle cx="12" cy="12" r="1" fill="currentColor"/>
      <circle cx="12" cy="19" r="1" fill="currentColor"/>
    </svg>
  </button>
</nav>

<div class="ma-menu-overlay" id="ptMenuOverlay" onclick="ptCloseMenu()"></div>
<div class="ma-menu-dd" id="ptMenuDd">
  <div id="ptMenuUser" class="ma-menu-user"></div>
  <div class="ma-menu-sec">
    <a class="ma-mi" href="index.html">       <span class="ma-mi-icon">🏠</span>Início</a>
    <a class="ma-mi" href="cursos.html">      <span class="ma-mi-icon">🎓</span>Meus Cursos</a>
    <a class="ma-mi" href="painel.html">      <span class="ma-mi-icon">📊</span>Meu Painel</a>
    <a class="ma-mi" href="ranking.html">     <span class="ma-mi-icon">🏆</span>Ranking</a>
    <a class="ma-mi" href="perfil.html">      <span class="ma-mi-icon">👤</span>Meu Perfil</a>
    <a class="ma-mi" href="indicacoes.html">  <span class="ma-mi-icon">🤝</span>Indicações</a>
    <a class="ma-mi" href="trilhas.html">     <span class="ma-mi-icon">🗺️</span>Trilhas</a>
    <a class="ma-mi" href="loja.html">        <span class="ma-mi-icon">🛒</span>Loja de XP</a>
    <a class="ma-mi" href="mural.html">       <span class="ma-mi-icon">📌</span>Mural</a>
  </div>
  <div class="ma-menu-sec" id="ptMenuAuth"></div>
</div>
`;

  /* ── Injeta no body assim que o DOM estiver pronto ── */
  function inject() {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    document.body.insertBefore(wrapper, document.body.firstChild);
    ptInitTopbar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

})();

/* ══════════════════════════════════════════════════════════════
   FUNÇÕES GLOBAIS DA TOPBAR DO PORTAL
   ══════════════════════════════════════════════════════════════ */

function ptInitTopbar() {
  // Atualiza pontos imediatamente com dados do cache (já populado no HTML inicial)
  ptUpdatePts();

  // Oculta/mostra botão Planos conforme o plano do usuário
  (function _ptUpdPlansBtn() {
    var btn = document.getElementById('maTopbarPlansBtn');
    if (!btn) return;
    try {
      var u = window.MAStore ? MAStore.getUserSync() : JSON.parse(localStorage.getItem('ma_user') || 'null');
      var plano = u ? (u.plano || 'gratuito').toLowerCase() : 'gratuito';
      // Master tem tudo: botão fica discreto mas visível (pode querer ver dias restantes)
      if (plano === 'master') {
        btn.style.opacity = '.45';
        btn.title = 'Voc\u00ea j\u00e1 tem o Plano Master 3 Anos \u2014 acesso completo!';
      }
    } catch(e) {}
  })();

  // Tema salvo
  var saved = localStorage.getItem('ma_theme');
  if (saved === 'light') {
    document.body.classList.add('light');
    var moon = document.getElementById('ptIconMoon');
    var sun  = document.getElementById('ptIconSun');
    if (moon) moon.style.display = 'none';
    if (sun)  sun.style.display  = 'block';
  }

  ptUpdateMenuUser();

  // Atualiza XP a cada 30s (backup para manter sincronizado)
  setInterval(ptUpdatePts, 30000);
  
  // Escuta evento de atualização de pontos
  document.addEventListener('ma:pointsUpdate', function(e) {
    ptUpdatePtsFromEvent(e.detail);
  });
  
  // CORREÇÃO: quando Firebase estiver pronto, registra observer de auth
  // que atualiza a topbar sempre que o estado de login mudar
  function _setupFirebaseSync() {
    // Sincroniza imediatamente
    ptSyncFromFirebase();

    // Registra observer de autenticação para manter XP sempre atualizado
    if (window.maAuth) {
      window.maAuth.onAuthStateChanged(function(authUser) {
        if (authUser) {
          // Pequeno delay para garantir que MAStore terminou de iniciar
          setTimeout(ptSyncFromFirebase, 300);
        } else {
          var el = document.getElementById('maPtsNum');
          if (el) { el.textContent = '0'; el._prev = 0; }
          ptUpdateMenuUser();
        }
      });
    }
  }

  if (window.__maFirebaseReady) {
    _setupFirebaseSync();
  } else {
    document.addEventListener('maFirebaseReady', _setupFirebaseSync, { once: true });
  }
}

/**
 * Atualiza pontos na topbar - VERSÃO FIREBASE
 */
function ptUpdatePts() {
  var el = document.getElementById('maPtsNum');
  if (!el) return;

  var total = 0;

  // FIX: Se nao tem ma_user em localStorage, forca XP=0 (evita cache apos logout)
  var _lu = null;
  try { _lu = JSON.parse(localStorage.getItem('ma_user') || 'null'); } catch(e) {}

  if (!_lu) {
    total = 0;
  } else if (window.MAStore && window.MAStore.getTotalPointsSync) {
    // Prioridade 1: MAStore (Firebase)
    total = MAStore.getTotalPointsSync();
  } else {
    // Fallback: localStorage ma_user.xp_total
    total = (typeof _lu.xp_total === 'number') ? _lu.xp_total : 0;
  }
  
  var prev = el._prev;
  el.textContent = total.toLocaleString('pt-BR');
  
  // Animação de bump se mudou
  if (prev !== undefined && prev !== total) {
    var block = document.getElementById('maPtsLive');
    if (block) {
      block.classList.remove('bump');
      void block.offsetWidth;
      block.classList.add('bump');
    }
  }
  
  el._prev = total;
}

/**
 * Atualiza pontos quando recebe evento
 */
function ptUpdatePtsFromEvent(detail) {
  var el = document.getElementById('maPtsNum');
  if (!el) return;
  
  el.textContent = detail.total.toLocaleString('pt-BR');
  
  // Animação de bump
  var block = document.getElementById('maPtsLive');
  if (block) {
    block.classList.remove('bump');
    void block.offsetWidth;
    block.classList.add('bump');
  }
  
  el._prev = detail.total;
  
  // Atualiza menu também se estiver aberto
  ptUpdateMenuUser();
}

/**
 * Sincroniza pontos do Firebase
 */
async function ptSyncFromFirebase() {
  if (!window.MAStore) return;
  
  try {
    var user = await MAStore.getUser();
    if (user) {
      var total = user.xp_total || 0;
      var el = document.getElementById('maPtsNum');
      if (el) {
        el.textContent = total.toLocaleString('pt-BR');
        el._prev = total;
      }
      console.log('[Portal Topbar] Pontos sincronizados:', total);
    }
  } catch(e) {
    console.error('[Portal Topbar] Erro na sincronização:', e);
  }
}

function ptUpdateMenuUser() {
  var sec  = document.getElementById('ptMenuUser');
  var auth = document.getElementById('ptMenuAuth');
  if (!sec || !auth) return;
  
  // Prioridade: MAStore
  var u = null;
  var total = 0;
  
  if (window.MAStore && window.MAStore.getUserSync) {
    u = MAStore.getUserSync();
    total = u ? (u.xp_total || 0) : 0;
    // Se MAStore tem cache com xp_total mais preciso, usa ele
    if (window.MAStore.getTotalPointsSync) {
      total = MAStore.getTotalPointsSync();
    }
  } else {
    try {
      u = JSON.parse(localStorage.getItem('ma_user') || 'null');
      // v3 FIX: lê xp_total do ma_user (escrito pelo Firebase) — NUNCA ma_points legado
      total = (u && typeof u.xp_total === 'number') ? u.xp_total : 0;
    } catch(e) {}
  }
  
  if (u && (u.email || u.nome)) {
    var _firstName = ((u.nome || u.name || u.email || '').split(' ')[0]);
    var _badge = u.badge || 'Iniciante';
    sec.innerHTML  = '<span class="ma-mu-name">' + _firstName + '</span>'
                   + '<span class="ma-mu-badge">' + _badge + '</span>'
                   + '<div class="ma-mu-pts"><b>' + total.toLocaleString('pt-BR') + '</b> XP</div>';
    auth.innerHTML = '<a class="ma-mi gold" href="planos.html">'
                   + '<span class="ma-mi-icon">💎</span>Ver Planos</a>'
                   + '<button class="ma-mi red" onclick="ptLogout()">'
                   + '<span class="ma-mi-icon">🚪</span>Sair da conta</button>';
  } else {
    sec.innerHTML  = '<span class="ma-mu-name" style="color:#8888a8">Visitante</span>'
                   + '<div class="ma-mu-pts">Faça login para salvar seu progresso</div>';
    auth.innerHTML = '<a class="ma-mi" href="index.html" onclick="localStorage.setItem(\'ma_open_modal\',\'login\');return true">'
                   + '<span class="ma-mi-icon">🔑</span>Entrar / Cadastrar</a>'
                   + '<a class="ma-mi gold" href="planos.html">'
                   + '<span class="ma-mi-icon">💎</span>Ver Planos</a>';
  }
}

function ptToggleMenu() {
  var d = document.getElementById('ptMenuDd');
  var o = document.getElementById('ptMenuOverlay');
  if (!d || !o) return;
  d.classList.toggle('open');
  o.classList.toggle('open');
  if (d.classList.contains('open')) ptUpdateMenuUser();
}

function ptCloseMenu() {
  var d = document.getElementById('ptMenuDd');
  var o = document.getElementById('ptMenuOverlay');
  if (d) d.classList.remove('open');
  if (o) o.classList.remove('open');
}

function ptToggleTheme() {
  document.body.classList.toggle('light');
  var isLight = document.body.classList.contains('light');
  localStorage.setItem('ma_theme', isLight ? 'light' : 'dark');
  var moon = document.getElementById('ptIconMoon');
  var sun  = document.getElementById('ptIconSun');
  if (moon) moon.style.display = isLight ? 'none'  : 'block';
  if (sun)  sun.style.display  = isLight ? 'block' : 'none';
}

async function ptLogout() {
  ptCloseMenu();

  try {
    if (window.MAStore && MAStore.logout) {
      await MAStore.logout();
    } else if (window.MA_AUTH && MA_AUTH.logout) {
      await MA_AUTH.logout();
    }
  } catch(e) { console.warn('[ptLogout] erro:', e); }

  // FIX: limpa TODAS as chaves de sessao (evita XP persistir apos logout)
  var _keys = ['ma_user','ma_points','ma_streak2','ma_sessions','ma_online_status','ma_avatar','ma_course_progress','ma_activity_log'];
  _keys.forEach(function(k){ try { localStorage.removeItem(k); } catch(e) {} });

  location.href = 'index.html';
}

console.log('[Portal Topbar v3] ✅ Carregado - Firebase Edition');
