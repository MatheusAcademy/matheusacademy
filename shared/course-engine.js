/* ══════════════════════════════════════════════════════════════
   MATHEUS ACADEMY — COURSE ENGINE JS v4
   Arquivo compartilhado: edite aqui para alterar TODOS os cursos
   COURSE e MODS devem ser definidos ANTES deste script ser carregado
   ══════════════════════════════════════════════════════════════ */

/* ── HTML ESTRUTURAL (injetado automaticamente no body) ── */
(function injectShell(){
  var shell = `
<div class="toast" id="toast"></div>

<div class="lock-screen" id="lockScreen">
  <span class="lock-icon">🔒</span>
  <h2 class="lock-title">Conteúdo Bloqueado</h2>
  <p class="lock-sub">Este módulo requer acesso premium. Desbloqueie agora para ter acesso completo.</p>
  <div class="lock-btns">
    <button class="lock-btn lock-btn-pri" onclick="closeLockScreen();openM('plans')">💎 Ver Planos</button>
    <button class="lock-btn lock-btn-sec" onclick="closeLockScreen()">Voltar</button>
  </div>
</div>

<div class="motiv-popup" id="motivPopup">
  <div class="motiv-card">
    <span class="mp-icon" id="mpIcon">🎉</span>
    <h3 class="mp-title" id="mpTitle">Módulo Concluído!</h3>
    <p class="mp-sub" id="mpSub">Continue avançando!</p>
    <div class="mp-pts">⭐ <span id="mpPts">+100 pontos</span></div>
    <button class="mp-close" onclick="closeMotiv()">Continuar →</button>
  </div>
</div>

<!-- Toolbar flutuante ao selecionar texto -->
<div class="highlight-toolbar" id="highlightToolbar">
  <span class="hl-label-small">✏️</span>
  <div class="hl-color-btn" data-color="amarelo" title="Amarelo" onclick="applyHighlight('amarelo')"></div>
  <div class="hl-color-btn" data-color="verde" title="Verde" onclick="applyHighlight('verde')"></div>
  <div class="hl-color-btn" data-color="azul" title="Azul" onclick="applyHighlight('azul')"></div>
  <div class="hl-color-btn" data-color="rosa" title="Rosa" onclick="applyHighlight('rosa')"></div>
  <div class="hl-color-btn" data-color="laranja" title="Laranja" onclick="applyHighlight('laranja')"></div>
  <div class="hl-sep"></div>
  <button class="hl-action-btn" onclick="addNoteToHighlight()">📝 Anotar</button>
  <button class="hl-action-btn remove" onclick="removeHighlight()">✕ Remover</button>
</div>
<div class="hl-note-popup" id="hlNotePopup">
  <div style="font-size:.62rem;color:var(--txt3);margin-bottom:8px;font-weight:700">📝 Anotação sobre o trecho</div>
  <textarea class="hl-note-input" id="hlNoteInput" placeholder="Escreva sua observação..."></textarea>
  <div class="hl-note-btns">
    <button class="hl-note-save" onclick="saveHlNote()">Salvar</button>
    <button class="hl-note-cancel" onclick="closeHlNote()">Cancelar</button>
  </div>
</div>

<!-- TOPBAR -->
<nav class="ma-topbar">
  <button class="sidebar-toggle-btn" id="sidebarToggleBtn" onclick="toggleSidebar()" title="Módulos">☰</button>

  <!-- LOGO HORIZONTAL EXATA — M branco + linha dupla azul + ACADEMY -->
  <a class="ma-tb-logo" href="index.html">
    <svg width="110" height="32" viewBox="0 0 260 76" xmlns="http://www.w3.org/2000/svg" class="tb-logo-svg">
      <text class="tb-logo-m" x="36" y="52" text-anchor="middle" font-family="Arial Black,sans-serif" font-weight="900" font-size="56" letter-spacing="-2">M</text>
      <line class="tb-logo-line1" x1="4" y1="60" x2="70" y2="60" stroke-width="2.2"/>
      <line class="tb-logo-line2" x1="4" y1="65" x2="70" y2="65" stroke-width="1" opacity=".4"/>
      <line x1="84" y1="12" x2="84" y2="66" stroke="rgba(74,126,255,0.35)" stroke-width="1"/>
      <text class="tb-logo-academy" x="175" y="49" text-anchor="middle" font-family="Arial,sans-serif" font-weight="400" font-size="20" letter-spacing="7">ACADEMY</text>
    </svg>
  </a>

  <div class="ma-tb-sep"></div>
  <span class="ma-tb-course-name" id="tbCourseName">Curso</span>
  <div class="ma-tb-spacer"></div>

  <!-- STREAK -->
  <a class="ma-tb-streak" id="maStreakLive" href="painel.html" title="Dias consecutivos de estudo">
    <span class="ma-tb-streak-fire">🔥</span>
    <span class="ma-tb-streak-num" id="maStreakNum">0</span>
    <span class="ma-tb-streak-lbl">dias</span>
  </a>

  <!-- TROFÉU + PONTOS -->
  <a class="ma-tb-pts-block" id="maPtsLive" href="painel.html">
    <span class="ma-tb-trophy">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/>
        <path d="M8 21h8"/><path d="M12 17v4"/>
        <path d="M6 5v4a6 6 0 0 0 12 0V5H6z"/>
      </svg>
    </span>
    <span class="ma-tb-pts-num" id="maPtsNum">001</span>
  </a>

  <button class="ma-tb-theme-btn" id="themeToggleBtn" onclick="toggleTheme()" title="Alternar tema claro/escuro">
    <svg id="themeIconMoon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    <svg id="themeIconSun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
  </button>

  <button class="ma-tb-menu-btn" onclick="toggleMaMenu()">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/>
    </svg>
  </button>
</nav>

<div class="ma-menu-overlay" id="maMenuOverlay" onclick="closeMaMenu()"></div>
<div class="ma-menu-dd" id="maMenuDd">
  <div id="maMenuUserSec" class="ma-menu-user"></div>
  <div class="ma-menu-sec">
    <a class="ma-mi" href="index.html"><span class="ma-mi-icon">🏠</span>Início</a>
    <a class="ma-mi" href="painel.html"><span class="ma-mi-icon">📊</span>Meu Painel</a>
    <a class="ma-mi" href="ranking.html"><span class="ma-mi-icon">🏆</span>Ranking</a>
    <a class="ma-mi" href="perfil.html"><span class="ma-mi-icon">👤</span>Meu Perfil</a>
    <a class="ma-mi" href="indicacoes.html"><span class="ma-mi-icon">🤝</span>Indicações</a>
    <a class="ma-mi" href="trilhas.html"><span class="ma-mi-icon">🗺️</span>Trilhas</a>
    <a class="ma-mi" href="loja.html"><span class="ma-mi-icon">🛒</span>Loja de XP</a>
    <a class="ma-mi" href="mural.html"><span class="ma-mi-icon">📌</span>Mural</a>
  </div>
  <div class="ma-menu-sec" id="maMenuAuthSec"></div>
</div>

<!-- BOTÃO MODO FOCO -->
<button class="focus-mode-btn" id="focusModeBtn" onclick="toggleFocusMode()" title="Modo Foco">⛶</button>


<!-- LAYOUT PRINCIPAL -->
<div class="app-layout">
  <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebarMobile()"></div>

  <!-- SIDEBAR -->
  <aside class="course-sidebar" id="courseSidebar">
    <div class="sb-header">
      <span class="sb-course-label" id="sbCourseLabel">Negócios</span>
      <span class="sb-course-title" id="sbCourseTitle">Dominando Tráfego Pago</span>
      <div class="sb-progress-bar"><div class="sb-progress-fill" id="sbProgFill" style="width:0%"></div></div>
      <div class="sb-progress-txt">
        <span id="sbProgDone">0 tópicos concluídos</span>
        <span id="sbProgPct">0%</span>
      </div>
    </div>
    <input class="sb-search" id="sbSearch" placeholder="🔍 Buscar tópico..." oninput="filterModules(this.value)">
    <div class="sb-list" id="sbList"></div>
  </aside>

  <!-- CONTEÚDO PRINCIPAL -->
  <main class="course-main" id="courseMain">

    <!-- ══════════════════════════════════
         CAPA FULL-SCREEN PERSONALIZADA
         ══════════════════════════════════ -->
    <div class="course-cover" id="courseCoverSection">
      <div class="cover-bg"></div>
      <div class="cover-grid"></div>
      <div class="cover-scan"></div>
      <div class="cover-horizon"></div>
      <div class="cover-orb cover-orb-1"></div>
      <div class="cover-orb cover-orb-2"></div>
      <div class="cover-orb cover-orb-3"></div>

      <div class="cover-content">
        <!-- Logo — SEM contorno, limpa, flutuando com glow -->
        <div class="cover-logo-big" id="coverLogoWrap" onclick="logoDropEffect(this)" title="Matheus Academy">
          <div class="logo-ripple-container">
            <svg class="logo-svg" id="coverLogoSvg" viewBox="0 0 260 200" width="180" height="138" xmlns="http://www.w3.org/2000/svg">
              <text x="130" y="130" text-anchor="middle" fill="#FFFFFF" font-family="Arial Black,sans-serif" font-weight="900" font-size="140" letter-spacing="-4">M</text>
              <line x1="20" y1="148" x2="240" y2="148" stroke="#4A7EFF" stroke-width="3"/>
              <line x1="20" y1="155" x2="240" y2="155" stroke="#4A7EFF" stroke-width="1.2" opacity=".45"/>
              <text x="130" y="188" text-anchor="middle" fill="#4A7EFF" font-family="Arial,sans-serif" font-weight="400" font-size="22" letter-spacing="10">ACADEMY</text>
            </svg>
          </div>
        </div>

        <span class="cover-badge" id="coverBadge">⚡ Negócios</span>
        <h1 class="cover-course-title" id="coverTitle">Dominando Tráfego Pago</h1>
        <div class="cover-title-line"></div>
        <p class="cover-desc" id="coverDesc">Domine Meta Ads, Google Ads e TikTok para escalar qualquer negócio digital. Do zero ao expert em estratégias de tráfego pago.</p>

        <div class="cover-stats-grid">
          <div class="cover-stat-card">
            <div class="cover-stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </div>
            <span class="cover-stat-val" id="coverMods">0</span>
            <span class="cover-stat-lbl">Módulos</span>
          </div>
          <div class="cover-stat-card">
            <div class="cover-stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                <line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="13" y2="11"/>
              </svg>
            </div>
            <span class="cover-stat-val" id="coverTopics">0</span>
            <span class="cover-stat-lbl">Tópicos</span>
          </div>
          <div class="cover-stat-card">
            <div class="cover-stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 15.5"/>
              </svg>
            </div>
            <span class="cover-stat-val" id="coverHours">0</span>
            <span class="cover-stat-lbl">Horas</span>
          </div>
          <div class="cover-stat-card">
            <div class="cover-stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 8v4l2 2"/><path d="M18 2v6h6"/>
                <path d="M22 2l-4 4"/>
              </svg>
            </div>
            <span class="cover-stat-val" id="coverQuizzes">0</span>
            <span class="cover-stat-lbl">Quizzes</span>
          </div>
        </div>

        <!-- BOTAO CONTINUAR DE ONDE PAROU -->
        <button class="cover-continue-btn" id="coverContinueBtn" style="display:none"></button>

        <!-- PROGRESSO — sempre visível logo abaixo dos stats -->
        <div class="cover-progress" id="coverProgressWrap">
          <div class="cover-prog-row">
            <span class="cover-prog-label">Seu Progresso</span>
            <span class="cover-prog-val" id="coverProgVal">0%</span>
          </div>
          <div class="cover-prog-bar">
            <div class="cover-prog-fill" id="coverProgFill" style="width:0%"></div>
          </div>
        </div>

        <!-- ESTIMATIVA DE CONCLUSÃO -->
        <div class="completion-estimate" id="completionEstimate" style="display:none;width:100%;margin-bottom:16px;">
          <span class="ce-icon">🕐</span>
          <span id="completionEstimateText">Calculando estimativa...</span>
        </div>

        <!-- TÍTULO E MÓDULOS -->
        <div class="cover-modules-title" id="coverModulesTitle">
          <div class="cmt-line"></div>
          <span id="coverModulesTitleText">Conteúdo do Curso</span>
          <div class="cmt-line"></div>
        </div>
        <div class="cover-modules-section" id="coverModulesSection">
          <!-- preenchido por JS -->
        </div>
      </div>
    </div>

    <!-- TABS COM BOTÃO VOLTAR -->
    <div class="tabs-wrap" id="courseTabs" style="display:none">
      <div class="tabs-scroll">
        <button class="ctab active" onclick="switchTab('conteudo')" id="tab-conteudo">📖 Aula</button>
        <button class="ctab" onclick="switchTab('anotacoes')" id="tab-anotacoes">✏️ Notas</button>
        <button class="ctab" onclick="switchTab('chat')" id="tab-chat">🤖 IA</button>
        <button class="ctab" onclick="switchTab('certificado')" id="tab-certificado">🏆 Cert.</button>
      </div>
      <button class="back-to-cover-btn" onclick="showCoverIfNeeded()">
        <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
        Capa
      </button>
    </div>

    <!-- ABA: AULA — NOVO LAYOUT ACORDEÃO POR MÓDULO -->
    <div class="tab-pane active" id="pane-conteudo" style="display:none">

      <!-- MINI-CAPA -->
      <div class="lesson-cover-mini" id="lessonCoverMini">
        <div class="lcm-bg"></div>
        <div class="lcm-grid"></div>
        <div class="lcm-orb lcm-orb-1"></div>
        <div class="lcm-orb lcm-orb-2"></div>
        <div class="lcm-logo" id="lcmLogoWrap" onclick="logoDropEffect(this)" title="Matheus Academy">
          <div class="logo-ripple-container">
            <svg class="logo-svg" viewBox="0 0 200 160" width="110" height="88" xmlns="http://www.w3.org/2000/svg">
              <text x="100" y="105" text-anchor="middle" fill="#FFFFFF" font-family="Arial Black,sans-serif" font-weight="900" font-size="110" letter-spacing="-3">M</text>
              <line x1="16" y1="118" x2="184" y2="118" stroke="#4A7EFF" stroke-width="3"/>
              <line x1="16" y1="125" x2="184" y2="125" stroke="#4A7EFF" stroke-width="1.2" opacity=".45"/>
              <text x="100" y="152" text-anchor="middle" fill="#4A7EFF" font-family="Arial,sans-serif" font-weight="400" font-size="18" letter-spacing="8">ACADEMY</text>
            </svg>
          </div>
        </div>
        <div class="lcm-info">
          <span class="lcm-badge" id="lcmBadge">⚡ Curso</span>
          <div class="lcm-title" id="lcmTitle">Nome do Curso</div>
          <div class="lcm-line"></div>
          <div class="lcm-desc" id="lcmDesc"></div>
        </div>
      </div>


      <!-- ACORDEÃO DE TÓPICOS + QUIZ + FLASHCARDS DO MÓDULO -->
      <div class="mod-lesson-wrap" id="modLessonWrap">
        <!-- preenchido por renderModLesson() -->
      </div>

    </div>

    <!-- ABA: ANOTAÇÕES — caderno único do curso -->
    <div class="tab-pane" id="pane-anotacoes" style="display:none">
      <div class="notes-area">
        <div class="nb-header">
          <div class="nb-title-row">
            <span class="nb-icon">📓</span>
            <div>
              <div class="nb-title">Caderno de Anotações</div>
              <div class="nb-sub">Suas notas e destaques de todo o curso</div>
            </div>
            <button class="nb-pdf-btn" onclick="downloadNotesPDF()" title="Baixar PDF">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Baixar PDF
            </button>
          </div>
        </div>

        <!-- Textarea livre — persiste no localStorage -->
        <div class="nb-free-section">
          <div class="nb-section-label">✏️ Suas anotações livres</div>
          <textarea
            class="nb-textarea"
            id="nbFreeText"
            placeholder="Escreva suas observações, resumos, ideias... Tudo é salvo automaticamente."
            oninput="saveNbText()"
          ></textarea>
        </div>

        <!-- Destaques e grifos da canetinha -->
        <div class="nb-hl-section">
          <div class="nb-section-label">🖊️ Trechos grifados</div>
          <div class="hl-notes-list" id="hlNotesList">
            <div class="nb-empty">Nenhum trecho grifado ainda.<br>Ative a canetinha e toque no texto da aula!</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ABA: CHAT IA -->
    <div class="tab-pane" id="pane-chat" style="display:none">
      <div class="chat-area">
        <div class="chat-messages" id="chatMessages">
          <div class="chat-msg bot">
            <div class="chat-avatar">🤖</div>
            <div class="chat-bubble">Olá! Sou seu assistente de aprendizado. Pergunte qualquer coisa sobre o conteúdo! 💡</div>
          </div>
        </div>
        <div class="chat-input-row">
          <input class="chat-input" id="chatInput" placeholder="Pergunte sobre o curso..." onkeydown="if(event.key==='Enter')sendChat()">
          <button class="chat-send" id="chatSendBtn" onclick="sendChat()">➤</button>
        </div>
      </div>
    </div>

    <!-- ABA: CERTIFICADO -->
    <div class="tab-pane" id="pane-certificado" style="display:none">
      <div class="cert-area">
        <div class="cert-card">
          <span class="cert-icon">🏆</span>
          <h2 class="cert-title">Certificado de Conclusão</h2>
          <p class="cert-sub">Complete 100% do curso para gerar seu certificado com validação digital.</p>
          <div class="cert-prog-info">Progresso atual: <b id="certPct">0%</b></div>
          <button class="cert-btn" id="certBtn" onclick="generateCert()" disabled>🏆 Gerar Certificado</button>
          <canvas id="certCanvas" class="cert-canvas" width="1000" height="700"></canvas>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════
         TELA DE MÓDULO — ACORDEÃO
         ══════════════════════════════════ -->
    <div class="mod-accordion-screen" id="modAccordionScreen">
      <div class="moa-header">
        <div class="moa-header-bg"></div>
        <div class="moa-header-grid"></div>
        <div class="moa-header-content">
          <button class="moa-back-btn" onclick="closeModAccordion()">
            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div>
            <span class="moa-mod-num" id="moaModNum">Módulo 01</span>
            <div class="moa-mod-title" id="moaModTitle">Nome do Módulo</div>
          </div>
        </div>
        <div class="moa-progress-row">
          <div class="moa-prog-bar"><div class="moa-prog-fill" id="moaProgFill" style="width:0%"></div></div>
          <span class="moa-prog-pct" id="moaProgPct">0%</span>
        </div>
      </div>
      <div class="moa-list" id="moaList"></div>
    </div>

  </main>
</div>

<!-- Timer -->
<div class="study-timer"><span class="st-icon">⏱️</span><span class="st-time" id="stTime">00:00</span><span>estudando</span></div>

<!-- MODAL CONCLUSAO DO CURSO -->
<div class="course-complete-modal" id="courseCompleteModal">
  <div class="ccm-box">
    <div class="ccm-icon">&#127942;</div>
    <h2 class="ccm-title">Curso Concluido!</h2>
    <p class="ccm-sub">Parabens! Voce finalizou <b id="ccmCourseName"></b> com sucesso!</p>
    <div class="ccm-pts">&#11088; +1.000 pontos conquistados!</div>
    <div class="ccm-btns">
      <button class="ccm-btn-cert" onclick="closeCourseCompleteModal();switchTab('certificado')">&#127942; Baixar Certificado</button>
      <button class="ccm-btn-close" onclick="closeCourseCompleteModal()">Continuar Estudando</button>
    </div>
  </div>
</div>

<!-- ══════════════════════════════════════════
     BOTTOM NAV BAR — ESTILO APP MOBILE
     ══════════════════════════════════════════ -->
<nav class="bottom-nav" id="bottomNav">
  <!-- INÍCIO -->
  <a class="bn-item" id="bn-inicio" href="index.html">
    <span class="bn-icon">
      <svg viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/><polyline points="9 21 9 13 15 13 15 21"/></svg>
    </span>
    <span class="bn-label">Início</span>
  </a>
  <!-- CURSOS -->
  <a class="bn-item" id="bn-cursos" href="painel.html">
    <span class="bn-icon">
      <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
    </span>
    <span class="bn-label">Cursos</span>
  </a>
  <!-- LOGO CENTRAL -->
  <a class="bn-item bn-center" href="index.html" title="Matheus Academy">
    <div class="bn-center-logo">
      <svg width="36" height="36" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
        <text x="36" y="52" text-anchor="middle" fill="#FFFFFF" font-family="Arial Black,sans-serif" font-weight="900" font-size="48">M</text>
        <line x1="10" y1="58" x2="62" y2="58" stroke="#4A7EFF" stroke-width="3"/>
        <line x1="10" y1="63" x2="62" y2="63" stroke="#4A7EFF" stroke-width="1.4" opacity=".4"/>
      </svg>
    </div>
  </a>
  <!-- RANKING -->
  <a class="bn-item" id="bn-ranking" href="ranking.html">
    <span class="bn-icon">
      <svg viewBox="0 0 24 24"><polyline points="18 20 18 10"/><polyline points="12 20 12 4"/><polyline points="6 20 6 14"/></svg>
    </span>
    <span class="bn-label">Ranking</span>
  </a>
  <!-- PERFIL -->
  <a class="bn-item" id="bn-perfil" href="perfil.html">
    <span class="bn-icon">
      <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    </span>
    <span class="bn-label">Perfil</span>
  </a>
</nav>

<!-- CANETINHA FLUTUANTE ARRASTÁVEL -->
<div class="floating-pen" id="floatingPen" style="display:none">
  <div class="fp-palette" id="fpPalette">
    <div class="fp-color fp-active" data-color="amarelo" onclick="fpSelectColor('amarelo')"></div>
    <div class="fp-color" data-color="verde" onclick="fpSelectColor('verde')"></div>
    <div class="fp-color" data-color="azul" onclick="fpSelectColor('azul')"></div>
    <div class="fp-color" data-color="rosa" onclick="fpSelectColor('rosa')"></div>
    <div class="fp-color" data-color="laranja" onclick="fpSelectColor('laranja')"></div>
    <div class="fp-sep"></div>
    <div class="fp-sep"></div>
    <div class="fp-erase" id="fpEraserBtn" onclick="fpToggleEraser()" title="Borracha" style="font-size:.7rem;font-weight:900">🗑️</div>
    <div class="fp-erase" onclick="fpEraseMode()" title="Desfazer último">↩</div>
  </div>
  <div class="fp-btn" id="fpBtn">
    <!-- Indicador de cor ativa no canto do botão -->
    <div class="fp-color-dot" id="fpColorDot"></div>
    <!-- Badge ON/OFF -->
    <span class="fp-status-badge" id="fpStatusBadge">OFF</span>
    <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
  </div>
</div>

<!-- MODAL DE MÓDULO — lista de tópicos com avançar -->
<div class="mod-modal-bg" id="modModalBg" onclick="closeModModal(event)">
  <div class="mod-modal" id="modModal">
    <div class="mod-modal-header">
      <div class="mod-modal-num" id="modModalNum">01</div>
      <div class="mod-modal-title" id="modModalTitle">Nome do Módulo</div>
      <button class="mod-modal-close" onclick="closeModModal()">✕</button>
    </div>
    <div class="mod-modal-body" id="modModalBody"></div>
    <div class="mod-modal-footer">
      <button class="mod-modal-prev" id="modModalPrev" onclick="modModalNav(-1)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button class="mod-modal-next" id="modModalNext" onclick="modModalNav(1)">
        Avançar <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 6 15 12 9 18"/></svg>
      </button>
      <span class="mod-modal-step" id="modModalStep">1 / 1</span>
    </div>
  </div>
</div>

<!-- MODAIS -->
<div class="modal-bg" id="modal-login">
  <div class="modal"><button class="modal-close" data-close="login">&#215;</button>
    <h3>Entrar</h3><div class="msub">Acesse sua conta</div>
    <label>E-mail</label><input type="email" id="loginEmail" placeholder="seu@email.com">
    <label>Senha</label><input type="password" id="loginPass" placeholder="Sua senha">
    <button class="mbtn" id="loginBtn">Entrar</button>
    <div id="loginMsg"></div>
    <div class="sw-link"><a id="goReset">Esqueci a senha</a> · <a id="goRegister">Criar conta</a></div>
  </div>
</div>
<div class="modal-bg" id="modal-register">
  <div class="modal"><button class="modal-close" data-close="register">&#215;</button>
    <h3>Criar Conta</h3><div class="msub">Junte-se à Matheus Academy</div>
    <label>Nome</label><input type="text" id="regName" placeholder="Seu nome completo">
    <label>E-mail</label><input type="email" id="regEmail" placeholder="seu@email.com">
    <label>Senha</label><input type="password" id="regPass" placeholder="Mínimo 6 caracteres">
    <button class="mbtn" id="regBtn">Criar Conta</button>
    <div id="regMsg"></div>
    <div class="sw-link"><a id="goLogin">Já tenho conta</a></div>
  </div>
</div>
<div class="modal-bg" id="modal-reset">
  <div class="modal"><button class="modal-close" data-close="reset">&#215;</button>
    <h3>Redefinir Senha</h3><div class="msub">Informe seu e-mail</div>
    <label>E-mail</label><input type="email" id="resetEmail" placeholder="seu@email.com">
    <button class="mbtn" id="sendResetBtn">Enviar Código</button>
    <div id="resetCodeWrap" style="display:none">
      <label style="margin-top:10px">Código</label><input type="text" id="resetCode" placeholder="XXXXXX" style="letter-spacing:.2em;text-transform:uppercase">
      <label>Nova Senha</label><input type="password" id="resetNewPass" placeholder="Nova senha">
      <button class="mbtn" id="verifyResetBtn">Confirmar</button>
    </div>
    <div id="resetMsg"></div>
    <div class="sw-link"><a id="backToLogin">Voltar ao login</a></div>
  </div>
</div>
<div class="modal-bg" id="modal-plans">
  <div class="modal"><button class="modal-close" data-close="plans">&#215;</button>
    <h3>Planos & Acesso</h3><div class="msub">Escolha o plano ideal</div>
    <div class="plans-grid">
      <div class="plan pop">
        <div class="pop-tag">Mais Popular</div>
        <h4>Acesso Completo — 3 Anos</h4>
        <div class="price">R$297<small>/única vez</small></div>
        <div class="pdesc">Todos os cursos + novos lançamentos + certificados + IA ilimitada</div>
        <a class="pbtn pbtn-pri" href="https://pay.kiwify.com.br/uzERliL" target="_blank">Assinar Agora</a>
      </div>
      <div class="plan">
        <h4>Plano Mensal</h4>
        <div class="price">R$19<small>.50/mês</small></div>
        <div class="pdesc">Acesso a todos os cursos com renovação mensal</div>
        <a class="pbtn pbtn-sec" href="https://pay.kiwify.com.br/JGGuFr4" target="_blank">Assinar</a>
      </div>
    </div>
    <div class="plan-indiv">
      <p>Apenas este curso?</p>
      <a class="pbtn pbtn-sec" href="https://pay.kiwify.com.br/h2b7ZRH" target="_blank" style="display:inline-block;width:auto;padding:10px 24px">R$9,99 — Comprar Individual</a>
    </div>
    <div style="margin-top:14px">
      <label>Código de acesso</label>
      <div style="display:flex;gap:8px">
        <input type="text" id="codeInput" placeholder="XXXX-XXXX" style="flex:1;text-transform:uppercase;letter-spacing:.1em">
        <button class="mbtn" style="width:auto;padding:10px 16px" onclick="activateCode()">Ativar</button>
      </div>
      <div id="codeMsg"></div>
    </div>
  </div>
</div>
  `;
  document.body.insertAdjacentHTML('beforeend', shell);
})();

