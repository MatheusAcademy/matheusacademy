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
    <div class="mp-pts">⭐ <span id="mpPts">+50 pontos</span></div>
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
    <svg width="130" height="38" viewBox="0 0 260 76" xmlns="http://www.w3.org/2000/svg">
      <!-- M branco bold -->
      <text x="36" y="52" text-anchor="middle" fill="#FFFFFF" font-family="Arial Black,sans-serif" font-weight="900" font-size="56" letter-spacing="-2">M</text>
      <!-- Linha dupla azul abaixo do M -->
      <line x1="4" y1="60" x2="70" y2="60" stroke="#4A7EFF" stroke-width="2.2"/>
      <line x1="4" y1="65" x2="70" y2="65" stroke="#4A7EFF" stroke-width="1" opacity=".4"/>
      <!-- Separador vertical -->
      <line x1="84" y1="12" x2="84" y2="66" stroke="rgba(74,126,255,0.35)" stroke-width="1"/>
      <!-- ACADEMY em azul à direita -->
      <text x="175" y="49" text-anchor="middle" fill="#4A7EFF" font-family="Arial,sans-serif" font-weight="400" font-size="20" letter-spacing="7">ACADEMY</text>
    </svg>
  </a>

  <div class="ma-tb-sep"></div>
  <span class="ma-tb-course-name" id="tbCourseName">Curso</span>
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
  <div class="ma-menu-sec">
    <a class="ma-mi gold" href="index.html" onclick="localStorage.setItem('ma_open_modal','plans');return true"><span class="ma-mi-icon">💎</span>Ver Planos</a>
  </div>
  <div class="ma-menu-sec" id="maMenuAuthSec"></div>
</div>

<!-- PUXADOR LATERAL — externo, sempre visível no desktop -->
<div class="sb-puller" id="sbPuller" onclick="toggleSidebar()" title="Mostrar/ocultar menu lateral">
  <svg viewBox="0 0 10 10"><polyline points="7 2 3 5 7 8"/></svg>
