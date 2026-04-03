/* ══════════════════════════════════════════════════════════════
   MATHEUS ACADEMY — COURSE-ENGINE PATCH v2
   ══════════════════════════════════════════════════════════════
   
   INSTRUÇÕES DE USO:
   Este arquivo contém as funções CORRIGIDAS que devem SUBSTITUIR
   as funções equivalentes no course-engine.js
   
   As funções abaixo usam Firebase como fonte única de verdade
   para pontos/XP, corrigindo o bug de reset ao navegar.
   
   COMO APLICAR:
   1. No course-engine.js, localize as funções listadas abaixo
   2. Substitua cada função pela versão corrigida
   3. Ou inclua este arquivo APÓS o course-engine.js original
   
   ══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   SUBSTITUIR: função gP() - linha ~577 do course-engine.js
   ANTES: function gP(){try{return JSON.parse(localStorage.getItem('ma_points'))||{total:0,history:[]};}catch(e){return{total:0,history:[]};}}
   ═══════════════════════════════════════════════════════════════ */

// Cache local para pontos (evita múltiplas leituras)
var _maCachedPoints = null;
var _maCacheTime = 0;

function gP() {
  // Se MAStore existe e tem dados do Firebase, usa
  if (window.MAStore && window.MAStore.getTotalPointsSync) {
    var total = MAStore.getTotalPointsSync();
    return { total: total, history: [] };
  }
  
  // Fallback: tenta do localStorage
  try {
    return JSON.parse(localStorage.getItem('ma_points')) || { total: 0, history: [] };
  } catch(e) {
    return { total: 0, history: [] };
  }
}

/* ═══════════════════════════════════════════════════════════════
   SUBSTITUIR: função addPoints() - linha ~702-710 do course-engine.js
   
   ANTES:
   function addPoints(src,pts){
     var u=gU();if(!u)return;
     var p=gP();p.total+=pts;p.history.unshift({source:src,pts:pts,date:new Date().toLocaleDateString('pt-BR')});
     localStorage.setItem('ma_points',JSON.stringify(p));
     playCoinSound();
     updateTopbar();
     showToast('⭐ +'+pts+' pontos — '+src,'pts');
   }
   ═══════════════════════════════════════════════════════════════ */

async function addPoints(src, pts) {
  var u = gU();
  if (!u) return;
  
  // Som de moedas primeiro (feedback instantâneo)
  playCoinSound();
  
  // Mostra toast imediatamente
  showToast('⭐ +' + pts + ' pontos — ' + src, 'pts');
  
  // Adiciona via MAStore (Firebase)
  if (window.MAStore && window.MAStore.addPoints) {
    try {
      var newTotal = await MAStore.addPoints(src, pts);
      console.log('[Course] +' + pts + ' XP (' + src + ') = ' + newTotal);
      
      // Atualiza UI
      updateTopbar();
      
    } catch(e) {
      console.error('[Course] Erro ao adicionar pontos:', e);
      
      // Fallback: salva no localStorage (será sincronizado depois)
      _addPointsFallback(src, pts);
    }
  } else {
    // Fallback se MAStore não estiver disponível
    _addPointsFallback(src, pts);
  }
}

// Fallback para quando Firebase não está disponível
function _addPointsFallback(src, pts) {
  try {
    var p = JSON.parse(localStorage.getItem('ma_points')) || { total: 0, history: [] };
    p.total += pts;
    p.history.unshift({ source: src, pts: pts, date: new Date().toLocaleDateString('pt-BR') });
    localStorage.setItem('ma_points', JSON.stringify(p));
    updateTopbar();
  } catch(e) {
    console.error('[Course] Fallback points error:', e);
  }
}

// Re-expõe globalmente
window.MA_addPoints = addPoints;
window.MA_getPoints = gP;

/* ═══════════════════════════════════════════════════════════════
   SUBSTITUIR: função updateTopbar() - linha ~713-733 do course-engine.js
   
   Atualizada para buscar pontos do Firebase quando disponível
   ═══════════════════════════════════════════════════════════════ */

function updateTopbar() {
  var u = gU();
  var p = gP();
  var lv = gLv(p.total);
  
  // Pontos — formata com zeros à esquerda para números pequenos
  var pEl = document.getElementById('maPtsLive');
  var pN = document.getElementById('maPtsNum');
  
  if (pN) {
    var total = p.total;
    var str = total < 1000 ? String(total).padStart(3, '0') : total.toLocaleString('pt-BR');
    pN.textContent = str;
    
    // Animação bump
    if (pEl) {
      pEl.classList.remove('bump');
      void pEl.offsetWidth;
      pEl.classList.add('bump');
      setTimeout(function() { pEl.classList.remove('bump'); }, 500);
    }
  }
  
  var uS = document.getElementById('maMenuUserSec');
  var aS = document.getElementById('maMenuAuthSec');
  
  if (u) {
    if (uS) {
      uS.innerHTML = '<div class="ma-menu-user">'
        + '<span class="ma-mu-name">' + u.name.split(' ')[0] + '</span>'
        + '<span class="ma-mu-level ' + lv.c + '"><span class="ma-lv-dot"></span>' + lv.n + '</span>'
        + '<div class="ma-mu-pts"><b>' + p.total.toLocaleString('pt-BR') + '</b> pontos</div>'
        + '</div>';
    }
    if (aS) {
      aS.innerHTML = '<button class="ma-mi red" onclick="maLogout()"><span class="ma-mi-icon">🚪</span>Sair</button>';
    }
  } else {
    if (uS) {
      uS.innerHTML = '<div class="ma-menu-user"><span class="ma-mu-name" style="color:#8888a8">Visitante</span></div>';
    }
    if (aS) {
      aS.innerHTML = '<a class="ma-mi" href="#" onclick="closeMaMenu();openM(\'login\');return false"><span class="ma-mi-icon">🔑</span>Entrar</a>'
        + '<a class="ma-mi gold" href="#" onclick="closeMaMenu();openM(\'plans\');return false"><span class="ma-mi-icon">💎</span>Ver Planos</a>';
    }
  }
}

/* ═══════════════════════════════════════════════════════════════
   ADICIONAR: Sincronização inicial com Firebase
   
   Este código deve ser adicionado no final do DOMContentLoaded
   do course-engine.js
   ═══════════════════════════════════════════════════════════════ */

// Sincroniza pontos do Firebase quando a página carrega
document.addEventListener('maFirebaseReady', async function() {
  console.log('[Course] Firebase pronto, sincronizando pontos...');
  
  if (window.MAStore) {
    try {
      // Força sync do cache
      await MAStore.syncFromFirebase();
      
      // Atualiza UI com dados frescos
      updateTopbar();
      
      console.log('[Course] Pontos sincronizados do Firebase');
    } catch(e) {
      console.error('[Course] Erro na sincronização:', e);
    }
  }
});

/* ═══════════════════════════════════════════════════════════════
   ATUALIZAR: Listener de pontos para atualizar em tempo real
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('ma:pointsUpdate', function(e) {
  // Força atualização da topbar quando pontos mudam
  updateTopbar();
});

console.log('[Course Engine Patch v2] ✅ Funções de pontos atualizadas para Firebase');