/* ═══ CONSTANTES ═══ */
var EXP_M=3*365*24*3600000, EXP_I=365*24*3600000;
var COURSES=[
  {id:'tp',name:'Dominando Tráfego Pago',file:'dominando-trafego-pago.html',salt:'TP_HENRY_2026_MASTER',ak:'tp_auth'},
  {id:'ni',name:'Negócios Inteligentes',file:'negocios-inteligentes.html',salt:'NI_HENRY_2026_MASTER',ak:'ni_auth'},
  {id:'gp',name:'Geopolítica Avançada',file:'geopolitica-curso.html',salt:'GP_HENRY_2026_MASTER',ak:'gp_auth'},
  {id:'nl',name:'Nichos Lucrativos',file:'nichos-lucrativos.html',salt:'NL_HENRY_2026_MASTER',ak:'nl_auth'}
];

/* ═══ HELPERS ═══ */
function gU(){try{return JSON.parse(localStorage.getItem('ma_user'));}catch(e){return null;}}
function gA(){try{return JSON.parse(localStorage.getItem('ma_access'))||{};}catch(e){return {};}}
function sA(a){localStorage.setItem('ma_access',JSON.stringify(a));}
// v3 FIX: lê XP do Firebase (MAStore) — NUNCA de ma_points legado
function gP(){
  try{
    if(window.MAStore&&MAStore.getTotalPointsSync){
      return {total:MAStore.getTotalPointsSync(),history:[]};
    }
    var _u=JSON.parse(localStorage.getItem('ma_user')||'null');
    if(_u&&typeof _u.xp_total==='number') return {total:_u.xp_total,history:[]};
  }catch(e){}
  return {total:0,history:[]};
}
function gProg(){try{return JSON.parse(localStorage.getItem(COURSE.prefix+'prog'))||{};}catch(e){return {};}}
function sProg(p){localStorage.setItem(COURSE.prefix+'prog',JSON.stringify(p));}
function gHlData(){try{return JSON.parse(localStorage.getItem(COURSE.prefix+'hl'))||[];}catch(e){return[];}}
function sHlData(d){localStorage.setItem(COURSE.prefix+'hl',JSON.stringify(d));}
async function sha(s){var h=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return Array.from(new Uint8Array(h)).map(b=>b.toString(16).padStart(2,'0')).join('').substring(0,8).toUpperCase();}
function showToast(msg,type){var t=document.getElementById('toast');t.textContent=msg;t.className='toast '+(type||'');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000);}
function openM(id){var el=document.getElementById('modal-'+id);if(el)el.classList.add('show');}
function closeM(id){var el=document.getElementById('modal-'+id);if(el)el.classList.remove('show');}
function openLockScreen(){document.getElementById('lockScreen').classList.add('show');}
function closeLockScreen(){document.getElementById('lockScreen').classList.remove('show');}
function showMotiv(icon,title,sub,pts){
  document.getElementById('mpIcon').textContent=icon;
  document.getElementById('mpTitle').textContent=title;
  document.getElementById('mpSub').textContent=sub;
  document.getElementById('mpPts').textContent=pts;
  document.getElementById('motivPopup').classList.add('show');
}
function closeMotiv(){document.getElementById('motivPopup').classList.remove('show');}

/* ═══ TAMANHO DE FONTE ═══ */
var _fontSize = parseInt(localStorage.getItem('ma_font_size')) || 14;
var _fontMin = 10, _fontMax = 26;

// Escala base: 14px = 1.0. Cada px altera proporcionalmente tudo.
function applyFontSize(){
  var scale = _fontSize / 14;
  var root = document.documentElement;

  // Variável principal — conteúdo dos parágrafos
  root.style.setProperty('--font-size', _fontSize+'px');

  // ── Conteúdo das aulas ──
  // Parágrafos e listas
  _applyToAll('.ml-topic-content, .ml-topic-content p, .ml-topic-content li, .moa-topic-content, .moa-topic-content p, .moa-topic-content li, .lesson-content, .lesson-content p, .lesson-content li', 'fontSize', _fontSize+'px');
  // h3 dentro das aulas
  _applyToAll('.ml-topic-content h3, .moa-topic-content h3, .lesson-content h3', 'fontSize', Math.round(_fontSize*1.22)+'px');
  // h4 dentro das aulas
  _applyToAll('.ml-topic-content h4, .moa-topic-content h4, .lesson-content h4', 'fontSize', Math.round(_fontSize*1.08)+'px');
  // strong, em, blockquote
  _applyToAll('.ml-topic-content strong, .moa-topic-content strong, .lesson-content strong', 'fontSize', _fontSize+'px');
  _applyToAll('.ml-topic-content blockquote, .moa-topic-content blockquote, .lesson-content blockquote', 'fontSize', Math.round(_fontSize*0.96)+'px');

  // ── Títulos dos módulos ──
  _applyToAll('.ml-mod-name, .moa-mod-title, .moa-topic-title', 'fontSize', Math.round(_fontSize*1.45)+'px');
  _applyToAll('.ml-mod-label, .ml-mod-meta, .moa-mod-num', 'fontSize', Math.round(_fontSize*0.6)+'px');

  // ── Títulos dos tópicos na lista ──
  _applyToAll('.ml-topic-name, .moa-item-title', 'fontSize', Math.round(_fontSize*0.92)+'px');
  _applyToAll('.ml-topic-dur, .moa-item-meta span', 'fontSize', Math.round(_fontSize*0.62)+'px');

  // ── Quiz e Flashcards ──
  _applyToAll('.mlq-q, .quiz-q', 'fontSize', Math.round(_fontSize*0.9)+'px');
  _applyToAll('.mlq-opt, .quiz-opt', 'fontSize', Math.round(_fontSize*0.84)+'px');
  _applyToAll('.ml-fc-answer, .fc-txt', 'fontSize', Math.round(_fontSize*0.82)+'px');
  _applyToAll('.ml-quiz-header-title', 'fontSize', Math.round(_fontSize*1.1)+'px');
  _applyToAll('.ml-quiz-header-sub', 'fontSize', Math.round(_fontSize*0.72)+'px');

  // Display
  var disp = document.getElementById('fontSizeDisplay');
  if(disp) disp.textContent = _fontSize+'px';
  localStorage.setItem('ma_font_size', _fontSize);
}

function _applyToAll(selector, prop, value){
  try{
    document.querySelectorAll(selector).forEach(function(el){
      el.style[prop] = value;
    });
  }catch(e){}
}

function changeFontSize(delta){
  _fontSize = Math.max(_fontMin, Math.min(_fontMax, _fontSize + delta));
  applyFontSize();
  showToast('Aa ' + _fontSize + 'px', 'ok');
}

/* ═══ CANETINHA — COR ATIVA ═══ */
var _activeHlColor = 'amarelo';
function setActiveColor(color){
  _activeHlColor = color;
  document.querySelectorAll('.hl-btn').forEach(b => b.classList.remove('active'));
  var btn = document.querySelector('.hl-btn[data-color="'+color+'"]');
  if(btn) btn.classList.add('active');
  // sem toast — silencioso
}
function applySelectedHighlight(){
  var sel = window.getSelection();
  if(!sel || sel.toString().trim().length < 2){
    showToast('Selecione um trecho de texto primeiro!', 'warn');
    return;
  }
  var range = sel.getRangeAt(0);
  var content = document.getElementById('modLessonWrap');
  if(!content||!content.contains(range.commonAncestorContainer)){
    showToast('Selecione texto dentro da aula!', 'warn');
    return;
  }
  _curRange = range.cloneRange();
  applyHighlight(_activeHlColor);
}

/* ═══ SOM DE MOEDAS (Web Audio API) ═══ */
function playCoinSound(){
  try{
    var ctx=new(window.AudioContext||window.webkitAudioContext)();
    var times=[0,.08,.16,.22,.28];
    var freqs=[1046,1318,1568,1318,1046];
    times.forEach(function(t,i){
      var o=ctx.createOscillator();
      var g=ctx.createGain();
      o.connect(g);g.connect(ctx.destination);
      o.type='sine';o.frequency.value=freqs[i];
      g.gain.setValueAtTime(0,ctx.currentTime+t);
      g.gain.linearRampToValueAtTime(.22,ctx.currentTime+t+.02);
      g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+t+.12);
      o.start(ctx.currentTime+t);o.stop(ctx.currentTime+t+.14);
    });
  }catch(e){}
}

/* ═══ XP ═══ */
var LVS=[{n:'Iniciante',c:'ma-lvc0',m:0},{n:'Aprendiz',c:'ma-lvc1',m:1000},{n:'Profissional',c:'ma-lvc2',m:3000},{n:'Especialista',c:'ma-lvc3',m:7000},{n:'Elite',c:'ma-lvc4',m:15000},{n:'Elite I',c:'ma-lvc5',m:50000},{n:'Elite II',c:'ma-lvc6',m:200000},{n:'Elite III',c:'ma-lvc7',m:1000000}];
function gLv(t){for(var i=LVS.length-1;i>=0;i--)if(t>=LVS[i].m)return LVS[i];return LVS[0];}
function addPoints(src,pts){
  var u=gU();if(!u)return;
  // v3 FIX: salva XP no Firebase (MAStore) — NUNCA em ma_points legado
  if(window.MAStore&&MAStore.addPoints){
    MAStore.addPoints(src,pts).then(function(){updateTopbar();});
  }
  playCoinSound();
  showToast('⭐ +'+pts+' pontos — '+src,'pts');
}
window.MA_addPoints=addPoints;window.MA_getPoints=gP;

/* ═══ TOPBAR ═══ */
function updateTopbar(){
  var u=gU(),p=gP(),lv=gLv(p.total);
  /* Streak */
  var _ss;try{_ss=JSON.parse(localStorage.getItem('ma_sessions'))||{};}catch(e){_ss={};}
  var streakNum=document.getElementById('maStreakNum');
  var streakEl=document.getElementById('maStreakLive');
  if(streakNum)streakNum.textContent=(_ss.streak||0);
  if(streakEl){
    streakEl.style.display=(_ss.streak&&_ss.streak>0)?'flex':'none';
    if(_ss.streak>=7)streakEl.classList.add('streak-hot');
    else streakEl.classList.remove('streak-hot');
  }
  /* Pontos — formata com zeros à esquerda para números pequenos */
  var pEl=document.getElementById('maPtsLive');
  var pN=document.getElementById('maPtsNum');
  if(pN){
    var total=p.total;
    var str=total<1000?String(total).padStart(3,'0'):total.toLocaleString('pt-BR');
    pN.textContent=str;
    /* Animação bump */
    if(pEl){pEl.classList.remove('bump');void pEl.offsetWidth;pEl.classList.add('bump');setTimeout(function(){pEl.classList.remove('bump');},500);}
  }
  var uS=document.getElementById('maMenuUserSec'),aS=document.getElementById('maMenuAuthSec');
  if(u){
    if(uS)uS.innerHTML='<div class="ma-menu-user"><span class="ma-mu-name">'+u.name.split(' ')[0]+'</span><span class="ma-mu-level '+lv.c+'"><span class="ma-lv-dot"></span>'+lv.n+'</span><div class="ma-mu-pts"><b>'+p.total.toLocaleString('pt-BR')+'</b> pontos</div></div>';
    if(aS)aS.innerHTML='<button class="ma-mi red" onclick="maLogout()"><span class="ma-mi-icon">🚪</span>Sair</button>';
  }else{
    if(uS)uS.innerHTML='<div class="ma-menu-user"><span class="ma-mu-name" style="color:#8888a8">Visitante</span></div>';
    if(aS)aS.innerHTML='<a class="ma-mi" href="#" onclick="closeMaMenu();openM(\'login\');return false"><span class="ma-mi-icon">🔑</span>Entrar</a><a class="ma-mi gold" href="#" onclick="closeMaMenu();openM(\'plans\');return false"><span class="ma-mi-icon">💎</span>Ver Planos</a>';
  }
}
function toggleMaMenu(){var d=document.getElementById('maMenuDd'),o=document.getElementById('maMenuOverlay');d.classList.toggle('open');o.classList.toggle('open');}
function closeMaMenu(){document.getElementById('maMenuDd').classList.remove('open');document.getElementById('maMenuOverlay').classList.remove('open');}
function maLogout(){localStorage.removeItem('ma_user');closeMaMenu();location.reload();}

/* ═══ SIDEBAR — OVERLAY UNIVERSAL ═══ */
var _sidebarOpen=false;
var _isMobile=()=>window.innerWidth<=768;
var _isTablet=()=>window.innerWidth>768&&window.innerWidth<=1024;

function openSidebar(){
  _sidebarOpen=true;
  var sb=document.getElementById('courseSidebar');
  var ov=document.getElementById('sidebarOverlay');
  var main=document.getElementById('courseMain');
  if(sb)sb.classList.add('sb-open');
  if(ov)ov.classList.add('show');
  if(main&&window.innerWidth>768)main.style.marginLeft='var(--sidebar-w)';
  localStorage.setItem('ma_sidebar','1');
}

function closeSidebar(){
  _sidebarOpen=false;
  var sb=document.getElementById('courseSidebar');
  var ov=document.getElementById('sidebarOverlay');
  var main=document.getElementById('courseMain');
  if(sb)sb.classList.remove('sb-open');
  if(ov)ov.classList.remove('show');
  if(main)main.style.marginLeft='0';
  localStorage.setItem('ma_sidebar','0');
}

function toggleSidebar(){
  if(_sidebarOpen)closeSidebar();else openSidebar();
}

/* Compat: usado pelo overlay onclick e mobile */
function closeSidebarMobile(){closeSidebar();}

function initSidebar(){
  // Sidebar sempre fechada ao iniciar
  closeSidebar();
  // Overlay fecha ao clicar
  var ov=document.getElementById('sidebarOverlay');
  if(ov)ov.addEventListener('click',closeSidebar);
  // Fechar ao clicar no conteúdo principal (desktop/tablet)
  var main=document.getElementById('courseMain');
  if(main)main.addEventListener('click',function(e){
    if(_sidebarOpen&&!e.target.closest('.course-sidebar')&&!e.target.closest('.sb-puller')&&!e.target.closest('.sidebar-toggle-btn')){
      closeSidebar();
    }
  });
  // Resize — reajusta
  window.addEventListener('resize',function(){
    if(_sidebarOpen)closeSidebar();
  });
}

/* ═══ ACESSO ═══ */
function isUnlocked(){
  if(COURSE.free)return true;
  // v4 FIX: usa Firebase (ma_user) como fonte de verdade
  var u=gU();
  if(!u)return false;
  var plano=(u.plano||'').toLowerCase();
  if(plano==='master'||plano==='mensal'||plano==='anual')return true;
  var cursos=u.cursos||u.cursos_comprados||[];
  if(cursos.indexOf(COURSE.courseKey)>=0)return true;
  if(cursos.indexOf(COURSE.ak)>=0)return true;
  // fallback legado
  var ac=gA(),now=Date.now();
  if(ac.master&&ac.masterTs&&now-ac.masterTs<(ac.expiry||EXP_M))return true;
  var raw=localStorage.getItem(COURSE.ak);
  if(raw){try{var d=JSON.parse(raw);if(d.ts&&now-d.ts<(d.expiry||EXP_I))return true;}catch(e){}}
  return false;
}
function modFree(mi){return mi<COURSE.freeModules;}