</div>

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

        <!-- TÍTULO DO CURSO -->
        <div class="cover-modules-title" id="coverModulesTitle">
          <div class="cmt-line"></div>
          <span id="coverModulesTitleText">Conteúdo do Curso</span>
          <div class="cmt-line"></div>
        </div>

        <!-- CARROSSEL DE MÓDULOS — fileiras de até 4, scroll horizontal -->
        <div class="cover-modules-section" id="coverModulesSection">
          <!-- preenchido por JS -->
        </div>

        <!-- PROGRESSO -->
        <div class="cover-progress" id="coverProgressWrap" style="display:none">
          <div class="cover-prog-row">
            <span class="cover-prog-label">Seu progresso</span>
            <span class="cover-prog-val" id="coverProgVal">0%</span>
          </div>
          <div class="cover-prog-bar">
            <div class="cover-prog-fill" id="coverProgFill" style="width:0%"></div>
          </div>
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

    <!-- ABA: AULA -->
    <div class="tab-pane active" id="pane-conteudo" style="display:none">

      <!-- MINI-CAPA IDÊNTICA À CAPA PRINCIPAL -->
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

      <div class="lesson-area">
        <div class="lesson-header">
          <span class="lesson-mod-tag" id="lessonModTag">Selecione um tópico →</span>
          <h2 class="lesson-title" id="lessonTitle">Bem-vindo ao curso!</h2>
          <div class="lesson-meta-row">
            <span class="lm-chip" id="lessonDur">⏱️ —</span>
            <span class="lm-chip" id="lessonNum">Tópico —</span>
          </div>
        </div>

        <!-- ÁUDIO -->
        <div class="audio-ctrl">
          <button class="audio-btn" id="audioBtn" onclick="toggleAudio()">▶️</button>
          <div class="audio-info">
            <span class="audio-label">Narração por IA</span>
            <span class="audio-status" id="audioStatus">Clique para ouvir a aula</span>
          </div>
          <select class="audio-speed" id="audioSpeed" onchange="changeAudioSpeed(this.value)">
            <option value="0.5">0.5×</option>
            <option value="0.75">0.75×</option>
            <option value="1" selected>1×</option>
            <option value="1.25">1.25×</option>
            <option value="1.5">1.5×</option>
            <option value="1.75">1.75×</option>
            <option value="2">2×</option>
            <option value="2.5">2.5×</option>
            <option value="3">3×</option>
          </select>
        </div>

        <!-- ══════════════════════════════════════════════
             BARRA DE FERRAMENTAS DE LEITURA — SEMPRE VISÍVEL
             Canetinha + Tamanho de fonte
             ══════════════════════════════════════════════ -->
        <div class="reading-toolbar">
          <!-- Canetinha -->
          <div class="rt-section">
            <span class="rt-label">✏️ Canetinha</span>
          </div>
          <div class="rt-section" style="gap:5px">
            <div class="hl-btn" data-color="amarelo" title="Amarelo" onclick="setActiveColor('amarelo')"></div>
            <div class="hl-btn" data-color="verde" title="Verde" onclick="setActiveColor('verde')"></div>
            <div class="hl-btn" data-color="azul" title="Azul" onclick="setActiveColor('azul')"></div>
            <div class="hl-btn" data-color="rosa" title="Rosa" onclick="setActiveColor('rosa')"></div>
            <div class="hl-btn" data-color="laranja" title="Laranja" onclick="setActiveColor('laranja')"></div>
          </div>
          <button class="rt-note-btn" onclick="applySelectedHighlight()">🖌️ Aplicar</button>
          <button class="hl-remove-btn" onclick="removeHighlight()">✕ Remover</button>
          <div class="rt-sep"></div>
          <!-- Tamanho de fonte -->
          <div class="rt-section">
            <span class="rt-label">Aa Fonte</span>
          </div>
          <div class="rt-section">
            <button class="font-size-btn" onclick="changeFontSize(-1)" title="Diminuir fonte">−</button>
            <span class="font-size-display" id="fontSizeDisplay">14px</span>
            <button class="font-size-btn" onclick="changeFontSize(1)" title="Aumentar fonte">+</button>
          </div>
        </div>

        <!-- CONTEÚDO DA AULA -->
        <div class="lesson-content" id="lessonContent">
          <p>Selecione um módulo e tópico na barra lateral para começar a estudar.</p>
          <p>Use a <strong>barra de ferramentas acima</strong> para destacar trechos com cores e ajustar o tamanho da fonte do texto. Selecione o texto e clique em 🖌️ Aplicar para colorir!</p>
        </div>

        <!-- QUIZ — 5 perguntas por tópico -->
        <div class="quiz-wrap" id="quizWrap" style="display:none">
          <span class="quiz-label">🧠 Quiz do Tópico</span>
          <div class="quiz-nav-row">
            <div class="quiz-progress-dots" id="quizProgDots"></div>
            <span class="quiz-step-label" id="quizStepLabel">1 / 5</span>
          </div>
          <div class="quiz-card">
            <div class="quiz-q" id="quizQ"></div>
            <div class="quiz-opts" id="quizOpts"></div>
            <div class="quiz-feedback" id="quizFb"></div>
            <button class="quiz-confirm" id="quizBtn" onclick="submitQuiz()">Confirmar</button>
          </div>
        </div>

        <!-- FLASHCARDS — 3 lado a lado -->
        <div class="fc-section" id="fcSection" style="display:none">
          <div class="fc-section-header">
            <span class="fc-label">🃏 Flashcards — Clique para virar</span>
            <span class="fc-counter-badge" id="fcCounterBadge">3 cards</span>
          </div>
          <div class="fc-grid" id="fcGrid">
            <!-- renderizado por JS -->
          </div>
          <div class="fc-dots-row" id="fcDotsRow"></div>
        </div>

        <!-- NAVEGAÇÃO -->
        <div class="topic-nav">
          <button class="tnav-btn" id="prevBtn" onclick="goToPrev()">← Anterior</button>
          <button class="tnav-btn primary" id="nextBtn" onclick="goToNext()">Próximo →</button>
        </div>
      </div>
    </div>

    <!-- ABA: ANOTAÇÕES -->
    <div class="tab-pane" id="pane-anotacoes" style="display:none">
      <div class="notes-area">
        <div class="notes-tab-header">
          <div class="notes-tab-title">✏️ Minhas Anotações & Destaques</div>
          <div class="notes-tab-sub">Trechos destacados com a canetinha aparecem aqui</div>
        </div>
        <div class="hl-notes-list" id="hlNotesList">
          <div style="text-align:center;color:var(--txt3);font-size:.75rem;padding:40px 0">
            Nenhum destaque ainda.<br>Use a barra de ferramentas da aula para destacar textos!
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
  <a class="bn-item" id="bn-cursos" href="#" onclick="showCoverIfNeeded();return false">
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
    <div class="fp-erase" onclick="removeHighlight()" title="Remover destaque">✕</div>
  </div>
  <div class="fp-btn" id="fpBtn">
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
function gP(){try{return JSON.parse(localStorage.getItem('ma_points'))||{total:0,history:[]};}catch(e){return{total:0,history:[]};}}
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
var _fontMin = 4, _fontMax = 30;
function applyFontSize(){
  document.documentElement.style.setProperty('--font-size', _fontSize+'px');
  document.getElementById('fontSizeDisplay').textContent = _fontSize+'px';
  localStorage.setItem('ma_font_size', _fontSize);
}
function changeFontSize(delta){
  _fontSize = Math.max(_fontMin, Math.min(_fontMax, _fontSize + delta));
  applyFontSize();
  showToast('Fonte: '+_fontSize+'px', 'ok');
}

