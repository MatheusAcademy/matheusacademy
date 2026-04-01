/**
 * ============================================================
 * MATHEUS ACADEMY â COURSES.JS
 * Fonte Ãºnica de verdade de todos os cursos da plataforma.
 *
 * COMO ADICIONAR UM NOVO CURSO:
 *   1. Copie um objeto do array abaixo
 *   2. Preencha todos os campos
 *   3. Defina active: true
 *   4. FaÃ§a push no GitHub
 *   Pronto! O curso aparece automaticamente em todo o portal.
 *
 * COMO DESATIVAR UM CURSO (sem apagar):
 *   Mude active: true  â  active: false
 *
 * CAMPOS OBRIGATÃRIOS:
 *   id          â chave Ãºnica curta (ex: 'tp', 'ni', 'gp')
 *   name        â nome completo exibido na plataforma
 *   desc        â descriÃ§Ã£o curta (1-2 linhas)
 *   file        â nome do arquivo HTML (ex: 'dominando-trafego-pago.html')
 *   cat         â categoria (deve bater com uma entrada em CATS abaixo)
 *   modules     â nÃºmero total de mÃ³dulos
 *   topics      â nÃºmero total de tÃ³picos
 *   hours       â carga horÃ¡ria estimada
 *   quizzes     â nÃºmero de quizzes
 *   salt        â salt do SHA-256 para autenticaÃ§Ã£o (definido no arquivo do curso)
 *   ak          â chave de acesso no localStorage (ex: 'tp_auth')
 *   storagePrefix â prefixo usado pelo curso para salvar progresso (ex: 'dt_')
 *   icon        â emoji representativo do curso
 *   color       â cor principal em hex (usada em grÃ¡ficos e progresso)
 *   addedTs     â timestamp Unix em ms da data de lanÃ§amento
 *   active      â true = visÃ­vel | false = oculto em todo o portal
 *
 * CAMPOS OPCIONAIS:
 *   free        â true = acesso gratuito sem cÃ³digo (padrÃ£o: false)
 * ============================================================
 */