/* ═══ SIDEBAR BUILD ═══ */
var _allTopics=[],_curModIdx=0,_curTopIdx=0,_filterStr='';
function buildSidebar(){
  var prog=gProg(),unlocked=isUnlocked();
  _allTopics=[];
  var total=0,done=0,html='';
  MODS.forEach(function(mod,mi){
    var mFree=modFree(mi),canAcc=unlocked||mFree;
    var doneT=mod.topics.filter(function(t){return prog[mod.id+'_'+t.id];}).length;
    var pct=mod.topics.length?Math.round(doneT/mod.topics.length*100):0;
    var completed=pct===100;
    total+=mod.topics.length;done+=doneT;
    mod.topics.forEach(function(t,ti){_allTopics.push({mod:mod,mi:mi,t:t,ti:ti,canAcc:canAcc});});
    var visible=!_filterStr||mod.name.toLowerCase().includes(_filterStr)||mod.topics.some(function(t){return t.name.toLowerCase().includes(_filterStr);});
    if(!visible)return;
    var isOpenMod=mi===_curModIdx;
    html+='<div class="sb-module"><div class="sb-mod-hdr'+(completed?' completed':'')+(isOpenMod?' active-mod open':'')+'" onclick="toggleSbMod('+mi+','+canAcc+')" id="sbModHdr'+mi+'">';
    html+='<div class="sb-mod-num">'+(completed?'✓':(mi+1))+'</div>';
    html+='<div class="sb-mod-info"><span class="sb-mod-name">'+mod.name+(mFree&&!unlocked?' <span style="font-size:.5rem;color:var(--grn);font-weight:700">FREE</span>':'')+'</span><span class="sb-mod-meta">'+mod.topics.length+' tópicos · '+doneT+' concluídos</span></div>';
    if(completed)html+='<span class="sb-mod-badge">✓ OK</span>';
    if(!canAcc)html+='<span class="sb-mod-lock">🔒</span>';
    html+='<span class="sb-mod-arrow">›</span></div>';
    if(pct>0)html+='<div class="sb-mod-prog"><div class="sb-mod-prog-fill" style="width:'+pct+'%"></div></div>';
    html+='<div class="sb-topics'+(isOpenMod?' open':'')+'" id="sbTopics'+mi+'">';
    mod.topics.forEach(function(topic,ti){
      var topDone=!!prog[mod.id+'_'+topic.id];
      var isActive=mi===_curModIdx&&ti===_curTopIdx;
      var vis2=!_filterStr||topic.name.toLowerCase().includes(_filterStr);
      if(!vis2)return;
      html+='<div class="sb-topic-item'+(isActive?' active':'')+(topDone?' done':'')+'" onclick="selectTopic('+mi+','+ti+','+canAcc+')" id="sbTopic'+mi+'_'+ti+'">';
      html+='<div class="sb-topic-dot">'+(topDone?'✓':(ti+1))+'</div><span class="sb-topic-name">'+topic.name+'</span><span class="sb-topic-dur">'+topic.dur+'</span>';
      if(!canAcc)html+='<span class="sb-topic-lock">🔒</span>';
      html+='</div>';
    });
    html+='</div></div>';
  });
  document.getElementById('sbList').innerHTML=html;
  var pct=total?Math.round(done/total*100):0;
  document.getElementById('sbProgFill').style.width=pct+'%';
  document.getElementById('sbProgDone').textContent=done+' de '+total+' tópicos';
  document.getElementById('sbProgPct').textContent=pct+'%';
  updateCertPct(pct);
  // Atualizar capa
  // Botao continuar de onde parou
  var lastMi=parseInt(localStorage.getItem(COURSE.prefix+'lastMod'));
  var lastTi=parseInt(localStorage.getItem(COURSE.prefix+'lastTopic'));
  var btnCont=document.getElementById('coverContinueBtn');
  if(btnCont&&!isNaN(lastMi)&&MODS[lastMi]){
    var lastMod=MODS[lastMi];
    var lastTop=lastMod.topics[lastTi]||lastMod.topics[0];
    btnCont.style.display='flex';
    btnCont.innerHTML='\u25b6\ufe0f Continuar \u2014 '+lastMod.name+(lastTop?' \u2023 '+lastTop.name:'');
    btnCont.onclick=function(){selectTopic(lastMi,lastTi||0,true);};
  } else if(btnCont&&done===0){
    btnCont.style.display='none';
  }

  // Atualizar progresso na capa \u2014 sempre visível
  var cpw=document.getElementById('coverProgressWrap');
  if(cpw){
    cpw.style.display='block';
    document.getElementById('coverProgVal').textContent=pct+'%';
    document.getElementById('coverProgFill').style.width=pct+'%';
  }
  // Atualizar carrossel de módulos
  buildModuleCarousel();
}
function toggleSbMod(mi,canAcc){if(!canAcc){openLockScreen();return;}var hdr=document.getElementById('sbModHdr'+mi),tops=document.getElementById('sbTopics'+mi);if(hdr)hdr.classList.toggle('open');if(tops)tops.classList.toggle('open');}
function filterModules(val){_filterStr=val.trim().toLowerCase();buildSidebar();if(_filterStr){document.querySelectorAll('.sb-topics').forEach(el=>el.classList.add('open'));document.querySelectorAll('.sb-mod-hdr').forEach(el=>el.classList.add('open'));}}

/* Controle do puller — só aparece em aula (não na capa) */
function _showPuller(){}
function _hidePuller(){}

/* ═══ MOSTRAR ABAS / CAPA ═══ */
function showCoverIfNeeded(){
  document.getElementById('courseCoverSection').style.display='flex';
  document.getElementById('courseTabs').style.display='none';
  document.querySelectorAll('.tab-pane').forEach(function(p){p.style.display='none';});
  hideFloatingPen();
  _hidePuller();
  _hideFocusBtn();
  _updateCompletionEstimate();
}
function showTabs(){
  document.getElementById('courseCoverSection').style.display='none';
  document.getElementById('courseTabs').style.display='flex';
  document.querySelectorAll('.tab-pane').forEach(function(p){p.style.display='none';});
  document.getElementById('pane-conteudo').style.display='block';
  document.getElementById('pane-conteudo').classList.add('active');
  showFloatingPen();
  _showPuller();
  _showFocusBtn();
}
function startCourse(){
  if(MODS.length>0)selectTopic(0,0,true);
}

/* ═══ SELECIONAR TÓPICO — abre módulo e expande o tópico ═══ */
function selectTopic(mi,ti,canAcc){
  if(!canAcc){openLockScreen();return;}
  _curModIdx=mi;_curTopIdx=ti;
  // Salvar ultimo topico para "continuar de onde parou"
  localStorage.setItem(COURSE.prefix+'lastMod',mi);
  localStorage.setItem(COURSE.prefix+'lastTopic',ti);
  buildSidebar();
  showTabs();switchTab('conteudo');
  if(_isMobile())closeSidebarMobile();
  grantMission('aula');

  /* Se já está no mesmo módulo renderizado, não re-renderiza tudo —
     apenas abre o tópico e scrolla. Evita o DOM ser destruído e recriado. */
  var existingItem=document.getElementById('ml_topic_'+mi+'_'+ti);
  if(existingItem){
    /* DOM já existe — calcula posição ANTES de qualquer mudança */
    var hdr=existingItem.querySelector('.ml-topic-hdr')||existingItem;
    var topbarH=56, tabsH=48, gap=12;
    var offsetTop=hdr.getBoundingClientRect().top + window.scrollY - (topbarH + tabsH + gap);
    /* Expande sem fechar outros */
    existingItem.classList.add('t-open');
    window.scrollTo({top:Math.max(0,offsetTop),behavior:'smooth'});
    /* Marca como visto */
    var mod0=MODS[mi],t0=mod0.topics[ti];
    var prog0=gProg(),key0=mod0.id+'_'+t0.id;
    if(!prog0[key0]){prog0[key0]=true;sProg(prog0);buildSidebar();}
    return;
  }

  /* DOM ainda não existe — precisa renderizar o módulo primeiro */
  renderModLesson(mi);
  setTimeout(function(){
    var item=document.getElementById('ml_topic_'+mi+'_'+ti);
    if(!item){window.scrollTo({top:0,behavior:'instant'});return;}
    /* DOM recém criado — todos os tópicos estão fechados, posição é precisa */
    var hdr=item.querySelector('.ml-topic-hdr')||item;
    var topbarH=56, tabsH=48, gap=12;
    var offsetTop=hdr.getBoundingClientRect().top + window.scrollY - (topbarH + tabsH + gap);
    item.classList.add('t-open');
    window.scrollTo({top:Math.max(0,offsetTop),behavior:'smooth'});
    /* Marca como visto */
    var mod=MODS[mi],t=mod.topics[ti];
    var prog=gProg(),key=mod.id+'_'+t.id;
    if(!prog[key]){prog[key]=true;sProg(prog);buildSidebar();}
  },80);
}

/* ═══ RENDERIZAR MÓDULO COMPLETO — acordeão de tópicos + quiz + flashcards ═══ */
var _mlAudio={}; // estado de áudio por tópico {mi_ti: {synth, playing}}