/* ═══ CANETINHA — COR ATIVA ═══ */
var _activeHlColor = 'amarelo';
function setActiveColor(color){
  _activeHlColor = color;
  document.querySelectorAll('.hl-btn').forEach(b => b.classList.remove('active'));
  var btn = document.querySelector('.hl-btn[data-color="'+color+'"]');
  if(btn) btn.classList.add('active');
  showToast('Cor selecionada: '+color, 'ok');
}
function applySelectedHighlight(){
  var sel = window.getSelection();
  if(!sel || sel.toString().trim().length < 2){
    showToast('Selecione um trecho de texto primeiro!', 'warn');
    return;
  }
  var range = sel.getRangeAt(0);
  var content = document.getElementById('lessonContent');
  if(!content.contains(range.commonAncestorContainer)){
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
  var p=gP();p.total+=pts;p.history.unshift({source:src,pts:pts,date:new Date().toLocaleDateString('pt-BR')});
  localStorage.setItem('ma_points',JSON.stringify(p));
  playCoinSound();
  updateTopbar();
  showToast('⭐ +'+pts+' pontos — '+src,'pts');
}
window.MA_addPoints=addPoints;window.MA_getPoints=gP;

/* ═══ TOPBAR ═══ */
function updateTopbar(){
  var u=gU(),p=gP(),lv=gLv(p.total);
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

/* ═══ SIDEBAR ═══ */
var _sidebarOpen=true;
var _isMobile=()=>window.innerWidth<=768;
function toggleSidebar(){
  _sidebarOpen=!_sidebarOpen;
  var sb=document.getElementById('courseSidebar');
  var main=document.getElementById('courseMain');
  var ov=document.getElementById('sidebarOverlay');
  var puller=document.getElementById('sbPuller');
  if(_isMobile()){
    sb.classList.toggle('mobile-open',_sidebarOpen);
    ov.classList.toggle('show',_sidebarOpen);
  }else{
    sb.classList.toggle('hidden',!_sidebarOpen);
    main.classList.toggle('sidebar-hidden',!_sidebarOpen);
    if(puller){
      puller.classList.toggle('sb-closed',!_sidebarOpen);
    }
  }
  localStorage.setItem('ma_sidebar',_sidebarOpen?'1':'0');
}
function closeSidebarMobile(){
  _sidebarOpen=false;
  document.getElementById('courseSidebar').classList.remove('mobile-open');
  document.getElementById('sidebarOverlay').classList.remove('show');
}
function initSidebar(){
  var puller=document.getElementById('sbPuller');
  if(_isMobile()){
    _sidebarOpen=false;
    document.getElementById('courseSidebar').classList.remove('mobile-open');
  }else{
    var saved=localStorage.getItem('ma_sidebar');
    _sidebarOpen=saved!=='0';
    if(!_sidebarOpen){
      document.getElementById('courseSidebar').classList.add('hidden');
      document.getElementById('courseMain').classList.add('sidebar-hidden');
      if(puller)puller.classList.add('sb-closed');
    }
  }
}

/* ═══ ACESSO ═══ */
function isUnlocked(){
  if(COURSE.free)return true;
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
      html+='<div class="sb-topic-dot"></div><span class="sb-topic-name">'+topic.name+'</span><span class="sb-topic-dur">'+topic.dur+'</span>';
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
  var cpw=document.getElementById('coverProgressWrap');
  if(cpw&&done>0){cpw.style.display='block';document.getElementById('coverProgVal').textContent=pct+'%';document.getElementById('coverProgFill').style.width=pct+'%';}
  // Atualizar carrossel de módulos
  buildModuleCarousel();
}
function toggleSbMod(mi,canAcc){if(!canAcc){openLockScreen();return;}var hdr=document.getElementById('sbModHdr'+mi),tops=document.getElementById('sbTopics'+mi);if(hdr)hdr.classList.toggle('open');if(tops)tops.classList.toggle('open');}
function filterModules(val){_filterStr=val.trim().toLowerCase();buildSidebar();if(_filterStr){document.querySelectorAll('.sb-topics').forEach(el=>el.classList.add('open'));document.querySelectorAll('.sb-mod-hdr').forEach(el=>el.classList.add('open'));}}

/* ═══ MOSTRAR ABAS / CAPA ═══ */
function showCoverIfNeeded(){
  document.getElementById('courseCoverSection').style.display='flex';
  document.getElementById('courseTabs').style.display='none';
  document.querySelectorAll('.tab-pane').forEach(function(p){p.style.display='none';});
  hideFloatingPen();
}
function showTabs(){
  document.getElementById('courseCoverSection').style.display='none';
  document.getElementById('courseTabs').style.display='flex';
  document.querySelectorAll('.tab-pane').forEach(function(p){p.style.display='none';});
  document.getElementById('pane-conteudo').style.display='block';
  document.getElementById('pane-conteudo').classList.add('active');
  showFloatingPen();
}
function startCourse(){
  if(MODS.length>0&&MODS[0].topics.length>0){selectTopic(0,0,true);}
}

/* ═══ SELECIONAR TÓPICO ═══ */
function selectTopic(mi,ti,canAcc){
  if(!canAcc){openLockScreen();return;}
  _curModIdx=mi;_curTopIdx=ti;
  buildSidebar();loadTopic(mi,ti);
  showTabs();switchTab('conteudo');
  if(_isMobile())closeSidebarMobile();
  grantMission('aula');
  // Scroll imediato ao topo do conteúdo
  setTimeout(function(){
    window.scrollTo({top:0,behavior:'instant'});
    var main=document.getElementById('courseMain');
    if(main)main.scrollTo({top:0,behavior:'instant'});
  },0);
}

/* ═══ CARREGAR TÓPICO ═══ */
function loadTopic(mi,ti){
  var mod=MODS[mi],t=mod.topics[ti];if(!t)return;
  document.getElementById('lessonModTag').textContent='Módulo '+(mi+1)+' — '+mod.name;
  document.getElementById('lessonTitle').textContent=t.name;
  document.getElementById('lessonDur').textContent='⏱️ '+t.dur;
  document.getElementById('lessonNum').textContent='Tópico '+(ti+1)+'/'+mod.topics.length;
  document.getElementById('lessonContent').innerHTML=t.content||'<p>Conteúdo em preparação.</p>';
  stopAudio();
  // Quiz
  var qw=document.getElementById('quizWrap');
  if(t.quiz){qw.style.display='block';loadQuiz(t.quiz);}else qw.style.display='none';
  // Flashcards — SEMPRE ao final se existirem
  var fs=document.getElementById('fcSection');
  if(t.cards&&t.cards.length){
    fs.style.display='block';
    _fcCards=t.cards;_fcIdx=0;
    renderCard();
  }else{
    fs.style.display='none';
  }
  // Marcar como visto
  var prog=gProg(),key=mod.id+'_'+t.id;
  if(!prog[key]){prog[key]=true;sProg(prog);addPoints('Aula: '+t.name,10);buildSidebar();}
  // Prev/Next
  var flat=_allTopics.findIndex(x=>x.mi===mi&&x.ti===ti);
  var prevBtn=document.getElementById('prevBtn'),nextBtn=document.getElementById('nextBtn');
  if(prevBtn)prevBtn.disabled=flat<=0;
  if(nextBtn){if(flat>=_allTopics.length-1)nextBtn.textContent='✅ Concluir Módulo';else nextBtn.textContent='Próximo →';}
}
function _scrollToTop(){window.scrollTo({top:0,behavior:'smooth'});var main=document.getElementById('courseMain');if(main)main.scrollTo({top:0,behavior:'smooth'});}
function goToPrev(){var flat=_allTopics.findIndex(x=>x.mi===_curModIdx&&x.ti===_curTopIdx);if(flat<=0)return;var p=_allTopics[flat-1];selectTopic(p.mi,p.ti,p.canAcc);_scrollToTop();}
function goToNext(){var flat=_allTopics.findIndex(x=>x.mi===_curModIdx&&x.ti===_curTopIdx);if(flat>=_allTopics.length-1){completeModule(_curModIdx);return;}var n=_allTopics[flat+1];if(!n.canAcc){openLockScreen();return;}selectTopic(n.mi,n.ti,n.canAcc);_scrollToTop();}
function completeModule(mi){var prog=gProg(),mod=MODS[mi],key='mod_done_'+mi;if(!prog[key]){prog[key]=true;sProg(prog);addPoints('Módulo concluído: '+mod.name,50);showMotiv('🎉','Módulo Concluído!','Você completou "'+mod.name+'" com sucesso!','+50 pontos');}buildSidebar();}

/* ═══ TABS ═══ */
function switchTab(tab){
  document.querySelectorAll('.ctab').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p=>{p.classList.remove('active');p.style.display='none';});
  document.getElementById('tab-'+tab).classList.add('active');
  var pane=document.getElementById('pane-'+tab);pane.style.display='block';pane.classList.add('active');
  if(tab==='anotacoes')renderHlNotes();
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
  var sel=window.getSelection();
  if(!sel||sel.rangeCount===0||sel.toString().trim().length<2){hideToolbar();return;}
  var range=sel.getRangeAt(0);
  var content=document.getElementById('lessonContent');
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
    addPoints('Destaque no texto',3);showToast('✏️ Trecho destacado!','ok');
  }catch(e){showToast('Selecione texto simples sem formatações para destacar','warn');}
  sel.removeAllRanges();hideToolbar();_curRange=null;
}
function removeHighlight(){
  var sel=window.getSelection();if(!sel||sel.rangeCount===0){showToast('Clique sobre o texto destacado e selecione-o','warn');return;}
  var node=sel.getRangeAt(0).commonAncestorContainer;
  var mark=node.nodeType===3?node.parentElement:node;
  while(mark&&mark.tagName!=='MARK'&&mark.id!=='lessonContent')mark=mark.parentElement;
  if(mark&&mark.tagName==='MARK'){var hlId=mark.dataset.hlId;var parent=mark.parentNode;while(mark.firstChild)parent.insertBefore(mark.firstChild,mark);parent.removeChild(mark);if(hlId)deleteHighlight(hlId);showToast('Destaque removido','ok');}
  else showToast('Selecione o texto destacado para remover','warn');
  sel.removeAllRanges();hideToolbar();
}
function saveHighlight(id,color,text){var data=gHlData();data.unshift({id:id,color:color,text:text.substring(0,200),note:'',topicKey:_curModIdx+'_'+_curTopIdx,date:new Date().toLocaleDateString('pt-BR')});sHlData(data);}
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
  closeHlNote();hideToolbar();addPoints('Anotação vinculada ao texto',5);showToast('📝 Anotação salva!','ok');
}
function closeHlNote(){document.getElementById('hlNoteInput').value='';_notePopup.classList.remove('show');_pendingHlId=null;}
function renderHlNotes(){
  var data=gHlData();var el=document.getElementById('hlNotesList');
  if(!data.length){el.innerHTML='<div style="text-align:center;color:var(--txt3);font-size:.75rem;padding:40px 0">Nenhum destaque ainda.<br>Use a canetinha na aula!</div>';return;}
  var colorLabels={amarelo:'#fbbb24',verde:'#22c55e',azul:'#5b7fff',rosa:'#ec4899',laranja:'#f59e0b'};
  el.innerHTML=data.map(d=>'<div class="hl-note-item">'+(d.text?'<div class="hl-ni-quote" style="border-left-color:'+(colorLabels[d.color]||'#5b7fff')+'">'+escHtml(d.text.substring(0,120))+(d.text.length>120?'…':'')+'</div>':'')+(d.note?'<div class="hl-ni-note">'+escHtml(d.note)+'</div>':'')+'<div class="hl-ni-meta"><div class="hl-ni-color" style="background:'+(colorLabels[d.color]||'#5b7fff')+'"></div><span>'+d.date+'</span></div><button class="hl-note-del" onclick="deleteHlItem(\''+d.id+'\')">✕</button></div>').join('');
}
function deleteHlItem(id){var data=gHlData().filter(d=>d.id!==id);sHlData(data);renderHlNotes();}
function escHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

