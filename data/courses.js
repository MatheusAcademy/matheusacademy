var MA_COURSES = [
  {
    id: 'gp',
    courseKey: 'geo',
    name: 'Geopolítica Avançada',
    desc: 'Entenda o mundo como ele funciona. Teoria, conflitos e economia global.',
    file: 'geopolitica-curso.html',
    cat: 'Geopolítica',
    modules: 27,
    topics: 271,
    hours: 90,
    quizzes: 27,
    salt: 'GP_HENRY_2026_MASTER',
    ak: 'gp_auth',
    storagePrefix: 'geo_',
    icon: '🌍',
    color: '#22c55e',
    addedTs: 1742688000000,
    active: true
  },
  {
    id: 'bm',
    courseKey: 'bm',
    name: 'Caso Banco Master',
    desc: 'A maior fraude bancária do Brasil. R$52bi, CPI e delação premiada.',
    file: 'caso-banco-master.html',
    cat: 'Atualize-se! Notícias Mais Relevantes da Semana',
    modules: 7,
    topics: 7,
    hours: 1,
    quizzes: 0,
    salt: 'FREE',
    ak: 'free',
    storagePrefix: 'bm_',
    icon: '🏦',
    color: '#ef4444',
    free: true,
    addedTs: 1743264000000,
    active: true
  },
  {
    id: 'ii',
    courseKey: 'ii',
    name: 'Guerra Israel x Irã',
    desc: 'O conflito que mudou o mundo. De 2025 à escalada de 2026.',
    file: 'guerra-israel-ira.html',
    cat: 'Atualize-se! Notícias Mais Relevantes da Semana',
    modules: 7,
    topics: 7,
    hours: 1,
    quizzes: 0,
    salt: 'FREE',
    ak: 'free',
    storagePrefix: 'ii_',
    icon: '⚔️',
    color: '#f97316',
    free: true,
    addedTs: 1743292800000,
    active: true
  },
  {
    id: 'cp',
    courseKey: 'cp',
    name: 'Copa do Mundo 2026',
    desc: 'Tudo sobre o maior evento esportivo do mundo. Análise completa.',
    file: 'copa-do-mundo-2026.html',
    cat: 'Atualize-se! Notícias Mais Relevantes da Semana',
    modules: 7,
    topics: 7,
    hours: 1,
    quizzes: 0,
    salt: 'FREE',
    ak: 'free',
    storagePrefix: 'cp_',
    icon: '⚽',
    color: '#10b981',
    free: true,
    addedTs: 1743350400000,
    active: true
  },
  {
    id: 'bc',
    name: 'Bitcoin — A Moeda que Mudou a História do Mundo',
    desc: '',
    file: 'bitcoin-curso.html',
    cat: 'Negócios',
    modules: 35,
    topics: 210,
    hours: 30,
    quizzes: 35,
    salt: 'BC_HENRY_2026_MASTER',
    ak: 'bc_auth',
    storagePrefix: 'bc_',
    icon: '🎓',
    color: '#3b82f6',
    addedTs: 1775218683742,
    active: true
  }
];
var MA_CATS = [
  {name:'Atualize-se! Notícias Mais Relevantes da Semana', sub:'Os acontecimentos mais relevantes do momento explicados em detalhes', courses:[], soon:['Eleições 2026: Em Quem Votar?'], isSpecial:true},
  {name:'Negócios', sub:'Aqui você encontra as aulas exclusivas do Matheus Academy', courses:[], soon:[]},
  {name:'Geopolítica', sub:'Entenda o mundo como ele realmente funciona, além das notícias', courses:[], soon:['Relações Internacionais']},
  {name:'PNL', sub:'Domine a arte de comunicar, persuadir e influenciar pessoas', courses:[], soon:['Técnicas de Persuasão','Oratória e Comunicação Assertiva','PNL — Programação Neurolinguística']},
  {name:'Desenvolvimento', sub:'Transforme sua mentalidade e atinja o próximo nível', courses:[], soon:['Inteligência Emocional na Prática','Produtividade e Gestão do Tempo','Liderança']},
  {name:'Tecnologia', sub:'A tecnologia chegou para ficar — aprenda a lucrar com ela', courses:[], soon:['Inteligência Artificial na Prática','Programação para Iniciantes','Automação Digital']},
  {name:'Psicologia', sub:'Compreenda o comportamento humano e use isso a seu favor', courses:[], soon:['Psicologia Comportamental','Neurociência e Comportamento','Psicologia das Relações']},
  {name:'História', sub:'Quem não conhece a história está condenado a repeti-la', courses:[], soon:['História do Brasil Completa','Grandes Civilizações Antigas','História Contemporânea']},
  {name:'Filosofia', sub:'Pense melhor, decida melhor, viva melhor', courses:[], soon:['Filosofia para a Vida Real','Grandes Filósofos da História','Ética e Pensamento Crítico']},
  {name:'Inglês', sub:'O idioma que abre portas no mundo inteiro', courses:[], soon:['Inglês do Zero ao Fluente','Business English','Inglês para Viagens']},
  {name:'Bíblia / Teologia', sub:'Aprofunde sua fé com estudo sério e contextualizado', courses:[], soon:['Estudo Bíblico Completo','Teologia Sistemática','Panorama do Antigo Testamento']},
  {name:'Biografias', sub:'Aprenda com quem construiu história e mudou o mundo', courses:[], soon:['Líderes que Mudaram o Mundo','Empreendedores Visionários','Gênios da Ciência']},
  {name:'Engenharia', sub:'Conhecimento técnico de alta precisão e aplicação real', courses:[], soon:['Instalações Hidráulicas e Gás','Fundamentos de Engenharia Civil','Projetos Estruturais']},
  {name:'Mecânica', sub:'Do básico ao avançado em manutenção e diagnóstico automotivo', courses:[], soon:['Mecânica Básica Automotiva','Diagnóstico e Manutenção','Elétrica Automotiva']},
  {name:'📚 Ebooks', sub:'Materiais de leitura aprofundados sobre os temas que mais importam', courses:[], soon:['China x EUA','Israel x Irã','Devocional 2026','Estamos Próximos do Fim?'], isEbook:true}
];

