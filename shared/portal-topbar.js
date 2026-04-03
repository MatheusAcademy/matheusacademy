/* ══════════════════════════════════════════════════════════════
   MATHEUS ACADEMY — PORTAL TOPBAR v1
   Injeta o cabeçalho padrão (igual ao course-engine) em todas
   as páginas do portal: index, painel, ranking, perfil,
   indicacoes, trilhas, loja, mural
   ══════════════════════════════════════════════════════════════
   USO: coloque <script src="shared/portal-topbar.js"></script>
   no <head> de cada página do portal, APÓS os outros scripts.
   Defina a variável global antes de incluir este arquivo:
     var PORTAL_PAGE = { title: '📊 Meu Painel' };
   ══════════════════════════════════════════════════════════════ */

(function injectPortalTopbar() {

  /* ── CSS da topbar (idêntico ao course.css) ── */
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
    body { padding-top: var(--topbar-h); }

    /* ── TOPBAR ── */
    .ma-topbar {
      position: fixed; top: 0; left: 0; right: 0;
      height: var(--topbar-h);
      background: rgba(4,4,10,.99);
      border-bottom: 1px solid rgba(91,127,255,.15);
      display: flex; align-items: center; padding: 0 14px; gap: 6px;
      z-index: 9999; font-family: var(--font);
    }
    .ma-topbar::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1.5px;
      background: linear-gradient(90deg,transparent 0%,#4A7EFF 30%,#00d4ff 65%,transparent 100%);
      opacity: .75;
    }
    .ma-tb-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
    .ma-tb-logo svg { display: block; flex-shrink: 0; }
    .ma-tb-sep { width: 1px; height: 20px; background: rgba(255,255,255,.1); flex-shrink: 0; }
    .ma-tb-page-name { font-size: .66rem; font-weight: 700; color: var(--txt2); white-space: nowrap; flex-shrink: 0; }
    .ma-tb-spacer { flex: 1; min-width: 0; }

    /* Bloco troféu + pontos */
    .ma-tb-pts-block {
      display: flex; align-items: center; gap: 7px;
      text-decoration: none; flex-shrink: 0;
      padding: 5px 12px 5px 10px; border-radius: 22px;
      border: 1px solid rgba(255,255,255,.1);
      background: rgba(255,255,255,.04); transition: all .2s; cursor: pointer;
    }
    .ma-tb-pts-block:hover { border-color: rgba(255,255,255,.25); background: rgba(255,255,255,.08); }
    .ma-tb-pts-block.bump { animation: ptsBump .45s cubic-bezier(.2,0,.3,1); }
    @keyframes ptsBump { 0%{transform:scale(1)} 35%{transform:scale(1.2)} 65%{transform:scale(.95)} 100%{transform:scale(1)} }
    .ma-tb-trophy { display: flex; align-items: center; justify-content: center; color: #f59e0b; flex-shrink: 0; }
    .ma-tb-trophy svg { width: 16px; height: 16px; stroke: #f59e0b; }
    .ma-tb-pts-num {
      font-size: .82rem; font-weight: 900; color: #fff;
      font-variant-numeric: tabular-nums; letter-spacing: .02em;
      min-width: 28px; text-align: right; line-height: 1; transition: color .3s;
    }
    .ma-tb-pts-block.bump .ma-tb-pts-num { color: #f59e0b; }

    /* Botão tema */
    .ma-tb-theme-btn {
      width: 34px; height: 34px; border-radius: 9px;
      border: 1px solid var(--brd); background: var(--bg2); color: #f59e0b;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: all .2s; padding: 0;
    }
    .ma-tb-theme-btn svg { width: 16px; height: 16px; stroke: currentColor; pointer-events: none; }
    .ma-tb-theme-btn:hover { border-color: rgba(245,158,11,.5); background: rgba(245,158,11,.08); }
    body.light .ma-tb-theme-btn { color: #5b7fff; }

    /* Botão menu 3 pontos */
    .ma-tb-menu-btn {
      width: 34px; height: 34px; border-radius: 9px;
      border: 1px solid var(--brd); background: var(--bg2); color: #8888a8;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: all .2s; padding: 0;
    }
    .ma-tb-menu-btn svg { width: 16px; height: 16px; stroke: currentColor; pointer-events: none; }
    .ma-tb-menu-btn:hover { border-color: rgba(255,255,255,.3); color: #fff; }

    /* Menu dropdown */
    .ma-menu-overlay { position: fixed; inset: 0; z-index: 10000; display: none; }
    .ma-menu-overlay.open { display: block; }
    .ma-menu-dd {
      position: fixed; top: 62px; right: 10px;
      background: #0f0f1e; border: 1px solid #252540; border-radius: 16px;
      min-width: 240px; z-index: 10001; box-shadow: 0 16px 56px rgba(0,0,0,.75);
      overflow: hidden; opacity: 0;
      transform: scale(.88) translateY(-12px); pointer-events: none;
      transition: all .22s cubic-bezier(.2,0,.3,1); transform-origin: top right;
    }
    .ma-menu-dd.open { opacity: 1; transform: scale(1) translateY(0); pointer-events: all; }
    .ma-menu-user { padding: 14px 16px 0; border-bottom: 1px solid #1e1e35; }
    .ma-mu-name { font-size: .85rem; font-weight: 800; color: #fff; display: block; margin-bottom: 5px; }
    .ma-mu-pts { font-size: .63rem; color: #8888a8; margin-top: 6px; margin-bottom: 10px; }
    .ma-mu-pts b { color: #5b7fff; }
    .ma-menu-sec { padding: 5px 0; }
    .ma-menu-sec + .ma-menu-sec { border-top: 1px solid #1e1e35; }
    .ma-mi {
      display: flex; align-items: center; gap: 10px; padding: 11px 16px;
      font-size: .78rem; font-weight: 600; color: #8888a8; text-decoration: none;
      cursor: pointer; border: none; background: transparent;
      font-family: var(--font); width: 100%; text-align: left; transition: background .15s;
    }
    .ma-mi:hover { background: #161628; color: #e8e8f0; }
    .ma-mi-icon { font-size: 1rem; width: 22px; text-align: center; flex-shrink: 0; }
    .ma-mi.gold { color: #f59e0b; }
    .ma-mi.red  { color: #ef4444; }

    /* Tema claro */
    body.light .ma-topbar { background: rgba(240,242,248,.98); border-bottom-color: rgba(91,127,255,.2); }
    body.light .ma-menu-dd { background: #ffffff; border-color: #d0d4e8; box-shadow: 0 16px 56px rgba(0,0,0,.15); }
    body.light .ma-menu-user { border-bottom-color: #e8eaf2; }
    body.light .ma-mi { color: #5a5a7a; }
    body.light .ma-mi:hover { background: #f0f2f8; color: #1a1a2e; }
    body.light .ma-menu-sec + .ma-menu-sec { border-top-color: #e8eaf2; }
    body.light .ma-tb-pts-block { border-color: rgba(0,0,0,.15); background: rgba(0,0,0,.04); }
    body.light .ma-tb-pts-num { color: #1a1a2e; }
  `;
  document.head.appendChild(style);

  /* ── HTML da topbar ── */
  var pageName = (window.PORTAL_PAGE && window.PORTAL_PAGE.title) || '';
  var html = `
<nav class="ma-topbar">

  <!-- LOGO SVG horizontal — M branco + linha dupla azul + ACADEMY -->
  <a class="ma-tb-logo" href="index.html">
    <svg width="130" height="38" viewBox="0 0 260 76" xmlns="http://www.w3.org/2000/svg">
      <text x="36" y="52" text-anchor="middle" fill="#FFFFFF" font-family="Arial Black,sans-serif" font-weight="900" font-size="56" letter-spacing="-2">M</text>
      <line x1="4" y1="60" x2="70" y2="60" stroke="#4A7EFF" stroke-width="2.2"/>
      <line x1="4" y1="65" x2="70" y2="65" stroke="#4A7EFF" stroke-width="1" opacity=".4"/>
      <line x1="84" y1="12" x2="84" y2="66" stroke="rgba(74,126,255,0.35)" stroke-width="1"/>
      <text x="175" y="49" text-anchor="middle" fill="#4A7EFF" font-family="Arial,sans-serif" font-weight="400" font-size="20" letter-spacing="7">ACADEMY</text>
    </svg>
  </a>

  <div class="ma-tb-sep"></div>
  <span class="ma-tb-page-name" id="tbPageName">${pageName}</span>
  <div class="ma-tb-spacer"></div>

  <!-- TROFÉU + PONTOS -->
  <a class="ma-tb-pts-block" id="maPtsLive" href="painel.html">
    <span class="ma-tb-trophy">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/>
        <path d="M8 21h8"/><path d="M12 17v4"/>
        <path d="M6 5v4a6 6 0 0 0 12 0V5H6z"/>
      </svg>
    </span>
    <span class="ma-tb-pts-num" id="maPtsNum">0</span>
  </a>

  <!-- BOTÃO TEMA -->
  <button class="ma-tb-theme-btn" id="ptThemeBtn" onclick="ptToggleTheme()" title="Alternar tema">
    <svg id="ptIconMoon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    <svg id="ptIconSun"  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
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
<div class="ma-menu-dd"      id="ptMenuDd">
  <div id="ptMenuUser" class="ma-menu-user"></div>
  <div class="ma-menu-sec">
    <a class="ma-mi" href="index.html">      <span class="ma-mi-icon">🏠</span>Início</a>
    <a class="ma-mi" href="painel.html">     <span class="ma-mi-icon">📊</span>Meu Painel</a>
    <a class="ma-mi" href="ranking.html">    <span class="ma-mi-icon">🏆</span>Ranking</a>
    <a class="ma-mi" href="perfil.html">     <span class="ma-mi-icon">👤</span>Meu Perfil</a>
    <a class="ma-mi" href="indicacoes.html"> <span class="ma-mi-icon">🤝</span>Indicações</a>
    <a class="ma-mi" href="trilhas.html">    <span class="ma-mi-icon">🗺️</span>Trilhas</a>
    <a class="ma-mi" href="loja.html">       <span class="ma-mi-icon">🛒</span>Loja de XP</a>
    <a class="ma-mi" href="mural.html">      <span class="ma-mi-icon">📌</span>Mural</a>
  </div>
  <div class="ma-menu-sec">
    <a class="ma-mi gold" href="index.html" onclick="localStorage.setItem('ma_open_modal','plans');return true">
      <span class="ma-mi-icon">💎</span>Ver Planos
    </a>
  </div>
  <div class="ma-menu-sec" id="ptMenuAuth"></div>
</div>
`;

  /* Injeta no body assim que o DOM estiver pronto */
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
   FUNÇÕES DA TOPBAR DO PORTAL
   ══════════════════════════════════════════════════════════════ */

function ptInitTopbar() {
  /* Pontos XP */
  ptUpdatePts();

  /* Tema salvo */
  var saved = localStorage.getItem('ma_theme');
  if (saved === 'light') {
    document.body.classList.add('light');
    var moon = document.getElementById('ptIconMoon');
    var sun  = document.getElementById('ptIconSun');
    if (moon) moon.style.display = 'none';
    if (sun)  sun.style.display  = 'block';
  }

  /* Usuário no menu */
  ptUpdateMenuUser();

  /* Atualiza pontos a cada 10s (para refletir XP ganho em outras abas) */
  setInterval(ptUpdatePts, 10000);
}

function ptUpdatePts() {
  var el = document.getElementById('maPtsNum');
  if (!el) return;
  try {
    var pts = JSON.parse(localStorage.getItem('ma_points') || '{}');
    var total = pts.total || 0;
    el.textContent = total.toLocaleString('pt-BR');
    /* Anima quando muda */
    var prev = el._prev;
    if (prev !== undefined && prev !== total) {
      var block = document.getElementById('maPtsLive');
      if (block) { block.classList.remove('bump'); void block.offsetWidth; block.classList.add('bump'); }
    }
    el._prev = total;
  } catch(e) {}
}

function ptUpdateMenuUser() {
  var sec = document.getElementById('ptMenuUser');
  var auth = document.getElementById('ptMenuAuth');
  if (!sec || !auth) return;
  try {
    var u = JSON.parse(localStorage.getItem('ma_user') || 'null');
    if (u && u.email) {
      var pts = JSON.parse(localStorage.getItem('ma_points') || '{}');
      sec.innerHTML = '<span class="ma-mu-name">' + (u.name || u.email) + '</span>'
        + '<div class="ma-mu-pts"><b>' + (pts.total || 0).toLocaleString('pt-BR') + '</b> XP</div>';
      auth.innerHTML = '<button class="ma-mi red" onclick="ptLogout()"><span class="ma-mi-icon">🚪</span>Sair da conta</button>';
    } else {
      sec.innerHTML = '<span class="ma-mu-name" style="color:#8888a8">Visitante</span>'
        + '<div class="ma-mu-pts">Faça login para salvar seu progresso</div>';
      auth.innerHTML = '<a class="ma-mi" href="index.html"><span class="ma-mi-icon">🔑</span>Entrar / Cadastrar</a>';
    }
  } catch(e) {}
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

function ptLogout() {
  ptCloseMenu();
  if (window.MAStore && MAStore.logout) { MAStore.logout(); return; }
  if (window.MA_AUTH && MA_AUTH.logout) { MA_AUTH.logout().catch(function(){}); }
  localStorage.removeItem('ma_user');
  location.href = 'index.html';
}