/* ═══ ÁUDIO ═══ */
var _synth=window.speechSynthesis,_utt=null,_speaking=false,_paused=false;
function toggleAudio(){
  if(!_synth)return;
  if(_speaking&&!_paused){_synth.pause();_paused=true;_speaking=false;document.getElementById('audioBtn').textContent='▶️';document.getElementById('audioStatus').textContent='Pausado';}
  else if(_paused){_synth.resume();_paused=false;_speaking=true;document.getElementById('audioBtn').textContent='⏸️';document.getElementById('audioStatus').textContent='Reproduzindo...';}
  else{
    var txt=document.getElementById('lessonContent').innerText;if(!txt)return;
    _synth.cancel();
    var rate=parseFloat(document.getElementById('audioSpeed').value)||1;
    _utt=new SpeechSynthesisUtterance(txt);_utt.lang='pt-BR';_utt.rate=rate;
    _utt.onstart=()=>{_speaking=true;_paused=false;document.getElementById('audioBtn').textContent='⏸️';document.getElementById('audioStatus').textContent='Reproduzindo... ('+rate+'×)';};
    _utt.onend=_utt.onerror=()=>{_speaking=false;_paused=false;document.getElementById('audioBtn').textContent='▶️';document.getElementById('audioStatus').textContent='Concluído';};
    _synth.speak(_utt);
  }
}
/* Altera velocidade em tempo real — reinicia a fala com nova taxa */
function changeAudioSpeed(val){
  var rate=parseFloat(val)||1;
  if(_speaking||_paused){
    /* Guarda posição aproximada não é possível via API — reinicia do começo com nova velocidade */
    var txt=document.getElementById('lessonContent').innerText;if(!txt)return;
    _synth.cancel();_speaking=false;_paused=false;
    _utt=new SpeechSynthesisUtterance(txt);_utt.lang='pt-BR';_utt.rate=rate;
    _utt.onstart=()=>{_speaking=true;_paused=false;document.getElementById('audioBtn').textContent='⏸️';document.getElementById('audioStatus').textContent='Reproduzindo... ('+rate+'×)';};
    _utt.onend=_utt.onerror=()=>{_speaking=false;_paused=false;document.getElementById('audioBtn').textContent='▶️';document.getElementById('audioStatus').textContent='Concluído';};
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
  if(isCorrect){fb.className='quiz-feedback show ok';fb.textContent='✅ Correto! Excelente!';addPoints('Quiz correto',25);btn.style.background='var(--grn)';}
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
function grantMission(type){var today=new Date().toLocaleDateString('pt-BR');var ms;try{ms=JSON.parse(localStorage.getItem('ma_missions'))||{};}catch(e){ms={};}if(!ms.done||ms.date!==today)ms={date:today,done:{}};if(!ms.done[type]){ms.done[type]=true;localStorage.setItem('ma_missions',JSON.stringify(ms));var mp={aula:10,quiz:15};if(mp[type])addPoints('Missão: '+type,mp[type]);}}

/* ═══ CHAT IA ═══ */
var CHAT_URL='https://shiny-disk-b207ma-academy-ai.matheushenry1998.workers.dev/chat';
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
    _chatHist.push({role:'assistant',content:reply});addMsg('bot',reply);addPoints('Pergunta ao Assistente IA',3);
  }catch(e){document.getElementById('chatTyping')&&document.getElementById('chatTyping').remove();addMsg('bot','❌ Erro de conexão.');}
  document.getElementById('chatSendBtn').disabled=false;
}

