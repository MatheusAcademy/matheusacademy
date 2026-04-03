/* ══════════════════════════════════════════════════════════════════
   MATHEUS ACADEMY — TIME TRACKER v1
   Rastreia tempo REAL que o aluno fica com o site aberto e visível.
   - Conta apenas quando a aba está em foco (visibilitychange)
   - Para quando o aluno troca de aba ou minimiza
   - Salva a cada 30s no localStorage (prefixo ma_time_)
   - Registra histórico por dia para o admin
   - Funciona em TODAS as páginas do portal
   ══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Helpers ── */
  function gs(k, def) {
    try { var v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : def; } catch (e) { return def; }
  }
  function ss(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }
  function today() {
    return new Date().toISOString().split('T')[0];
  }
  function getUser() {
    try { return JSON.parse(localStorage.getItem('ma_user') || 'null'); } catch (e) { return null; }
  }

  /* ── Estado ── */
  var _startTime = null;       // quando começou a contar (ms)
  var _totalSession = 0;       // segundos acumulados nesta sessão de página
  var _isVisible = !document.hidden;
  var _page = (location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';
  var _saveInterval = null;

  /* ── Iniciar contagem ── */
  function startCounting() {
    if (!_isVisible || _startTime !== null) return;
    _startTime = Date.now();
  }

  /* ── Pausar e acumular ── */
  function pauseCounting() {
    if (_startTime === null) return;
    var elapsed = Math.floor((Date.now() - _startTime) / 1000);
    if (elapsed > 0) _totalSession += elapsed;
    _startTime = null;
  }

  /* ── Salvar no localStorage ── */
  function save() {
    // Acumula o que ainda está rodando sem pausar
    var extra = _startTime !== null ? Math.floor((Date.now() - _startTime) / 1000) : 0;
    var totalSec = _totalSession + extra;
    if (totalSec <= 0) return;

    var tk = today();
    var u = getUser();

    /* ma_time_today: { date, totalSec, byPage: {pageName: sec} } */
    var td = gs('ma_time_today', { date: tk, totalSec: 0, byPage: {} });
    if (td.date !== tk) {
      // Novo dia — salva o dia anterior no histórico antes de resetar
      saveToHistory(td);
      td = { date: tk, totalSec: 0, byPage: {} };
    }
    td.totalSec = (td.totalSec || 0) + totalSec;
    td.byPage = td.byPage || {};
    td.byPage[_page] = (td.byPage[_page] || 0) + totalSec;
    td.lastSeen = Date.now();
    if (u && u.email) td.user = u.email;
    if (u && u.name)  td.userName = u.name;
    ss('ma_time_today', td);

    /* ma_time_total: total acumulado em segundos ── */
    ss('ma_time_total', (gs('ma_time_total', 0) + totalSec));

    /* ma_study_total_min, ma_study_today_min — compatibilidade com perfil.html */
    var addMin = Math.floor(totalSec / 60);
    if (addMin > 0) {
      ss('ma_study_total_min', (gs('ma_study_total_min', 0) + addMin));
      ss('ma_study_today_min', (gs('ma_study_today_min', 0) + addMin));
      ss('ma_study_week_min',  (gs('ma_study_week_min',  0) + addMin));
      ss('ma_study_month_min', (gs('ma_study_month_min', 0) + addMin));
    }

    /* Resetar acumulador para não contar duplo */
    _totalSession = 0;
    if (_startTime !== null) _startTime = Date.now(); // reinicia o tick
  }

  /* ── Salvar dia no histórico ── */
  function saveToHistory(dayData) {
    if (!dayData || !dayData.date || !dayData.totalSec) return;
    var hist = gs('ma_time_history', []);
    // Evitar duplicatas
    var exists = false;
    for (var i = 0; i < hist.length; i++) {
      if (hist[i].date === dayData.date) {
        hist[i] = dayData;
        exists = true;
        break;
      }
    }
    if (!exists) hist.unshift(dayData);
    // Manter apenas 90 dias
    if (hist.length > 90) hist = hist.slice(0, 90);
    ss('ma_time_history', hist);
  }

  /* ── Marcar online/offline ── */
  function setOnline(on) {
    var u = getUser();
    if (!u || !u.email) return;
    var status = gs('ma_online_status', {});
    status.online = on;
    status.lastSeen = Date.now();
    status.page = _page;
    status.user = u.email;
    status.userName = u.name || u.email;
    ss('ma_online_status', status);
  }

  /* ── Visibilidade da aba ── */
  document.addEventListener('visibilitychange', function () {
    _isVisible = !document.hidden;
    if (_isVisible) {
      startCounting();
      setOnline(true);
    } else {
      pauseCounting();
      save();
      setOnline(false);
    }
  });

  /* ── Foco / blur da janela (troca de programa) ── */
  window.addEventListener('focus', function () {
    _isVisible = !document.hidden;
    if (_isVisible) { startCounting(); setOnline(true); }
  });
  window.addEventListener('blur', function () {
    pauseCounting();
    save();
    setOnline(false);
  });

  /* ── Salvar ao sair/recarregar ── */
  window.addEventListener('beforeunload', function () {
    pauseCounting();
    save();
    setOnline(false);
    // Salvar hoje no histórico ao final do dia (aproximação)
    var td = gs('ma_time_today', null);
    if (td) saveToHistory(td);
  });
  window.addEventListener('pagehide', function () {
    pauseCounting();
    save();
    setOnline(false);
  });

  /* ── Auto-save a cada 30 segundos ── */
  _saveInterval = setInterval(save, 30000);

  /* ── Início ── */
  if (_isVisible) {
    startCounting();
    setOnline(true);
  }

  /* ── Expor API global para o admin-cursos.html usar ── */
  window.MA_TimeTracker = {
    getStatus: function () {
      return {
        isVisible: _isVisible,
        sessionSec: _totalSession + (_startTime ? Math.floor((Date.now() - _startTime) / 1000) : 0),
        page: _page
      };
    },
    getToday: function () { return gs('ma_time_today', { date: today(), totalSec: 0, byPage: {} }); },
    getHistory: function () { return gs('ma_time_history', []); },
    getTotal: function () { return gs('ma_time_total', 0); },
    getOnlineStatus: function () { return gs('ma_online_status', {}); },
    formatTime: function (sec) {
      var h = Math.floor(sec / 3600);
      var m = Math.floor((sec % 3600) / 60);
      var s = sec % 60;
      if (h > 0) return h + 'h ' + m + 'm';
      if (m > 0) return m + 'm ' + s + 's';
      return s + 's';
    }
  };

})();
