/**
 * ============================================================
 * MATHEUS ACADEMY — USERSTORE.JS v3
 * CORREÇÃO: Sincronização correta entre Firebase e localStorage
 * ============================================================
 * 
 * PROBLEMA CORRIGIDO:
 *   - Valor de XP diferente entre dispositivos
 *   - localStorage com dados antigos não sendo atualizados
 *   - Cache local sobrescrevendo dados do Firebase
 *
 * MUDANÇAS NA v3:
 *   - getTotalPointsSync() agora SEMPRE usa dados mais recentes
 *   - Atualização automática do localStorage quando Firebase sincroniza
 *   - Força limpeza de dados legados inconsistentes
 *   - Melhor logging para debug
 *
 * COMO USAR:
 *   <script src="firebase-config.js"></script>
 *   <script src="data/courses.js"></script>
 *   <script src="data/userStore.js"></script>
 *
 * ============================================================
 */

var MAStore = (function() {

  /* ══════════════════════════════════════════════════════════
     CACHE LOCAL — apenas para performance, NÃO é fonte de verdade
     ══════════════════════════════════════════════════════════ */
  var _cache = {
    user: null,
    userData: null,
    lastSync: 0
  };

  var CACHE_TTL = 30000; // 30 segundos

  /* ══════════════════════════════════════════════════════════
     HELPERS INTERNOS
     ══════════════════════════════════════════════════════════ */
  
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

  // Espera o Firebase estar pronto
  function _waitFirebase() {
    return new Promise(function(resolve) {
      if (window.__maFirebaseReady && window.maAuth && window.maDb) {
        resolve(true);
        return;
      }
      var timeout = setTimeout(function() {
        console.warn('[MAStore] Firebase timeout - usando fallback');
        resolve(false);
      }, 5000);
      
      document.addEventListener('maFirebaseReady', function() {
        clearTimeout(timeout);
        resolve(true);
      }, { once: true });
    });
  }

  // Verifica se o cache ainda é válido
  function _isCacheValid() {
    return _cache.userData && (Date.now() - _cache.lastSync) < CACHE_TTL;
  }

  /**
   * NOVO v3: Atualiza o localStorage com dados do Firebase
   * Garante que o localStorage sempre tenha os dados mais recentes
   */
  function _syncLocalStorageWithFirebase(userData, authUser) {
    if (!userData || !authUser) return;
    
    var localData = {
      uid: authUser.uid,
      name: userData.nome || authUser.displayName || '',
      nome: userData.nome || authUser.displayName || '',
      email: userData.email || authUser.email || '',
      foto: userData.foto || authUser.photoURL || '',
      plano: userData.plano || 'gratuito',
      cursos: userData.cursos_comprados || [],
      cursos_comprados: userData.cursos_comprados || [],
      xp_total: userData.xp_total || 0,  // ← CRÍTICO: Sempre sincronizar XP
      streak_atual: userData.streak_atual || 0,
      streak_record: userData.streak_record || 0,
      nivel: userData.nivel || 1,
      _lastFirebaseSync: Date.now()
    };
    
    _set('ma_user', localData);
    
    // NOVO v3: Remove chave legada de pontos para evitar conflitos
    _remove('ma_points');
    
    console.log('[MAStore v3] localStorage sincronizado com Firebase | XP:', localData.xp_total);
  }

  /* ══════════════════════════════════════════════════════════
     USUÁRIO — Dados do Firebase Auth + Firestore
     ══════════════════════════════════════════════════════════ */

  /**
   * Retorna o usuário atual com dados completos do Firestore
   * @returns {Promise<Object|null>} Dados do usuário ou null
   */
  async function getUser() {
    var ready = await _waitFirebase();
    
    if (!ready || !window.maAuth) {
      // Fallback: tenta do localStorage
      return _get('ma_user', null);
    }

    var authUser = window.maAuth.currentUser;
    if (!authUser) {
      _cache.user = null;
      _cache.userData = null;
      return null;
    }

    // Se cache válido, retorna do cache
    if (_isCacheValid() && _cache.user && _cache.user.uid === authUser.uid) {
      return _cache.userData;
    }

    // Busca dados frescos do Firestore
    try {
      var userData = await MA_DB.getUsuario(authUser.uid);
      if (userData) {
        _cache.user = authUser;
        _cache.userData = userData;
        _cache.lastSync = Date.now();
        
        // NOVO v3: Sincroniza localStorage com dados do Firebase
        _syncLocalStorageWithFirebase(userData, authUser);
        
        return userData;
      }
    } catch(e) {
      console.error('[MAStore] Erro ao buscar usuário:', e);
    }

    // Fallback para localStorage
    return _get('ma_user', null);
  }

  /**
   * Verifica se há usuário logado
   * @returns {Promise<boolean>}
   */
  async function isLoggedIn() {
    var user = await getUser();
    return user !== null;
  }

  /**
   * Atualiza dados do usuário no cache local
   * (usado após login para sincronizar)
   */
  function setCurrentUser(u) {
    _cache.userData = u;
    _cache.lastSync = Date.now();
    
    // NOVO v3: Garante que xp_total está presente
    if (u && typeof u.xp_total !== 'undefined') {
      var local = _get('ma_user', {});
      local.xp_total = u.xp_total;
      _set('ma_user', Object.assign(local, u));
    }
    
    return true;
  }

  /**
   * Logout — limpa Firebase + cache local
   */
  async function logout() {
    _cache.user = null;
    _cache.userData = null;
    _cache.lastSync = 0;
    
    if (window.MA_AUTH) {
      try {
        await MA_AUTH.logout();
      } catch(e) {
        console.error('[MAStore] Erro no logout:', e);
      }
    }
    
    // Limpa cache local
    _remove('ma_user');
    _remove('ma_points'); // Legado - limpar para evitar conflitos
  }

  /* ══════════════════════════════════════════════════════════
     PONTOS / XP — 100% Firebase
     ══════════════════════════════════════════════════════════ */

  /**
   * Retorna o total de pontos do usuário
   * @returns {Promise<number>}
   */
  async function getTotalPoints() {
    var user = await getUser();
    if (!user) return 0;
    return user.xp_total || 0;
  }

  /**
   * Adiciona pontos ao usuário
   * @param {string} source - Motivo dos pontos (ex: "Aula concluída")
   * @param {number} pts - Quantidade de pontos
   * @returns {Promise<number>} - Total de pontos após adição
   */
  async function addPoints(source, pts) {
    var ready = await _waitFirebase();
    
    if (!ready || !window.maAuth || !window.maAuth.currentUser) {
      console.warn('[MAStore] addPoints: usuário não autenticado');
      return 0;
    }

    var uid = window.maAuth.currentUser.uid;

    try {
      // Adiciona no Firebase
      await MA_DB.addXP(uid, pts, source);
      
      // Invalida cache para forçar refresh
      _cache.lastSync = 0;
      
      // Busca o total atualizado
      var userData = await MA_DB.getUsuario(uid);
      var newTotal = userData ? userData.xp_total : 0;
      
      // Atualiza cache
      if (_cache.userData) {
        _cache.userData.xp_total = newTotal;
      }
      
      // NOVO v3: Atualiza localStorage imediatamente
      var local = _get('ma_user', {});
      local.xp_total = newTotal;
      _set('ma_user', local);
      
      // Dispara evento para atualizar UI
      _dispatchPointsUpdate(newTotal, pts, source);
      
      console.log('[MAStore] +' + pts + ' XP (' + source + ') = ' + newTotal + ' total');
      return newTotal;
      
    } catch(e) {
      console.error('[MAStore] Erro ao adicionar pontos:', e);
      return 0;
    }
  }

  /**
   * Retorna objeto de pontos (compatibilidade com código legado)
   * @returns {Promise<Object>}
   */
  async function getPoints() {
    var total = await getTotalPoints();
    return { total: total, history: [] };
  }

  // Dispara evento customizado quando pontos mudam
  function _dispatchPointsUpdate(total, added, source) {
    var event = new CustomEvent('ma:pointsUpdate', {
      detail: { total: total, added: added, source: source }
    });
    document.dispatchEvent(event);
    
    // Também chama função global se existir (compatibilidade)
    if (window.MA_onPointsUpdate) {
      window.MA_onPointsUpdate(total, added, source);
    }
  }

  /* ══════════════════════════════════════════════════════════
     ACESSO A CURSOS — 100% Firebase
     ══════════════════════════════════════════════════════════ */

  /**
   * Verifica se o usuário tem acesso a um curso
   * @param {string} ak - Access key do curso (ex: 'gp_auth', 'tp_auth')
   * @returns {Promise<boolean>}
   */
  async function hasCourseAccess(ak) {
    // Cursos gratuitos
    if (!ak || ak === 'free' || ak === 'gratuito') return true;

    var ready = await _waitFirebase();
    
    if (!ready || !window.maAuth || !window.maAuth.currentUser) {
      // Fallback: verifica localStorage
      var local = _get('ma_user', {});
      if (local.plano === 'anual' || local.plano === 'mensal') return true;
      var cursos = local.cursos || local.cursos_comprados || [];
      var courseKey = ak.replace('_auth', '');
      return cursos.includes(courseKey) || cursos.includes(ak);
    }

    try {
      var uid = window.maAuth.currentUser.uid;
      var courseKey = ak.replace('_auth', '');
      return await MA_DB.temAcesso(uid, courseKey);
    } catch(e) {
      console.error('[MAStore] Erro ao verificar acesso:', e);
      return false;
    }
  }

  /**
   * Desbloqueia todos os cursos (plano anual)
   */
  async function unlockAllCourses() {
    var ready = await _waitFirebase();
    if (!ready || !window.maAuth || !window.maAuth.currentUser) return false;

    try {
      var uid = window.maAuth.currentUser.uid;
      await MA_DB.updateUsuario(uid, { plano: 'anual' });
      _cache.lastSync = 0;
      await getUser(); // Força sync
      return true;
    } catch(e) {
      console.error('[MAStore] Erro ao desbloquear cursos:', e);
      return false;
    }
  }

  /**
   * Desbloqueia um curso específico
   */
  async function unlockCourse(courseKey) {
    var ready = await _waitFirebase();
    if (!ready || !window.maAuth || !window.maAuth.currentUser) return false;

    try {
      var uid = window.maAuth.currentUser.uid;
      await MA_DB.liberarCurso(uid, courseKey.replace('_auth', ''));
      _cache.lastSync = 0;
      await getUser();
      return true;
    } catch(e) {
      console.error('[MAStore] Erro ao desbloquear curso:', e);
      return false;
    }
  }

  /* ══════════════════════════════════════════════════════════
     PROGRESSO — Firebase
     ══════════════════════════════════════════════════════════ */

  /**
   * Salva progresso de um curso
   */
  async function saveProgress(courseKey, data) {
    var ready = await _waitFirebase();
    if (!ready || !window.maAuth || !window.maAuth.currentUser) {
      // Fallback: salva no localStorage
      var prog = _get('ma_course_progress', {});
      prog[courseKey] = data;
      _set('ma_course_progress', prog);
      return true;
    }

    try {
      var uid = window.maAuth.currentUser.uid;
      await MA_DB.salvarProgresso(uid, courseKey, data);
      return true;
    } catch(e) {
      console.error('[MAStore] Erro ao salvar progresso:', e);
      return false;
    }
  }

  /**
   * Retorna progresso de um curso
   */
  async function getProgress(courseKey) {
    var user = await getUser();
    if (!user) {
      // Fallback localStorage
      var prog = _get('ma_course_progress', {});
      return prog[courseKey] || null;
    }
    
    var progresso = user.progresso || {};
    return progresso[courseKey] || null;
  }

  /**
   * Retorna progresso de todos os cursos
   */
  async function getAllProgress() {
    var user = await getUser();
    if (!user) return _get('ma_course_progress', {});
    return user.progresso || {};
  }

  /**
   * Marca um tópico como concluído
   */
  async function markTopicDone(courseKey, topicId) {
    var prog = await getProgress(courseKey) || { topics: [], quizzes: [], percentual: 0 };
    if (!prog.topics) prog.topics = [];
    if (!prog.topics.includes(topicId)) {
      prog.topics.push(topicId);
    }
    await saveProgress(courseKey, prog);
    return prog;
  }

  /* ══════════════════════════════════════════════════════════
     STREAK / SESSÕES — Firebase
     ══════════════════════════════════════════════════════════ */

  async function getStreak() {
    var user = await getUser();
    if (!user) {
      var local = _get('ma_streak2', { current: 0, record: 0 });
      return local;
    }
    return {
      current: user.streak_atual || 0,
      record: user.streak_record || 0
    };
  }

  async function getSessions() {
    var user = await getUser();
    if (!user) return { totalMins: 0, days: 0 };
    return {
      totalMins: user.total_minutos_estudo || 0,
      days: user.dias_ativos || 0
    };
  }

  /* ══════════════════════════════════════════════════════════
     MISSÕES — localStorage (migrar para Firebase futuramente)
     ══════════════════════════════════════════════════════════ */

  function getMissions() { return _get('ma_missions', null); }
  function setMissions(m) { return _set('ma_missions', m); }
  
  async function completeMission(missionId) {
    var missions = getMissions() || { completed: [], lastReset: 0 };
    if (!missions.completed) missions.completed = [];
    if (!missions.completed.includes(missionId)) {
      missions.completed.push(missionId);
      setMissions(missions);
    }
    return missions;
  }

  /* ══════════════════════════════════════════════════════════
     RECENTES — localStorage
     ══════════════════════════════════════════════════════════ */

  function getRecent() {
    return _get('ma_recent', []);
  }

  function addRecent(courseId, courseName) {
    var rec = getRecent();
    rec = rec.filter(function(r) { return r.id !== courseId; });
    rec.unshift({ id: courseId, name: courseName, ts: Date.now() });
    if (rec.length > 10) rec = rec.slice(0, 10);
    _set('ma_recent', rec);
  }

  /* ══════════════════════════════════════════════════════════
     TEMPO DE ESTUDO — Firebase
     ══════════════════════════════════════════════════════════ */

  async function getTotalMins() {
    var user = await getUser();
    if (!user) return 0;
    return user.total_minutos_estudo || 0;
  }

  async function addStudyMins(mins) {
    var ready = await _waitFirebase();
    if (!ready || !window.maAuth || !window.maAuth.currentUser) return;

    var uid = window.maAuth.currentUser.uid;

    try {
      await MA_DB.updateUsuario(uid, {
        total_minutos_estudo: firebase.firestore.FieldValue.increment(mins)
      });
      _cache.lastSync = 0;
    } catch(e) {
      console.error('[MAStore] Erro ao adicionar minutos:', e);
    }
  }

  /* ══════════════════════════════════════════════════════════
     LOJA / BADGES — localStorage por enquanto
     ══════════════════════════════════════════════════════════ */

  function getShopOwned() { return _get('mae_shop_owned', []); }
  function setShopOwned(o) { return _set('mae_shop_owned', o); }
  function getShopStock() { return _get('mae_shop_stock', {}); }
  function setShopStock(s) { return _set('mae_shop_stock', s); }

  function getTrailBadges() { return _get('mae_trail_badges', []); }
  function addTrailBadge(b) {
    var badges = getTrailBadges();
    if (!badges.includes(b)) {
      badges.push(b);
      _set('mae_trail_badges', badges);
      return true;
    }
    return false;
  }

  /* ══════════════════════════════════════════════════════════
     UTILITÁRIOS
     ══════════════════════════════════════════════════════════ */

  /**
   * Força sincronização do cache com Firebase
   */
  async function syncFromFirebase() {
    _cache.lastSync = 0;
    
    // NOVO v3: Remove dados legados antes de sincronizar
    _remove('ma_points');
    
    await getUser();
    console.log('[MAStore v3] Cache sincronizado com Firebase');
  }

  /**
   * Invalida o cache (força busca fresca na próxima leitura)
   */
  function invalidateCache() {
    _cache.lastSync = 0;
  }

  /**
   * Reset completo (NÃO apaga dados do Firebase)
   */
  function resetLocalCache() {
    var keys = [
      'ma_missions', 'ma_recent', 'mae_shop_owned',
      'mae_shop_stock', 'mae_trail_badges', 'ma_points'
    ];
    keys.forEach(function(k) { _remove(k); });
    _cache.user = null;
    _cache.userData = null;
    _cache.lastSync = 0;
  }

  /* ══════════════════════════════════════════════════════════
     COMPATIBILIDADE COM CÓDIGO LEGADO — CORRIGIDO v3
     ══════════════════════════════════════════════════════════ */

  /**
   * CORRIGIDO v3: Retorna dados do usuário do cache
   * Prioriza _cache.userData que é sempre atualizado pelo Firebase
   */
  function getUserSync() {
    // Prioridade 1: Cache em memória (sempre mais recente)
    if (_cache.userData) {
      return _cache.userData;
    }
    // Prioridade 2: localStorage (pode estar desatualizado, mas é fallback)
    return _get('ma_user', null);
  }

  /**
   * CORRIGIDO v3: Retorna pontos do cache
   * Garante que sempre use o valor mais recente disponível
   */
  function getTotalPointsSync() {
    // Prioridade 1: Cache em memória (sempre mais recente quando Firebase sincroniza)
    if (_cache.userData && typeof _cache.userData.xp_total === 'number') {
      return _cache.userData.xp_total;
    }
    
    // Prioridade 2: localStorage (pode estar desatualizado)
    var local = _get('ma_user', null);
    if (local && typeof local.xp_total === 'number') {
      return local.xp_total;
    }
    
    // REMOVIDO: Não usa mais ma_points legado
    // Isso evita o bug de mostrar valor antigo
    
    return 0;
  }

  // Legado - mantido para não quebrar código antigo
  function getUsers() { return _get('ma_users', {}); }
  function setUsers(users) { return _set('ma_users', users); }
  function getAccess() { return _get('ma_access', {}); }
  function setAccess(a) { return _set('ma_access', a); }
  function setPoints(p) { /* Ignorado - Firebase é fonte de verdade */ }
  function setSessions(s) { /* Ignorado - Firebase é fonte de verdade */ }

  /* ══════════════════════════════════════════════════════════
     API PÚBLICA
     ══════════════════════════════════════════════════════════ */

  return {
    // Usuário (async)
    getUser: getUser,
    isLoggedIn: isLoggedIn,
    setCurrentUser: setCurrentUser,
    logout: logout,
    
    // Usuário (sync - compatibilidade)
    getUserSync: getUserSync,
    
    // Pontos/XP (async)
    getTotalPoints: getTotalPoints,
    addPoints: addPoints,
    getPoints: getPoints,
    
    // Pontos (sync - compatibilidade)
    getTotalPointsSync: getTotalPointsSync,
    
    // Acesso a cursos (async)
    hasCourseAccess: hasCourseAccess,
    unlockAllCourses: unlockAllCourses,
    unlockCourse: unlockCourse,
    
    // Progresso (async)
    saveProgress: saveProgress,
    getProgress: getProgress,
    getAllProgress: getAllProgress,
    markTopicDone: markTopicDone,
    
    // Streak/Sessões (async)
    getStreak: getStreak,
    getSessions: getSessions,
    
    // Missões (sync/async)
    getMissions: getMissions,
    setMissions: setMissions,
    completeMission: completeMission,
    
    // Recentes (sync)
    getRecent: getRecent,
    addRecent: addRecent,
    
    // Tempo de estudo (async)
    getTotalMins: getTotalMins,
    addStudyMins: addStudyMins,
    
    // Loja/Badges (sync)
    getShopOwned: getShopOwned,
    setShopOwned: setShopOwned,
    getShopStock: getShopStock,
    setShopStock: setShopStock,
    getTrailBadges: getTrailBadges,
    addTrailBadge: addTrailBadge,
    
    // Utilitários
    syncFromFirebase: syncFromFirebase,
    invalidateCache: invalidateCache,
    resetLocalCache: resetLocalCache,
    
    // Legado (compatibilidade)
    getUsers: getUsers,
    setUsers: setUsers,
    getAccess: getAccess,
    setAccess: setAccess,
    setPoints: setPoints,
    setSessions: setSessions,
    
    // Acesso direto ao localStorage (compatibilidade)
    _get: _get,
    _set: _set,
    _remove: _remove
  };

})();