/* ═══ CERTIFICADO ═══ */
function updateCertPct(pct){var el=document.getElementById('certPct');if(el)el.textContent=pct+'%';var btn=document.getElementById('certBtn');if(btn)btn.disabled=pct<100;}
function generateCert(){
  var u=gU();if(!u){openM('login');return;}
  var cv=document.getElementById('certCanvas');cv.className='cert-canvas show';
  var ctx=cv.getContext('2d'),W=1000,H=700;
  var bg=ctx.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#08080f');bg.addColorStop(.5,'#0e1225');bg.addColorStop(1,'#08080f');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='#5b7fff';ctx.lineWidth=3;ctx.strokeRect(30,30,W-60,H-60);
  ctx.strokeStyle='rgba(91,127,255,.3)';ctx.lineWidth=1;ctx.strokeRect(40,40,W-80,H-80);
  ctx.fillStyle='#fff';ctx.font='bold 22px Arial';ctx.textAlign='center';ctx.fillText('MATHEUS ACADEMY',W/2,100);
  ctx.fillStyle='rgba(91,127,255,.8)';ctx.font='15px Arial';ctx.fillText('Certificado de Conclusão',W/2,130);
  ctx.font='60px Arial';ctx.fillText('🏆',W/2,240);
  ctx.fillStyle='#fff';ctx.font='bold 36px Georgia';ctx.fillText(u.name,W/2,310);
  ctx.fillStyle='rgba(255,255,255,.7)';ctx.font='16px Arial';ctx.fillText('concluiu com êxito o curso',W/2,360);
  ctx.fillStyle='#5b7fff';ctx.font='bold 24px Georgia';ctx.fillText(COURSE.name,W/2,400);
  ctx.fillStyle='rgba(255,255,255,.5)';ctx.font='13px Arial';ctx.fillText('Conclusão: '+new Date().toLocaleDateString('pt-BR'),W/2,460);
  ctx.fillStyle='rgba(255,255,255,.3)';ctx.font='11px Arial';ctx.fillText('Matheus Academy · ID: MA-'+Date.now().toString(36).toUpperCase(),W/2,520);
  addPoints('Certificado gerado',100);showMotiv('🏆','Parabéns!','Você concluiu o curso!','+100 pontos');
}