var MA_COURSES = [

  /* ââââââââââââââââââââââââââââââââââââââââââ
     CURSOS PRINCIPAIS (requerem cÃ³digo de acesso)
  ââââââââââââââââââââââââââââââââââââââââââ */

  {
    id: 'tp',
    name: 'Dominando TrÃ¡fego Pago',
    desc: 'De zero a gestor de elite. Meta Ads, Google Ads, criativos e escala.',
    file: 'dominando-trafego-pago.html',
    cat: 'NegÃ³cios',
    modules: 117,
    topics: 819,
    hours: 234,
    quizzes: 117,
    salt: 'TP_HENRY_2026_MASTER',
    ak: 'tp_auth',
    storagePrefix: 'dt_',
    icon: 'ð',
    color: '#5b7fff',
    addedTs: 1741996800000,
    active: false
  },

  {
    id: 'ni',
    name: 'NegÃ³cios Inteligentes',
    desc: 'Mentalidade, marketing digital, vendas, dropshipping, IA e finanÃ§as.',
    file: 'negocios-inteligentes.html',
    cat: 'NegÃ³cios',
    modules: 197,
    topics: 1379,
    hours: 462,
    quizzes: 197,
    salt: 'NI_HENRY_2026_MASTER',
    ak: 'ni_auth',
    storagePrefix: 'ni_',
    icon: 'ð¼',
    color: '#a855f7',
    addedTs: 1742256000000,
    active: true
  },

  {
    id: 'gp',
    name: 'GeopolÃ­tica AvanÃ§ada',
    desc: 'Entenda o mundo como ele funciona. Teoria, conflitos e economia global.',
    file: 'geopolitica-curso.html',
    cat: 'GeopolÃ­tica',
    modules: 27,
    topics: 271,
    hours: 90,
    quizzes: 27,
    salt: 'GP_HENRY_2026_MASTER',
    ak: 'gp_auth',
    storagePrefix: 'geo_',
    icon: 'ð',
    color: '#22c55e',
    addedTs: 1742688000000,
    active: true
  },

  {
    id: 'nl',
    name: 'Nichos Lucrativos',
    desc: 'O guia definitivo para encontrar e dominar nichos lucrativos.',
    file: 'nichos-lucrativos.html',
    cat: 'NegÃ³cios',
    modules: 97,
    topics: 679,
    hours: 165,
    quizzes: 97,
    salt: 'NL_HENRY_2026_MASTER',
    ak: 'nl_auth',
    storagePrefix: 'nl_',
    icon: 'ð¡',
    color: '#f59e0b',
    addedTs: 1743033600000,
    active: true
  },

  {
    id: 'mp',
    name: 'Mestre em PersuasÃ£o',
    desc: 'Domine a arte de influenciar. Psicologia, comunicaÃ§Ã£o e copywriting.',
    file: 'mestre-em-persuasao.html',
    cat: 'PNL',
    modules: 217,
    topics: 1522,
    hours: 508,
    quizzes: 217,
    salt: 'MP_HENRY_2026_MASTER',
    ak: 'mp_auth',
    storagePrefix: 'mp_',
    icon: 'ð¯',
    color: '#ec4899',
    addedTs: 1743206400000,
    active: true
  },

  {
    id: 'pb',
    name: 'PolÃ­tica Brasileira',
    desc: 'Do zero ao avanÃ§ado. Sistema polÃ­tico, ConstituiÃ§Ã£o, eleiÃ§Ãµes, poderes e cenÃ¡rio atual.',
    file: 'politica-brasileira.html',
    cat: 'GeopolÃ­tica',
    modules: 17,
    topics: 119,
    hours: 42,
    quizzes: 17,
    salt: 'PB_HENRY_2026_MASTER',
    ak: 'pb_auth',
    storagePrefix: 'pb_',
    icon: 'ðï¸',
    color: '#3B82F6',
    addedTs: 1743400000000,
    active: true
  },

  /* ââââââââââââââââââââââââââââââââââââââââââ
     NOTÃCIAS / CONTEÃDO GRATUITO
  ââââââââââââââââââââââââââââââââââââââââââ */

  {
    id: 'bm',
    name: 'Caso Banco Master',
    desc: 'A maior fraude bancÃ¡ria do Brasil. R$52bi, CPI e delaÃ§Ã£o premiada.',
    file: 'caso-banco-master.html',
    cat: 'Atualize-se! NotÃ­cias Mais Relevantes da Semana',
    modules: 7,
    topics: 7,
    hours: 1,
    quizzes: 0,
    salt: 'FREE',
    ak: 'free',
    storagePrefix: 'bm_',
    icon: 'ð¦',
    color: '#ef4444',
    free: true,
    addedTs: 1743264000000,
    active: true
  },

  {
    id: 'ii',
    name: 'Guerra Israel x IrÃ£',
    desc: 'O conflito que mudou o mundo. De 2025 Ã  escalada de 2026.',
    file: 'guerra-israel-ira.html',
    cat: 'Atualize-se! NotÃ­cias Mais Relevantes da Semana',
    modules: 7,
    topics: 7,
    hours: 1,
    quizzes: 0,
    salt: 'FREE',
    ak: 'free',
    storagePrefix: 'ii_',
    icon: 'âï¸',
    color: '#f97316',
    free: true,
    addedTs: 1743292800000,
    active: true
  },

  {
    id: 'cp',
    name: 'Copa do Mundo 2026',
    desc: 'Tudo sobre o maior evento esportivo do mundo. AnÃ¡lise completa.',
    file: 'copa-do-mundo-2026.html',
    cat: 'Atualize-se! NotÃ­cias Mais Relevantes da Semana',
    modules: 7,
    topics: 7,
    hours: 1,
    quizzes: 0,
    salt: 'FREE',
    ak: 'free',
    storagePrefix: 'cp_',
    icon: 'â½',
    color: '#10b981',
    free: true,
    addedTs: 1743350400000,
    active: true
  }

  /*
   * ââââââââââââââââââââââââââââââââââââââââââ
   * TEMPLATE PARA NOVO CURSO â copie e cole abaixo:
   *
   * ,{
   *   id: 'xx',
   *   name: 'Nome do Curso',
   *   desc: 'DescriÃ§Ã£o curta e objetiva.',
   *   file: 'nome-do-arquivo.html',
   *   cat: 'NegÃ³cios',
   *   modules: 0,
   *   topics: 0,
   *   hours: 0,
   *   quizzes: 0,
   *   salt: 'XX_HENRY_2026_MASTER',
   *   ak: 'xx_auth',
   *   storagePrefix: 'xx_',
   *   icon: 'ð',
   *   color: '#4b8bff',
   *   addedTs: Date.now(),
   *   active: true
   * }
   * ââââââââââââââââââââââââââââââââââââââââââ
   */
];

