/**
 * ============================================================
 * MATHEUS ACADEMY — USERSTORE.JS
 * Wrapper centralizado para todo acesso ao localStorage.
 *
 * REGRA DE OURO:
 *   Nenhuma página deve acessar localStorage diretamente.
 *   Sempre use as funções deste módulo.
 *
 * COMO USAR EM QUALQUER PÁGINA:
 *   <script src="data/courses.js"></script>
 *   <script src="data/userStore.js"></script>
 *   Depois: var user = MAStore.getUser();
 *
 * CHAVES DO LOCALSTORAGE (nunca altere):
 *   ma_user       → dados do usuário logado (objeto)
 *   ma_users      → banco de usuários registrados (objeto indexado por email)
 *   ma_access     → cursos liberados e datas de expiração (objeto)
 *   ma_points     → pontos XP: { total, history[] }
 *   ma_sessions   → dados de sessão: streak, lastStudyDate, count
 *   ma_missions   → missões diárias: { date, done: {} }
 *   ma_recent     → cursos acessados recentemente (array)
 *   mae_study_log → log diário de minutos estudados (objeto)
 *   mae_total_mins→ total de minutos estudados (number)
 *   mae_wk_mods   → módulos concluídos na semana (number)
 *   mae_shop_owned→ itens da loja comprados (array)
 *   mae_shop_stock→ estoque da loja (objeto)
 *   mae_trail_badges → badges de trilhas conquistados (array)
 *   indicadoPor   → código de referência de quem indicou
 *   ma_ref_code   → código de referência do próprio usuário
 * ============================================================
 */