function renderModLesson(mi){
  var mod=MODS[mi];
  if(!mod)return;
  var wrap=document.getElementById('modLessonWrap');
  var prog=gProg();
  var doneCount=mod.topics.filter(function(t){return prog[mod.id+'_'+t.id];}).length;
  var pct=mod.topics.length?Math.round(doneCount/mod.topics.length*100):0;
  var html='';

  /* ── Cabeçalho + áudio ── */
  html+='<div class="ml-controls-bar" id="ml_audio_'+mi+'">'
    +'<div class="mlc-left">'
    +'<button class="mlc-play-btn" id="ml_abtn_'+mi+'" onclick="mlToggleModAudio('+mi+')" title="Ouvir">'
    +'<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><polygon points="5 3 19 12 5 21 5 3"/></svg>'
    +'</button>'
    +'<div class="mlc-audio-info">'
    +'<span class="mlc-audio-title">Narrar por IA</span>'
    +'<span class="mlc-audio-status" id="ml_ast_'+mi+'">Clique para ouvir</span>'
    +'</div>'
    +'<select class="mlc-speed" id="ml_aspd_'+mi+'" onchange="mlChangeModSpeed('+mi+',this.value)">'
    +'<option value="0.75">0.75x</option>'
    +'<option value="1" selected>1x</option>'
    +'<option value="1.25">1.25x</option>'
    +'<option value="1.5">1.5x</option>'
    +'<option value="2">2x</option>'
    +'</select>'
    +'</div>'
    +'<div class="mlc-sep"></div>'
    +'<div class="mlc-right">'
    +'<span class="mlc-font-label">Aa</span>'
    +'<button class="mlc-font-btn" onclick="changeFontSize(-1)">A-</button>'
    +'<span class="mlc-font-val" id="fontSizeDisplay">14px</span>'
    +'<button class="mlc-font-btn mlc-font-plus" onclick="changeFontSize(1)">A+</button>'
    +'</div>'
    +'</div>';

  html+='<div class="ml-mod-header">'
    +'<span class="ml-mod-label">Módulo '+(mi+1)+'</span>'
    +'<div class="ml-mod-name">'+mod.name+'</div>'
    +'<div class="ml-mod-meta">'+mod.topics.length+' aulas · '+doneCount+' concluídas</div>'
    +'</div>';

  html+='<div class="ml-mod-prog-row">'
    +'<div class="ml-mod-prog-bar"><div class="ml-mod-prog-fill" style="width:'+pct+'%"></div></div>'
    +'<span class="ml-mod-prog-pct">'+pct+'%</span>'
    +'</div>';

  /* ════════════════════════════════════════
     TÓPICOS — só título + chevron, fechados
     Clica para expandir o conteúdo
  ════════════════════════════════════════ */
  html+='<div class="ml-topics-list" id="ml_topics_list_'+mi+'">';
  mod.topics.forEach(function(t,ti){
    var done=!!prog[mod.id+'_'+t.id];
    /* Sempre fechado ao renderizar — aluno expande clicando */
    var cls='ml-topic-item'+(done?' t-done':'');
    html+='<div class="'+cls+'" id="ml_topic_'+mi+'_'+ti+'">';

    /* Cabeçalho clicável */
    html+='<div class="ml-topic-hdr" onclick="mlToggleTopic('+mi+','+ti+')">'
      +'<div class="ml-topic-dot">'+(done?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:11px;height:11px"><polyline points="20 6 9 17 4 12"/></svg>':(ti+1))+'</div>'
      +'<div class="ml-topic-info">'
      +'<span class="ml-topic-name">'+t.name+'</span>'
      +'<div class="ml-topic-meta"><span class="ml-topic-dur">'+t.dur+'</span></div>'
      +'</div>'
      +'<div class="ml-topic-arrow"><svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div>'
      +'</div>';

    /* Conteúdo — oculto por padrão */
    html+='<div class="ml-topic-body" id="ml_tbody_'+mi+'_'+ti+'">'
      +'<div class="ml-topic-inner">'
      +'<div class="ml-topic-content lesson-content" id="ml_content_'+mi+'_'+ti+'">'+(t.content||'<p>Conteúdo em preparação.</p>')+'</div>'
      +'<button class="ml-mark-btn'+(done?' ml-mark-done':'')+'" id="ml_mark_'+mi+'_'+ti+'" onclick="mlMarkDone('+mi+','+ti+')">'
      +'<div class="ml-mark-checkbox">'+(done?'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>':'')+'</div>'
      +'<span class="ml-mark-label">'+(done?'Concluído':'Marcar como concluído')+'</span>'
      +'</button>'
      +'</div></div>';

    html+='</div>'; // ml-topic-item
  });
  html+='</div>'; // ml-topics-list

  /* ════════════════════════════════════════
     QUIZ — sempre visível e aberto no final
  ════════════════════════════════════════ */
  var allQuizzes=[];
  mod.topics.forEach(function(t){
    if(t.quiz){var arr=Array.isArray(t.quiz)?t.quiz:[t.quiz];arr.forEach(function(q){allQuizzes.push(q);});}
  });
  if(mod.quizFinal&&mod.quizFinal.length) allQuizzes=mod.quizFinal;
  allQuizzes=allQuizzes.slice(0,3);

  if(allQuizzes.length>0){
    var modName=mod.name.replace(/Módulo\s*\d+\s*[—\-–]\s*/i,'').trim();
    var letters=['A','B','C','D','E'];

    html+='<div class="ml-quiz-section qz-open" id="ml_quiz_sec_'+mi+'">';
    html+='<div class="ml-quiz-header">'
      +'<span class="ml-quiz-header-icon">🧠</span>'
      +'<span class="ml-quiz-header-title">Quiz — '+modName+'</span>'
      +'<span class="ml-quiz-header-sub">'+allQuizzes.length+' questões · complete o módulo para ganhar 100 pts</span>'
      +'</div>';
    html+='<div class="ml-quiz-body"><div class="ml-quiz-inner" id="ml_quiz_inner_'+mi+'">';

    allQuizzes.forEach(function(q,qi){
      html+='<div class="mlq-item" id="mlq_'+mi+'_'+qi+'">'
        +'<div class="mlq-header-row">'
        +'<div class="mlq-num">'+(qi+1)+'. '+q.q+'</div>'
        +'</div>'
        +'<div class="mlq-opts" id="mlq_opts_'+mi+'_'+qi+'">';
      q.opts.forEach(function(opt,oi){
        html+='<div class="mlq-opt" id="mlq_opt_'+mi+'_'+qi+'_'+oi+'" onclick="mlSelOpt('+mi+','+qi+','+oi+')">'
          +'<div class="mlq-opt-letter">'+(letters[oi]||oi)+'</div>'+opt+'</div>';
      });
      html+='</div><div class="mlq-result" id="mlq_res_'+mi+'_'+qi+'"></div></div>';
    });

    html+='<button class="ml-quiz-finish-btn" id="ml_qfbtn_'+mi+'" onclick="mlFinishQuiz('+mi+','+JSON.stringify(allQuizzes.map(function(q){return q.correct;}))+')">🎯 Finalizar Quiz</button>';
    html+='<div class="ml-quiz-score" id="ml_qscore_'+mi+'"></div>';
    html+='</div></div></div>'; // inner, body, section
  }

  /* ════════════════════════════════════════
     FLASHCARDS — sempre visíveis, 2 por módulo
  ════════════════════════════════════════ */
  var allCards=[];
  mod.topics.forEach(function(t){if(t.cards&&t.cards.length)t.cards.forEach(function(c){allCards.push(c);});});
  allCards=allCards.slice(0,2);

  if(allCards.length>0){
    html+='<div class="ml-fc-section fc-open" id="ml_fc_sec_'+mi+'">';
    html+='<div class="ml-fc-header" style="display:flex;align-items:center;gap:10px;padding:16px 18px 8px;">'
      +'<span style="font-size:1.1rem">🃏</span>'
      +'<span style="font-size:.78rem;font-weight:800;color:var(--txt)">Flashcards</span>'
      +'<span style="font-size:.54rem;font-weight:700;padding:2px 9px;border-radius:8px;background:rgba(74,126,255,.12);color:var(--course-color);border:1px solid rgba(74,126,255,.2)">'+allCards.length+' cards · clique para virar</span>'
      +'</div>';
    html+='<div class="ml-fc-body" style="max-height:9999px"><div class="ml-fc-grid" id="ml_fc_grid_'+mi+'">';
    allCards.forEach(function(c,ci){
      html+='<div class="ml-flashcard" id="ml_fc_'+mi+'_'+ci+'" onclick="mlFlipCard('+mi+','+ci+')">' 
        +'<div class="ml-fc-inner">'
        +'<div class="ml-fc-face ml-fc-front">'
        +'<div class="ml-fc-front-header"><span class="ml-fc-tag-front">📖 Pergunta</span><span class="ml-fc-qicon">?</span></div>'
        +'<div class="ml-fc-question">'+c.q+'</div>'
        +'<div class="ml-fc-flip-hint">🔄 Clique para ver a resposta</div>'
        +'</div>'
        +'<div class="ml-fc-face ml-fc-back">'
        +'<div class="ml-fc-back-glow"></div>'
        +'<div class="ml-fc-front-header"><span class="ml-fc-tag-back">✅ Resposta</span></div>'
        +'<div class="ml-fc-back-q-label">💬 '+c.q+'</div>'
        +'<div class="ml-fc-answer">'+c.a+'</div>'
        +'</div></div></div>';

    });
    html+='</div></div></div>';
  }

  /* ── Rodapé social ── */
  /* ══ Botões Navegação Módulo ══ */
  var prevModBtn='', nextModBtnNav='';
  if(mi>0){
    prevModBtn='<button class="ml-nav-btn ml-nav-prev" onclick="selectTopic('+(mi-1)+',0,true);window.scrollTo({top:0,behavior:\'smooth\'})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px"><polyline points="15 18 9 12 15 6"/></svg>Módulo anterior</button>';
  }
  if(mi+1<MODS.length&&(isUnlocked()||mi+1<COURSE.freeModules)){
    nextModBtnNav='<button class="ml-nav-btn ml-nav-next" onclick="selectTopic('+(mi+1)+',0,true);window.scrollTo({top:0,behavior:\'smooth\'})">Próximo módulo<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px"><polyline points="9 18 15 12 9 6"/></svg></button>';
  }
  if(prevModBtn||nextModBtnNav){
    html+='<div class="ml-nav-btns">'+prevModBtn+nextModBtnNav+'</div>';
  }

  /* ══ Rodé social — idêntico ao index ══ */
  html+='<footer class="ml-footer">'
    +'<div class="ml-footer-links">'
    +'<a href="indicacoes.html" class="ml-footer-a ml-footer-ind">🔗 Indicações</a>'
    +'<a href="https://t.me/+u07BKIwOsxEwNmIx" target="_blank" rel="noopener" class="ml-footer-a ml-footer-tg">✈️ Grupo VIP Telegram</a>'
    +'<a href="https://www.instagram.com/_matheusacademy?igsh=MW15ZWE3eTJyNjYy" target="_blank" rel="noopener" class="ml-footer-a ml-footer-ig">📸 @_matheusacademy</a>'
    +'</div>'
    +'<div class="ml-footer-brand"><b>Matheus Academy</b> · Conhecimento que transforma</div>'
    +'</footer>';

  wrap.innerHTML=html;
  setTimeout(applyFontSize,30);

  /* Restaurar quiz respondido */
  var qzDoneRestored=!!localStorage.getItem(COURSE.prefix+'qzdone_'+mi);
  allQuizzes.forEach(function(_,qi){
    var saved=localStorage.getItem(COURSE.prefix+'qzsel_'+mi+'_'+qi);
    if(saved!==null) mlSelOpt(mi,qi,parseInt(saved),true);
  });
  // Se o quiz já foi finalizado, restaurar o estado visual completo
  if(qzDoneRestored&&allQuizzes.length>0){
    var corrects=allQuizzes.map(function(q){return q.correct;});
    var score=0;
    corrects.forEach(function(correct,qi){
      var saved=localStorage.getItem(COURSE.prefix+'qzsel_'+mi+'_'+qi);
      var selected=saved!==null?parseInt(saved):-1;
      var isCorrect=selected===correct;
      if(isCorrect)score++;
      var optsEl=document.getElementById('mlq_opts_'+mi+'_'+qi);
      if(optsEl)optsEl.querySelectorAll('.mlq-opt').forEach(function(o,oi){
        o.classList.remove('selected');
        var letter=o.querySelector('.mlq-opt-letter');
        if(oi===correct){o.classList.add('correct-ans');if(letter)letter.textContent='✓';}
        else if(oi===selected&&!isCorrect){o.classList.add('wrong-ans');if(letter)letter.textContent='✕';}
        o.style.pointerEvents='none';
      });
      var res=document.getElementById('mlq_res_'+mi+'_'+qi);
      if(res){
        res.className='mlq-result '+(isCorrect?'correct':'wrong');
        res.textContent=isCorrect?'✅ Correto!':'❌ Incorreto — veja a resposta certa destacada em verde.';
      }
    });
    var fbtn=document.getElementById('ml_qfbtn_'+mi);
    if(fbtn){fbtn.disabled=true;fbtn.textContent='✅ Quiz Finalizado';}
    var scoreEl=document.getElementById('ml_qscore_'+mi);
    if(scoreEl){
      var pct2=Math.round(score/corrects.length*100);
      var icon=pct2===100?'🏆':pct2>=60?'🎯':'📚';
      var msg=pct2===100?'Perfeito! Acertou tudo!':pct2>=60?'Bom resultado! Continue assim.':'Revise o conteúdo e tente novamente.';
      scoreEl.classList.add('show');
      scoreEl.innerHTML='<span class="mlqs-icon">'+icon+'</span>'
        +'<div class="mlqs-title">'+score+' / '+corrects.length+' corretas</div>'
        +'<div class="mlqs-sub">'+msg+'</div>'
        +'<span class="mlqs-pts">✅ '+score+'/'+corrects.length+' acertos</span>';
    }
  }
}

/* ── TOGGLE DO TÓPICO ── */
function mlToggleTopic(mi,ti){
  var item=document.getElementById('ml_topic_'+mi+'_'+ti);
  if(!item)return;
  var isOpen=item.classList.contains('t-open');

  if(isOpen){
    /* ── FECHAR: só fecha este tópico, não mexe nos outros ── */
    item.classList.remove('t-open');
    return;
  }

  /* ── ABRIR: NÃO fecha os outros tópicos ──
     O DOM não muda antes do getBoundingClientRect(),
     então a posição calculada é 100% precisa. */
  var hdr=item.querySelector('.ml-topic-hdr')||item;
  var topbarH=56, tabsH=48, gap=12;

  /* Posição do header no momento do clique — DOM ainda não mudou */
  var offsetTop=hdr.getBoundingClientRect().top + window.scrollY - (topbarH + tabsH + gap);

  /* Expande o tópico */
  item.classList.add('t-open');
  _curModIdx=mi; _curTopIdx=ti;

  /* Scroll imediato para onde o header estava — sem esperar o DOM expandir */
  window.scrollTo({top: Math.max(0, offsetTop), behavior:'smooth'});

  /* Marcar como visto — SEM pontos */
  var mod=MODS[mi], t=mod.topics[ti];
  var prog=gProg(), key=mod.id+'_'+t.id;
  if(!prog[key]){prog[key]=true; sProg(prog); buildSidebar();}
}

/* Som de check — lápis riscando papel */
function playCheckSound(){
  try{
    var ctx=new(window.AudioContext||window.webkitAudioContext)();
    // Ruído branco filtrado — simula lápis no papel
    var buf=ctx.createBuffer(1,ctx.sampleRate*0.18,ctx.sampleRate);
    var data=buf.getChannelData(0);
    for(var i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(1-i/data.length);
    var src=ctx.createBufferSource();src.buffer=buf;
    var hp=ctx.createBiquadFilter();hp.type='highpass';hp.frequency.value=2200;
    var lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=7000;
    var gain=ctx.createGain();gain.gain.setValueAtTime(0.18,ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.18);
    src.connect(hp);hp.connect(lp);lp.connect(gain);gain.connect(ctx.destination);
    src.start();src.stop(ctx.currentTime+0.18);
    // Click seco no final
    var osc=ctx.createOscillator();var g2=ctx.createGain();
    osc.connect(g2);g2.connect(ctx.destination);
    osc.type='sine';osc.frequency.setValueAtTime(900,ctx.currentTime+0.12);
    osc.frequency.exponentialRampToValueAtTime(400,ctx.currentTime+0.18);
    g2.gain.setValueAtTime(0.12,ctx.currentTime+0.12);
    g2.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.2);
    osc.start(ctx.currentTime+0.12);osc.stop(ctx.currentTime+0.22);
  }catch(e){}
}

/* ── MARCAR TÓPICO COMO CONCLUÍDO (botão manual) ── */
function mlMarkDone(mi,ti){
  var mod=MODS[mi],t=mod.topics[ti];
  var prog=gProg(),key=mod.id+'_'+t.id;
  var isNew=!prog[key];
  if(isNew){prog[key]=true;sProg(prog);buildSidebar();}
  var btn=document.getElementById('ml_mark_'+mi+'_'+ti);
  if(btn){
    btn.classList.add('ml-mark-done');
    var cb=btn.querySelector('.ml-mark-checkbox');
    if(cb)cb.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    var lbl=btn.querySelector('.ml-mark-label');
    if(lbl)lbl.textContent='Concluído';
    playCheckSound();
  }
  var item=document.getElementById('ml_topic_'+mi+'_'+ti);
  if(item){
    item.classList.add('t-done');
    var badge=item.querySelector('.ml-topic-done-badge');
    if(badge)badge.style.display='inline';
  }
  renderModProgress(mi);
  // Verifica se todos os tópicos do módulo foram marcados → concluir módulo (+100 pts)
  checkModuleCompletion(mi);
  if(isNew)showToast('✅ Tópico marcado como concluído!','ok');
}

/* Atualiza só a barra de progresso sem re-renderizar tudo */
function renderModProgress(mi){
  var mod=MODS[mi];var prog=gProg();
  var done=mod.topics.filter(function(t){return prog[mod.id+'_'+t.id];}).length;
  var pct=mod.topics.length?Math.round(done/mod.topics.length*100):0;
  var fill=document.querySelector('#modLessonWrap .ml-mod-prog-fill');
  var pctEl=document.querySelector('#modLessonWrap .ml-mod-prog-pct');
  if(fill)fill.style.width=pct+'%';
  if(pctEl)pctEl.textContent=pct+'%';
}

/* ── VERIFICAR CONCLUSÃO DO MÓDULO → +100 pts ── */
function checkModuleCompletion(mi){
  var prog=gProg(),mod=MODS[mi],key='mod_done_'+mi;
  var allDone=mod.topics.every(function(t){return prog[mod.id+'_'+t.id];});
  if(allDone&&!prog[key]){
    prog[key]=true;sProg(prog);
    addPoints('Módulo concluído: '+mod.name,100);
    showMotiv('🎉','Módulo Concluído!','Você completou "'+mod.name+'" com sucesso!','+100 pontos');
    checkCourseCompletion();
  }
  buildSidebar();
}

/* ── VERIFICAR CONCLUSÃO DO CURSO → +1000 pts ── */
function checkCourseCompletion(){
  var prog=gProg(),key='course_done';
  var allModsDone=MODS.every(function(_,mi){return prog['mod_done_'+mi];});
  if(allModsDone&&!prog[key]){
    prog[key]=true;
    prog['cert_pts_granted']=true;
    sProg(prog);
    addPoints('Curso concluido: '+COURSE.name,1000);
    setTimeout(function(){ showCourseCompleteModal(); }, 800);
  }
}

function showCourseCompleteModal(){
  launchConfetti();
  var modal=document.getElementById('courseCompleteModal');
  if(modal)modal.classList.add('show');
}
function closeCourseCompleteModal(){
  var modal=document.getElementById('courseCompleteModal');
  if(modal)modal.classList.remove('show');
}
function launchConfetti(){
  var colors=['#5b7fff','#22c55e','#f59e0b','#ec4899','#00d4ff','#a855f7'];
  var count=0;
  var interval=setInterval(function(){
    if(count>120){clearInterval(interval);return;}
    count++;
    var el=document.createElement('div');
    el.style.cssText='position:fixed;top:-10px;left:'+Math.random()*100+'vw;'
      +'width:'+(6+Math.random()*8)+'px;height:'+(6+Math.random()*8)+'px;'
      +'background:'+colors[Math.floor(Math.random()*colors.length)]+';'
      +'border-radius:'+(Math.random()>0.5?'50%':'2px')+';'
      +'z-index:99999;pointer-events:none;'
      +'animation:confettiFall '+(1.5+Math.random()*2)+'s linear forwards;'
      +'transform:rotate('+Math.random()*360+'deg);';
    document.body.appendChild(el);
    setTimeout(function(){el.remove();},3500);
  },30);
}

/* ── STREAK 7 DIAS CONSECUTIVOS → +500 pts ── */
function checkStreak(){
  var s;try{s=JSON.parse(localStorage.getItem('ma_sessions'))||{};}catch(e){s={};}
  var today=new Date().toLocaleDateString('pt-BR');
  var yest=new Date(Date.now()-86400000).toLocaleDateString('pt-BR');
  // Se já acessou hoje, não reconta
  if(s.lastStudyDate===today)return;
  // Calcula streak
  if(s.lastStudyDate===yest){s.streak=(s.streak||0)+1;}
  else{s.streak=1;}
  s.lastStudyDate=today;
  localStorage.setItem('ma_sessions',JSON.stringify(s));
  // 7 dias consecutivos → premia uma vez por ciclo
  if(s.streak>0&&s.streak%7===0){
    var streakKey='streak_bonus_'+Math.floor(s.streak/7);
    if(!localStorage.getItem(streakKey)){
      localStorage.setItem(streakKey,'1');
      addPoints('7 dias consecutivos de acesso!',500);
      showMotiv('🔥','Sequência de 7 Dias!','Você acessou por 7 dias seguidos! Incrível!','+500 pontos');
    }
  }
}

/* ── ÁUDIO ÚNICO DO MÓDULO (lê todo o conteúdo dos tópicos em sequência) ── */
var _mlModSynth=null,_mlModMi=-1,_mlAudioEl=null;
function mlToggleModAudio(mi){
  var btn=document.getElementById('ml_abtn_'+mi);
  var st=document.getElementById('ml_ast_'+mi);
  var spdEl=document.getElementById('ml_aspd_'+mi);
  var spd=parseFloat(spdEl?spdEl.value:1)||1;
  if(_mlAudioEl&&_mlModMi===mi&&!_mlAudioEl.paused){
    _mlAudioEl.pause();
    if(btn)btn.classList.remove('playing');
    if(st)st.textContent='Pausado';
    return;
  }
  if(_mlAudioEl&&_mlModMi===mi&&_mlAudioEl.paused){
    _mlAudioEl.playbackRate=spd;_mlAudioEl.play();
    if(btn)btn.classList.add('playing');
    if(st)st.textContent='Narrando...';
    return;
  }
  if(_mlAudioEl){
    _mlAudioEl.pause();_mlAudioEl.src='';_mlAudioEl=null;
    var ob=document.getElementById('ml_abtn_'+_mlModMi);
    var os=document.getElementById('ml_ast_'+_mlModMi);
    if(ob)ob.classList.remove('playing');
    if(os)os.textContent='Clique para ouvir';
  }
  var mod=MODS[mi];var txt='';
  mod.topics.forEach(function(t){
    var tmp=document.createElement('div');tmp.innerHTML=t.content||'';
    var t2=(tmp.textContent||'').replace(/\s+/g,' ').trim();
    if(t2)txt+=t.name+'. '+t2+' ';
  });
  if(!txt.trim()){showToast('Sem conteudo para narrar','warn');return;}
  if(btn)btn.classList.add('playing');
  if(st)st.textContent='Gerando audio IA...';
  _mlModMi=mi;
  var ttsUrl=window.MA_TTS_URL||'';
  if(!ttsUrl){
    // Fallback navegador se nao configurado
    var utt=new SpeechSynthesisUtterance(txt.slice(0,2000));
    utt.lang='pt-BR';utt.rate=spd;
    utt.onstart=function(){if(st)st.textContent='Narrando...';};
    utt.onend=function(){if(btn)btn.classList.remove('playing');if(st)st.textContent='Concluido';};
    window.speechSynthesis.speak(utt);
    return;
  }
  fetch(ttsUrl,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({text:txt.slice(0,4000),voice:window.MA_TTS_VOICE||'onyx'})
  })
  .then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.blob();})
  .then(function(blob){
    var url=URL.createObjectURL(blob);
    _mlAudioEl=new Audio(url);
    _mlAudioEl.playbackRate=spd;
    _mlAudioEl.play();
    if(btn)btn.classList.add('playing');
    if(st)st.textContent='Narrando com voz IA...';
    _mlAudioEl.onended=function(){if(btn)btn.classList.remove('playing');if(st)st.textContent='Concluido';URL.revokeObjectURL(url);_mlAudioEl=null;};
    _mlAudioEl.onerror=function(){if(btn)btn.classList.remove('playing');if(st)st.textContent='Erro';_mlAudioEl=null;};
  })
  .catch(function(e){
    console.error('TTS:',e);
    if(btn)btn.classList.remove('playing');
    if(st)st.textContent='Usando voz do navegador...';
    var utt2=new SpeechSynthesisUtterance(txt.slice(0,2000));
    utt2.lang='pt-BR';utt2.rate=spd;
    utt2.onend=function(){if(btn)btn.classList.remove('playing');if(st)st.textContent='Concluido';};
    window.speechSynthesis.speak(utt2);
  });
}

function mlChangeModSpeed(mi,val){
  if(_mlAudioEl&&_mlModMi===mi)_mlAudioEl.playbackRate=parseFloat(val)||1;
}
/* ── TOGGLE QUIZ ── */
function mlToggleQuiz(mi){
  var sec=document.getElementById('ml_quiz_sec_'+mi);
  if(sec)sec.classList.toggle('qz-open');
}

/* ── SELEÇÃO DE OPÇÃO DO QUIZ ── */
var _mlQzSel={}; // {mi_qi: oi}
function mlSelOpt(mi,qi,oi,silent){
  var key=mi+'_'+qi;
  _mlQzSel[key]=oi;
  if(!silent)localStorage.setItem(COURSE.prefix+'qzsel_'+mi+'_'+qi,oi);
  // Atualiza visual
  var optsEl=document.getElementById('mlq_opts_'+mi+'_'+qi);
  if(!optsEl)return;
  optsEl.querySelectorAll('.mlq-opt').forEach(function(o,idx){
    o.classList.toggle('selected',idx===oi);
  });
}

/* ── FINALIZAR QUIZ DO MÓDULO ── */
function mlFinishQuiz(mi,corrects){
  // Verifica se todas as questões foram respondidas
  var allAnswered=true;
  for(var qi=0;qi<corrects.length;qi++){
    if(_mlQzSel[mi+'_'+qi]===undefined){allAnswered=false;break;}
  }
  if(!allAnswered){showToast('⚠️ Responda todas as questões antes de finalizar!','warn');return;}

  var score=0,totalPts=0;
  corrects.forEach(function(correct,qi){
    var selected=_mlQzSel[mi+'_'+qi];
    var isCorrect=selected===correct;
    if(isCorrect){score++;totalPts+=20;}else{totalPts-=50;}

    // Colorir opções e mostrar respostas
    var optsEl=document.getElementById('mlq_opts_'+mi+'_'+qi);
    if(optsEl)optsEl.querySelectorAll('.mlq-opt').forEach(function(o,oi){
      o.classList.remove('selected');
      var letter=o.querySelector('.mlq-opt-letter');
      if(oi===correct){
        o.classList.add('correct-ans');
        if(letter)letter.textContent='✓';
      } else if(oi===selected&&!isCorrect){
        o.classList.add('wrong-ans');
        if(letter)letter.textContent='✕';
      }
      o.style.pointerEvents='none';
    });

    // Feedback por questão
    var res=document.getElementById('mlq_res_'+mi+'_'+qi);
    if(res){
      res.className='mlq-result '+(isCorrect?'correct':'wrong');
      res.textContent=isCorrect?'✅ Correto!':'❌ Incorreto — veja a resposta certa destacada em verde.';
    }
  });

  // Pontos do quiz — desconto por erros, bônus por acertos
  if(totalPts!==0&&window.MAStore&&MAStore.addPoints){
    MAStore.addPoints(
      totalPts>0?'Quiz: acertos':'Quiz: erros',
      totalPts
    ).then(function(){
      updateTopbar(); // atualiza moedas na topbar imediatamente
    });
    if(totalPts>0){
      showToast('⭐ +'+totalPts+' pontos pelos acertos!','pts');
    } else {
      showToast('📉 '+totalPts+' pontos pelas respostas incorretas','');
    }
  }

  // Score final
  var scoreEl=document.getElementById('ml_qscore_'+mi);
  if(scoreEl){
    scoreEl.classList.add('show');
    var pct2=Math.round(score/corrects.length*100);
    var icon=pct2===100?'🏆':pct2>=60?'🎯':'📚';
    var msg=pct2===100?'Perfeito! Acertou tudo!':pct2>=60?'Bom resultado! Continue assim.':'Revise o conteúdo e tente novamente.';
    var nextModBtn='';
    // Botão próximo módulo só aparece se acertou 100% E existe próximo módulo
    if(pct2===100&&mi+1<MODS.length){
      var nextMod=MODS[mi+1];
      var canNext=isUnlocked()||mi+1<COURSE.freeModules;
      if(canNext){
        nextModBtn='<button class="ml-next-mod-btn" onclick="selectTopic('+(mi+1)+',0,true);window.scrollTo({top:0,behavior:\'smooth\'})">'
          +'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width:17px;height:17px"><polyline points="9 18 15 12 9 6"/></svg>'
          +'Ir para o Módulo '+(mi+2)+': '+nextMod.name
          +'</button>';
      }
    }
    scoreEl.innerHTML='<span class="mlqs-icon">'+icon+'</span>'
      +'<div class="mlqs-title">'+score+' / '+corrects.length+' corretas</div>'
      +'<div class="mlqs-sub">'+msg+'</div>'
      +'<span class="mlqs-pts">'+(totalPts<0?'📉 '+totalPts+' pts (penalidade)':'✅ '+score+'/'+corrects.length+' acertos')+'</span>'
      +nextModBtn;
  }

  // Desabilita botão finalizar
  var fbtn=document.getElementById('ml_qfbtn_'+mi);
  if(fbtn){fbtn.disabled=true;fbtn.textContent='✅ Quiz Finalizado';}

  // Salva como feito
  localStorage.setItem(COURSE.prefix+'qzdone_'+mi,'1');
  grantMission('quiz');

  // ── ANÁLISE DE DIFICULDADE ──
  // Registra erros por questão e alerta se errou a mesma 2x
  var diffAlerts=[];
  corrects.forEach(function(correct,qi){
    var selected=_mlQzSel[mi+'_'+qi];
    var isCorrect=selected===correct;
    if(!isCorrect){
      var errKey=COURSE.prefix+'qerr_'+mi+'_'+qi;
      var errCount=(parseInt(localStorage.getItem(errKey))||0)+1;
      localStorage.setItem(errKey,errCount);
      if(errCount>=2){
        // Pega o nome do tópico que tem este quiz
        var mod=MODS[mi];
        var topicName=mod&&mod.topics[qi%mod.topics.length]?mod.topics[qi%mod.topics.length].name:'este tema';
        diffAlerts.push({qi:qi,count:errCount,topicName:topicName,topicIdx:qi%mod.topics.length});
      }
    }
  });
  // Exibe alertas de dificuldade abaixo do score
  if(diffAlerts.length>0){
    var scoreEl2=document.getElementById('ml_qscore_'+mi);
    if(scoreEl2){
      var alertHtml='';
      diffAlerts.forEach(function(a){
        alertHtml+='<div class="quiz-difficulty-alert">'
          +'<span class="qda-icon">⚠️</span>'
          +'<div><strong>Você errou esta questão '+a.count+'x.</strong> Parece que o tema <em>"'+a.topicName+'"</em> precisa de reforço. '
          +'<span style="color:var(--txt2);">Recomendamos revisar este tópico antes de avançar.</span>'
          +'<br><button onclick="mlReviewTopic('+mi+','+a.topicIdx+')" style="margin-top:8px;padding:6px 14px;border-radius:8px;border:1px solid rgba(245,158,11,.4);background:rgba(245,158,11,.1);color:#f59e0b;font-family:var(--font);font-size:.7rem;font-weight:700;cursor:pointer;">'
          +'📖 Rever: '+a.topicName+'</button>'
          +'</div></div>';
      });
      scoreEl2.insertAdjacentHTML('beforeend',alertHtml);
    }
  }

  // Verifica conclusão do módulo → +100 pts via checkModuleCompletion
  checkModuleCompletion(mi);
}

/* Abre o tópico para revisão (chamado pelo alerta de dificuldade) */
function mlReviewTopic(mi,ti){
  /* mlToggleTopic não fecha os outros — scroll direto para o tópico */
  mlToggleTopic(mi,ti);
}

/* ── TOGGLE FLASHCARDS ── */
function mlToggleFC(mi){
  var sec=document.getElementById('ml_fc_sec_'+mi);
  if(sec)sec.classList.toggle('fc-open');
}

/* ── VIRAR FLASHCARD ── */
function mlFlipCard(mi,ci){
  var card=document.getElementById('ml_fc_'+mi+'_'+ci);
  if(card)card.classList.toggle('flipped');
}