/* ============================================================
   CATEGORIAS DO PORTAL
   Para adicionar nova categoria: copie um objeto e adicione no array.
   O campo 'courses' Ã© preenchido automaticamente â nÃ£o edite.
   soon[] = cursos futuros exibidos como "Em breve"
   ============================================================ */
var MA_CATS = [
  {name:'Atualize-se! NotÃ­cias Mais Relevantes da Semana', sub:'Os acontecimentos mais relevantes do momento explicados em detalhes', courses:[], soon:['EleiÃ§Ãµes 2026: Em Quem Votar?'], isSpecial:true},
  {name:'NegÃ³cios', sub:'Aqui vocÃª encontra as aulas exclusivas do Matheus Academy', courses:[], soon:[]},
  {name:'GeopolÃ­tica', sub:'Entenda o mundo como ele realmente funciona, alÃ©m das notÃ­cias', courses:[], soon:['RelaÃ§Ãµes Internacionais']},
  {name:'PNL', sub:'Domine a arte de comunicar, persuadir e influenciar pessoas', courses:[], soon:['TÃ©cnicas de PersuasÃ£o','OratÃ³ria e ComunicaÃ§Ã£o Assertiva','PNL â ProgramaÃ§Ã£o NeurolinguÃ­stica']},
  {name:'Desenvolvimento', sub:'Transforme sua mentalidade e atinja o prÃ³ximo nÃ­vel', courses:[], soon:['InteligÃªncia Emocional na PrÃ¡tica','Produtividade e GestÃ£o do Tempo','LideranÃ§a']},
  {name:'Tecnologia', sub:'A tecnologia chegou para ficar â aprenda a lucrar com ela', courses:[], soon:['InteligÃªncia Artificial na PrÃ¡tica','ProgramaÃ§Ã£o para Iniciantes','AutomaÃ§Ã£o Digital']},
  {name:'Psicologia', sub:'Compreenda o comportamento humano e use isso a seu favor', courses:[], soon:['Psicologia Comportamental','NeurociÃªncia e Comportamento','Psicologia das RelaÃ§Ãµes']},
  {name:'HistÃ³ria', sub:'Quem nÃ£o conhece a histÃ³ria estÃ¡ condenado a repeti-la', courses:[], soon:['HistÃ³ria do Brasil Completa','Grandes CivilizaÃ§Ãµes Antigas','HistÃ³ria ContemporÃ¢nea']},
  {name:'Filosofia', sub:'Pense melhor, decida melhor, viva melhor', courses:[], soon:['Filosofia para a Vida Real','Grandes FilÃ³sofos da HistÃ³ria','Ãtica e Pensamento CrÃ­tico']},
  {name:'InglÃªs', sub:'O idioma que abre portas no mundo inteiro', courses:[], soon:['InglÃªs do Zero ao Fluente','Business English','InglÃªs para Viagens']},
  {name:'BÃ­blia / Teologia', sub:'Aprofunde sua fÃ© com estudo sÃ©rio e contextualizado', courses:[], soon:['Estudo BÃ­blico Completo','Teologia SistemÃ¡tica','Panorama do Antigo Testamento']},
  {name:'Biografias', sub:'Aprenda com quem construiu histÃ³ria e mudou o mundo', courses:[], soon:['LÃ­deres que Mudaram o Mundo','Empreendedores VisionÃ¡rios','GÃªnios da CiÃªncia']},
  {name:'Engenharia', sub:'Conhecimento tÃ©cnico de alta precisÃ£o e aplicaÃ§Ã£o real', courses:[], soon:['InstalaÃ§Ãµes HidrÃ¡ulicas e GÃ¡s','Fundamentos de Engenharia Civil','Projetos Estruturais']},
  {name:'MecÃ¢nica', sub:'Do bÃ¡sico ao avanÃ§ado em manutenÃ§Ã£o e diagnÃ³stico automotivo', courses:[], soon:['MecÃ¢nica BÃ¡sica Automotiva','DiagnÃ³stico e ManutenÃ§Ã£o','ElÃ©trica Automotiva']},
  {name:'ð Ebooks', sub:'Materiais de leitura aprofundados sobre os temas que mais importam', courses:[], soon:['China x EUA','Israel x IrÃ£','Devocional 2026','Estamos PrÃ³ximos do Fim?'], isEbook:true}
];

