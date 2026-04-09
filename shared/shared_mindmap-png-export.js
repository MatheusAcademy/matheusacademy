/* ═══════════════════════════════════════════════════════════════════════════
   MATHEUS ACADEMY — MAPA MENTAL PDF v7
   Arquivo: shared/shared_mindmap-png-export.js

   ✅ EXPORTA COMO PDF
   • Renderiza mapa mental em HTML → canvas → PDF
   • Responsivo para mobile (360px) e desktop (1200px)
   • Qualidade alta com html2canvas + jsPDF
   • Logo Matheus Academy no topo
   • Cores diferentes por módulo
   • Estrutura: Tema Central → Módulos → Tópicos → Detalhes
   ═══════════════════════════════════════════════════════════════════════════ */

function _loadScript(url){
  return new Promise(function(resolve,reject){
    if(document.querySelector('script[src="'+url+'"]')){resolve();return;}
    var s=document.createElement('script');
    s.src=url;s.onload=resolve;s.onerror=reject;
    document.head.appendChild(s);
  });
}

function downloadMindMapPDF(){
  /* v7: mapa mental somente para assinantes */
  if(COURSE.mindMapFree===false&&!isUnlocked()){
    openLockScreen();
    showToast('🔒 Mapa Mental exclusivo para assinantes','warn');
    return;
  }

  showToast('⏳ Gerando PDF do mapa mental...','info');

  Promise.all([
    _loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),
    _loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
  ]).then(function(){
    _renderMindMapPDF();
  }).catch(function(){
    showToast('❌ Erro ao carregar bibliotecas','error');
  });
}