/* Legado — mantido para compatibilidade com sidebar */
function loadTopic(mi,ti){selectTopic(mi,ti,true);}
function goToPrev(){
  var flat=_allTopics.findIndex(function(x){return x.mi===_curModIdx&&x.ti===_curTopIdx;});
  if(flat<=0)return;
  var p=_allTopics[flat-1];selectTopic(p.mi,p.ti,p.canAcc);
}
function goToNext(){
  var flat=_allTopics.findIndex(function(x){return x.mi===_curModIdx&&x.ti===_curTopIdx;});
  if(flat>=_allTopics.length-1){completeModule(_curModIdx);return;}
  var n=_allTopics[flat+1];if(!n.canAcc){openLockScreen();return;}
  selectTopic(n.mi,n.ti,n.canAcc);
}
function completeModule(mi){checkModuleCompletion(mi);}

/* ═══ TABS ═══ */
function switchTab(tab){
  document.querySelectorAll('.ctab').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p=>{p.classList.remove('active');p.style.display='none';});
  document.getElementById('tab-'+tab).classList.add('active');
  var pane=document.getElementById('pane-'+tab);pane.style.display='block';pane.classList.add('active');
  if(tab==='anotacoes'){
    // Carrega texto livre salvo
    var saved=localStorage.getItem(COURSE.prefix+'nb_free')||'';
    var ta=document.getElementById('nbFreeText');
    if(ta)ta.value=saved;
    renderHlNotes();
  }
}

/* ═══ CANETINHA FLUTUANTE ═══ */
var _toolbar=null,_notePopup=null,_curRange=null,_pendingHlId=null;
function initHighlight(){
  _toolbar=document.getElementById('highlightToolbar');
  _notePopup=document.getElementById('hlNotePopup');
  document.addEventListener('mouseup',onTextSelect);
  document.addEventListener('touchend',function(){setTimeout(onTextSelect,100);});
  document.addEventListener('mousedown',function(e){if(!_toolbar.contains(e.target)&&!_notePopup.contains(e.target)){hideToolbar();closeHlNote();}});
}
function onTextSelect(){
  // Quando caneta está no modo ON, não mostra toolbar — o clique já aplica direto
  if(_penActive){hideToolbar();return;}
  var sel=window.getSelection();
  if(!sel||sel.rangeCount===0||sel.toString().trim().length<2){hideToolbar();return;}
  var range=sel.getRangeAt(0);
  var content=document.getElementById('modLessonWrap');
  if(!content||!content.contains(range.commonAncestorContainer)){hideToolbar();return;}
  _curRange=range.cloneRange();
  var rect=range.getBoundingClientRect();
  var tbH=_toolbar.offsetHeight||50;
  var top=rect.top+window.scrollY-tbH-12;
  var left=rect.left+window.scrollX+(rect.width/2)-(_toolbar.offsetWidth/2||120);
  left=Math.max(12,Math.min(left,window.innerWidth-(_toolbar.offsetWidth||240)-12));
  if(top<70)top=rect.bottom+window.scrollY+10;
  _toolbar.style.top=top+'px';_toolbar.style.left=left+'px';
  _toolbar.classList.add('visible');
}
function hideToolbar(){if(_toolbar)_toolbar.classList.remove('visible');}
function applyHighlight(color){
  if(!_curRange)return;
  var sel=window.getSelection();sel.removeAllRanges();sel.addRange(_curRange);
  try{
    var span=document.createElement('mark');
    span.className='hl-'+color;span.dataset.hlColor=color;span.dataset.hlId='hl_'+Date.now();
    _curRange.surroundContents(span);
    saveHighlight(span.dataset.hlId,color,span.textContent);
    showToast('✏️ Trecho destacado!','ok');
  }catch(e){showToast('Selecione texto simples sem formatações para destacar','warn');}
  sel.removeAllRanges();hideToolbar();_curRange=null;
}
function removeHighlight(){
  var sel=window.getSelection();if(!sel||sel.rangeCount===0){showToast('Clique sobre o texto destacado e selecione-o','warn');return;}
  var node=sel.getRangeAt(0).commonAncestorContainer;
  var mark=node.nodeType===3?node.parentElement:node;
  while(mark&&mark.tagName!=='MARK'&&mark.id!=='modLessonWrap')mark=mark.parentElement;
  if(mark&&mark.tagName==='MARK'){var hlId=mark.dataset.hlId;var parent=mark.parentNode;while(mark.firstChild)parent.insertBefore(mark.firstChild,mark);parent.removeChild(mark);if(hlId)deleteHighlight(hlId);showToast('Destaque removido','ok');}
  else showToast('Selecione o texto destacado para remover','warn');
  sel.removeAllRanges();hideToolbar();
}
function saveHighlight(id,color,text){
  var now=new Date();
  var dateStr=now.toLocaleDateString('pt-BR');
  var timeStr=now.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
  var data=gHlData();
  data.unshift({id:id,color:color,text:text.substring(0,500),note:'',topicKey:_curModIdx+'_'+_curTopIdx,date:dateStr,time:timeStr});
  sHlData(data);
}
function deleteHighlight(id){var data=gHlData().filter(d=>d.id!==id);sHlData(data);}
function addNoteToHighlight(){
  if(!_curRange)return;
  var sel=window.getSelection();
  if(sel&&sel.rangeCount>0){var node=sel.getRangeAt(0).commonAncestorContainer;var mark=node.nodeType===3?node.parentElement:node;while(mark&&mark.tagName!=='MARK')mark=mark.parentElement;if(mark)_pendingHlId=mark.dataset.hlId;}
  var tbRect=_toolbar.getBoundingClientRect();
  _notePopup.style.top=(tbRect.bottom+window.scrollY+8)+'px';
  _notePopup.style.left=_toolbar.style.left;
  _notePopup.classList.add('show');
  document.getElementById('hlNoteInput').focus();
}
function saveHlNote(){
  var note=document.getElementById('hlNoteInput').value.trim();if(!note){closeHlNote();return;}
  var data=gHlData();
  if(_pendingHlId){var item=data.find(d=>d.id===_pendingHlId);if(item)item.note=note;}
  else{data.unshift({id:'note_'+Date.now(),color:_activeHlColor,text:window.getSelection().toString().substring(0,200),note:note,topicKey:_curModIdx+'_'+_curTopIdx,date:new Date().toLocaleDateString('pt-BR')});}
  sHlData(data);document.getElementById('hlNoteInput').value='';
  closeHlNote();hideToolbar();showToast('📝 Anotação salva!','ok');
}
function closeHlNote(){document.getElementById('hlNoteInput').value='';_notePopup.classList.remove('show');_pendingHlId=null;}
function renderHlNotes(){
  var data=gHlData();
  var el=document.getElementById('hlNotesList');
  if(!el)return;
  if(!data.length){
    el.innerHTML='<div class="nb-empty">Nenhum trecho grifado ainda.<br>Ative a canetinha e toque no texto da aula!</div>';
    return;
  }
  var colorMap={amarelo:'#fbbb24',verde:'#22c55e',azul:'#5b7fff',rosa:'#ec4899',laranja:'#f59e0b'};
  el.innerHTML=data.map(function(d){
    // Descobrir nome do tópico a partir de topicKey "mi_ti"
    var topicLabel='';
    if(d.topicKey){
      var parts=d.topicKey.split('_');
      var tmi=parseInt(parts[0]),tti=parseInt(parts[1]);
      if(!isNaN(tmi)&&MODS[tmi]&&MODS[tmi].topics[tti])
        topicLabel=MODS[tmi].name+' › '+MODS[tmi].topics[tti].name;
    }
    return '<div class="hl-note-item">'
      +(topicLabel?'<div style="font-size:.46rem;color:var(--txt3);margin-bottom:6px;font-weight:700;text-transform:uppercase;letter-spacing:.08em">📍 '+escHtml(topicLabel)+'</div>':'')
      +(d.text?'<div class="hl-ni-quote" style="border-left-color:'+(colorMap[d.color]||'#5b7fff')+'">'+escHtml(d.text.substring(0,300))+(d.text.length>300?'…':'')+'</div>':'')
      +(d.note?'<div class="hl-ni-note">📝 '+escHtml(d.note)+'</div>':'')
      +'<div class="hl-ni-meta"><div class="hl-ni-color" style="background:'+(colorMap[d.color]||'#5b7fff')+'"></div><span>'+(d.date||'')+(d.time?' às '+d.time:'')+'</span></div>'
      +'<button class="hl-note-del" onclick="deleteHlItem(\''+d.id+'\')" title="Remover">✕</button>'
      +'</div>';
  }).join('');
}
function deleteHlItem(id){var data=gHlData().filter(function(d){return d.id!==id;});sHlData(data);renderHlNotes();}
function escHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

/* Salvar texto livre do caderno */
function saveNbText(){
  var ta=document.getElementById('nbFreeText');
  if(ta)localStorage.setItem(COURSE.prefix+'nb_free',ta.value);
}

/* Download PDF das anotações */
function downloadNotesPDF(){
  var freeText=localStorage.getItem(COURSE.prefix+'nb_free')||'';
  var hlData=gHlData();
  var colorMap={amarelo:'#f59e0b',verde:'#22c55e',azul:'#4A7EFF',rosa:'#ec4899',laranja:'#f97316'};
  var colorNameMap={amarelo:'Amarelo',verde:'Verde',azul:'Azul',rosa:'Rosa',laranja:'Laranja'};
  var now=new Date();
  var exportDate=now.toLocaleDateString('pt-BR');
  var exportTime=now.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});

  var lines=[];
  lines.push('<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">');
  lines.push('<style>');
  lines.push('*{margin:0;padding:0;box-sizing:border-box}');
  lines.push('body{font-family:Georgia,serif;max-width:820px;margin:0 auto;padding:40px 32px;color:#1a1a2e;background:#fff;font-size:14px;line-height:1.75;}');
  lines.push('.header{border-bottom:3px solid #4A7EFF;padding-bottom:20px;margin-bottom:32px;}');
  lines.push('.header-top{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;}');
  lines.push('.logo-text{font-size:11px;font-weight:900;color:#4A7EFF;letter-spacing:3px;text-transform:uppercase;margin-bottom:6px;}');
  lines.push('.course-title{font-size:22px;font-weight:900;color:#0d0d1a;line-height:1.2;}');
  lines.push('.export-info{text-align:right;font-size:11px;color:#888;line-height:1.6;}');
  lines.push('.export-info b{color:#4A7EFF;}');
  lines.push('.section{margin-bottom:36px;}');
  lines.push('.section-title{font-size:13px;font-weight:900;color:#4A7EFF;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #e8eaf2;padding-bottom:8px;margin-bottom:18px;display:flex;align-items:center;gap:8px;}');
  lines.push('.section-count{font-size:10px;background:#e8eaf2;color:#5a5a7a;padding:2px 8px;border-radius:10px;font-weight:700;}');
  lines.push('.free-text{background:#f8f9ff;border:1px solid #e8eaf2;border-radius:10px;padding:18px 20px;white-space:pre-wrap;font-size:13.5px;line-height:1.85;color:#2a2a4a;font-family:Arial,sans-serif;}');
  lines.push('.hl-item{border-left:4px solid #4A7EFF;padding:14px 16px;margin-bottom:14px;background:#fafafa;border-radius:0 10px 10px 0;page-break-inside:avoid;}');
  lines.push('.hl-topic{font-size:10px;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;font-family:Arial,sans-serif;}');
  lines.push('.hl-text{font-style:italic;color:#1a1a2e;font-size:14px;line-height:1.7;margin-bottom:8px;padding:8px 12px;border-radius:6px;}');
  lines.push('.hl-note{font-size:13px;color:#2a2a4a;background:#fff;border:1px solid #e8eaf2;padding:8px 12px;border-radius:6px;margin-top:8px;font-family:Arial,sans-serif;}');
  lines.push('.hl-note::before{content:"📝 Anotação: ";font-weight:700;color:#4A7EFF;}');
  lines.push('.hl-meta{display:flex;align-items:center;gap:10px;margin-top:10px;font-size:11px;color:#aaa;font-family:Arial,sans-serif;}');
  lines.push('.hl-color-dot{width:10px;height:10px;border-radius:50%;display:inline-block;flex-shrink:0;}');
  lines.push('.empty{text-align:center;color:#aaa;padding:40px;font-style:italic;}');
  lines.push('.footer{margin-top:48px;padding-top:16px;border-top:1px solid #e8eaf2;text-align:center;font-size:11px;color:#aaa;font-family:Arial,sans-serif;}');
  lines.push('@media print{body{padding:20px;margin:0;max-width:100%}.hl-item{page-break-inside:avoid}}');
  lines.push('</style></head><body>');

  // Cabeçalho
  lines.push('<div class="header">');
  lines.push('<div class="header-top">');
  lines.push('<div><div class="logo-text">Matheus Academy</div><div class="course-title">'+escHtml(COURSE.name)+'</div></div>');
  lines.push('<div class="export-info">Caderno de Anotações<br><b>'+exportDate+'</b> às <b>'+exportTime+'</b></div>');
  lines.push('</div></div>');

  // Anotações livres
  if(freeText.trim()){
    lines.push('<div class="section">');
    lines.push('<div class="section-title">✏️ Anotações Livres</div>');
    lines.push('<div class="free-text">'+escHtml(freeText)+'</div>');
    lines.push('</div>');
  }

  // Trechos grifados
  if(hlData.length){
    lines.push('<div class="section">');
    lines.push('<div class="section-title">🖊️ Trechos Destacados <span class="section-count">'+hlData.length+' destaque'+(hlData.length>1?'s':'')+'</span></div>');
    hlData.forEach(function(d,i){
      var topicLabel='';
      if(d.topicKey){
        var parts=d.topicKey.split('_');
        var tmi=parseInt(parts[0]),tti=parseInt(parts[1]);
        if(!isNaN(tmi)&&MODS[tmi]&&MODS[tmi].topics[tti])
          topicLabel=MODS[tmi].name+' › '+MODS[tmi].topics[tti].name;
      }
      var color=colorMap[d.color]||'#4A7EFF';
      var colorName=colorNameMap[d.color]||d.color;
      lines.push('<div class="hl-item" style="border-left-color:'+color+'">');
      if(topicLabel)lines.push('<div class="hl-topic">📍 '+escHtml(topicLabel)+'</div>');
      if(d.text)lines.push('<div class="hl-text" style="background:'+color+'22">'+escHtml(d.text)+'</div>');
      if(d.note)lines.push('<div class="hl-note">'+escHtml(d.note)+'</div>');
      lines.push('<div class="hl-meta"><span class="hl-color-dot" style="background:'+color+'"></span><span>'+colorName+'</span><span>•</span><span>'+(d.date||'')+(d.time?' às '+d.time:'')+'</span></div>');
      lines.push('</div>');
    });
    lines.push('</div>');
  }

  if(!freeText.trim()&&!hlData.length){
    lines.push('<div class="empty">Nenhuma anotação ou destaque encontrado.</div>');
  }

  lines.push('<div class="footer">Gerado por Matheus Academy · '+escHtml(COURSE.name)+' · '+exportDate+' às '+exportTime+'</div>');
  lines.push('</body></html>');

  var win=window.open('','_blank','width=920,height=750');
  if(!win){showToast('Permita pop-ups para baixar o PDF','warn');return;}
  win.document.write(lines.join(''));
  win.document.close();
  setTimeout(function(){win.print();},600);
  showToast('📥 Abrindo para impressão/PDF...','ok');
}

/* ═══ ÁUDIO (legado — compatibilidade) ═══ */
var _synth=window.speechSynthesis,_utt=null,_speaking=false,_paused=false;
function _getLessonText(){
  // Pega texto do tópico aberto no acordeão
  var openTopic=document.querySelector('.ml-topic-item.t-open .ml-topic-content');
  if(openTopic)return openTopic.innerText||'';
  // Fallback: todo o conteúdo visível do módulo
  var wrap=document.getElementById('modLessonWrap');
  return wrap?wrap.innerText||'':'';
}
function toggleAudio(){
  if(!_synth)return;
  if(_speaking&&!_paused){_synth.pause();_paused=true;_speaking=false;document.getElementById('audioBtn').textContent='▶️';document.getElementById('audioStatus').textContent='Pausado';}
  else if(_paused){_synth.resume();_paused=false;_speaking=true;document.getElementById('audioBtn').textContent='⏸️';document.getElementById('audioStatus').textContent='Reproduzindo...';}
  else{
    var txt=_getLessonText();if(!txt)return;
    _synth.cancel();
    var rate=parseFloat(document.getElementById('audioSpeed')&&document.getElementById('audioSpeed').value||1);
    _utt=new SpeechSynthesisUtterance(txt);_utt.lang='pt-BR';_utt.rate=rate;
    _utt.onstart=function(){_speaking=true;_paused=false;var ab=document.getElementById('audioBtn');var as_=document.getElementById('audioStatus');if(ab)ab.textContent='⏸️';if(as_)as_.textContent='Reproduzindo... ('+rate+'×)';};
    _utt.onend=_utt.onerror=function(){_speaking=false;_paused=false;var ab=document.getElementById('audioBtn');var as_=document.getElementById('audioStatus');if(ab)ab.textContent='▶️';if(as_)as_.textContent='Concluído';};
    _synth.speak(_utt);
  }
}
/* Altera velocidade em tempo real */
function changeAudioSpeed(val){
  var rate=parseFloat(val)||1;
  if(_speaking||_paused){
    var txt=_getLessonText();if(!txt)return;
    _synth.cancel();_speaking=false;_paused=false;
    _utt=new SpeechSynthesisUtterance(txt);_utt.lang='pt-BR';_utt.rate=rate;
    _utt.onstart=function(){_speaking=true;_paused=false;var ab=document.getElementById('audioBtn');var as_=document.getElementById('audioStatus');if(ab)ab.textContent='⏸️';if(as_)as_.textContent='Reproduzindo... ('+rate+'×)';};
    _utt.onend=_utt.onerror=function(){_speaking=false;_paused=false;var ab=document.getElementById('audioBtn');var as_=document.getElementById('audioStatus');if(ab)ab.textContent='▶️';if(as_)as_.textContent='Concluído';};
    _synth.speak(_utt);
    showToast('🔊 Velocidade: '+rate+'×','ok');
  }
}
function stopAudio(){if(_synth){_synth.cancel();_speaking=false;_paused=false;}var ab=document.getElementById('audioBtn');if(ab)ab.textContent='▶️';var as_=document.getElementById('audioStatus');if(as_)as_.textContent='Clique para ouvir a aula';}

/* ═══ QUIZ — 5 PERGUNTAS ═══ */
var _qData=null,_qSel=-1,_qAnswered=false,_qIdx=0,_qResults=[];
function loadQuiz(quizArr){
  // Aceita array de perguntas ou objeto único (legado)
  if(!Array.isArray(quizArr))quizArr=[quizArr];
  _qData=quizArr;_qIdx=0;_qResults=new Array(quizArr.length).fill(null);
  renderQuizQuestion();
}
function renderQuizQuestion(){
  if(!_qData||!_qData.length)return;
  var q=_qData[_qIdx];
  _qSel=-1;_qAnswered=false;
  document.getElementById('quizQ').textContent=q.q;
  document.getElementById('quizOpts').innerHTML=q.opts.map(function(o,i){return '<div class="quiz-opt" onclick="selOpt('+i+')" id="qo'+i+'"><div class="quiz-dot"></div>'+o+'</div>';}).join('');
  var fb=document.getElementById('quizFb');fb.className='quiz-feedback';fb.textContent='';
  var btn=document.getElementById('quizBtn');btn.disabled=false;btn.textContent='Confirmar';btn.style.background='';
  // Dots de progresso
  var label=document.getElementById('quizStepLabel');
  if(label)label.textContent=(_qIdx+1)+' / '+_qData.length;
  var dotsEl=document.getElementById('quizProgDots');
  if(dotsEl)dotsEl.innerHTML=_qData.map(function(_,i){
    var cls='quiz-prog-dot'+(i===_qIdx?' active':'');
    if(_qResults[i]==='correct')cls='quiz-prog-dot correct';
    else if(_qResults[i]==='wrong')cls='quiz-prog-dot wrong';
    return '<div class="'+cls+'" onclick="jumpQuiz('+i+')"></div>';
  }).join('');
}
function jumpQuiz(i){if(_qResults[i]!==null||i===_qIdx)return;_qIdx=i;renderQuizQuestion();}
function selOpt(i){if(_qAnswered)return;_qSel=i;document.querySelectorAll('.quiz-opt').forEach(function(el,idx){el.className='quiz-opt'+(idx===i?' selected':'');});}
function submitQuiz(){
  if(_qAnswered||_qSel<0||!_qData)return;_qAnswered=true;
  var q=_qData[_qIdx],c=q.correct;
  document.querySelectorAll('.quiz-opt').forEach(function(el,i){if(i===c)el.className='quiz-opt correct';else if(i===_qSel&&i!==c)el.className='quiz-opt wrong';});
  var fb=document.getElementById('quizFb'),btn=document.getElementById('quizBtn');
  var isCorrect=_qSel===c;
  _qResults[_qIdx]=isCorrect?'correct':'wrong';
  if(isCorrect){fb.className='quiz-feedback show ok';fb.textContent='✅ Correto! Excelente!';btn.style.background='var(--grn)';}
  else{fb.className='quiz-feedback show err';fb.textContent='❌ Errado. Correto: "'+q.opts[c]+'"';btn.style.background='var(--red)';}
  // Avançar para próxima ou finalizar
  var next=_qIdx+1;
  if(next<_qData.length){
    btn.textContent='Próxima →';btn.style.background='var(--pri)';
    btn.onclick=function(){_qIdx=next;renderQuizQuestion();btn.onclick=submitQuiz;};
  }else{
    btn.textContent='✅ Concluído!';
    var total=_qResults.filter(function(r){return r==='correct';}).length;
    showToast('🧠 Quiz: '+total+'/'+_qData.length+' corretas!','ok');
    grantMission('quiz');
  }
  renderQuizQuestion();
}

