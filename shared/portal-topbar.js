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
  ══════════════════════════════════════════════════════════════ */

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

    /* Bloco trofåu + pontos */
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
      background: #0f0f1e; border: 1px solid #252540; border-radius: 16px;
      min-width: 240px; max-width: calc(100vw - 20px);
      z-index: 10001; box-shadow: 0 16px 56px rgba(0,0,0,.75);
      overflow-y: auto; max-height: 80vh; opacity: 0;
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

    /* ══ BOTÃO PLANOS — Oculto em telas pequenas ══ */
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
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
    