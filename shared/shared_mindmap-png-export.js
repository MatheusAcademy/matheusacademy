/* ═══════════════════════════════════════════════════════════════════════════
   MATHEUS ACADEMY — MAPA MENTAL PNG v6
   Arquivo: shared/mindmap-png-export.js
   
   ✅ MELHORAS:
   • Exporta como PNG em vez de PDF
   • Responsivo para mobile (360px) e desktop (1200px)
   • Qualidade mantida em qualquer resolução
   • Sem distorção de proporções
   • Download automático sem pop-ups
   
   📦 ADICIONE ESTE ARQUIVO A: shared/mindmap-png-export.js
   ═══════════════════════════════════════════════════════════════════════════ */

function downloadMindMapPNG(){
  /* v6: mapa mental somente para assinantes */
  if(COURSE.mindMapFree===false&&!isUnlocked()){
    openLockScreen();
    showToast('🔒 Mapa Mental exclusivo para assinantes','warn');
    return;
  }

  // Carregar html2canvas dinamicamente do CDN
  var script=document.createElement('script');
  script.src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
  
  script.onload=function(){
    // Começar renderização
    showToast('⏳ Gerando imagem do mapa mental...','info');
    
    var cc=COURSE.color||'#4A7EFF';
    var now=new Date();
    var exportDate=now.toLocaleDateString('pt-BR');
    var isMobile=window.innerWidth<768;
    var modColors=['#4A7EFF','#e63946','#22c55e','#f59e0b','#8b5cf6','#ec4899','#06b6d4','#f97316'];
    
    // Container temporário para renderizar
    var container=document.createElement('div');
    container.id='mindmapExportContainer';
    container.style.cssText='position:fixed;top:-9999px;left:-9999px;width:'+(isMobile?'360px':'1200px')+';background:#0a0a14;font-family:"Segoe UI",Arial,sans-serif;padding:24px;color:#e0e0e0;box-sizing:border-box;';
    
    var html='';
    
    // ════ HEADER ════
    html+='<div style="text-align:center;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid '+cc+'33;">';
    html+='<div style="font-size:10px;font-weight:900;color:#4A7EFF;letter-spacing:3px;text-transform:uppercase;margin-bottom:4px;">🎓 Matheus Academy</div>';
    html+='<div style="font-size:20px;font-weight:900;color:#fff;line-height:1.2;margin-bottom:6px;">🧠 Mapa Mental</div>';
    html+='<div style="font-size:14px;font-weight:700;color:#ccc;margin-bottom:8px;">'+escHtml(COURSE.name)+'</div>';
    html+='<div style="font-size:10px;color:#888;letter-spacing:1px;margin-bottom:12px;">Visão completa da estrutura do curso</div>';
    html+='<div style="display:flex;justify-content:center;gap:20px;flex-wrap:wrap;font-size:11px;color:#aaa;">';
    html+='<span><b style="color:'+cc+';font-size:13px;">'+COURSE.modules+'</b> módulos</span>';
    html+='<span><b style="color:'+cc+';font-size:13px;">'+COURSE.topics+'</b> tópicos</span>';
    html+='<span><b style="color:'+cc+';font-size:13px;">'+COURSE.hours+'</b> horas</span>';
    html+='</div></div>';
    
    // ════ NÓ CENTRAL ════
    html+='<div style="text-align:center;margin-bottom:24px;">';
    html+='<div style="display:inline-block;background:linear-gradient(135deg,'+cc+','+cc+'cc);color:#fff;font-size:16px;font-weight:900;padding:14px 32px;border-radius:50px;box-shadow:0 0 30px '+cc+'44;letter-spacing:.5px;white-space:nowrap;">'+escHtml(COURSE.shortName||COURSE.name)+'</div>';
    html+='</div>';
    
    // ════ GRID DE MÓDULOS (RESPONSIVO) ════
    html+='<div style="display:grid;grid-template-columns:'+(isMobile?'1fr':'1fr 1fr')+';gap:'+(isMobile?'12px':'16px 28px')+';width:100%;margin-bottom:20px;">';
    
    MODS.forEach(function(mod,mi){
      var mColor=modColors[mi%modColors.length];
      var modTitle=mod.name.replace(/^Módulo\s*\d+\s*[—–-]\s*/i,'');
      
      // ════ CARD DE MÓDULO ════
      html+='<div style="background:#12121e;border-radius:12px;padding:14px 16px;border-left:4px solid '+mColor+';break-inside:avoid;">';
      
      // Cabeçalho do módulo
      html+='<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">';
      html+='<div style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;color:#fff;background:'+mColor+';flex-shrink:0;">'+String(mi+1).padStart(2,'0')+'</div>';
      html+='<div style="font-size:12px;font-weight:800;color:#fff;line-height:1.3;">'+escHtml(modTitle)+'</div>';
      html+='</div>';
      
      // ════ TÓPICOS DO MÓDULO ════
      html+='<div style="display:flex;flex-direction:column;gap:6px;margin-left:38px;">';
      mod.topics.forEach(function(t){
        html+='<div style="display:flex;align-items:flex-start;gap:8px;font-size:11px;color:#ccc;line-height:1.4;">';
        html+='<div style="width:5px;height:5px;border-radius:50%;flex-shrink:0;margin-top:4px;background:'+mColor+'"></div>';
        html+='<span style="font-weight:600;color:#e8e8e8;">'+escHtml(t.name)+'</span>';
        html+='</div>';
      });
      html+='</div>';
      
      // ════ TAGS DE FLASHCARDS ════
      if(mod.topics.some(function(t){return t.cards&&t.cards.length;})){
        html+='<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:8px;margin-left:38px;">';
        mod.topics.forEach(function(t){
          if(t.cards){
            t.cards.slice(0,5).forEach(function(c){
              var short=c.q.length>35?c.q.substring(0,33)+'…':c.q;
              html+='<span style="font-size:8px;background:#ffffff0a;border:1px solid #ffffff15;padding:2px 6px;border-radius:4px;color:#888;">'+escHtml(short)+'</span>';
            });
          }
        });
        html+='</div>';
      }
      
      html+='</div>';
    });
    
    html+='</div>'; // fim grid módulos
    
    // ════ FOOTER ════
    html+='<div style="text-align:center;margin-top:20px;padding-top:12px;border-top:1px solid #ffffff12;font-size:9px;color:#555;">Mapa Mental gerado automaticamente por Matheus Academy · '+escHtml(COURSE.name)+' · '+exportDate+'</div>';
    
    container.innerHTML=html;
    document.body.appendChild(container);
    
    // ════ RENDERIZAR COM HTML2CANVAS ════
    html2canvas(container,{
      backgroundColor:'#0a0a14',
      scale:isMobile?2:3,
      logging:false,
      useCORS:true,
      allowTaint:true,
      width:isMobile?360:1200
    }).then(function(canvas){
      // ════ CONVERTER PARA PNG E BAIXAR ════
      canvas.toBlob(function(blob){
        var link=document.createElement('a');
        var fileName='Mapa_Mental_'+COURSE.name.replace(/[^a-z0-9]/gi,'_')+'.png';
        link.href=URL.createObjectURL(blob);
        link.download=fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        
        // Limpar
        document.body.removeChild(container);
        showToast('📥 Mapa Mental baixado como PNG!','ok');
      },'image/png',0.95);
      
    }).catch(function(err){
      document.body.removeChild(container);
      console.error('Erro ao gerar imagem:',err);
      showToast('❌ Erro ao gerar mapa mental. Tente novamente.','error');
    });
  };
  
  script.onerror=function(){
    showToast('❌ Erro ao carregar biblioteca de renderização','error');
  };
  
  document.head.appendChild(script);
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPATIBILIDADE: Manter nome antigo para não quebrar código existente
   ═══════════════════════════════════════════════════════════════════════════ */
function downloadMindMapPDF(){
  downloadMindMapPNG();
}