/* ═══ FLASHCARDS — 3 LADO A LADO ═══ */
var _fcCards=[],_fcIdx=0;
function renderCard(){
  var grid=document.getElementById('fcGrid');
  var dotsRow=document.getElementById('fcDotsRow');
  if(!grid||!_fcCards.length)return;
  // Mostra sempre 3 cards — se tiver menos, preenche com placeholders
  var cards=_fcCards.slice(0,3);
  grid.innerHTML=cards.map(function(c,i){
    return '<div class="flashcard" id="fc'+i+'" onclick="flipCard('+i+')">'
      +'<div class="fc-inner">'
      +'<div class="fc-face fc-front"><div class="fc-tag">🔍 Clique para resposta</div><div class="fc-txt">'+c.q+'</div></div>'
      +'<div class="fc-face fc-back"><div class="fc-tag">✅ Resposta</div><div class="fc-txt">'+c.a+'</div></div>'
      +'</div></div>';
  }).join('');
  document.getElementById('fcCounterBadge').textContent=cards.length+' cards';
  if(dotsRow)dotsRow.innerHTML=cards.map(function(_,i){return '<div class="fc-dot'+(i===0?' active':'')+'" id="fcdot'+i+'"></div>';}).join('');
}
function flipCard(i){
  var fc=document.getElementById('fc'+i);
  if(fc)fc.classList.toggle('flipped');
  var dot=document.getElementById('fcdot'+i);
  if(dot)dot.classList.toggle('done');
}
/* legado — mantido por compatibilidade */
function prevCard(){}
function nextCard(){}
function jumpCard(i){}

/* ═══ SURPRESA ═══ */
var SURPRISES=[{i:'⭐',t:'Bônus diário: +30 pontos!',p:30},{i:'🎯',t:'Foco total: +20 pontos!',p:20},{i:'💡',t:'Insight do dia: +25 pontos!',p:25},{i:'🏆',t:'Campeão: +40 pontos!',p:40},{i:'🎁',t:'Presente surpresa: +15 pontos!',p:15}];
function openSurprise(){
  var s;try{s=JSON.parse(localStorage.getItem(COURSE.prefix+'surp'))||{};}catch(e){s={};}
  var today=new Date().toLocaleDateString('pt-BR');
  if(s.date===today){showToast('Você já abriu a caixa hoje! Volte amanhã 🎁','warn');return;}
  if(!gU()){openM('login');return;}
  var r=SURPRISES[Math.floor(Math.random()*SURPRISES.length)];
  localStorage.setItem(COURSE.prefix+'surp',JSON.stringify({date:today,pts:r.p}));
  document.getElementById('sbRewardText').textContent=r.i+' '+r.t;
  document.getElementById('sbReward').classList.add('show');
  addPoints('Caixa Surpresa Diária',r.p);
}

/* ═══ MISSÕES ═══ */
function grantMission(type){
  // Missões removidas da pontuação — pontos só vêm de módulos/cursos/notícias/streak
  // Mantida a função para compatibilidade de chamadas existentes
}

/* ═══ CHAT IA ═══ */
var CHAT_URL='https://shiny-disk-b207ma-academy-ai.matheushenry1998.workers.dev/chat';
window.MA_TTS_URL='https://ma-tts.matheushenry1998.workers.dev';
window.MA_TTS_VOICE='onyx';
var _chatHist=[];
function addMsg(role,content){var msgs=document.getElementById('chatMessages');var d=document.createElement('div');d.className='chat-msg '+(role==='user'?'user':'bot');d.innerHTML='<div class="chat-avatar">'+(role==='user'?'👤':'🤖')+'</div><div class="chat-bubble">'+content+'</div>';msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;}
function addTyping(){var msgs=document.getElementById('chatMessages');var d=document.createElement('div');d.className='chat-msg bot';d.id='chatTyping';d.innerHTML='<div class="chat-avatar">🤖</div><div class="chat-bubble"><div class="chat-typing"><span></span><span></span><span></span></div></div>';msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;}
async function sendChat(){
  var inp=document.getElementById('chatInput'),msg=inp.value.trim();if(!msg)return;
  var u=gU();if(!u){openM('login');return;}
  inp.value='';document.getElementById('chatSendBtn').disabled=true;
  addMsg('user',msg);_chatHist.push({role:'user',content:msg});addTyping();
  try{
    var mod=MODS[_curModIdx],t=mod&&mod.topics[_curTopIdx];
    var sys='Você é assistente do curso "'+COURSE.name+'" da Matheus Academy.'+(t?' Tópico atual: "'+t.name+'".'  :'')+'Responda de forma direta e educacional em português do Brasil.';
    var res=await fetch(CHAT_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:[{role:'system',content:sys}].concat(_chatHist),courseKey:COURSE.courseKey,plan:isUnlocked()?'premium':'free',userEmail:u.email})});
    var data=await res.json();
    document.getElementById('chatTyping')&&document.getElementById('chatTyping').remove();
    var reply=data.content?.[0]?.text||data.reply||'Não consegui processar. Tente novamente.';
    _chatHist.push({role:'assistant',content:reply});addMsg('bot',reply);
  }catch(e){document.getElementById('chatTyping')&&document.getElementById('chatTyping').remove();addMsg('bot','❌ Erro de conexão.');}
  document.getElementById('chatSendBtn').disabled=false;
}

/* ═══ CERTIFICADO ═══ */
function updateCertPct(pct){var el=document.getElementById('certPct');if(el)el.textContent=pct+'%';var btn=document.getElementById('certBtn');if(btn)btn.disabled=pct<100;}
function generateCert(){
  var u=gU();if(!u){openM('login');return;}
  var cv=document.getElementById('certCanvas');
  cv.className='cert-canvas show';
  var ctx=cv.getContext('2d'),W=1000,H=720;
  cv.width=W;cv.height=H;

  // Fundo escuro premium
  var bg=ctx.createLinearGradient(0,0,W,H);
  bg.addColorStop(0,'#05050f');
  bg.addColorStop(.4,'#0a0a20');
  bg.addColorStop(1,'#05050f');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);

  // Grade sutil
  ctx.strokeStyle='rgba(91,127,255,.06)';ctx.lineWidth=1;
  for(var gx=0;gx<W;gx+=40){ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,H);ctx.stroke();}
  for(var gy=0;gy<H;gy+=40){ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(W,gy);ctx.stroke();}

  // Borda dupla elegante
  ctx.strokeStyle='rgba(91,127,255,.7)';ctx.lineWidth=2.5;
  roundRect(ctx,24,24,W-48,H-48,12);ctx.stroke();
  ctx.strokeStyle='rgba(91,127,255,.2)';ctx.lineWidth=1;
  roundRect(ctx,34,34,W-68,H-68,8);ctx.stroke();

  // Orbe decorativo topo
  var orb=ctx.createRadialGradient(W/2,0,0,W/2,0,350);
  orb.addColorStop(0,'rgba(91,127,255,.25)');
  orb.addColorStop(1,'transparent');
  ctx.fillStyle=orb;ctx.fillRect(0,0,W,H);

  // Linha azul topo
  var lineG=ctx.createLinearGradient(100,0,W-100,0);
  lineG.addColorStop(0,'transparent');
  lineG.addColorStop(.3,'#4A7EFF');
  lineG.addColorStop(.7,'#00d4ff');
  lineG.addColorStop(1,'transparent');
  ctx.strokeStyle=lineG;ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(100,78);ctx.lineTo(W-100,78);ctx.stroke();

  // Logo M
  ctx.fillStyle='#FFFFFF';
  ctx.font='900 80px Arial Black,sans-serif';
  ctx.textAlign='center';
  ctx.fillText('M',W/2,70);
  ctx.strokeStyle='#4A7EFF';ctx.lineWidth=2.5;
  ctx.beginPath();ctx.moveTo(W/2-50,78);ctx.lineTo(W/2+50,78);ctx.stroke();
  ctx.lineWidth=1;ctx.globalAlpha=.45;
  ctx.beginPath();ctx.moveTo(W/2-50,84);ctx.lineTo(W/2+50,84);ctx.stroke();
  ctx.globalAlpha=1;
  ctx.fillStyle='#4A7EFF';
  ctx.font='400 13px Arial';ctx.letterSpacing='6px';
  ctx.fillText('ACADEMY',W/2,100);

  // Linha divisora
  ctx.strokeStyle='rgba(91,127,255,.3)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(150,120);ctx.lineTo(W-150,120);ctx.stroke();

  // Titulo certificado
  ctx.fillStyle='rgba(255,255,255,.55)';
  ctx.font='500 15px Arial';ctx.letterSpacing='3px';
  ctx.fillText('CERTIFICADO DE CONCLUSAO',W/2,155);

  // Nome do aluno
  ctx.fillStyle='#ffffff';
  ctx.font='900 42px Georgia,serif';ctx.letterSpacing='0px';
  ctx.fillText(u.name.toUpperCase(),W/2,230);

  // Linha sob nome
  var nameG=ctx.createLinearGradient(250,0,W-250,0);
  nameG.addColorStop(0,'transparent');
  nameG.addColorStop(.5,'rgba(91,127,255,.6)');
  nameG.addColorStop(1,'transparent');
  ctx.strokeStyle=nameG;ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(250,245);ctx.lineTo(W-250,245);ctx.stroke();

  // Texto conclusao
  ctx.fillStyle='rgba(255,255,255,.65)';
  ctx.font='400 16px Arial';ctx.letterSpacing='0';
  ctx.fillText('concluiu com exito o curso',W/2,285);

  // Nome do curso
  ctx.fillStyle='#5b7fff';
  ctx.font='700 28px Georgia,serif';
  wrapText(ctx,COURSE.name,W/2,330,W-200,38);

  // Stats: horas e modulos
  var statsY=430;
  var stats=[
    {icon:'clock',val:COURSE.hours+'h',lbl:'Carga Horaria'},
    {icon:'book',val:COURSE.modules,lbl:'Modulos'},
    {icon:'check',val:COURSE.topics,lbl:'Topicos'},
    {icon:'quiz',val:COURSE.quizzes,lbl:'Quizzes'}
  ];
  var statW=180;var startX=(W-(statW*4))/2;
  stats.forEach(function(s,i){
    var sx=startX+i*statW+statW/2;
    ctx.fillStyle='rgba(91,127,255,.12)';
    roundRect(ctx,sx-70,statsY-30,140,80,10);ctx.fill();
    ctx.strokeStyle='rgba(91,127,255,.3)';ctx.lineWidth=1;
    roundRect(ctx,sx-70,statsY-30,140,80,10);ctx.stroke();
    ctx.fillStyle='#5b7fff';ctx.font='900 24px Arial';
    ctx.fillText(s.val,sx,statsY+8);
    ctx.fillStyle='rgba(255,255,255,.45)';ctx.font='400 11px Arial';
    ctx.fillText(s.lbl.toUpperCase(),sx,statsY+28);
  });

  // Data e ID
  ctx.fillStyle='rgba(255,255,255,.35)';ctx.font='400 12px Arial';
  ctx.fillText('Emitido em: '+new Date().toLocaleDateString('pt-BR'),W/2,560);
  ctx.fillStyle='rgba(255,255,255,.2)';ctx.font='400 10px Arial';
  ctx.fillText('Matheus Academy · matheusacademy.com.br · ID: MA-'+Date.now().toString(36).toUpperCase(),W/2,585);

  // Linha final
  ctx.strokeStyle=lineG;ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(150,H-50);ctx.lineTo(W-150,H-50);ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.25)';ctx.font='700 11px Arial';ctx.letterSpacing='1px';
  ctx.fillText('MATHEUS ACADEMY · CONHECIMENTO QUE TRANSFORMA',W/2,H-30);

  // Adicionar botao download
  var dlBtn=document.getElementById('certDownloadBtn');
  if(!dlBtn){
    dlBtn=document.createElement('button');
    dlBtn.id='certDownloadBtn';
    dlBtn.className='cert-download-btn';
    dlBtn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Baixar Certificado (PNG)';
    dlBtn.onclick=function(){
      var link=document.createElement('a');
      link.download='Certificado_'+COURSE.name.replace(/[^a-z0-9]/gi,'_')+'.png';
      link.href=cv.toDataURL('image/png');
      link.click();
    };
    cv.parentNode.appendChild(dlBtn);
  }

  // Pontos
  var prog=gProg();
  if(!prog['cert_pts_granted']){
    prog['cert_pts_granted']=true;sProg(prog);
    addPoints('Certificado: '+COURSE.name,1000);
  }
  showMotiv('🏆','Parabens!','Voce concluiu o curso e gerou seu certificado!','+1.000 pontos');
}

function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}
function wrapText(ctx,text,x,y,maxW,lineH){
  var words=text.split(' ');var line='';
  for(var i=0;i<words.length;i++){
    var test=line+words[i]+' ';
    if(ctx.measureText(test).width>maxW&&i>0){ctx.fillText(line,x,y);line=words[i]+' ';y+=lineH;}
    else{line=test;}
  }
  ctx.fillText(line,x,y);
}

/* ═══ AUTH ═══ */
function sMsg(id,t,tp){var el=document.getElementById(id);if(!el)return;el.innerHTML='<div class="msg-'+(tp==='ok'?'ok':'err')+'">'+t+'</div>';setTimeout(()=>{el.innerHTML='';},4000);}
async function doLogin(){
  var em=document.getElementById('loginEmail').value.trim().toLowerCase();
  var pw=document.getElementById('loginPass').value;
  if(!em||!pw){sMsg('loginMsg','Preencha e-mail e senha','err');return;}
  var btn=document.getElementById('loginBtn');
  if(btn){btn.disabled=true;btn.textContent='Entrando...';}
  try{
    if(window.MA_AUTH){
      var user=await MA_AUTH.login(em,pw);
      var dados=window.MA_DB?await MA_DB.getUsuario(user.uid):null;
      localStorage.setItem('ma_user',JSON.stringify({
        uid:user.uid,
        name:(dados&&dados.nome)||user.displayName||em.split('@')[0],
        email:em,
        plano:(dados&&dados.plano)||'gratuito',
        cursos:(dados&&dados.cursos_comprados)||[],
        xp_total:(dados&&dados.xp_total)||0
      }));
      localStorage.removeItem('ma_points');
      if(btn){btn.disabled=false;btn.textContent='Entrar';}
      closeM('login');updateTopbar();buildSidebar();
      showToast('✅ Bem-vindo(a), '+((dados&&dados.nome)||em.split('@')[0]).split(' ')[0]+'!','ok');
    }
  }catch(e){
    if(btn){btn.disabled=false;btn.textContent='Entrar';}
    var msg=e.code==='auth/user-not-found'?'E-mail não encontrado':
            e.code==='auth/wrong-password'||e.code==='auth/invalid-credential'?'Senha incorreta':
            e.code==='auth/invalid-email'?'E-mail inválido':'Erro: '+e.message;
    sMsg('loginMsg',msg,'err');
  }
}
async function doRegister(){
  var nm=document.getElementById('regName').value.trim();
  var em=document.getElementById('regEmail').value.trim().toLowerCase();
  var pw=document.getElementById('regPass').value;
  if(!nm||!em||!pw){sMsg('regMsg','Preencha todos os campos','err');return;}
  if(pw.length<6){sMsg('regMsg','Senha mínima 6 caracteres','err');return;}
  var btn=document.getElementById('regBtn');
  if(btn){btn.disabled=true;btn.textContent='Cadastrando...';}
  try{
    if(window.MA_AUTH){
      var user=await MA_AUTH.cadastrar(nm,em,pw);
      localStorage.setItem('ma_user',JSON.stringify({
        uid:user.uid,name:nm,email:em,
        plano:'gratuito',cursos:[],xp_total:0
      }));
      localStorage.removeItem('ma_points');
      if(btn){btn.disabled=false;btn.textContent='Criar Conta';}
      closeM('register');updateTopbar();
      showToast('🎉 Conta criada! Bem-vindo(a), '+nm.split(' ')[0]+'!','ok');
    }
  }catch(e){
    if(btn){btn.disabled=false;btn.textContent='Criar Conta';}
    var msg=e.code==='auth/email-already-in-use'?'E-mail já cadastrado':
            e.code==='auth/weak-password'?'Senha fraca (mín. 6 chars)':
            e.code==='auth/invalid-email'?'E-mail inválido':'Erro: '+e.message;
    sMsg('regMsg',msg,'err');
  }
}
var _re='';
async function sendReset(){var em=document.getElementById('resetEmail').value.trim().toLowerCase();var us=JSON.parse(localStorage.getItem('ma_users')||'{}');if(!us[em]){sMsg('resetMsg','E-mail não encontrado','err');return;}_re=em;var code='';for(var i=0;i<6;i++)code+=Math.floor(Math.random()*10);localStorage.setItem('ma_rst_'+em,code);document.getElementById('resetCodeWrap').style.display='block';sMsg('resetMsg','Código gerado: '+code,'ok');}
async function verifyReset(){var code=document.getElementById('resetCode').value.trim();var np=document.getElementById('resetNewPass').value;if(localStorage.getItem('ma_rst_'+_re)!==code){sMsg('resetMsg','Código inválido','err');return;}if(np.length<6){sMsg('resetMsg','Senha mínima 6 caracteres','err');return;}var ph=await sha(np+_re);var us=JSON.parse(localStorage.getItem('ma_users')||'{}');us[_re].passHash=ph;localStorage.setItem('ma_users',JSON.stringify(us));localStorage.removeItem('ma_rst_'+_re);sMsg('resetMsg','Senha atualizada!','ok');setTimeout(()=>{closeM('reset');openM('login');},1500);}
async function activateCode(){
  var u=gU();if(!u){document.getElementById('codeMsg').innerHTML='<div class="msg-err">Faça login primeiro</div>';return;}
  var code=document.getElementById('codeInput').value.trim().toUpperCase();var em=u.email;var ac=gA();
  for(var i=0;i<COURSES.length;i++){var c=COURSES[i];var h=await sha(c.salt+code);if(h===code.substring(0,8)){ac.courses=ac.courses||{};ac.courses[c.ak+'_file']={code:code,ts:Date.now(),expiry:EXP_I};localStorage.setItem(c.ak,JSON.stringify({email:em,code:code,ts:Date.now(),type:'individual',expiry:EXP_I}));sA(ac);closeM('plans');buildSidebar();showToast('✅ Curso "'+c.name+'" desbloqueado!','ok');return;}}
  var mh=await sha('MA_MASTER_2026_'+code);if(mh===code.substring(0,8)){ac.master=true;ac.masterTs=Date.now();ac.expiry=EXP_M;ac.email=em;sA(ac);COURSES.forEach(c=>{localStorage.setItem(c.ak,JSON.stringify({email:em,code:code,ts:Date.now(),type:'master',expiry:EXP_M}));});closeM('plans');buildSidebar();showToast('🏆 Acesso Master ativado!','ok');return;}
  document.getElementById('codeMsg').innerHTML='<div class="msg-err">Código inválido</div>';
}

/* ═══ MÓDULO EM ACORDEÃO — usado internamente ═══ */
var _moaMi=-1;

function openModAccordion(mi){
  _moaMi=mi;
  var mod=MODS[mi];
  // Esconde capa, mostra acordeão
  document.getElementById('courseCoverSection').style.display='none';
  document.getElementById('courseTabs').style.display='none';
  document.querySelectorAll('.tab-pane').forEach(function(p){p.style.display='none';});
  document.getElementById('modAccordionScreen').classList.add('active');
  hideFloatingPen();
  // Preenche cabeçalho
  document.getElementById('moaModNum').textContent='Módulo '+String(mi+1).padStart(2,'0');
  document.getElementById('moaModTitle').textContent=mod.name;
  renderModAccordion(mi);
  window.scrollTo(0,0);
  if(_isMobile())closeSidebarMobile();
}

function closeModAccordion(){
  document.getElementById('modAccordionScreen').classList.remove('active');
  document.getElementById('courseCoverSection').style.display='flex';
}

