/**
 * ============================================================
 * MATHEUS ACADEMY — POINTS SYNC LISTENER
 * 
 * Adicione este código no final de cada página que exibe pontos
 * na topbar (ou inclua como script separado após userStore.js)
 * ============================================================
 */

(function() {
  // Escuta evento de sincronização de pontos
  window.addEventListener('ma-points-synced', function(e) {
    var newPoints = e.detail.points;
    updateAllPointsDisplays(newPoints);
  });

  // Escuta evento de pontos adicionados
  window.addEventListener('ma-points-added', function(e) {
    var newTotal = e.detail.total;
    updateAllPointsDisplays(newTotal);
  });

  // Função para atualizar TODOS os elementos que exibem pontos
  function updateAllPointsDisplays(points) {
    // Seletores comuns para elementos de pontos na topbar
    var selectors = [
      '#user-points',
      '#topbar-points',
      '.user-points',
      '.points-display',
      '.xp-display',
      '[data-points]',
      // Adicione aqui outros seletores específicos do seu site
    ];

    selectors.forEach(function(selector) {
      var elements = document.querySelectorAll(selector);
      elements.forEach(function(el) {
        // Atualiza o texto do elemento
        if (el.textContent !== undefined) {
          // Mantém formatação se houver (ex: "533 XP" ou apenas "533")
          var currentText = el.textContent;
          var suffix = currentText.replace(/[\d.,]+/g, '').trim();
          el.textContent = points.toLocaleString('pt-BR') + (suffix ? ' ' + suffix : '');
        }
        // Atualiza data-attribute se existir
        if (el.dataset.points !== undefined) {
          el.dataset.points = points;
        }
      });
    });

    // Callback global se existir
    if (window.updatePointsDisplay && typeof window.updatePointsDisplay === 'function') {
      window.updatePointsDisplay(points);
    }

    console.log('[MAStore] UI atualizada com ' + points + ' pontos');
  }

  // Expõe função globalmente para uso manual
  window.updateAllPointsDisplays = updateAllPointsDisplays;

  // Força sincronização inicial após 2 segundos
  setTimeout(function() {
    if (window.MAStore && MAStore.forcePointsSync) {
      MAStore.forcePointsSync();
    }
  }, 2000);

})();