/* ============================================================
   TRILHAS DE APRENDIZADO
   Trilhas agrupam cursos por objetivo de aprendizado.
   Para adicionar curso em uma trilha: use o id do curso (campo id do MA_COURSES).
   O sistema busca nome, file e icon automaticamente pelo id.
   ============================================================ */
var MA_TRAILS = [
  {
    id: 'empreendedor',
    icon: 'ð',
    color: 'rgba(91,127,255,.1)',
    borderColor: 'rgba(91,127,255,.4)',
    name: 'Trilha Empreendedor Digital',
    desc: 'Do zero ao negÃ³cio digital lucrativo. Aprenda trÃ¡fego pago, negÃ³cios inteligentes e nichos lucrativos na sequÃªncia ideal para empreender online.',
    badge: 'ð Empreendedor Digital',
    courseIds: ['tp', 'ni', 'nl']
  },
  {
    id: 'estrategista',
    icon: 'ð',
    color: 'rgba(34,197,94,.1)',
    borderColor: 'rgba(34,197,94,.35)',
    name: 'Trilha Estrategista Global',
    desc: 'Entenda o mundo como ele funciona e use esse conhecimento nos seus negÃ³cios. GeopolÃ­tica + NegÃ³cios Inteligentes para uma visÃ£o estratÃ©gica completa.',
    badge: 'ð Estrategista Global',
    courseIds: ['gp', 'ni']
  },
  {
    id: 'cidadao',
    icon: 'ðï¸',
    color: 'rgba(59,130,246,.1)',
    borderColor: 'rgba(59,130,246,.35)',
    name: 'Trilha CidadÃ£o Consciente',
    desc: 'Entenda como o Brasil funciona por dentro. PolÃ­tica Brasileira + GeopolÃ­tica AvanÃ§ada para uma visÃ£o crÃ­tica e estratÃ©gica do mundo e do seu paÃ­s.',
    badge: 'ðï¸ CidadÃ£o Consciente',
    courseIds: ['pb', 'gp']
  },
  {
    id: 'completa',
    icon: 'ð',
    color: 'rgba(245,158,11,.1)',
    borderColor: 'rgba(245,158,11,.35)',
    name: 'Trilha Completa Matheus Academy',
    desc: 'O percurso definitivo. Todos os cursos principais em sequÃªncia lÃ³gica para quem quer dominar trÃ¡fego, negÃ³cios, geopolÃ­tica, polÃ­tica, persuasÃ£o e nichos.',
    badge: 'ð Mestre Academy',
    courseIds: ['tp', 'ni', 'gp', 'pb', 'nl', 'mp']
  }
];

/* ============================================================
   UTILITÃRIOS GLOBAIS
   FunÃ§Ãµes auxiliares disponÃ­veis para todas as pÃ¡ginas.
   ============================================================ */

/** Retorna apenas os cursos ativos */
function MA_getActiveCourses() {
  return MA_COURSES.filter(function(c) { return c.active !== false; });
}

/** Busca um curso pelo id */
function MA_getCourseById(id) {
  return MA_COURSES.find(function(c) { return c.id === id; }) || null;
}

/** Monta as categorias com os cursos ativos distribuÃ­dos */
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

/** Monta as trilhas resolvendo os cursos pelos ids */
function MA_buildTrails() {
  return MA_TRAILS.map(function(trail) {
    var resolved = [];
    trail.courseIds.forEach(function(cid) {
      var c = MA_getCourseById(cid);
      if (c && c.active !== false) resolved.push({ key: c.id, icon: c.icon, name: c.name, file: c.file });
    });
    return {
      id: trail.id, icon: trail.icon, color: trail.color, borderColor: trail.borderColor,
      name: trail.name, desc: trail.desc, badge: trail.badge, courses: resolved
    };
  });
}