/* ══════════════════════════════════════════════════════════
   FUNÇÕES GLOBAIS — Compatibilidade com código existente
   ══════════════════════════════════════════════════════════ */

// Função global que o course-engine.js usa
window.MA_addPoints = async function(source, pts) {
  return await MAStore.addPoints(source, pts);
};

// Função global para obter pontos
window.MA_getPoints = function() {
  var total = MAStore.getTotalPointsSync();
  return { total: total, history: [] };
};

// Atualiza UI quando pontos mudam
document.addEventListener('ma:pointsUpdate', function(e) {
  var detail = e.detail;
  
  // Atualiza todos os elementos de pontos na página
  var ptsElements = document.querySelectorAll('#maPtsNum, .ma-tb-pts-num, .pts-display');
  ptsElements.forEach(function(el) {
    el.textContent = detail.total.toLocaleString('pt-BR');
  });
  
  // Animação de bump
  var ptsBlocks = document.querySelectorAll('#maPtsLive, .ma-tb-pts-block');
  ptsBlocks.forEach(function(block) {
    block.classList.remove('bump');
    void block.offsetWidth;
    block.classList.add('bump');
    setTimeout(function() { block.classList.remove('bump'); }, 500);
  });
});

/* ══════════════════════════════════════════════════════════
   AUTO-SYNC v3 — Mantém UI sincronizada com Firebase
   ══════════════════════════════════════════════════════════ */