var MA_TRAILS = [
  {
    id: 'empreendedor',
    icon: '🚀',
    color: 'rgba(91,127,255,.1)',
    borderColor: 'rgba(91,127,255,.4)',
    name: 'Trilha Empreendedor Digital',
    desc: 'Do zero ao negócio digital lucrativo.',
    badge: '🚀 Empreendedor Digital',
    courseIds: ['tp', 'ni', 'nl']
  },
  {
    id: 'estrategista',
    icon: '🌍',
    color: 'rgba(34,197,94,.1)',
    borderColor: 'rgba(34,197,94,.35)',
    name: 'Trilha Estrategista Global',
    desc: 'Geopolítica + Negócios para uma visão estratégica completa.',
    badge: '🌍 Estrategista Global',
    courseIds: ['gp', 'ni']
  },
  {
    id: 'cidadao',
    icon: '🏛️',
    color: 'rgba(59,130,246,.1)',
    borderColor: 'rgba(59,130,246,.35)',
    name: 'Trilha Cidadão Consciente',
    desc: 'Política Brasileira + Geopolítica para uma visão crítica completa.',
    badge: '🏛️ Cidadão Consciente',
    courseIds: ['pb', 'gp']
  },
  {
    id: 'completa',
    icon: '👑',
    color: 'rgba(245,158,11,.1)',
    borderColor: 'rgba(245,158,11,.35)',
    name: 'Trilha Completa Matheus Academy',
    desc: 'O percurso definitivo. Todos os cursos principais.',
    badge: '👑 Mestre Academy',
    courseIds: ['tp', 'ni', 'gp', 'pb', 'nl', 'mp']
  }
];

function MA_getActiveCourses() {
  return MA_COURSES.filter(function(c) { return c.active !== false; });
}
function MA_getCourseById(id) {
  return MA_COURSES.find(function(c) { return c.id === id; }) || null;
}
function MA_buildCats() {
  var cats = MA_CATS.map(function(cat) {
    return { name: cat.name, sub: cat.sub, courses: [], soon: cat.soon || [], isSpecial: !!cat.isSpecial, isEbook: !!cat.isEbook };
  });
  MA_getActiveCourses().forEach(function(c) {
    var cat = cats.find(function(k) { return k.name === c.cat; });
    if (cat) cat.courses.push(c);
  });
  return cats.filter(function(cat) { return cat.courses.length > 0 || cat.soon.length > 0; });
}
function MA_buildTrails() {
  return MA_TRAILS.map(function(trail) {
    var resolved = [];
    trail.courseIds.forEach(function(cid) {
      // Trilhas incluem TODOS os cursos (mesmo inactive) — mostram o caminho completo
      var c = MA_COURSES.find(function(x){ return x.id === cid; });
      if (c) resolved.push({ key: c.id, icon: c.icon, name: c.name, file: c.file });
    });
    return { id: trail.id, icon: trail.icon, color: trail.color, borderColor: trail.borderColor, name: trail.name, desc: trail.desc, badge: trail.badge, courses: resolved };
  }).filter(function(t){ return t.courses.length > 0; });
}
