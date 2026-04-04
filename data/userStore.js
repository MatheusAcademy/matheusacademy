/**
 * ============================================================
 * MATHEUS ACADEMY — USERSTORE.JS v3
 * CORREÇÃO: Sincronização XP entre Firebase e localStorage
 * ============================================================
 * 
 * PROBLEMA CORRIGIDO NA v3:
 *   - XP mostrava valor diferente entre dispositivos
 *   - localStorage antigo não era atualizado pelo Firebase
 *
 * MUDANÇA ÚNICA:
 *   - getUser() agora SEMPRE atualiza xp_total no localStorage
 *   - getTotalPointsSync() prioriza cache em memória
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
        
        // v3 FIX: Atualiza localStorage COM xp_total
        _set('ma_user', {
          uid: authUser.uid,
          name: userData.nome || authUser.displayName || '',
          email: userData.email || authUser.email || '',
          foto: userData.foto || authUser.photoURL || '',
          plano: userData.plano || 'gratuito',
          cursos: userData.cursos_comprados || [],
          xp_total: userData.xp_total || 0  // ← CORREÇÃO: sempre incluir xp_total
        });
        
        // v3 FIX: Remove ma_points legado
        _remove('ma_points');
        
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
    return _set('ma_user', u);
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
      
      // v3 FIX: Atualiza localStorage também
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
    if (!ak || ak === 'free') return true;

    var user = await getUser();
    if (!user) return false;

    // Planos que dão acesso total
    if (user.plano === 'master' || user.plano === 'anual' || user.plano === 'mensal') {
      return true;
    }

    // Verifica cursos individuais comprados
    var cursos = user.cursos_comprados || [];
    
    // Mapeia ak para courseKey
    var course = (typeof MA_COURSES !== 'undefined') 
      ? MA_COURSES.find(function(c) { return c.ak === ak; }) 
      : null;
    
    var courseKey = course ? (course.courseKey || course.id) : ak.replace('_auth', '');
    
    return cursos.indexOf(courseKey) >= 0 || cursos.indexOf(ak) >= 0;
  }

  /**
   * Libera acesso a todos os cursos (plano MASTER/MENSAL)
   */
  async function unlockAllCourses(email, code, type, expiry) {
    var ready = await _waitFirebase();
    if (!ready || !window.maAuth || !window.maAuth.currentUser) return;

    var uid = window.maAuth.currentUser.uid;
    var plano = type === 'monthly' ? 'mensal' : 'master';

    try {
      await MA_DB.updateUsuario(uid, { plano: plano });
      _cache.lastSync = 0; // Invalida cache
      
      // Atualiza cache local
      var user = _get('ma_user', {});
      user.plano = plano;
      _set('ma_user', user);
      
    } catch(e) {
      console.error('[MAStore] Erro ao liberar todos os cursos:', e);
    }
  }

  /**
   * Libera acesso a um curso específico (INDIVIDUAL)
   */
  async function unlockCourse(ak, email, code, type, expiry) {
    var ready = await _waitFirebase();
    if (!ready || !window.maAuth || !window.maAuth.currentUser) return;

    var uid = window.maAuth.currentUser.uid;
    
    // Mapeia ak para courseKey
    var course = (typeof MA_COURSES !== 'undefined')
      ? MA_COURSES.find(function(c) { return c.ak === ak; })
      : null;
    var courseKey = course ? (course.courseKey || course.id) : ak.replace('_auth', '');

    try {
      await MA_DB.liberarCurso(uid, courseKey, 'individual');
      _cache.lastSync = 0; // Invalida cache
      
      // Atualiza cache local
      var user = _get('ma_user', {});
      if (!user.cursos) user.cursos = [];
      if (user.cursos.indexOf(courseKey) < 0) user.cursos.push(courseKey);
      _set('ma_user', user);
      
    } catch(e) {
      console.error('[MAStore] Erro ao liberar curso:', e);
    }
  }

  /* ══════════════════════════════════════════════════════════
     PROGRESSO DOS CURSOS — 100% Firebase
     ══════════════════════════════════════════════════════════ */

  /**
   * Salva progresso de um curso
   * @param {string} courseKey - Identificador do curso
   * @param {Object} dados - Dados do progresso
   */
  async function saveProgress(courseKey, dados) {
    var ready = await _waitFirebase();
    if (!ready || !window.maAuth || !window.maAuth.currentUser) return;

    var uid = window.maAuth.currentUser.uid;

    try {
      await MA_DB.salvarProgresso(uid, courseKey, dados);
      console.log('[MAStore] Progresso salvo:', courseKey);
    } catch(e) {
      console.error('[MAStore] Erro ao salvar progresso:', e);
    }
  }

  /**
   * Retorna progresso de um curso específico
   * @param {string} courseKey - Identificador do curso
   * @returns {Promise<Object>}
   */
  async function getProgress(courseKey) {
    var user = await getUser();
    if (!user || !user.progresso) return {};
    return user.progresso[courseKey] || {};
  }

  /**
   * Retorna progresso de todos os cursos
   * @returns {Promise<Object>}
   */
  async function getAllProgress() {
    var user = await getUser();
    if (!user || !user.progresso) return {};
    return user.progresso;
  }

  /**
   * Marca um tópico como concluído
   * @param {string} courseKey - Identificador do curso
   * @param {number} moduleIdx - Índice do módulo
   * @param {number} topicIdx - Índice do tópico
   */
  async function markTopicDone(courseKey, moduleIdx, topicIdx) {
    var progress = await getProgress(courseKey);
    
    if (!progress.topicos_concluidos) {
      progress.topicos_concluidos = [];
    }
    
    var topicId = moduleIdx + '_' + topicIdx;
    if (progress.topicos_concluidos.indexOf(topicId) < 0) {
      progress.topicos_concluidos.push(topicId);
    }
    
    // Recalcula percentual
    // (isso depende de quantos tópicos o curso tem no total)
    
    await saveProgress(courseKey, progress);
  }

  /* ══════════════════════════════════════════════════════════
     STREAK E SESSÕES — 100% Firebase
     ══════════════════════════════════════════════════════════ */

  /**
   * Retorna o streak atual do usuário
   * @returns {Promise<number>}
   */
  async function getStreak() {
    var user = await getUser();
    if (!user) return 0;
    return user.streak_atual || 0;
  }

  /**
   * Retorna dados de sessão/streak
   * @returns {Promise<Object>}
   */
  async function getSessions() {
    var user = await getUser();
    if (!user) return { streak: 0, count: 0 };
    return {
      streak: user.streak_atual || 0,
      record: user.streak_record || 0,
      diasAtivos: user.dias_ativos || 0
    };
  }

  /* ══════════════════════════════════════════════════════════
     MISSÕES DIÁRIAS — Híbrido (localStorage + Firebase futuro)
     ══════════════════════════════════════════════════════════ */

  function getMissions() {
    var today = new Date().toLocaleDateString('pt-BR');
    var ms = _get('ma_missions', {});
    if (!ms.done || ms.date !== today) {
      ms = { date: today, done: {} };
    }
    return ms;
  }

  function setMissions(ms) {
    return _set('ma_missions', ms);
  }

  async function completeMission(missionKey, pointsReward) {
    var ms = getMissions();
    if (ms.done[missionKey]) return false;
    
    ms.done[missionKey] = true;
    setMissions(ms);
    
    if (pointsReward) {
      await addPoints('Missão: ' + missionKey, pointsReward);
    }
    
    return true;
  }

  /* ══════════════════════════════════════════════════════════
     CURSOS RECENTES — localStorage (não crítico)
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

  /**
   * Retorna total de minutos estudados
   * @returns {Promise<number>}
   */
  async function getTotalMins() {
    var user = await getUser();
    if (!user) return 0;
    return user.total_minutos_estudo || 0;
  }

  /**
   * Adiciona minutos de estudo
   * @param {number} mins - Minutos a adicionar
   */
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
     (migrar para Firebase no futuro)
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
    await getUser();
    console.log('[MAStore] Cache sincronizado com Firebase');
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
      'mae_shop_stock', 'mae_trail_badges'
    ];
    keys.forEach(function(k) { _remove(k); });
    _cache.user = null;
    _cache.userData = null;
    _cache.lastSync = 0;
  }

  /* ══════════════════════════════════════════════════════════
     COMPATIBILIDADE COM CÓDIGO LEGADO
     ══════════════════════════════════════════════════════════ */

  // Funções síncronas para compatibilidade (retornam do cache)
  function getUserSync() {
    return _cache.userData || _get('ma_user', null);
  }

  // v3 FIX: Prioriza cache em memória sobre localStorage
  function getTotalPointsSync() {
    // Prioridade 1: cache em memória (sempre atualizado pelo Firebase)
    if (_cache.userData && typeof _cache.userData.xp_total === 'number') {
      return _cache.userData.xp_total;
    }
    // Prioridade 2: localStorage
    var user = _get('ma_user', null);
    if (user && typeof user.xp_total === 'number') {
      return user.xp_total;
    }
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
  // Retorna sync do cache para compatibilidade
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
   AUTO-SYNC — Mantém UI sincronizada
   ══════════════════════════════════════════════════════════ */

(function() {
  // v3 FIX ANTI-FLASH-ZERO: mostra cache local imediatamente ao carregar
  // para que o XP apareça antes do Firebase responder
  (function _showCacheImmediate() {
    try {
      var _u = JSON.parse(localStorage.getItem('ma_user')||'null');
      if (_u && typeof _u.xp_total === 'number' && _u.xp_total > 0) {
        var _xp = _u.xp_total;
        document.querySelectorAll('#maPtsNum, .ma-tb-pts-num, .maTbPtsN, #maTbPtsN, #hdrPtsNum').forEach(function(el) {
          el.textContent = _xp.toLocaleString('pt-BR');
        });
      }
    } catch(e) {}
  })();

  // Quando Firebase estiver pronto, faz TUDO: registra observer + sincroniza
  function _onFirebaseReady() {
    console.log('[MAStore v3] Firebase pronto, configurando observer de auth...');

    // CORREÇÃO RAIZ: registra o observer DENTRO do evento maFirebaseReady
    // para garantir que window.MA_AUTH já existe
    if (window.MA_AUTH) {
      MA_AUTH.onAuthChange(async function(authUser) {
        if (authUser) {
          // v3 FIX: ANTES de buscar Firestore, mostra o cache para evitar piscar 0
          try {
            var _cached = JSON.parse(localStorage.getItem('ma_user')||'null');
            if (_cached && typeof _cached.xp_total === 'number' && _cached.xp_total > 0) {
              document.querySelectorAll('#maPtsNum, .ma-tb-pts-num, .maTbPtsN, #maTbPtsN, #hdrPtsNum').forEach(function(el) {
                el.textContent = _cached.xp_total.toLocaleString('pt-BR');
              });
            }
          } catch(e2) {}

          // Usuário logado — busca dados frescos do Firestore
          var user = await MAStore.getUser();
          if (user) {
            var total = user.xp_total || 0;
            // Atualiza TODOS os elementos de XP na página
            document.querySelectorAll('#maPtsNum, .ma-tb-pts-num, .maTbPtsN, #maTbPtsN, #hdrPtsNum').forEach(function(el) {
              el.textContent = total.toLocaleString('pt-BR');
            });
            // Chama ptSyncFromFirebase se existir (portal-topbar)
            if (window.ptSyncFromFirebase) ptSyncFromFirebase();
            // Chama updTopbar se existir (index.html)
            if (window.updTopbar) window.updTopbar();
            console.log('[MAStore v3] Auth OK —', user.nome, '| XP:', total);
          }
        } else {
          // Usuário deslogado — limpa cache
          MAStore.invalidateCache();
          document.querySelectorAll('#maPtsNum, .ma-tb-pts-num, .maTbPtsN, #maTbPtsN, #hdrPtsNum').forEach(function(el) {
            el.textContent = '0';
          });
        }
      });
    } else {
      console.warn('[MAStore v3] MA_AUTH não disponível no maFirebaseReady');
    }
  }

  // Se Firebase já carregou (página recarregada com cache), executa direto
  if (window.__maFirebaseReady) {
    _onFirebaseReady();
  } else {
    document.addEventListener('maFirebaseReady', _onFirebaseReady, { once: true });
  }
})();

console.log('[MAStore v3] ✅ Carregado - Correção de sincronização XP');
