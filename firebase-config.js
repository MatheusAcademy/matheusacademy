// ================================================================
// MATHEUS ACADEMY — Firebase Config Central v2
// Inclua este script em TODAS as páginas da Academy
// <script src="firebase-config.js"></script>
// ================================================================

const MA_FIREBASE_CONFIG = {
  apiKey: "AIzaSyCf8LxX2kB6C_9CREEMF0XnQtAOYV1Ic5E",
  authDomain: "matheus-academy.firebaseapp.com",
  projectId: "matheus-academy",
  storageBucket: "matheus-academy.firebasestorage.app",
  messagingSenderId: "516102924911",
  appId: "1:516102924911:web:f9336eb5941dd94142bb9a"
};

const MA_PREFIX = 'ma_';

// ── Inicializar Firebase (via CDN, sem npm) ──
(function() {
  if (window.__maFirebaseReady) return;

  function loadScript(src, cb) {
    var s = document.createElement('script');
    s.src = src; s.onload = cb;
    s.onerror = function() { console.error('[MA Firebase] Falha: ' + src); };
    document.head.appendChild(s);
  }

  var BASE = 'https://www.gstatic.com/firebasejs/10.12.2/';

  loadScript(BASE + 'firebase-app-compat.js', function() {
    loadScript(BASE + 'firebase-auth-compat.js', function() {
      loadScript(BASE + 'firebase-firestore-compat.js', function() {
        if (!firebase.apps.length) firebase.initializeApp(MA_FIREBASE_CONFIG);
        window.maAuth = firebase.auth();
        window.maDb   = firebase.firestore();
        window.__maFirebaseReady = true;
        document.dispatchEvent(new Event('maFirebaseReady'));
        console.log('[MA Firebase] ✅ Pronto');
      });
    });
  });
})();

// ================================================================
// MA_AUTH — Autenticação (Email/Senha + Google)
// ================================================================
window.MA_AUTH = {

  // Cadastro com email e senha
  async cadastrar(nome, email, senha) {
    const auth = await _maWaitAuth();
    const cred = await auth.createUserWithEmailAndPassword(email, senha);
    await cred.user.updateProfile({ displayName: nome });
    await MA_DB.criarUsuario(cred.user.uid, { nome, email });
    return cred.user;
  },

  // Login com email e senha
  async login(email, senha) {
    const auth = await _maWaitAuth();
    const cred = await auth.signInWithEmailAndPassword(email, senha);
    await MA_DB.registrarAcesso(cred.user.uid);
    return cred.user;
  },

  // Login com Google (popup — 1 clique)
  async loginGoogle() {
    const auth = await _maWaitAuth();
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const cred = await auth.signInWithPopup(provider);
    const user = cred.user;
    await MA_DB.criarUsuario(user.uid, {
      nome: user.displayName || '',
      email: user.email || '',
      foto: user.photoURL || ''
    });
    await MA_DB.registrarAcesso(user.uid);
    return user;
  },

  // Logout
  async logout() {
    const auth = await _maWaitAuth();
    await auth.signOut();
    ['ma_user','ma_course_progress','ma_activity_log'].forEach(k => localStorage.removeItem(k));
  },

  // Recuperar senha
  async recuperarSenha(email) {
    const auth = await _maWaitAuth();
    await auth.sendPasswordResetEmail(email);
  },

  // Usuário atual
  async getUser() {
    const auth = await _maWaitAuth();
    return auth.currentUser;
  },

  // Observer de mudança de estado
  onAuthChange(cb) {
    _maWaitAuth().then(auth => auth.onAuthStateChanged(cb));
  }
};