/* ═══ AUTH ═══ */
function sMsg(id,t,tp){var el=document.getElementById(id);if(!el)return;el.innerHTML='<div class="msg-'+(tp==='ok'?'ok':'err')+'">'+t+'</div>';setTimeout(()=>{el.innerHTML='';},4000);}
async function doLogin(){var em=document.getElementById('loginEmail').value.trim().toLowerCase();var pw=document.getElementById('loginPass').value;if(!em||!pw){sMsg('loginMsg','Preencha e-mail e senha','err');return;}var ph=await sha(pw+em);var us=JSON.parse(localStorage.getItem('ma_users')||'{}');if(!us[em]){sMsg('loginMsg','E-mail não encontrado','err');return;}if(us[em].passHash!==ph){sMsg('loginMsg','Senha incorreta','err');return;}localStorage.setItem('ma_user',JSON.stringify(us[em]));closeM('login');updateTopbar();buildSidebar();showToast('✅ Bem-vindo(a), '+us[em].name.split(' ')[0]+'!','ok');}
async function doRegister(){var nm=document.getElementById('regName').value.trim();var em=document.getElementById('regEmail').value.trim().toLowerCase();var pw=document.getElementById('regPass').value;if(!nm||!em||!pw){sMsg('regMsg','Preencha todos os campos','err');return;}if(pw.length<6){sMsg('regMsg','Senha mínima 6 caracteres','err');return;}var ph=await sha(pw+em);var us=JSON.parse(localStorage.getItem('ma_users')||'{}');if(us[em]){sMsg('regMsg','E-mail já cadastrado','err');return;}us[em]={name:nm,email:em,passHash:ph,createdAt:new Date().toISOString()};localStorage.setItem('ma_users',JSON.stringify(us));localStorage.setItem('ma_user',JSON.stringify(us[em]));closeM('register');updateTopbar();showToast('🎉 Conta criada!','ok');}
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
  // Progresso
  var pct=mod.topics.length?Math.round(doneCount/mod.topics.length*100):0;
  document.getElementById('moaProgFill').style.width=pct+'%';
  document.getElementById('moaProgPct').textContent=pct+'%';
  // Marcar como visto o primeiro tópico
  if(mod.topics.length>0){
    var t0=mod.topics[0];var prog2=gProg();var key=mod.id+'_'+t0.id;
    if(!prog2[key]){prog2[key]=true;sProg(prog2);addPoints('Aula: '+t0.name,10);buildSidebar();}
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
    // Marcar visto
    var mod=MODS[mi],t=mod.topics[ti];
    var prog=gProg(),key=mod.id+'_'+t.id;
    if(!prog[key]){prog[key]=true;sProg(prog);addPoints('Aula: '+t.name,10);buildSidebar();renderModAccordion(mi);}
  }
}

