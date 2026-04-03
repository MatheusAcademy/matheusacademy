/* ══════════════════════════════════════════════════════════════
   MATHEUS ACADEMY — BOTTOM NAV COMPARTILHADO v2
   Injeta APENAS o rodapé mobile em todas as páginas.

   REGRA DE OURO:
   Este arquivo contém SOMENTE o CSS e HTML do .bottom-nav.
   O CSS da topbar (.ma-topbar, .ma-tb-*, .ma-menu-*) pertence
   exclusivamente a:
     - shared/portal-topbar.js  → páginas do portal
     - shared/course-engine.js  → páginas de curso
   Nunca duplique aqui.

   COMO USAR EM QUALQUER PÁGINA:
   Adicione antes do </body>:
     <script src="shared/bottom-nav.js"></script>

   O item ativo é detectado automaticamente pelo nome do arquivo.
   ══════════════════════════════════════════════════════════════ */

(function(){

  /* ── 1. CSS — SOMENTE do rodapé ── */
  var s = document.createElement('style');
  s.textContent = `
    :root { --bottombar-h: 72px; }

    /* ══ BOTTOM NAV ══ */
    .bottom-nav {
      position: fixed; bottom: 0; left: 0; right: 0;
      height: var(--bottombar-h);
      background: rgba(4,4,10,.99);
      border-top: 1px solid rgba(255,255,255,.07);
      display: flex; align-items: center; justify-content: space-around;
      z-index: 9990; padding: 0 8px;
      padding-bottom: env(safe-area-inset-bottom);
    }
    .bottom-nav::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,.12), transparent);
    }

    .bn-item {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 5px; flex: 1; height: 100%;
      cursor: pointer; border: none; background: transparent;
      color: rgba(255,255,255,.28); font-family: 'Outfit', sans-serif;
      text-decoration: none; position: relative;
      transition: color .2s;
      -webkit-tap-highlight-color: transparent;
    }
    .bn-item svg { transition: all .2s cubic-bezier(.2,0,.3,1); }
    .bn-item:hover svg, .bn-item.active svg { stroke: #fff; opacity: 1; }
    .bn-item:hover, .bn-item.active { color: #fff; }
    .bn-item.active::after {
      content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
      width: 20px; height: 2px; border-radius: 0 0 2px 2px;
      background: #fff;
    }

    /* Logo central elevada */
    .bn-item.bn-center { flex: 1.4; position: relative; top: -10px; }
    .bn-center-logo {
      width: 50px; height: 50px; border-radius: 14px;
      background: #000;
      border: 1.5px solid rgba(255,255,255,.2);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 20px rgba(0,0,0,.6);
      transition: all .25s cubic-bezier(.2,0,.3,1);
    }
    .bn-item.bn-center:hover .bn-center-logo,
    .bn-item.bn-center:active .bn-center-logo {
      transform: scale(1.1);
      border-color: rgba(255,255,255,.45);
      box-shadow: 0 6px 28px rgba(0,0,0,.7), 0 0 20px rgba(74,126,255,.3);
    }
    .bn-item:active:not(.bn-center) { transform: scale(.88); }

    .bn-icon { display: flex; align-items: center; justify-content: center; line-height: 1; }
    .bn-icon svg { width: 20px; height: 20px; stroke: currentColor; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
    .bn-item.active .bn-icon svg { stroke-width: 2.2; }
    .bn-label { font-size: .48rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; line-height: 1; }

    /* Garante padding inferior no body */
    body { padding-bottom: var(--bottombar-h); }

    /* ══ TEMA CLARO ══ */
    body.light .bottom-nav { background: rgba(240,242,248,.98); border-top-color: #d0d4e8; }
    body.light .bn-item { color: rgba(0,0,0,.35); }
    body.light .bn-item.active, body.light .bn-item:hover { color: #1a1a2e; }
    body.light .bn-item.active::after { background: #5b7fff; }
    body.light .bn-center-logo { background: #fff; border-color: #d0d4e8; }

    /* ══ DESKTOP: oculta rodapé ══ */
    @media (min-width: 769px) {
      .bottom-nav { display: none !important; }
      :root { --bottombar-h: 0px; }
      body { padding-bottom: 0; }
    }
  `;
  document.head.appendChild(s);

  /* ── 2. HTML do rodapé ── */
  document.body.insertAdjacentHTML('beforeend', `
<nav class="bottom-nav" id="bottomNav">

  <!-- INÍCIO -->
  <a class="bn-item" id="bn-inicio" href="index.html">
    <span class="bn-icon">
      <svg viewBox="0 0 24 24">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/>
        <polyline points="9 21 9 13 15 13 15 21"/>
      </svg>
    </span>
    <span class="bn-label">Início</span>
  </a>

  <!-- PAINEL / CURSOS -->
  <a class="bn-item" id="bn-cursos" href="painel.html">
    <span class="bn-icon">
      <svg viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    </span>
    <span class="bn-label">Cursos</span>
  </a>

  <!-- LOGO CENTRAL -->
  <a class="bn-item bn-center" href="index.html" title="Matheus Academy">
    <div class="bn-center-logo">
      <svg width="36" height="36" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
        <text x="36" y="52" text-anchor="middle" fill="#FFFFFF"
              font-family="Arial Black,sans-serif" font-weight="900" font-size="48">M</text>
        <line x1="10" y1="58" x2="62" y2="58" stroke="#4A7EFF" stroke-width="3"/>
        <line x1="10" y1="63" x2="62" y2="63" stroke="#4A7EFF" stroke-width="1.4" opacity=".4"/>
      </svg>
    </div>
  </a>

  <!-- RANKING -->
  <a class="bn-item" id="bn-ranking" href="ranking.html">
    <span class="bn-icon">
      <svg viewBox="0 0 24 24">
        <polyline points="18 20 18 10"/>
        <polyline points="12 20 12 4"/>
        <polyline points="6 20 6 14"/>
      </svg>
    </span>
    <span class="bn-label">Ranking</span>
  </a>

  <!-- PERFIL -->
  <a class="bn-item" id="bn-perfil" href="perfil.html">
    <span class="bn-icon">
      <svg viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    </span>
    <span class="bn-label">Perfil</span>
  </a>

</nav>
  `);

  /* ── 3. Marca item ativo automaticamente ── */
  function setActive() {
    var page = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

    /* Mapa exato de páginas → id do botão */
    var map = {
      'index.html'       : 'bn-inicio',
      ''                 : 'bn-inicio',
      'painel.html'      : 'bn-cursos',
      'trilhas.html'     : 'bn-cursos',
      'loja.html'        : 'bn-cursos',
      'mural.html'       : 'bn-cursos',
      'indicacoes.html'  : 'bn-cursos',
      'ranking.html'     : 'bn-ranking',
      'perfil.html'      : 'bn-perfil'
    };

    /* Páginas de curso e notícias → Cursos */
    var courseKeywords = [
      'trafego','geopolit','negocios','nichos','persuasao',
      'politica','banco-master','israel','copa','seguranca',
      'curso','noticia','news'
    ];

    var activeId = map[page];

    if (!activeId) {
      if (courseKeywords.some(function(k){ return page.indexOf(k) >= 0; })) {
        activeId = 'bn-cursos';
      }
    }

    if (activeId) {
      var el = document.getElementById(activeId);
      if (el) el.classList.add('active');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setActive);
  } else {
    setActive();
  }

})();
