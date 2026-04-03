/**
 * ============================================================
 * MATHEUS ACADEMY — USERSTORE.JS v2.1
 * Wrapper centralizado para todo acesso ao localStorage.
 *
 * VERSÃO 2.1 — Com sincronização Firestore para pontos/XP
 * CORRIGIDO: usa coleção 'usuarios' e campo 'xp_total'
 *
 * REGRA DE OURO:
 *   Nenhuma página deve acessar localStorage diretamente.
 *   Sempre use as funções deste módulo.
 *
 * COMO USAR EM QUALQUER PÁGINA:
 *   <script src="data/courses.js"></script>
 *   <script src="data/userStore.js"></script>
 *   <script src="firebase-config.js"></script>
 *   Depois: var user = MAStore.getUser();
 * ============================================================
 */

var MAStore = (function() {

  /* ── Flag para evitar sincronização duplicada ── */
  var _syncInProgress = false;
  var _lastSyncTime = 0;
  var SYNC_COOLDOWN = 3000; // 3 segundos entre syncs

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
  function setCurrentUser(u){ 
    var result = _set('ma_user', u);
    // Ao definir usuário, sincroniza pontos do Firestore
    if (result && u && u.uid) {
      syncPointsFromFirestore();
    }
    return result;
  }
  function logout() {
    if (window.MA_AUTH) { MA_AUTH.logout().catch(function(){}); }
    else { _remove('ma_user'); }
  }

  /* ── ACESSO A CURSOS ── */
  function getAccess()      { return _get('ma_access', {}); }
  function setAccess(a)     { return _set('ma_access', a); }

  function hasCourseAccess(ak) {
    if (!ak || ak === 'free') return true;
    var u = getUser();
    if (u) {
      if (u.plano === 'master' || u.plano === 'anual' || u.plano === 'mensal') return true;
      if (u.cursos && Array.isArray(u.cursos)) {
        var course = MA_COURSES ? MA_COURSES.find(function(c){ return c.ak === ak; }) : null;
        var courseKey = course ? (course.courseKey || course.id) : ak.replace('_auth','');
        if (u.cursos.indexOf(courseKey) >= 0 || u.cursos.indexOf(ak) >= 0) return true;
      }
    }
    var ac = getAccess();
    if (!ac.courses || !ac.courses[ak]) return false;
    var entry = ac.courses[ak];
    if (!entry.expiry) return true;
    return Date.now() < entry.expiry;
  }

  function unlockAllCourses(email, code, type, expiry) {
    var u = getUser();
    if (u && u.uid && window.MA_DB) {
      MA_DB.liberarCurso(u.uid, 'all', type === 'monthly' ? 'mensal' : 'master').catch(function(){});
      u.plano = type === 'monthly' ? 'mensal' : 'master';
      setCurrentUser(u);
    }
    var ac = getAccess();
    if (!ac.courses) ac.courses = {};
    var courses = typeof MA_COURSES !== 'undefined' ? MA_COURSES : (typeof MA_getActiveCourses === 'function' ? MA_getActiveCourses() : []);
    courses.forEach(function(c) {
      if (c.free || c.ak === 'free') return;
      ac.courses[c.ak] = { email: email, code: code, ts: Date.now(), name: '', type: type, expiry: expiry };
    });
    setAccess(ac);
  }

  function unlockCourse(ak, email, code, type, expiry) {
    var u = getUser();
    if (u && u.uid && window.MA_DB) {
      var course = typeof MA_COURSES !== 'undefined' ? MA_COURSES.find(function(c){ return c.ak === ak; }) : null;
      var courseKey = course ? (course.courseKey || course.id) : ak.replace('_auth','');
      MA_DB.liberarCurso(u.uid, courseKey, 'individual').catch(function(){});
      if (!u.cursos) u.cursos = [];
      if (u.cursos.indexOf(courseKey) < 0) u.cursos.push(courseKey);
      setCurrentUser(u);
    }
    var ac = getAccess();
    if (!ac.courses) ac.courses = {};
    ac.courses[ak] = { email: email, code: code, ts: Date.now(), name: '', type: type, expiry: expiry };
    setAccess(ac);
  }

  /* ══════════════════════════════════════════════════════════════
     PONTOS / XP — VERSÃO 2.1 COM SINCRONIZAÇÃO FIRESTORE
     Usa coleção 'usuarios' e campo 'xp_total'
     ══════════════════════════════════════════════════════════════ */
  
  function getPoints()      { return _get('ma_points', { total: 0, history: [] }); }
  function setPoints(p)     { return _set('ma_points', p); }

  /**
   * SINCRONIZA pontos do Firestore para o localStorage
   * Usa a coleção 'usuarios' e o campo 'xp_total'
   */
  function syncPointsFromFirestore() {
    var now = Date.now();
    if (_syncInProgress || (now - _lastSyncTime) < SYNC_COOLDOWN) {
      return Promise.resolve(getPoints().total);
    }
    
    var u = getUser();
    if (!u || !u.uid) {
      console.log('[MAStore] Sync ignorado: usuário não logado');
      return Promise.resolve(getPoints().total);
    }
    
    // Aguarda Firebase estar pronto
    if (!window.maDb && !window.__maFirebaseReady) {
      console.log('[MAStore] Aguardando Firebase...');
      return new Promise(function(resolve) {
        document.addEventListener('maFirebaseReady', function() {
          syncPointsFromFirestore().then(resolve);
        }, { once: true });
        // Timeout de segurança
        setTimeout(function() { resolve(getPoints().total); }, 5000);
      });
    }
    
    if (!window.maDb) {
      console.log('[MAStore] Firestore não disponível');
      return Promise.resolve(getPoints().total);
    }
    
    _syncInProgress = true;
    console.log('[MAStore] Sincronizando pontos do Firestore...');
    
    return window.maDb.collection('usuarios').doc(u.uid).get()
      .then(function(doc) {
        _syncInProgress = false;
        _lastSyncTime = Date.now();
        
        if (doc.exists) {
          var data = doc.data();
          var firestoreXP = data.xp_total || 0;
          
          var localData = getPoints();
          var localPoints = localData.total || 0;
          
          console.log('[MAStore] Firestore xp_total=' + firestoreXP + ', local=' + localPoints);
          
          // Firestore é a fonte de verdade
          if (firestoreXP !== localPoints) {
            console.log('[MAStore] ✅ Atualizando local: ' + localPoints + ' → ' + firestoreXP);
            setPoints({
              total: firestoreXP,
              history: localData.history || []
            });
            
            // Dispara evento para atualizar UI
            try {
              window.dispatchEvent(new CustomEvent('ma-points-synced', { 
                detail: { points: firestoreXP, old: localPoints } 
              }));
            } catch(e) {}
            
            // Tenta atualizar elementos de UI diretamente
            _updatePointsUI(firestoreXP);
          }
          return firestoreXP;
        } else {
          console.log('[MAStore] Documento do usuário não existe no Firestore');
          return getPoints().total;
        }
      })
      .catch(function(err) {
        _syncInProgress = false;
        console.warn('[MAStore] Erro ao sincronizar:', err.message || err);
        return getPoints().total;
      });
  }

  /**
   * Atualiza elementos de UI que mostram pontos
   */
  function _updatePointsUI(points) {
    // Seletores comuns de elementos de pontos
    var selectors = [
      '#user-points', '#topbar-points', '#points-display',
      '.user-points', '.points-display', '.xp-display',
      '[data-points]', '.topbar-xp', '#xp-value'
    ];
    
    selectors.forEach(function(sel) {
      try {
        var els = document.querySelectorAll(sel);
        els.forEach(function(el) {
          var currentText = el.textContent || '';
          // Preserva sufixo se existir (ex: "XP", "pts")
          var suffix = currentText.replace(/[\d.,\s]+/g, '').trim();
          var formatted = points.toLocaleString('pt-BR');
          el.textContent = suffix ? formatted + ' ' + suffix : formatted;
        });
      } catch(e) {}
    });
  }

  /**
   * ADICIONA pontos — salva no Firestore E no localStorage
   */
  function addPoints(source, pts) {
    var u = getUser();
    var p = getPoints();
    var newTotal = (p.total || 0) + pts;
    
    // Atualiza localStorage imediatamente
    p.total = newTotal;
    if (!p.history) p.history = [];
    var historyEntry = { 
      source: source, 
      pts: pts, 
      date: new Date().toLocaleDateString('pt-BR'),
      ts: Date.now()
    };
    p.history.unshift(historyEntry);
    if (p.history.length > 200) p.history = p.history.slice(0, 200);
    setPoints(p);
    
    // Salva no Firestore usando MA_DB.addXP (já existe no firebase-config.js)
    if (u && u.uid && window.MA_DB && typeof MA_DB.addXP === 'function') {
      MA_DB.addXP(u.uid, pts, source).catch(function(err) {
        console.warn('[MAStore] Erro ao salvar XP no Firestore:', err);
      });
    }
    
    // Dispara evento
    try {
      window.dispatchEvent(new CustomEvent('ma-points-added', { 
        detail: { source: source, pts: pts, total: newTotal } 
      }));
    } catch(e) {}
    
    // Atualiza UI
    _updatePointsUI(newTotal);
    
    // Callback legado
    if (window.MA_addPoints && typeof window.MA_addPoints === 'function') {
      try { window.MA_addPoints(source, pts); } catch(e) {}
    }
    
    return newTotal;
  }

  /**
   * RETORNA total de pontos (com trigger de sync em background)
   */
  function getTotalPoints() { 
    // Sincroniza em background (não bloqueia)
    syncPointsFromFirestore();
    return getPoints().total || 0; 
  }

  /**
   * FORÇA sincronização imediata
   */
  function forcePointsSync() {
    _lastSyncTime = 0;
    _syncInProgress = false;
    return syncPointsFromFirestore();
  }

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

  /* ── RESET COMPLETO ── */
  function resetAll() {
    var keys = ['ma_access','ma_points','ma_sessions','ma_missions',
                'ma_recent','mae_study_log','mae_total_mins','mae_wk_mods',
                'mae_shop_owned','mae_shop_stock','mae_trail_badges'];
    keys.forEach(function(k) { _remove(k); });
  }

  /* ══════════════════════════════════════════════════════════════
     INICIALIZAÇÃO AUTOMÁTICA
     ══════════════════════════════════════════════════════════════ */
  
  // Sincroniza quando Firebase estiver pronto
  document.addEventListener('maFirebaseReady', function() {
    console.log('[MAStore] Firebase pronto, verificando sync...');
    if (isLoggedIn()) {
      setTimeout(function() {
        forcePointsSync();
      }, 500);
    }
  });

  // Também tenta sincronizar após 2 segundos (fallback)
  setTimeout(function() {
    if (isLoggedIn() && window.maDb) {
      forcePointsSync();
    }
  }, 2000);

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
    syncPointsFromFirestore: syncPointsFromFirestore,
    forcePointsSync: forcePointsSync,
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
    // Acesso direto
    _get: _get,
    _set: _set,
    _remove: _remove
  };

})();