function moaMarkDone(mi,ti){
  var mod=MODS[mi],t=mod.topics[ti];
  var prog=gProg(),key=mod.id+'_'+t.id;
  if(!prog[key]){prog[key]=true;sProg(prog);addPoints('Tópico concluído: '+t.name,20);buildSidebar();}
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
    // Último tópico — concluir módulo
    completeModule(mi);
  }
  // Atualiza progresso no header
  var doneCount=mod.topics.filter(function(t2){return !!gProg()[mod.id+'_'+t2.id];}).length;
  var pct=Math.round(doneCount/mod.topics.length*100);
  var pf=document.getElementById('moaProgFill');var pp=document.getElementById('moaProgPct');
  if(pf)pf.style.width=pct+'%';if(pp)pp.textContent=pct+'%';
}

function moaFlipCard(mi,ti,ci){
  var fc=document.getElementById('moa_fc_'+mi+'_'+ti+'_'+ci);
  if(fc){fc.classList.toggle('flipped');addPoints('Flashcard revisado',3);}
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
  if(correct){if(fb){fb.className='quiz-feedback show ok';fb.textContent='✅ Correto!';}addPoints('Quiz correto',25);}
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
  // Divide módulos em fileiras de 4
  var rows=[];
  for(var i=0;i<MODS.length;i+=4)rows.push(MODS.slice(i,i+4));
  var html='';
  rows.forEach(function(row,ri){
    html+='<div class="mod-row">';
    row.forEach(function(mod,ci){
      var mi=ri*4+ci;
      var canAcc=unlocked||mi<COURSE.freeModules;
      var doneT=mod.topics.filter(function(t){return prog[mod.id+'_'+t.id];}).length;
      var pct=mod.topics.length?Math.round(doneT/mod.topics.length*100):0;
      var isDone=pct===100;
      var cls='mod-card'+(isDone?' done':'')+(canAcc?'':' locked');
      html+='<div class="'+cls+'" onclick="openModModal('+mi+')" data-mi="'+mi+'">';
      // Capa do card
      html+='<div class="mod-card-cover">';
      html+='<div class="mod-card-cover-bg"></div>';
      html+='<div class="mod-card-cover-grid"></div>';
      html+='<div class="mod-card-cover-num">Módulo '+(mi+1)+'</div>';
      // Logo M pequena
      html+='<div class="mod-card-logo">';
      html+='<svg viewBox="0 0 120 90" width="60" height="45" xmlns="http://www.w3.org/2000/svg">';
      html+='<text x="60" y="65" text-anchor="middle" fill="#FFFFFF" font-family="Arial Black,sans-serif" font-weight="900" font-size="68" letter-spacing="-2">M</text>';
      html+='<line x1="8" y1="72" x2="112" y2="72" stroke="#4A7EFF" stroke-width="2.5"/>';
      html+='<line x1="8" y1="78" x2="112" y2="78" stroke="#4A7EFF" stroke-width="1" opacity=".4"/>';
      html+='</svg></div>';
      // Badge concluído
      html+='<div class="mod-card-done-badge">✓</div>';
      // Lock
      html+='<div class="mod-card-lock">🔒</div>';
      html+='</div>';
      // Info
      html+='<div class="mod-card-info">';
      html+='<span class="mod-card-name">'+mod.name+'</span>';
      html+='<div class="mod-card-meta"><span>'+mod.topics.length+' tópicos</span></div>';
      html+='<div class="mod-card-prog"><div class="mod-card-prog-fill" style="width:'+pct+'%"></div></div>';
      html+='</div>';
      html+='</div>';
    });
    html+='</div>';
  });
  section.innerHTML=html;
}