function _renderMindMapPDF(){
  var cc=COURSE.color||'#4A7EFF';
  var now=new Date();
  var exportDate=now.toLocaleDateString('pt-BR');
  var isMobile=window.innerWidth<768;
  var W=isMobile?380:1200;
  var modColors=['#4A7EFF','#e63946','#22c55e','#f59e0b','#8b5cf6','#ec4899','#06b6d4','#f97316'];

  var container=document.createElement('div');
  container.style.cssText='position:fixed;top:-9999px;left:-9999px;width:'+W+'px;background:#0a0a14;font-family:"Segoe UI",Arial,sans-serif;padding:32px;color:#e0e0e0;box-sizing:border-box;';

  var html='';

  /* ════ LOGO + HEADER ════ */
  html+='<div style="text-align:center;margin-bottom:28px;padding-bottom:18px;border-bottom:2px solid '+cc+'33;">';
  html+='<div style="display:inline-flex;align-items:center;gap:8px;margin-bottom:10px;">';
  html+='<div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,'+cc+','+cc+'aa);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;color:#fff;">M</div>';
  html+='<span style="font-size:13px;font-weight:900;color:#fff;letter-spacing:2px;">MATHEUS ACADEMY</span>';
  html+='</div>';
  html+='<div style="font-size:22px;font-weight:900;color:#fff;line-height:1.2;margin-bottom:6px;">🧠 Mapa Mental</div>';
  html+='<div style="font-size:15px;font-weight:700;color:#ccc;margin-bottom:8px;">'+escHtml(COURSE.name)+'</div>';
  html+='<div style="font-size:10px;color:#888;letter-spacing:1px;margin-bottom:14px;">Estrutura completa do curso — use como guia de estudo</div>';
  html+='<div style="display:flex;justify-content:center;gap:24px;flex-wrap:wrap;font-size:11px;color:#aaa;">';
  html+='<span>📚 <b style="color:'+cc+';font-size:13px;">'+COURSE.modules+'</b> módulos</span>';
  html+='<span>📝 <b style="color:'+cc+';font-size:13px;">'+COURSE.topics+'</b> tópicos</span>';
  html+='<span>⏱️ <b style="color:'+cc+';font-size:13px;">'+COURSE.hours+'</b> horas</span>';
  html+='</div></div>';

  /* ════ NÓ CENTRAL ════ */
  html+='<div style="text-align:center;margin-bottom:28px;">';
  html+='<div style="display:inline-block;background:linear-gradient(135deg,'+cc+','+cc+'cc);color:#fff;font-size:17px;font-weight:900;padding:14px 36px;border-radius:50px;box-shadow:0 0 30px '+cc+'44,0 0 60px '+cc+'22;letter-spacing:.5px;">'+escHtml(COURSE.shortName||COURSE.name)+'</div>';
  html+='<div style="width:2px;height:18px;background:'+cc+'55;margin:0 auto;"></div>';
  html+='</div>';

  /* ════ GRID DE MÓDULOS ════ */
  html+='<div style="display:grid;grid-template-columns:'+(isMobile?'1fr':'1fr 1fr')+';gap:'+(isMobile?'14px':'18px 32px')+';width:100%;margin-bottom:24px;">';

  MODS.forEach(function(mod,mi){
    var mColor=modColors[mi%modColors.length];
    var modTitle=mod.name.replace(/^Módulo\s*\d+\s*[—–\-]\s*/i,'');

    html+='<div style="background:#12121e;border-radius:14px;padding:16px 18px;border-left:4px solid '+mColor+';box-shadow:0 2px 12px rgba(0,0,0,.3);break-inside:avoid;">';

    /* Cabeçalho módulo */
    html+='<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">';
    html+='<div style="width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;color:#fff;background:'+mColor+';flex-shrink:0;box-shadow:0 0 12px '+mColor+'44;">'+String(mi+1).padStart(2,'0')+'</div>';
    html+='<div style="font-size:13px;font-weight:800;color:#fff;line-height:1.3;">'+escHtml(modTitle)+'</div>';
    html+='</div>';

    /* Tópicos */
    html+='<div style="display:flex;flex-direction:column;gap:7px;margin-left:40px;">';
    mod.topics.forEach(function(t,ti){
      html+='<div style="display:flex;align-items:flex-start;gap:8px;font-size:11px;line-height:1.4;">';
      html+='<div style="width:6px;height:6px;border-radius:50%;flex-shrink:0;margin-top:4px;background:'+mColor+';box-shadow:0 0 4px '+mColor+'66;"></div>';
      html+='<span style="font-weight:600;color:#e0e0e0;">'+escHtml(t.name)+'</span>';
      html+='</div>';
    });
    html+='</div>';

    /* Flashcards/conceitos-chave */
    if(mod.topics.some(function(t){return t.cards&&t.cards.length;})){
      html+='<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:10px;margin-left:40px;">';
      var count=0;
      mod.topics.forEach(function(t){
        if(t.cards&&count<6){
          t.cards.forEach(function(c){
            if(count>=6)return;
            var short=c.q.length>30?c.q.substring(0,28)+'…':c.q;
            html+='<span style="font-size:8px;background:'+mColor+'12;border:1px solid '+mColor+'30;padding:2px 7px;border-radius:4px;color:'+mColor+'cc;">'+escHtml(short)+'</span>';
            count++;
          });
        }
      });
      html+='</div>';
    }

    html+='</div>';
  });

  html+='</div>';

  /* ════ LEGENDA ════ */
  html+='<div style="display:flex;justify-content:center;gap:16px;flex-wrap:wrap;margin-bottom:16px;font-size:10px;color:#888;">';
  html+='<span>● Nó central = tema do curso</span>';
  html+='<span>● Ramos = módulos</span>';
  html+='<span>● Folhas = tópicos de cada módulo</span>';
  html+='<span>● Tags = conceitos-chave (flashcards)</span>';
  html+='</div>';

  /* ════ DICAS ════ */
  html+='<div style="background:#ffffff06;border:1px solid #ffffff10;border-radius:10px;padding:12px 16px;margin-bottom:16px;">';
  html+='<div style="font-size:10px;font-weight:700;color:#fff;margin-bottom:6px;">📌 Como usar este mapa:</div>';
  html+='<div style="font-size:9px;color:#aaa;line-height:1.6;">';
  html+='Use palavras-chave, não frases completas · Organize do simples → complexo · Atualize conforme aprende mais · Revise regularmente para fixar o conteúdo';
  html+='</div></div>';

  /* ════ FOOTER ════ */
  html+='<div style="text-align:center;margin-top:16px;padding-top:12px;border-top:1px solid #ffffff10;font-size:9px;color:#555;">';
  html+='Mapa Mental gerado por Matheus Academy · '+escHtml(COURSE.name)+' · '+exportDate;
  html+='</div>';

  container.innerHTML=html;
  document.body.appendChild(container);

  /* ════ RENDER → PDF ════ */
  html2canvas(container,{
    backgroundColor:'#0a0a14',
    scale:isMobile?2:2.5,
    logging:false,
    useCORS:true,
    allowTaint:true,
    width:W
  }).then(function(canvas){
    var imgData=canvas.toDataURL('image/png',0.95);
    var imgW=canvas.width;
    var imgH=canvas.height;

    /* Dimensões do PDF: A4 landscape ou portrait dependendo da proporção */
    var jsPDF=window.jspdf.jsPDF;
    var ratio=imgW/imgH;
    var orientation=ratio>1.2?'landscape':'portrait';
    var pdf=new jsPDF({orientation:orientation,unit:'mm',format:'a4'});

    var pageW=pdf.internal.pageSize.getWidth();
    var pageH=pdf.internal.pageSize.getHeight();
    var margin=8;
    var usableW=pageW-margin*2;
    var scaledH=(usableW/imgW)*imgH;

    if(scaledH<=pageH-margin*2){
      /* Cabe em uma página */
      pdf.addImage(imgData,'PNG',margin,margin,usableW,scaledH,'','FAST');
    } else {
      /* Múltiplas páginas — divide a imagem */
      var pageContentH=pageH-margin*2;
      var srcSliceH=(pageContentH/scaledH)*imgH;
      var yOffset=0;
      var page=0;
      while(yOffset<imgH){
        if(page>0)pdf.addPage();
        var sliceH=Math.min(srcSliceH,imgH-yOffset);
        var tempCanvas=document.createElement('canvas');
        tempCanvas.width=imgW;
        tempCanvas.height=sliceH;
        var ctx=tempCanvas.getContext('2d');
        ctx.drawImage(canvas,0,yOffset,imgW,sliceH,0,0,imgW,sliceH);
        var sliceData=tempCanvas.toDataURL('image/png');
        var drawH=(sliceH/imgW)*usableW;
        pdf.addImage(sliceData,'PNG',margin,margin,usableW,drawH,'','FAST');
        yOffset+=sliceH;
        page++;
      }
    }

    var fileName='Mapa_Mental_'+COURSE.name.replace(/[^a-z0-9]/gi,'_')+'.pdf';
    pdf.save(fileName);

    document.body.removeChild(container);
    showToast('📥 Mapa Mental baixado como PDF!','ok');

  }).catch(function(err){
    document.body.removeChild(container);
    console.error('Erro ao gerar PDF:',err);
    showToast('❌ Erro ao gerar mapa mental. Tente novamente.','error');
  });
}

/* Compatibilidade: manter nome antigo */
function downloadMindMapPNG(){
  downloadMindMapPDF();
}