(function() {
  
  // NOVO v3: Limpa dados legados ao carregar
  function _cleanupLegacyData() {
    try {
      // Remove ma_points que causava conflito
      localStorage.removeItem('ma_points');
      console.log('[MAStore v3] Dados legados limpos');
    } catch(e) {}
  }
  
  // Executa limpeza imediatamente
  _cleanupLegacyData();
  
  // Quando Firebase estiver pronto, sincroniza
  document.addEventListener('maFirebaseReady', async function() {
    console.log('[MAStore v3] Firebase pronto, sincronizando...');
    
    // Força sincronização limpa
    await MAStore.syncFromFirebase();
    
    // Carrega dados do usuário
    var user = await MAStore.getUser();
    
    if (user) {
      // Atualiza UI com pontos do Firebase
      var total = user.xp_total || 0;
      var ptsEl = document.getElementById('maPtsNum');
      if (ptsEl) {
        ptsEl.textContent = total.toLocaleString('pt-BR');
        ptsEl._prev = total; // Atualiza referência para animação
      }
      
      console.log('[MAStore v3] ✅ Usuário:', user.nome, '| XP:', total);
    }
  });

  // Observer para mudanças de auth
  document.addEventListener('maFirebaseReady', function() {
    if (window.MA_AUTH) {
      MA_AUTH.onAuthChange(async function(authUser) {
        if (authUser) {
          // Força sync completo após login
          await MAStore.syncFromFirebase();
          
          // Atualiza UI
          var user = await MAStore.getUser();
          if (user) {
            var total = user.xp_total || 0;
            var ptsEl = document.getElementById('maPtsNum');
            if (ptsEl) {
              ptsEl.textContent = total.toLocaleString('pt-BR');
            }
          }
        } else {
          MAStore.invalidateCache();
        }
      });
    }
  });
  
})();

console.log('[MAStore v3] ✅ Carregado - Correção de sincronização Firebase/localStorage');