/* ═══ MODAL DE MÓDULO ═══ */
var _modalMi=-1,_modalTi=0;
function openModModal(mi){
  var unlocked=isUnlocked();
  var canAcc=unlocked||mi<COURSE.freeModules;
  if(!canAcc){openLockScreen();return;}
  // Abre direto o primeiro tópico do módulo — sem mostrar modal de lista
  selectTopic(mi,0,true);
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

/* ═══ CANETINHA FLUTUANTE ═══ */
function initFloatingPen(){
  var pen=document.getElementById('floatingPen');
  var btn=document.getElementById('fpBtn');
  var palette=document.getElementById('fpPalette');
  if(!pen||!btn)return;
  var _dragging=false,_startX,_startY,_origX,_origY;
  btn.addEventListener('mousedown',function(e){
    _dragging=false;_startX=e.clientX;_startY=e.clientY;
    var r=pen.getBoundingClientRect();_origX=r.left;_origY=r.top;
    function onMove(e){var dx=e.clientX-_startX,dy=e.clientY-_startY;
      if(Math.abs(dx)>4||Math.abs(dy)>4){_dragging=true;}
      if(_dragging){pen.style.left=Math.max(0,_origX+dx)+'px';pen.style.top=Math.max(0,_origY+dy)+'px';pen.style.right='auto';pen.style.bottom='auto';}}
    function onUp(){document.removeEventListener('mousemove',onMove);document.removeEventListener('mouseup',onUp);
      if(!_dragging){palette.classList.toggle('open');}}
    document.addEventListener('mousemove',onMove);document.addEventListener('mouseup',onUp);e.preventDefault();
  });
  btn.addEventListener('touchstart',function(e){
    _dragging=false;var tc=e.touches[0];_startX=tc.clientX;_startY=tc.clientY;
    var r=pen.getBoundingClientRect();_origX=r.left;_origY=r.top;
    function onMove(e){var tc=e.touches[0];var dx=tc.clientX-_startX,dy=tc.clientY-_startY;
      if(Math.abs(dx)>4||Math.abs(dy)>4)_dragging=true;
      if(_dragging){pen.style.left=Math.max(0,_origX+dx)+'px';pen.style.top=Math.max(0,_origY+dy)+'px';pen.style.right='auto';pen.style.bottom='auto';}}
    function onEnd(){document.removeEventListener('touchmove',onMove);document.removeEventListener('touchend',onEnd);
      if(!_dragging){palette.classList.toggle('open');}}
    document.addEventListener('touchmove',onMove,{passive:false});document.addEventListener('touchend',onEnd);e.preventDefault();
  },{passive:false});
}
function fpSelectColor(c){
  _activeHlColor=c;
  document.querySelectorAll('.fp-color').forEach(function(b){b.classList.toggle('fp-active',b.dataset.color===c);});
  document.querySelectorAll('.hl-btn').forEach(function(b){b.classList.toggle('active',b.dataset.color===c);});
  document.getElementById('fpPalette').classList.remove('open');
  showToast('✏️ Cor: '+c,'ok');
}
function showFloatingPen(){var p=document.getElementById('floatingPen');if(p)p.style.display='block';}
function hideFloatingPen(){var p=document.getElementById('floatingPen');if(p)p.style.display='none';}

/* ═══ TIMER ═══ */
var _start=Date.now();
var _lp=null;
setInterval(function(){
  // Timer de estudo
  var e=Math.floor((Date.now()-_start)/1000);
  var m=Math.floor(e/60).toString().padStart(2,'0');
  var s=(e%60).toString().padStart(2,'0');
  var el=document.getElementById('stTime');if(el)el.textContent=m+':'+s;
  if(e>0&&e%300===0)addPoints('Estudo (5min)',5);
  // Polling de pontos (a cada 3 ticks = ~3s)
  if(e%3===0){var p=gP();if(_lp!==null&&p.total>_lp)updateTopbar();_lp=p.total;}
},1000);

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
  // Polling de pontos
  // Polling de pontos — unificado no timer principal acima
  // Sessão
  var _ss=Date.now();
  function saveSession(){var dur=Math.floor((Date.now()-_ss)/60000);var s;try{s=JSON.parse(localStorage.getItem('ma_sessions'))||{};}catch(e){s={};}s.count=(s.count||0)+1;s.lastDuration=dur;var today=new Date().toLocaleDateString('pt-BR'),yest=new Date(Date.now()-86400000).toLocaleDateString('pt-BR');if(s.lastStudyDate===yest)s.streak=(s.streak||0)+1;else if(s.lastStudyDate!==today)s.streak=1;s.lastStudyDate=today;localStorage.setItem('ma_sessions',JSON.stringify(s));}
  window.addEventListener('beforeunload',saveSession);window.addEventListener('pagehide',saveSession);
  grantMission('aula');
});