function renderModAccordion(mi){
  var mod=MODS[mi];
  var prog=gProg();
  var unlocked=isUnlocked();
  var doneCount=0;
  var html='';
  mod.topics.forEach(function(t,ti){
    var done=!!prog[mod.id+'_'+t.id];
    if(done)doneCount++;
    var isFirst=ti===0;
    var cls='moa-item'+(done?' done':'')+(isFirst?' open':'');
    // Flashcards HTML
    var fcHtml='';
    if(t.cards&&t.cards.length){
      var cards=t.cards.slice(0,3);
      fcHtml='<div class="moa-section-sep"></div>';
      fcHtml+='<div style="font-size:.58rem;font-weight:700;color:var(--txt3);text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px">🃏 Flashcards</div>';
      fcHtml+='<div class="moa-fc-grid">';
      cards.forEach(function(c,ci){
        fcHtml+='<div class="flashcard" id="moa_fc_'+mi+'_'+ti+'_'+ci+'" onclick="moaFlipCard('+mi+','+ti+','+ci+')">'
          +'<div class="fc-inner">'
          +'<div class="fc-face fc-front"><div class="fc-tag">🔍 Clique</div><div class="fc-txt">'+c.q+'</div></div>'
          +'<div class="fc-face fc-back"><div class="fc-tag">✅ Resposta</div><div class="fc-txt">'+c.a+'</div></div>'
          +'</div></div>';
      });
      fcHtml+='</div>';
    }
    // Quiz HTML
    var qHtml='';
    if(t.quiz){
      var qArr=Array.isArray(t.quiz)?t.quiz:[t.quiz];
      qHtml='<div class="moa-section-sep"></div>';
      qHtml+='<div style="font-size:.58rem;font-weight:700;color:var(--txt3);text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px">🧠 Quiz</div>';
      qHtml+='<div class="moa-quiz-nav">'
        +'<div class="moa-quiz-dots" id="moa_qdots_'+mi+'_'+ti+'">'
        +qArr.map(function(_,qi){return '<div class="moa-quiz-dot'+(qi===0?' active':'')+'" id="moa_qd_'+mi+'_'+ti+'_'+qi+'"></div>';}).join('')
        +'</div>'
        +'<span style="font-size:.56rem;color:var(--txt3)" id="moa_qlabel_'+mi+'_'+ti+'">1 / '+qArr.length+'</span>'
        +'</div>';
      qHtml+='<div class="quiz-card" id="moa_qcard_'+mi+'_'+ti+'">';
      qHtml+='<div class="quiz-q" id="moa_qq_'+mi+'_'+ti+'">'+qArr[0].q+'</div>';
      qHtml+='<div class="quiz-opts" id="moa_qopts_'+mi+'_'+ti+'">'
        +qArr[0].opts.map(function(o,oi){
          return '<div class="quiz-opt" onclick="moaSelOpt('+mi+','+ti+','+oi+')" id="moa_qo_'+mi+'_'+ti+'_'+oi+'"><div class="quiz-dot"></div>'+o+'</div>';
        }).join('')
        +'</div>';
      qHtml+='<div class="quiz-feedback" id="moa_qfb_'+mi+'_'+ti+'"></div>';
      qHtml+='<button class="quiz-confirm" id="moa_qbtn_'+mi+'_'+ti+'" onclick="moaSubmitQuiz('+mi+','+ti+')">Confirmar</button>';
      qHtml+='</div>';
    }
    // Botão concluir
    var btnHtml='<button class="moa-done-btn'+(done?' completed':'')+'" id="moa_done_'+mi+'_'+ti+'" onclick="moaMarkDone('+mi+','+ti+')">'
      +(done?'✅ Tópico Concluído':'✔ Marcar como Concluído e Ver Próximo')
      +'</button>';
    html+='<div class="moa-item '+cls+'" id="moa_item_'+mi+'_'+ti+'">'
      +'<div class="moa-item-header'+(isFirst?' open':'')+'" onclick="moaToggle('+mi+','+ti+')">'
      +'<div class="moa-item-num">'+(done?'✓':(ti+1))+'</div>'
      +'<div class="moa-item-info"><span class="moa-item-title">'+t.name+'</span>'
      +'<div class="moa-item-meta"><span>'+t.dur+'</span></div></div>'
      +(done?'<span class="moa-item-badge">✓ Feito</span>':'')
      +'<div class="moa-item-arrow"><svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18"/></svg></div>'
      +'</div>'
      +'<div class="moa-item-body">'
      +'<div class="moa-item-inner">'
      +'<div class="moa-topic-title">'+t.name+'</div>'
      +'<div class="moa-topic-line"></div>'
      +'<div class="moa-topic-content" id="moa_content_'+mi+'_'+ti+'">'+(t.content||'<p>Conteúdo em preparação.</p>')+'</div>'
      +fcHtml+qHtml+btnHtml
      +'</div></div></div>';
  });
  document.getElementById('moaList').innerHTML=html;
  setTimeout(applyFontSize,30);
  // Progresso
  var pct=mod.topics.length?Math.round(doneCount/mod.topics.length*100):0;
  document.getElementById('moaProgFill').style.width=pct+'%';
  document.getElementById('moaProgPct').textContent=pct+'%';
  // Marcar como visto o primeiro tópico — sem pontos (pontos só de módulo concluído)
  if(mod.topics.length>0){
    var t0=mod.topics[0];var prog2=gProg();var key=mod.id+'_'+t0.id;
    if(!prog2[key]){prog2[key]=true;sProg(prog2);buildSidebar();}
  }
}

function moaToggle(mi,ti){
  var item=document.getElementById('moa_item_'+mi+'_'+ti);
  var hdr=item.querySelector('.moa-item-header');
  var isOpen=item.classList.contains('open');
  // Fecha todos
  document.querySelectorAll('.moa-item').forEach(function(el){
    el.classList.remove('open');
    el.querySelector('.moa-item-header').classList.remove('open');
  });
  if(!isOpen){
    item.classList.add('open');
    hdr.classList.add('open');
    // Marcar visto — sem pontos (pontos só de módulo concluído)
    var mod=MODS[mi],t=mod.topics[ti];
    var prog=gProg(),key=mod.id+'_'+t.id;
    if(!prog[key]){prog[key]=true;sProg(prog);buildSidebar();renderModAccordion(mi);}
  }
}

function moaMarkDone(mi,ti){
  var mod=MODS[mi],t=mod.topics[ti];
  var prog=gProg(),key=mod.id+'_'+t.id;
  if(!prog[key]){prog[key]=true;sProg(prog);buildSidebar();}
  // Atualiza botão
  var btn=document.getElementById('moa_done_'+mi+'_'+ti);
  if(btn){btn.textContent='✅ Tópico Concluído';btn.classList.add('completed');}
  // item
  var item=document.getElementById('moa_item_'+mi+'_'+ti);
  if(item){item.classList.add('done');var num=item.querySelector('.moa-item-num');if(num)num.textContent='✓';}
  // Abre próximo tópico automaticamente
  var next=ti+1;
  if(next<mod.topics.length){
    setTimeout(function(){moaToggle(mi,next);
      var el=document.getElementById('moa_item_'+mi+'_'+next);
      if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
    },350);
  }else{
    // Último tópico — verifica conclusão do módulo → +100 pts
    checkModuleCompletion(mi);
  }
  // Atualiza progresso no header
  var doneCount=mod.topics.filter(function(t2){return !!gProg()[mod.id+'_'+t2.id];}).length;
  var pct=Math.round(doneCount/mod.topics.length*100);
  var pf=document.getElementById('moaProgFill');var pp=document.getElementById('moaProgPct');
  if(pf)pf.style.width=pct+'%';if(pp)pp.textContent=pct+'%';
}

function moaFlipCard(mi,ti,ci){
  var fc=document.getElementById('moa_fc_'+mi+'_'+ti+'_'+ci);
  if(fc){fc.classList.toggle('flipped');}
}

// Estado do quiz por tópico
var _moaQState={};
function moaSelOpt(mi,ti,oi){
  var key=mi+'_'+ti;
  if(!_moaQState[key])_moaQState[key]={idx:0,sel:-1,answered:false,results:[]};
  var s=_moaQState[key];
  if(s.answered)return;
  s.sel=oi;
  var qArr=Array.isArray(MODS[mi].topics[ti].quiz)?MODS[mi].topics[ti].quiz:[MODS[mi].topics[ti].quiz];
  var q=qArr[s.idx];
  q.opts.forEach(function(_,i){
    var el=document.getElementById('moa_qo_'+mi+'_'+ti+'_'+i);
    if(el)el.className='quiz-opt'+(i===oi?' selected':'');
  });
}
function moaSubmitQuiz(mi,ti){
  var key=mi+'_'+ti;
  if(!_moaQState[key])_moaQState[key]={idx:0,sel:-1,answered:false,results:[]};
  var s=_moaQState[key];
  if(s.answered||s.sel<0)return;
  s.answered=true;
  var qArr=Array.isArray(MODS[mi].topics[ti].quiz)?MODS[mi].topics[ti].quiz:[MODS[mi].topics[ti].quiz];
  var q=qArr[s.idx];
  var correct=s.sel===q.correct;
  s.results[s.idx]=correct?'correct':'wrong';
  // Visual
  q.opts.forEach(function(_,i){
    var el=document.getElementById('moa_qo_'+mi+'_'+ti+'_'+i);
    if(!el)return;
    if(i===q.correct)el.className='quiz-opt correct';
    else if(i===s.sel&&!correct)el.className='quiz-opt wrong';
  });
  var fb=document.getElementById('moa_qfb_'+mi+'_'+ti);
  var btn=document.getElementById('moa_qbtn_'+mi+'_'+ti);
  if(correct){if(fb){fb.className='quiz-feedback show ok';fb.textContent='✅ Correto!';}}
  else{if(fb){fb.className='quiz-feedback show err';fb.textContent='❌ Correto: "'+q.opts[q.correct]+'"';}}
  // Dot
  var dot=document.getElementById('moa_qd_'+mi+'_'+ti+'_'+s.idx);
  if(dot){dot.className='moa-quiz-dot '+(correct?'correct':'wrong');}
  playCoinSound();
  // Avança para próxima
  var next=s.idx+1;
  if(next<qArr.length){
    btn.textContent='Próxima →';btn.style.background='var(--pri)';
    btn.onclick=function(){
      s.idx=next;s.sel=-1;s.answered=false;
      var nq=qArr[next];
      var qq=document.getElementById('moa_qq_'+mi+'_'+ti);
      if(qq)qq.textContent=nq.q;
      var opts=document.getElementById('moa_qopts_'+mi+'_'+ti);
      if(opts)opts.innerHTML=nq.opts.map(function(o,oi){
        return '<div class="quiz-opt" onclick="moaSelOpt('+mi+','+ti+','+oi+')" id="moa_qo_'+mi+'_'+ti+'_'+oi+'"><div class="quiz-dot"></div>'+o+'</div>';
      }).join('');
      if(fb){fb.className='quiz-feedback';fb.textContent='';}
      btn.textContent='Confirmar';btn.style.background='';btn.onclick=function(){moaSubmitQuiz(mi,ti);};
      var label=document.getElementById('moa_qlabel_'+mi+'_'+ti);
      if(label)label.textContent=(next+1)+' / '+qArr.length;
      var nd=document.getElementById('moa_qd_'+mi+'_'+ti+'_'+next);
      if(nd){document.querySelectorAll('[id^="moa_qd_'+mi+'_'+ti+'_"]').forEach(function(d){d.classList.remove('active');});nd.classList.add('active');}
    };
  }else{
    btn.textContent='✅ Quiz Concluído!';btn.style.background='var(--grn)';
    var total=s.results.filter(function(r){return r==='correct';}).length;
    showToast('🧠 '+total+'/'+qArr.length+' corretas! +'+total*25+' pts','ok');
  }
}
function buildModuleCarousel(){
  var section=document.getElementById('coverModulesSection');
  if(!section||!MODS||!MODS.length)return;
  var prog=gProg();
  var unlocked=isUnlocked();
  var html='<div class="mod-scroll-track">';
  MODS.forEach(function(mod,mi){
    var canAcc=unlocked||mi<COURSE.freeModules;
    var doneT=mod.topics.filter(function(t){return prog[mod.id+'_'+t.id];}).length;
    var pct=mod.topics.length?Math.round(doneT/mod.topics.length*100):0;
    var isDone=pct===100;
    var isActive=!isDone&&doneT>0;
    var cls='mod-scroll-card'+(isDone?' msc-done':isActive?' msc-active':canAcc?'':' msc-locked');
    html+='<div class="'+cls+'" onclick="'+(canAcc?'selectTopic('+mi+',0,true)':'openLockScreen()')+'" title="'+mod.name+'">';
    // Capa visual do card com logo M
    html+='<div class="msc-cover">';
    html+='<div class="msc-cover-grid"></div>';
    // Logo M centralizada
    html+='<svg class="msc-logo" viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg">';
    html+='<text x="60" y="65" text-anchor="middle" fill="#FFFFFF" font-family="Arial Black,sans-serif" font-weight="900" font-size="68" letter-spacing="-2" opacity=".9">M</text>';
    html+='<line x1="8" y1="72" x2="112" y2="72" stroke="#4A7EFF" stroke-width="2.5"/>';
    html+='<line x1="8" y1="78" x2="112" y2="78" stroke="#4A7EFF" stroke-width="1" opacity=".4"/>';
    html+='</svg>';
    // Numero do modulo e badge de status
    html+='<div class="msc-num">';
    if(isDone) html+='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    else if(!canAcc) html+='🔒';
    else html+=(mi+1);
    html+='</div>';
    html+='</div>';
    // Info
    html+='<div class="msc-info">';
    html+='<span class="msc-label">Mod.'+(mi+1)+'</span>';
    html+='<span class="msc-name">'+mod.name+'</span>';
    html+='<span class="msc-meta">'+mod.topics.length+' aulas</span>';
    html+='</div>';
    // Progresso
    if(pct>0&&!isDone) html+='<div class="msc-prog"><div class="msc-prog-fill" style="width:'+pct+'%"></div></div>';
    if(isDone) html+='<div class="msc-done-bar"></div>';
    html+='</div>';
  });
  html+='</div>';
  section.innerHTML=html;
}

/* ═══ MODAL DE MÓDULO ═══ */
var _modalMi=-1,_modalTi=0;
function openModModal(mi){
  var unlocked=isUnlocked();
  var canAcc=unlocked||mi<COURSE.freeModules;
  if(!canAcc){openLockScreen();return;}
  // Abre o módulo com todos os tópicos fechados
  _curModIdx=mi; _curTopIdx=0;
  buildSidebar();
  showTabs(); switchTab('conteudo');
  if(_isMobile()) closeSidebarMobile();
  grantMission('aula');
  renderModLesson(mi);
  window.scrollTo({top:0,behavior:'instant'});
}
function closeModModal(e){
  if(e&&e.target!==document.getElementById('modModalBg'))return;
  document.getElementById('modModalBg').classList.remove('open');
}
function renderModModalTopics(){
  var mod=MODS[_modalMi];
  var prog=gProg();
  var unlocked=isUnlocked();
  var canAcc=unlocked||_modalMi<COURSE.freeModules;
  // Corpo — lista de tópicos
  var html='';
  mod.topics.forEach(function(t,ti){
    var done=!!prog[mod.id+'_'+t.id];
    var isActive=ti===_modalTi;
    var cls='mod-topic-item'+(done?' done-t':'')+(isActive?' active-t':'');
    html+='<div class="'+cls+'" onclick="modSelectTopic('+ti+')">';
    html+='<div class="mod-topic-num">'+(done?'✓':(ti+1))+'</div>';
    html+='<div class="mod-topic-info">';
    html+='<span class="mod-topic-name">'+t.name+'</span>';
    html+='<span class="mod-topic-dur">'+t.dur+'</span>';
    html+='</div>';
    html+='<span class="mod-topic-arrow">›</span>';
    html+='</div>';
  });
  document.getElementById('modModalBody').innerHTML=html;
  // Footer
  var total=mod.topics.length;
  document.getElementById('modModalStep').textContent=(_modalTi+1)+' / '+total;
  document.getElementById('modModalPrev').disabled=_modalTi===0;
  var nextBtn=document.getElementById('modModalNext');
  if(_modalTi>=total-1){
    nextBtn.innerHTML='▶ Abrir Tópico <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 6 15 12 9 18"/></svg>';
  }else{
    nextBtn.innerHTML='Avançar <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 6 15 12 9 18"/></svg>';
  }
  // Scroll para o tópico ativo
  setTimeout(function(){
    var items=document.querySelectorAll('.mod-topic-item');
    if(items[_modalTi])items[_modalTi].scrollIntoView({block:'nearest',behavior:'smooth'});
  },50);
}
function modSelectTopic(ti){
  _modalTi=ti;
  renderModModalTopics();
}
function modModalNav(dir){
  var mod=MODS[_modalMi];
  var newTi=_modalTi+dir;
  if(newTi<0)return;
  if(newTi>=mod.topics.length){
    // Abre o tópico atual
    document.getElementById('modModalBg').classList.remove('open');
    selectTopic(_modalMi,_modalTi,true);
    return;
  }
  _modalTi=newTi;
  renderModModalTopics();
}

/* ═══ INIT CARROSSEL ═══ */
function updateLessonCoverMini(){
  var b=document.getElementById('lcmBadge'),t=document.getElementById('lcmTitle'),d=document.getElementById('lcmDesc');
  if(b)b.textContent='⚡ '+COURSE.cat;
  if(t)t.textContent=COURSE.name;
  if(d)d.textContent=COURSE.desc||'';
}

/* ═══ CANETINHA FLUTUANTE — ON/OFF + AUTO-HIGHLIGHT ═══ */
var _penActive = false;   // caneta ON/OFF
var _eraserActive = false; // borracha ON/OFF

/* Cores CSS de cada nome */
var _colorMap = {
  amarelo:'rgba(251,191,36,.9)',
  verde:'rgba(34,197,94,.85)',
  azul:'rgba(91,127,255,.9)',
  rosa:'rgba(236,72,153,.85)',
  laranja:'rgba(245,158,11,.9)'
};

/* Atualiza visual do botão (badge + bolinha de cor) */
function _updatePenUI(){
  var pen=document.getElementById('floatingPen');
  var badge=document.getElementById('fpStatusBadge');
  var dot=document.getElementById('fpColorDot');
  var eraserBtn=document.getElementById('fpEraserBtn');
  if(!pen)return;
  if(_penActive){
    pen.classList.add('pen-on');
    pen.style.background='';
    if(badge){badge.textContent='ON';badge.style.background='';}
    if(dot){dot.style.background=_colorMap[_activeHlColor]||_colorMap.amarelo;dot.style.display='block';}
    document.body.className=document.body.className.replace(/\bpen-\w+\b/g,'').trim();
    document.body.classList.add('pen-mode-active','pen-'+_activeHlColor);
  } else if(_eraserActive){
    pen.classList.add('pen-on');
    if(badge){badge.textContent='🗑️';badge.style.background='#ef4444';}
    if(dot){dot.style.background='#ef4444';dot.style.display='block';}
    document.body.className=document.body.className.replace(/\bpen-\w+\b/g,'').trim();
  } else {
    pen.classList.remove('pen-on');
    if(badge){badge.textContent='OFF';badge.style.background='';}
    if(dot){dot.style.display='none';}
    document.body.classList.remove('pen-mode-active');
    document.body.className=document.body.className.replace(/\bpen-\w+\b/g,'').trim();
  }
  if(eraserBtn) eraserBtn.style.background = _eraserActive?'rgba(239,68,68,.4)':'rgba(239,68,68,.15)';
}

/* Toggle ON/OFF da canetinha (chamado ao clicar no botão sem arrastar) */
function fpToggleMode(){
  _penActive=!_penActive;
  if(_penActive) _eraserActive=false;
  _updatePenUI();
  showToast(_penActive?'✏️ Caneta ON — toque para marcar':'✏️ Caneta OFF', _penActive?'ok':'');
}

/* Liga/desliga borracha */
function fpToggleEraser(){
  _eraserActive=!_eraserActive;
  if(_eraserActive) _penActive=false;
  _updatePenUI();
  document.getElementById('fpPalette').classList.remove('open');
  showToast(_eraserActive?'🗑️ Borracha ON — toque no destaque para apagar':'🗑️ Borracha OFF','ok');
}

/* Selecionar cor pelo balão (sem fechar o modo, só troca a cor) */
function fpSelectColor(c){
  _activeHlColor=c;
  document.querySelectorAll('.fp-color').forEach(function(b){b.classList.toggle('fp-active',b.dataset.color===c);});
  document.querySelectorAll('.hl-btn').forEach(function(b){b.classList.toggle('active',b.dataset.color===c);});
  document.getElementById('fpPalette').classList.remove('open');
  // Atualiza a bolinha de cor no botão
  var dot=document.getElementById('fpColorDot');
  if(dot)dot.style.background=_colorMap[c]||_colorMap.amarelo;
  // Atualiza classe do body para cursor
  document.body.className=document.body.className.replace(/\bpen-\w+\b/g,'').trim();
  if(_penActive)document.body.classList.add('pen-mode-active','pen-'+c);
}

/* Apaga último destaque */
function fpEraseMode(){
  document.getElementById('fpPalette').classList.remove('open');
  var marks = document.querySelectorAll('mark.hl-amarelo,mark.hl-verde,mark.hl-azul,mark.hl-rosa,mark.hl-laranja');
  if(!marks.length){showToast('Nenhum destaque para remover','warn');return;}
  var last = marks[marks.length-1];
  var hlId=last.dataset.hlId, parent=last.parentNode;
  while(last.firstChild) parent.insertBefore(last.firstChild,last);
  parent.removeChild(last);
  if(hlId) deleteHighlight(hlId);
  showToast('↩ Último destaque removido','ok');
}

/* Limpar todos os destaques */
function fpClearAll(){
  document.getElementById('fpPalette').classList.remove('open');
  var marks = document.querySelectorAll('mark.hl-amarelo,mark.hl-verde,mark.hl-azul,mark.hl-rosa,mark.hl-laranja');
  if(!marks.length){showToast('Nenhum destaque na tela','warn');return;}
  marks.forEach(function(m){
    var hlId=m.dataset.hlId, parent=m.parentNode;
    while(m.firstChild) parent.insertBefore(m.firstChild,m);
    parent.removeChild(m);
    if(hlId) deleteHighlight(hlId);
  });
  showToast('🗑️ Todos os destaques removidos','ok');
}