// ================================================================
// MA_DB — Banco de Dados (Firestore)
// ================================================================
window.MA_DB = {

  async criarUsuario(uid, dados) {
    const db = await _maWaitDb();
    const ref = db.collection('usuarios').doc(uid);
    const snap = await ref.get();
    if (!snap.exists) {
      await ref.set({
        uid,
        nome: dados.nome || '',
        email: dados.email || '',
        foto: dados.foto || '',
        plano: 'gratuito',
        cursos_comprados: [],
        xp_total: 0,
        nivel: 1,
        streak_atual: 0,
        streak_record: 0,
        conquistas: [],
        progresso: {},
        total_minutos_estudo: 0,
        dias_ativos: 0,
        ultimo_acesso: firebase.firestore.FieldValue.serverTimestamp(),
        data_cadastro: firebase.firestore.FieldValue.serverTimestamp(),
        opt_in_email: true,
        ativo: true
      });
    }
    return ref;
  },

  async getUsuario(uid) {
    const db = await _maWaitDb();
    const snap = await db.collection('usuarios').doc(uid).get();
    return snap.exists ? { id: snap.id, ...snap.data() } : null;
  },

  async updateUsuario(uid, dados) {
    const db = await _maWaitDb();
    await db.collection('usuarios').doc(uid).update(dados);
  },

  async registrarAcesso(uid) {
    const db = await _maWaitDb();
    const ref = db.collection('usuarios').doc(uid);
    const snap = await ref.get();
    if (!snap.exists) return;
    const data = snap.data();
    const agora = new Date();
    const ultimo = data.ultimo_acesso ? data.ultimo_acesso.toDate() : null;
    let streak = data.streak_atual || 0;
    let record = data.streak_record || 0;
    let dias = data.dias_ativos || 0;
    if (ultimo) {
      const diffDias = Math.floor((agora - ultimo) / (1000 * 60 * 60 * 24));
      if (diffDias === 1) streak += 1;
      else if (diffDias > 1) streak = 1;
      if (diffDias >= 1) dias += 1;
    } else { streak = 1; dias = 1; }
    if (streak > record) record = streak;
    await ref.update({
      ultimo_acesso: firebase.firestore.FieldValue.serverTimestamp(),
      streak_atual: streak, streak_record: record, dias_ativos: dias
    });
  },

  async salvarProgresso(uid, courseKey, dados) {
    const db = await _maWaitDb();
    const update = {};
    update[`progresso.${courseKey}`] = {
      ...dados, ultimo_acesso: firebase.firestore.FieldValue.serverTimestamp()
    };
    await db.collection('usuarios').doc(uid).update(update);
    try {
      const local = JSON.parse(localStorage.getItem('ma_course_progress') || '{}');
      local[courseKey] = dados;
      localStorage.setItem('ma_course_progress', JSON.stringify(local));
    } catch(e) {}
  },

  async addXP(uid, xp, motivo) {
    const db = await _maWaitDb();
    await db.collection('usuarios').doc(uid).update({
      xp_total: firebase.firestore.FieldValue.increment(xp)
    });
    await db.collection('usuarios').doc(uid).collection('historico_xp').add({
      xp, motivo: motivo || '', ts: firebase.firestore.FieldValue.serverTimestamp()
    });
  },

  async temAcesso(uid, courseKey) {
    const db = await _maWaitDb();
    const snap = await db.collection('usuarios').doc(uid).get();
    if (!snap.exists) return false;
    const data = snap.data();
    if (data.plano === 'anual' || data.plano === 'mensal') return true;
    return (data.cursos_comprados || []).includes(courseKey);
  },

  async liberarCurso(uid, courseKey, plano) {
    const db = await _maWaitDb();
    await db.collection('usuarios').doc(uid).update({
      plano: plano || 'individual',
      cursos_comprados: firebase.firestore.FieldValue.arrayUnion(courseKey),
      data_compra: firebase.firestore.FieldValue.serverTimestamp()
    });
  },

  async sincronizarLocal(uid) {
    const db = await _maWaitDb();
    const update = {};
    // v3 FIX: NÃO sincroniza ma_points legado — Firebase é a fonte de verdade
    // Apenas sincroniza dados que não têm origem no Firebase
    try { const s=JSON.parse(localStorage.getItem('ma_streak2')||'{}'); if(s.current) update.streak_atual=s.current; if(s.record) update.streak_record=s.record; } catch(e){}
    try { const m=parseInt(localStorage.getItem('ma_study_total_min')||'0'); if(m) update.total_minutos_estudo=m; } catch(e){}
    try { const prog=JSON.parse(localStorage.getItem('ma_course_progress')||'{}'); Object.keys(prog).forEach(k=>{update[`progresso.${k}`]=prog[k];}); } catch(e){}
    if (Object.keys(update).length > 0) {
      await db.collection('usuarios').doc(uid).update(update);
      console.log('[MA Firebase] ✅ localStorage sincronizado');
    }
  }
};

// ================================================================
// MA_ACESSO — Proteção de páginas de curso
// ================================================================
window.MA_ACESSO = {

  async verificar(courseKey) {
    try {
      const auth = await _maWaitAuth();
      const user = auth.currentUser;
      if (!user) return { user: null, acesso: false, dados: null };
      const dados = await MA_DB.getUsuario(user.uid);
      const acesso = await MA_DB.temAcesso(user.uid, courseKey);
      if (dados) {
        // v3 FIX: inclui xp_total para que a topbar leia XP correto do cache
        localStorage.setItem('ma_user', JSON.stringify({
          uid: user.uid,
          nome: dados.nome || user.displayName,
          name: dados.nome || user.displayName,
          email: dados.email || user.email,
          foto: user.photoURL || '',
          plano: dados.plano,
          cursos: dados.cursos_comprados,
          xp_total: dados.xp_total || 0  // ← CORREÇÃO: sempre salvar xp_total
        }));
        // Remove chave legada que causava conflito
        localStorage.removeItem('ma_points');
      }
      return { user, acesso, dados };
    } catch(e) {
      console.error('[MA_ACESSO]', e);
      return { user: null, acesso: false, dados: null };
    }
  },

  async proteger(courseKey, urlLogin) {
    urlLogin = urlLogin || '../index.html';
    const result = await this.verificar(courseKey);
    if (!result.user) { window.location.href = urlLogin; return null; }
    return result;
  }
};

// ── Helpers internos ──
function _maWaitAuth() {
  return new Promise(resolve => {
    if (window.maAuth) { resolve(window.maAuth); return; }
    document.addEventListener('maFirebaseReady', () => resolve(window.maAuth), { once: true });
  });
}
function _maWaitDb() {
  return new Promise(resolve => {
    if (window.maDb) { resolve(window.maDb); return; }
    document.addEventListener('maFirebaseReady', () => resolve(window.maDb), { once: true });
  });
}