var MAStore = (function() {

  /* ── Funções internas de leitura/escrita segura ── */
  function _get(key, def) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }
    catch(e) { return def; }
  }
  function _set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; }
    catch(e) { return false; }
  }
  function _remove(key) {
    try { localStorage.removeItem(key); return true; }
    catch(e) { return false; }
  }

  /* ── USUÁRIO ── */
  function getUser()        { return _get('ma_user', null); }
  function isLoggedIn()     { return getUser() !== null; }
  function getUsers()       { return _get('ma_users', {}); }
  function setUsers(users)  { return _set('ma_users', users); }
  function setCurrentUser(u){ return _set('ma_user', u); }
  function logout()         { _remove('ma_user'); }

  /* ── ACESSO A CURSOS ── */
  function getAccess()      { return _get('ma_access', {}); }
  function setAccess(a)     { return _set('ma_access', a); }

  /** Verifica se o usuário tem acesso a um curso pelo ak (chave de acesso) */
  function hasCourseAccess(ak) {
    if (!ak || ak === 'free') return true;
    var ac = getAccess();
    if (!ac.courses || !ac.courses[ak]) return false;
    var entry = ac.courses[ak];
    if (!entry.expiry) return true;
    return Date.now() < entry.expiry;
  }

  /** Libera acesso a todos os cursos (MASTER) */
  function unlockAllCourses(email, code, type, expiry) {
    var ac = getAccess();
    if (!ac.courses) ac.courses = {};
    MA_getActiveCourses().forEach(function(c) {
      if (c.free) return;
      ac.courses[c.ak] = { email: email, code: code, ts: Date.now(), name: '', type: type, expiry: expiry };
    });
    setAccess(ac);
  }

  /** Libera acesso a um curso específico (INDIVIDUAL) */
  function unlockCourse(ak, email, code, type, expiry) {
    var ac = getAccess();
    if (!ac.courses) ac.courses = {};
    ac.courses[ak] = { email: email, code: code, ts: Date.now(), name: '', type: type, expiry: expiry };
    setAccess(ac);
  }

  /* ── PONTOS / XP ── */
  function getPoints()      { return _get('ma_points', { total: 0, history: [] }); }
  function setPoints(p)     { return _set('ma_points', p); }

  function addPoints(source, pts) {
    var p = getPoints();
    p.total = (p.total || 0) + pts;
    if (!p.history) p.history = [];
    p.history.unshift({ source: source, pts: pts, date: new Date().toLocaleDateString('pt-BR') });
    if (p.history.length > 200) p.history = p.history.slice(0, 200);
    setPoints(p);
    if (window.MA_addPoints) window.MA_addPoints(source, pts);
    return p.total;
  }

  function getTotalPoints()  { return getPoints().total || 0; }

  /* ── SESSÕES / STREAK ── */
  function getSessions()     { return _get('ma_sessions', { streak: 0, count: 0 }); }
  function setSessions(s)    { return _set('ma_sessions', s); }
  function getStreak()       { return getSessions().streak || 0; }

  /* ── MISSÕES DIÁRIAS ── */
  function getMissions() {
    var today = new Date().toLocaleDateString('pt-BR');
    var ms = _get('ma_missions', {});
    if (!ms.done || ms.date !== today) ms = { date: today, done: {} };
    return ms;
  }
  function setMissions(ms)   { return _set('ma_missions', ms); }

  function completeMission(missionKey, pointsReward) {
    var ms = getMissions();
    if (ms.done[missionKey]) return false;
    ms.done[missionKey] = true;
    setMissions(ms);
    if (pointsReward) addPoints('Missão: ' + missionKey, pointsReward);
    return true;
  }

  /* ── RECENTES ── */
  function getRecent()       { return _get('ma_recent', []); }

  function addRecent(courseId, courseName) {
    var rec = getRecent();
    rec = rec.filter(function(r) { return r.id !== courseId; });
    rec.unshift({ id: courseId, name: courseName, ts: Date.now() });
    if (rec.length > 10) rec = rec.slice(0, 10);
    _set('ma_recent', rec);
  }

  /* ── PROGRESSO DE MÓDULOS ── */
  /**
   * Retorna progresso de um curso pelo storagePrefix.
   * Conta chaves do tipo: {prefix}mod_xxx com valor 'done'|'true'|'1'
   */
  function getCourseProgress(storagePrefix) {
    var done = 0, total = 0;
    try {
      for (var k in localStorage) {
        if (k.indexOf(storagePrefix + 'mod_') === 0) {
          total++;
          var v = localStorage.getItem(k);
          if (v === 'done' || v === 'true' || v === '1') done++;
        }
      }
    } catch(e) {}
    return { done: done, total: total, pct: total > 0 ? Math.round(done / total * 100) : 0 };
  }

  /** Retorna progresso de todos os cursos ativos como array */
  function getAllProgress() {
    return MA_getActiveCourses().map(function(c) {
      var p = getCourseProgress(c.storagePrefix);
      return { id: c.id, name: c.name, icon: c.icon, color: c.color, storagePrefix: c.storagePrefix, done: p.done, total: p.total, pct: p.pct };
    });
  }

  /* ── ESTUDO (tempo) ── */
  function getTotalMins()    { return _get('mae_total_mins', 0); }
  function addStudyMins(m)   { _set('mae_total_mins', getTotalMins() + m); }

  function getStudyLog()     { return _get('mae_study_log', {}); }
  function addStudyLog(mins) {
    var log = getStudyLog();
    var today = new Date().toLocaleDateString('pt-BR');
    log[today] = (log[today] || 0) + mins;
    _set('mae_study_log', log);
  }

  /* ── LOJA ── */
  function getShopOwned()    { return _get('mae_shop_owned', []); }
  function setShopOwned(o)   { return _set('mae_shop_owned', o); }
  function getShopStock()    { return _get('mae_shop_stock', {}); }
  function setShopStock(s)   { return _set('mae_shop_stock', s); }

  /* ── BADGES DE TRILHAS ── */
  function getTrailBadges()  { return _get('mae_trail_badges', []); }
  function addTrailBadge(b) {
    var badges = getTrailBadges();
    if (!badges.includes(b)) { badges.push(b); _set('mae_trail_badges', badges); return true; }
    return false;
  }

  /* ── REFERÊNCIA ── */
  function getRefCode()      { return localStorage.getItem('ma_ref_code') || null; }
  function getIndicadoPor()  { return localStorage.getItem('indicadoPor') || null; }

  /* ── RESET COMPLETO (cuidado!) ── */
  function resetAll() {
    var keys = ['ma_user','ma_access','ma_points','ma_sessions','ma_missions',
                'ma_recent','mae_study_log','mae_total_mins','mae_wk_mods',
                'mae_shop_owned','mae_shop_stock','mae_trail_badges'];
    keys.forEach(function(k) { _remove(k); });
  }

  /* ── API PÚBLICA ── */
  return {
    // Usuário
    getUser: getUser,
    isLoggedIn: isLoggedIn,
    getUsers: getUsers,
    setUsers: setUsers,
    setCurrentUser: setCurrentUser,
    logout: logout,
    // Acesso
    getAccess: getAccess,
    setAccess: setAccess,
    hasCourseAccess: hasCourseAccess,
    unlockAllCourses: unlockAllCourses,
    unlockCourse: unlockCourse,
    // Pontos
    getPoints: getPoints,
    setPoints: setPoints,
    addPoints: addPoints,
    getTotalPoints: getTotalPoints,
    // Sessões
    getSessions: getSessions,
    setSessions: setSessions,
    getStreak: getStreak,
    // Missões
    getMissions: getMissions,
    setMissions: setMissions,
    completeMission: completeMission,
    // Recentes
    getRecent: getRecent,
    addRecent: addRecent,
    // Progresso
    getCourseProgress: getCourseProgress,
    getAllProgress: getAllProgress,
    // Estudo
    getTotalMins: getTotalMins,
    addStudyMins: addStudyMins,
    getStudyLog: getStudyLog,
    addStudyLog: addStudyLog,
    // Loja
    getShopOwned: getShopOwned,
    setShopOwned: setShopOwned,
    getShopStock: getShopStock,
    setShopStock: setShopStock,
    // Badges
    getTrailBadges: getTrailBadges,
    addTrailBadge: addTrailBadge,
    // Referência
    getRefCode: getRefCode,
    getIndicadoPor: getIndicadoPor,
    // Reset
    resetAll: resetAll,
    // Acesso direto (para compatibilidade com código legado)
    _get: _get,
    _set: _set,
    _remove: _remove
  };

})();