/* Auto-highlight por clique/toque no texto da aula quando caneta ON */
/* ═══════════════════════════════════════════════════════
   CANETA — CANVAS DE DESENHO LIVRE
   Quando ON: cria canvas transparente sobre a tela.
   O aluno arrasta o dedo e desenha livremente.
   Toque curto num traço existente → apaga aquele traço.
   ═══════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════
   CANETA — HIGHLIGHT FIXO NO TEXTO VIA caretRangeFromPoint
   Arrasta o dedo sobre o texto → marca exatamente as palavras
   tocadas. O <mark> fica no HTML → acompanha o scroll.
   Toque curto em <mark> existente → apaga.
   ═══════════════════════════════════════════════════════ */

/* variáveis de toque gerenciadas dentro de _setupPenClickHighlight */




function _setupPenClickHighlight(){
  var main = document.getElementById('courseMain') || document.body;

  /* ── Utilitários ── */
  function _elUnder(x,y){
    return document.elementFromPoint(x,y);
  }

  function _inContent(el){
    return !!(el && el.closest && el.closest(
      '.ml-topic-content,.moa-topic-content,#modLessonWrap'
    ));
  }

  /* Marca o elemento de parágrafo/linha inteiro sob o ponto tocado */
  function _markLineAt(x, y){
    var el = _elUnder(x, y);
    if(!el) return;

    /* Apaga se tocou em mark E borracha ativa */
    if(_eraserActive){
      var m = el.closest('mark') || (el.tagName==='MARK'?el:null);
      if(m){
        var hlId=m.dataset.hlId, parent=m.parentNode;
        while(m.firstChild) parent.insertBefore(m.firstChild, m);
        parent.removeChild(m);
        if(hlId) deleteHighlight(hlId);
        showToast('🗑️ Removido','ok');
      }
      return;
    }

    if(!_penActive) return;

    /* Sobe na DOM até achar nó de texto dentro do conteúdo */
    var node = el;
    while(node && !_inContent(node)) node = node.parentElement;
    if(!node) return;

    /* Pega o menor elemento de bloco (p, li, h3, h4, span, etc.) */
    var inline = el;
    /* Se caretRangeFromPoint disponível — usa ele para pegar a linha exata */
    var range = null;
    if(document.caretRangeFromPoint){
      var cr = document.caretRangeFromPoint(x,y);
      if(cr && cr.startContainer && cr.startContainer.nodeType===3){
        /* Expande para a linha inteira do nó de texto */
        range = document.createRange();
        range.selectNodeContents(cr.startContainer.parentElement);
      }
    }

    /* Fallback: seleciona o conteúdo do elemento clicado */
    if(!range){
      var target = el;
      /* Sobe até encontrar um elemento de bloco pequeno */
      while(target && !['P','LI','H3','H4','H2','SPAN','STRONG','EM','DIV'].includes(target.tagName)){
        target = target.parentElement;
      }
      if(!target || !_inContent(target)) return;
      range = document.createRange();
      range.selectNodeContents(target);
    }

    if(!range || range.toString().trim().length===0) return;

    _curRange = range;
    try{ applyHighlight(_activeHlColor); }catch(e){}
  }

  /* ── Estado do toque ── */
  var _touching    = false;
  var _startX      = 0, _startY = 0;
  var _lastLineY   = -999; /* última coordenada Y onde marcamos */
  var _isScrolling = false;

  /* ── TOUCH START ── */
  main.addEventListener('touchstart', function(e){
    if(!_penActive && !_eraserActive) return;
    var t = e.touches[0];
    _touching    = true;
    _startX      = t.clientX;
    _startY      = t.clientY;
    _lastLineY   = -999;
    _isScrolling = false;
    /* Marca imediatamente ao tocar */
    _markLineAt(t.clientX, t.clientY);
    e.preventDefault();
  }, {passive:false});

  /* ── TOUCH MOVE ── */
  main.addEventListener('touchmove', function(e){
    if((!_penActive && !_eraserActive) || !_touching) return;
    var t  = e.touches[0];
    var dx = t.clientX - _startX;
    var dy = t.clientY - _startY;

    /* Se predominantemente vertical E ainda não estamos marcando → scroll */
    if(!_isScrolling && Math.abs(dy) > Math.abs(dx) * 1.8 && Math.abs(dy) > 12){
      _isScrolling = true;
    }
    if(_isScrolling){ _touching=false; return; }

    e.preventDefault();

    /* Marca a cada vez que o dedo muda de linha (~24px vertical) */
    var lineChanged = Math.abs(t.clientY - _lastLineY) > 12;
    if(lineChanged){
      _markLineAt(t.clientX, t.clientY);
      _lastLineY = t.clientY;
    }
  }, {passive:false});

  /* ── TOUCH END ── */
  main.addEventListener('touchend', function(e){
    if(!_penActive && !_eraserActive) return;
    _touching    = false;
    _isScrolling = false;
  }, {passive:false});

  /* ── MOUSE (desktop) ── */
  var _mdown = false, _mLastY = -999;
  main.addEventListener('mousedown', function(e){
    if(!_penActive && !_eraserActive) return;
    _mdown=true; _mLastY=-999;
    _markLineAt(e.clientX, e.clientY);
  });
  main.addEventListener('mousemove', function(e){
    if((!_penActive && !_eraserActive)||!_mdown) return;
    if(Math.abs(e.clientY-_mLastY)>12){
      _markLineAt(e.clientX, e.clientY);
      _mLastY=e.clientY;
    }
  });
  main.addEventListener('mouseup', function(){ _mdown=false; });
}

function initFloatingPen(){
  var pen=document.getElementById('floatingPen');
  var btn=document.getElementById('fpBtn');
  var palette=document.getElementById('fpPalette');
  if(!pen||!btn)return;

  /* Inicializa visual */
  _updatePenUI();
  // Bolinha de cor inicial
  var dot=document.getElementById('fpColorDot');
  if(dot)dot.style.background=_colorMap[_activeHlColor]||_colorMap.amarelo;

  var _dragging=false,_startX,_startY,_origX,_origY,_longPressTimer=null;

  /* Mouse — drag ou click simples (toggle) ou click-direito (paleta) */
  btn.addEventListener('contextmenu',function(e){e.preventDefault();palette.classList.toggle('open');});
  btn.addEventListener('mousedown',function(e){
    _dragging=false;_startX=e.clientX;_startY=e.clientY;
    var r=pen.getBoundingClientRect();_origX=r.left;_origY=r.top;
    function onMove(e){var dx=e.clientX-_startX,dy=e.clientY-_startY;
      if(Math.abs(dx)>4||Math.abs(dy)>4){_dragging=true;}
      if(_dragging){pen.style.left=Math.max(0,_origX+dx)+'px';pen.style.top=Math.max(0,_origY+dy)+'px';pen.style.right='auto';pen.style.bottom='auto';}}
    function onUp(){document.removeEventListener('mousemove',onMove);document.removeEventListener('mouseup',onUp);
      if(!_dragging){
        if(palette.classList.contains('open')){palette.classList.remove('open');}
        else{fpToggleMode();}
      }}
    document.addEventListener('mousemove',onMove);document.addEventListener('mouseup',onUp);e.preventDefault();
  });

  /* Touch — drag, tap (toggle) ou toque longo (paleta) */
  btn.addEventListener('touchstart',function(e){
    _dragging=false;var tc=e.touches[0];_startX=tc.clientX;_startY=tc.clientY;
    var r=pen.getBoundingClientRect();_origX=r.left;_origY=r.top;
    // Toque longo (500ms) → abre paleta de cores
    _longPressTimer=setTimeout(function(){
      if(!_dragging){palette.classList.toggle('open');}
    },500);
    function onMove(e){var tc=e.touches[0];var dx=tc.clientX-_startX,dy=tc.clientY-_startY;
      if(Math.abs(dx)>4||Math.abs(dy)>4){_dragging=true;clearTimeout(_longPressTimer);}
      if(_dragging){pen.style.left=Math.max(0,_origX+dx)+'px';pen.style.top=Math.max(0,_origY+dy)+'px';pen.style.right='auto';pen.style.bottom='auto';}}
    function onEnd(){clearTimeout(_longPressTimer);document.removeEventListener('touchmove',onMove);document.removeEventListener('touchend',onEnd);
      if(!_dragging&&!palette.classList.contains('open')){fpToggleMode();}
      else if(!_dragging&&palette.classList.contains('open')){/* já abriu no longpress, não fecha */}}
    document.addEventListener('touchmove',onMove,{passive:false});document.addEventListener('touchend',onEnd);e.preventDefault();
  },{passive:false});

  /* Setup do auto-highlight por clique/toque */
  _setupPenClickHighlight();
}
function showFloatingPen(){var p=document.getElementById('floatingPen');if(p)p.style.display='block';}
function hideFloatingPen(){var p=document.getElementById('floatingPen');if(p)p.style.display='none';}

/* ═══ TIMER + ESTIMATIVA DE CONCLUSÃO ═══ */
var _start=Date.now();
var _lp=null;
var _totalStudySeconds=parseInt(localStorage.getItem((COURSE.prefix||'xx_')+'study_secs'))||0;

setInterval(function(){
  var e=Math.floor((Date.now()-_start)/1000);
  var m=Math.floor(e/60).toString().padStart(2,'0');
  var s=(e%60).toString().padStart(2,'0');
  var el=document.getElementById('stTime');if(el)el.textContent=m+':'+s;
  if(e>0&&e%300===0){/* sem pontos por tempo — pontos só de módulos/cursos/streak */}
  if(e%3===0){
    // v3 FIX: lê XP do Firebase via MAStore — gP() já está corrigido
    var _xpNow=gP().total;
    if(_lp!==null&&_xpNow>_lp)updateTopbar();
    _lp=_xpNow;
  }
  // Acumula tempo de estudo a cada 10s
  if(e>0&&e%10===0){
    _totalStudySeconds+=10;
    localStorage.setItem((COURSE.prefix||'xx_')+'study_secs',_totalStudySeconds);
    _updateCompletionEstimate();
  }
},1000);

/* Calcula e exibe estimativa de conclusão */
function _updateCompletionEstimate(){
  var prog=gProg();
  var totalTopics=0,doneTopics=0;
  MODS.forEach(function(mod){
    totalTopics+=mod.topics.length;
    doneTopics+=mod.topics.filter(function(t){return !!prog[mod.id+'_'+t.id];}).length;
  });
  var remaining=totalTopics-doneTopics;
  if(remaining<=0||_totalStudySeconds<30||doneTopics===0){
    var el=document.getElementById('completionEstimate');
    if(el){
      if(remaining<=0){
        el.style.display='flex';
        document.getElementById('completionEstimateText').innerHTML='🎉 <strong>Parabéns!</strong> Você concluiu todos os tópicos do curso!';
      }
    }
    return;
  }
  // Segundos por tópico concluído (média)
  var secsPerTopic=_totalStudySeconds/doneTopics;
  var remainingSecs=secsPerTopic*remaining;
  var remainingHours=remainingSecs/3600;
  var el=document.getElementById('completionEstimate');
  if(!el)return;
  el.style.display='flex';
  var txt='';
  if(remainingHours<1){
    var mins=Math.round(remainingHours*60);
    txt='No seu ritmo atual, você termina em <strong>~'+mins+' minutos</strong> de estudo ('+remaining+' tópicos restantes)';
  } else {
    var hrs=remainingHours.toFixed(1).replace('.',',');
    txt='No seu ritmo atual, você termina em <strong>~'+hrs+'h</strong> de estudo ('+remaining+' tópicos restantes)';
  }
  document.getElementById('completionEstimateText').innerHTML=txt;
}

/* ═══ MODO FOCO ═══ */
var _focusMode=false;
function toggleFocusMode(){
  _focusMode=!_focusMode;
  document.body.classList.toggle('focus-mode',_focusMode);
  var btn=document.getElementById('focusModeBtn');
  if(btn){
    btn.title=_focusMode?'Sair do Modo Foco':'Modo Foco';
    btn.textContent=_focusMode?'✕':'⛶';
    btn.style.display='flex';
  }
  if(_focusMode){
    showToast('⛶ Modo Foco ativado — toque ✕ para sair','ok');
  } else {
    showToast('Modo Foco desativado','ok');
  }
}

/* Mostrar botão modo foco apenas quando estiver em aula */
function _showFocusBtn(){
  var btn=document.getElementById('focusModeBtn');
  if(btn)btn.style.display='flex';
}
function _hideFocusBtn(){
  var btn=document.getElementById('focusModeBtn');
  if(btn){btn.style.display='none';}
  if(_focusMode){_focusMode=false;document.body.classList.remove('focus-mode');}
}

/* ═══ BOTTOM NAV ATIVO ═══ */
function setBottomNavActive(){
  var path=window.location.pathname;
  var map={'/painel':'.bn-cursos','/ranking':'#bn-ranking','/perfil':'#bn-perfil'};
  // na página do curso, ativar "Cursos"
  document.getElementById('bn-cursos')&&document.getElementById('bn-cursos').classList.add('active');
}

/* ═══ SETUP DE EVENTOS ═══ */
function setupEvents(){
  document.querySelectorAll('[data-close]').forEach(b=>{b.addEventListener('click',function(){closeM(this.getAttribute('data-close'));});});
  document.querySelectorAll('.modal-bg').forEach(m=>{m.addEventListener('click',function(e){if(e.target===m)m.classList.remove('show');});});
  var lb=document.getElementById('loginBtn');if(lb)lb.addEventListener('click',doLogin);
  var lp=document.getElementById('loginPass');if(lp)lp.addEventListener('keydown',function(e){if(e.key==='Enter')doLogin();});
  var rb=document.getElementById('regBtn');if(rb)rb.addEventListener('click',doRegister);
  var sr=document.getElementById('sendResetBtn');if(sr)sr.addEventListener('click',sendReset);
  var vr=document.getElementById('verifyResetBtn');if(vr)vr.addEventListener('click',verifyReset);
  var gr=document.getElementById('goReset');if(gr)gr.addEventListener('click',function(){closeM('login');openM('reset');});
  var ge=document.getElementById('goRegister');if(ge)ge.addEventListener('click',function(){closeM('login');openM('register');});
  var gl=document.getElementById('goLogin');if(gl)gl.addEventListener('click',function(){closeM('register');openM('login');});
  var bl=document.getElementById('backToLogin');if(bl)bl.addEventListener('click',function(){closeM('reset');openM('login');});
  var mo=localStorage.getItem('ma_open_modal');if(mo){localStorage.removeItem('ma_open_modal');setTimeout(()=>openM(mo),400);}
}

/* ═══ LOGO INTERATIVA — SOM DE GOTA + ONDAS DE PISCINA ═══ */
function playDropSound(){
  try{
    var ctx=new(window.AudioContext||window.webkitAudioContext)();
    // Oscilador principal — tom descendente tipo gota
    var osc=ctx.createOscillator();
    var gain=ctx.createGain();
    var filter=ctx.createBiquadFilter();

    filter.type='lowpass';
    filter.frequency.value=1800;
    filter.Q.value=6;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.type='sine';
    // Frequência começa alta e cai — efeito "glot" de gota
    var t=ctx.currentTime;
    osc.frequency.setValueAtTime(980,t);
    osc.frequency.exponentialRampToValueAtTime(260,t+0.18);
    osc.frequency.exponentialRampToValueAtTime(130,t+0.32);

    gain.gain.setValueAtTime(0,t);
    gain.gain.linearRampToValueAtTime(0.38,t+0.015);
    gain.gain.exponentialRampToValueAtTime(0.001,t+0.38);

    osc.start(t);
    osc.stop(t+0.42);

    // Sub-grave que dá o "ploc" inicial da gota
    var osc2=ctx.createOscillator();
    var gain2=ctx.createGain();
    osc2.connect(gain2);gain2.connect(ctx.destination);
    osc2.type='sine';
    osc2.frequency.setValueAtTime(320,t);
    osc2.frequency.exponentialRampToValueAtTime(60,t+0.12);
    gain2.gain.setValueAtTime(0.28,t);
    gain2.gain.exponentialRampToValueAtTime(0.001,t+0.14);
    osc2.start(t);osc2.stop(t+0.16);
  }catch(e){}
}

function logoDropEffect(el){
  // Som de gota
  playDropSound();

  // Pega o container de ondas dentro do elemento
  var rc=el.querySelector('.logo-ripple-container');
  var svg=el.querySelector('.logo-svg');
  if(!rc||!svg)return;

  // Animação da logo — splash tipo piscina
  svg.classList.remove('splashing');
  void svg.offsetWidth; // reflow para resetar
  svg.classList.add('splashing');
  svg.addEventListener('animationend',function(){svg.classList.remove('splashing');},{once:true});

  // Remove ondas antigas
  rc.querySelectorAll('.logo-ripple,.logo-drop').forEach(function(r){r.remove();});

  // Gota visual caindo
  var drop=document.createElement('div');
  drop.className='logo-drop';
  rc.appendChild(drop);
  setTimeout(function(){drop.remove();},600);

  // 3 ondas concêntricas
  for(var i=0;i<3;i++){
    (function(idx){
      setTimeout(function(){
        var r=document.createElement('div');
        r.className='logo-ripple';
        rc.appendChild(r);
        setTimeout(function(){r.remove();},1000);
      },idx*60);
    })(i);
  }
}

/* ═══ INTERSECTION OBSERVER — pausa animações fora da tela ═══ */
(function(){
  if(!window.IntersectionObserver)return;
  var coverAnimEls=[];
  function initCoverObserver(){
    var cover=document.getElementById('courseCoverSection');
    if(!cover)return;
    coverAnimEls=cover.querySelectorAll('.cover-grid,.cover-scan,.cover-horizon,.cover-orb,.logo-svg');
    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        coverAnimEls.forEach(function(el){
          el.style.animationPlayState=entry.isIntersecting?'running':'paused';
        });
      });
    },{threshold:0.05});
    obs.observe(cover);
  }
  document.addEventListener('DOMContentLoaded',function(){setTimeout(initCoverObserver,500);});
})();

/* ═══ TEMA CLARO / ESCURO ═══ */
var _isLight=false;
function initTheme(){
  var saved=localStorage.getItem('ma_theme');
  _isLight=(saved==='light');
  _applyTheme();
}
function toggleTheme(){
  _isLight=!_isLight;
  localStorage.setItem('ma_theme',_isLight?'light':'dark');
  _applyTheme();
  showToast(_isLight?'☀️ Tema claro ativado':'🌙 Tema escuro ativado','ok');
}
function _applyTheme(){
  document.body.classList.toggle('light',_isLight);
  document.getElementById('themeIconSun').style.display=_isLight?'block':'none';
  document.getElementById('themeIconMoon').style.display=_isLight?'none':'block';
}

/* ═══ INIT ═══ */
document.addEventListener('DOMContentLoaded',function(){
  document.documentElement.style.setProperty('--course-color',COURSE.color);
  document.documentElement.style.setProperty('--course-glow',COURSE.glow);
  // Capa
  document.getElementById('coverBadge').textContent='⚡ '+COURSE.cat;
  var _ccmName=document.getElementById('ccmCourseName');
  if(_ccmName)_ccmName.textContent=COURSE.name;
  document.getElementById('coverTitle').textContent=COURSE.name;
  document.getElementById('coverDesc').textContent=COURSE.desc||'';
  document.getElementById('coverMods').textContent=COURSE.modules;
  document.getElementById('coverTopics').textContent=COURSE.topics;
  document.getElementById('coverHours').textContent=COURSE.hours;
  document.getElementById('coverQuizzes').textContent=COURSE.quizzes;
  // Sidebar
  document.getElementById('sbCourseLabel').textContent=COURSE.cat;
  document.getElementById('sbCourseTitle').textContent=COURSE.name;
  document.getElementById('tbCourseName').textContent=COURSE.shortName;
  // Font size
  applyFontSize();
  // Cor ativa padrão da canetinha
  setActiveColor('amarelo');
  // Tema claro/escuro — restaurar preferência salva
  initTheme();
  // Init
  initSidebar();setupEvents();updateTopbar();buildSidebar();initHighlight();setBottomNavActive();updateLessonCoverMini();initFloatingPen();buildModuleCarousel();
  // v3 FIX: Sincronizar com Firebase ao carregar — garante XP correto na topbar
  document.addEventListener('maFirebaseReady', function(){
    if(window.MAStore&&MAStore.syncFromFirebase){
      MAStore.syncFromFirebase().then(function(){updateTopbar();});
    }
  });
  if(window.__maFirebaseReady&&window.MAStore&&MAStore.syncFromFirebase){
    MAStore.syncFromFirebase().then(function(){updateTopbar();});
  }
  // Polling de pontos
  // Polling de pontos — unificado no timer principal acima
  // Sessão — salva duração e contagem, sem mexer no streak (gerenciado por checkStreak)
  var _ss=Date.now();
  function saveSession(){
    var dur=Math.floor((Date.now()-_ss)/60000);
    var s;try{s=JSON.parse(localStorage.getItem('ma_sessions'))||{};}catch(e){s={};}
    s.count=(s.count||0)+1;
    s.lastDuration=dur;
    // NÃO sobrescreve lastStudyDate nem streak — isso é responsabilidade do checkStreak()
    localStorage.setItem('ma_sessions',JSON.stringify(s));
  }
  window.addEventListener('beforeunload',saveSession);
  window.addEventListener('pagehide',saveSession);
  grantMission('aula');
  // Verificar streak de acesso consecutivo → +500 pts se 7 dias seguidos
  checkStreak();
});
