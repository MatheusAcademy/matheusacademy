/**
 * ============================================================
 * MATHEUS ACADEMY Ã¢ÂÂ COURSES.JS
 * Fonte ÃÂºnica de verdade de todos os cursos da plataforma.
 *
 * COMO ADICIONAR UM NOVO CURSO:
 *   1. Copie um objeto do array abaixo
 *   2. Preencha todos os campos
 *   3. Defina active: true
 *   4. FaÃÂ§a push no GitHub
 *   Pronto! O curso aparece automaticamente em todo o portal.
 *
 * COMO DESATIVAR UM CURSO (sem apagar):
 *   Mude active: true  Ã¢ÂÂ  active: false
 *
 * CAMPOS OBRIGATÃÂRIOS:
 *   id          Ã¢ÂÂ chave ÃÂºnica curta (ex: 'tp', 'ni', 'gp')
 *   name        Ã¢ÂÂ nome completo exibido na plataforma
 *   desc        Ã¢ÂÂ descriÃÂ§ÃÂ£o curta (1-2 linhas)
 *   file        Ã¢ÂÂ nome do arquivo HTML (ex: 'dominando-trafego-pago.html')
 *   cat         Ã¢ÂÂ categoria (deve bater com uma entrada em CATS abaixo)
 *   modules     Ã¢ÂÂ nÃÂºmero total de mÃÂ³dulos
 *   topics      Ã¢ÂÂ nÃÂºmero total de tÃÂ³picos
 *   hours       Ã¢ÂÂ carga horÃÂ¡ria estimada
 *   quizzes     Ã¢ÂÂ nÃÂºmero de quizzes
 *   salt        Ã¢ÂÂ salt do SHA-256 para autenticaÃÂ§ÃÂ£o (definido no arquivo do curso)
 *   ak          Ã¢ÂÂ chave de acesso no localStorage (ex: 'tp_auth')
 *   storagePrefix Ã¢ÂÂ prefixo usado pelo curso para salvar progresso (ex: 'dt_')
 *   icon        Ã¢ÂÂ emoji representativo do curso
 *   color       Ã¢ÂÂ cor principal em hex (usada em grÃÂ¡ficos e progresso)
 *   addedTs     Ã¢ÂÂ timestamp Unix em ms da data de lanÃÂ§amento
 *   active      Ã¢ÂÂ true = visÃÂ­vel | false = oculto em todo o portal
 *
 * CAMPOS OPCIONAIS:
 *   free        Ã¢ÂÂ true = acesso gratuito sem cÃÂ³digo (padrÃÂ£o: false)
 * ============================================================
 */

var MA_COURSES = [

  /* Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
     CURSOS PRINCIPAIS (requerem cÃÂ³digo de acesso)
  Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ */

  {
    id: 'tp',
    name: 'Dominando TrÃÂ¡fego Pago',
    desc: 'De zero a gestor de elite. Meta Ads, Google Ads, criativos e escala.',
    file: 'dominando-trafego-pago.html',
    cat: 'NegÃÂ³cios',
    modules: 117,
    topics: 819,
    hours: 234,
    quizzes: 117,
    salt: 'TP_HENRY_2026_MASTER',
    ak: 'tp_auth',
    storagePrefix: 'dt_',
    icon: 'Ã°ÂÂÂ',
    color: '#5b7fff',
    addedTs: 1741996800000,
    active: true
  },

  {
    id: 'ni',
    name: 'NegÃÂ³cios Inteligentes',
    desc: 'Mentalidade, marketing digital, vendas, dropshipping, IA e finanÃÂ§as.',
    file: 'negocios-inteligentes.html',
    cat: 'NegÃÂ³cios',
    modules: 197,
    topics: 1379,
    hours: 462,
    quizzes: 197,
    salt: 'NI_HENRY_2026_MASTER',
    ak: 'ni_auth',
    storagePrefix: 'ni_',
    icon: 'Ã°ÂÂÂ¼',
    color: '#a855f7',
    addedTs: 1742256000000,
    active: true
  },

  {
    id: 'gp',
    name: 'GeopolÃÂ­tica AvanÃÂ§ada',
    desc: 'Entenda o mundo como ele funciona. Teoria, conflitos e economia global.',
    file: 'geopolitica-curso.html',
    cat: 'GeopolÃÂ­tica',
    modules: 27,
    topics: 271,
    hours: 90,
    quizzes: 27,
    salt: 'GP_HENRY_2026_MASTER',
    ak: 'gp_auth',
    storagePrefix: 'geo_',
    icon: 'Ã°ÂÂÂ',
    color: '#22c55e',
    addedTs: 1742688000000,
    active: true
  },

  {
    id: 'nl',
    name: 'Nichos Lucrativos',
    desc: 'O guia definitivo para encontrar e dominar nichos lucrativos.',
    file: 'nichos-lucrativos.html',
    cat: 'NegÃÂ³cios',
    modules: 97,
    topics: 679,
    hours: 165,
    quizzes: 97,
    salt: 'NL_HENRY_2026_MASTER',
    ak: 'nl_auth',
    storagePrefix: 'nl_',
    icon: 'Ã°ÂÂÂ¡',
    color: '#f59e0b',
    addedTs: 1743033600000,
    active: true
  },

  {
    id: 'mp',
    name: 'Mestre em PersuasÃÂ£o',
    desc: 'Domine a arte de influenciar. Psicologia, comunicaÃÂ§ÃÂ£o e copywriting.',
    file: 'mestre-em-persuasao.html',
    cat: 'PNL',
    modules: 217,
    topics: 1522,
    hours: 508,
    quizzes: 217,
    salt: 'MP_HENRY_2026_MASTER',
    ak: 'mp_auth',
    storagePrefix: 'mp_',
    icon: 'Ã°ÂÂÂ¯',
    color: '#ec4899',
    addedTs: 1743206400000,
    active: true
  },

  {
    id: 'pb',
    name: 'PolÃÂ­tica Brasileira',
    desc: 'Do zero ao avanÃÂ§ado. Sistema polÃÂ­tico, ConstituiÃÂ§ÃÂ£o, eleiÃÂ§ÃÂµes, poderes e cenÃÂ¡rio atual.',
    file: 'politica-brasileira.html',
    cat: 'GeopolÃÂ­tica',
    modules: 17,
    topics: 119,
    hours: 42,
    quizzes: 17,
    salt: 'PB_HENRY_2026_MASTER',
    ak: 'pb_auth',
    storagePrefix: 'pb_',
    icon: 'Ã°ÂÂÂÃ¯Â¸Â',
    color: '#3B82F6',
    addedTs: 1743400000000,
    active: true
  },

  /* Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
     NOTÃÂCIAS / CONTEÃÂDO GRATUITO
  Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ */

  {
    id: 'bm',
    name: 'Caso Banco Master',
    desc: 'A maior fraude bancÃÂ¡ria do Brasil. R$52bi, CPI e delaÃÂ§ÃÂ£o premiada.',
    file: 'caso-banco-master.html',
    cat: 'Atualize-se! NotÃÂ­cias Mais Relevantes da Semana',
    modules: 7,
    topics: 7,
    hours: 1,
    quizzes: 0,
    salt: 'FREE',
    ak: 'free',
    storagePrefix: 'bm_',
    icon: 'Ã°ÂÂÂ¦',
    color: '#ef4444',
    free: true,
    addedTs: 1743264000000,
    active: true
  },

  {
    id: 'ii',
    name: 'Guerra Israel x IrÃÂ£',
    desc: 'O conflito que mudou o mundo. De 2025 ÃÂ  escalada de 2026.',
    file: 'guerra-israel-ira.html',
    cat: 'Atualize-se! NotÃÂ­cias Mais Relevantes da Semana',
    modules: 7,
    topics: 7,
    hours: 1,
    quizzes: 0,
    salt: 'FREE',
    ak: 'free',
    storagePrefix: 'ii_',
    icon: 'Ã¢ÂÂÃ¯Â¸Â',
    color: '#f97316',
    free: true,
    addedTs: 1743292800000,
    active: true
  },

  {
    id: 'cp',
    name: 'Copa do Mundo 2026',
    desc: 'Tudo sobre o maior evento esportivo do mundo. AnÃÂ¡lise completa.',
    file: 'copa-do-mundo-2026.html',
    cat: 'Atualize-se! NotÃÂ­cias Mais Relevantes da Semana',
    modules: 7,
    topics: 7,
    hours: 1,
    quizzes: 0,
    salt: 'FREE',
    ak: 'free',
    storagePrefix: 'cp_',
    icon: 'Ã¢ÂÂ½',
    color: '#10b981',
    free: true,
    addedTs: 1743350400000,
    active: true
  }

  /*
   * Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
   * TEMPLATE PARA NOVO CURSO Ã¢ÂÂ copie e cole abaixo:
   *
   * ,{
   *   id: 'xx',
   *   name: 'Nome do Curso',
   *   desc: 'DescriÃÂ§ÃÂ£o curta e objetiva.',
   *   file: 'nome-do-arquivo.html',
   *   cat: 'NegÃÂ³cios',
   *   modules: 0,
   *   topics: 0,
   *   hours: 0,
   *   quizzes: 0,
   *   salt: 'XX_HENRY_2026_MASTER',
   *   ak: 'xx_auth',
   *   storagePrefix: 'xx_',
   *   icon: 'Ã°ÂÂÂ',
   *   color: '#4b8bff',
   *   addedTs: Date.now(),
   *   active: true
   * }
   * Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
   */
];

/* ============================================================
   CATEGORIAS DO PORTAL
   Para adicionar nova categoria: copie um objeto e adicione no array.
   O campo 'courses' ÃÂ© preenchido automaticamente Ã¢ÂÂ nÃÂ£o edite.
   soon[] = cursos futuros exibidos como "Em breve"
   ============================================================ */
var MA_CATS = [
  {name:'Atualize-se! NotÃÂ­cias Mais Relevantes da Semana', sub:'Os acontecimentos mais relevantes do momento explicados em detalhes', courses:[], soon:['EleiÃÂ§ÃÂµes 2026: Em Quem Votar?'], isSpecial:true},
  {name:'NegÃÂ³cios', sub:'Aqui vocÃÂª encontra as aulas exclusivas do Matheus Academy', courses:[], soon:[]},
  {name:'GeopolÃÂ­tica', sub:'Entenda o mundo como ele realmente funciona, alÃÂ©m das notÃÂ­cias', courses:[], soon:['RelaÃÂ§ÃÂµes Internacionais']},
  {name:'PNL', sub:'Domine a arte de comunicar, persuadir e influenciar pessoas', courses:[], soon:['TÃÂ©cnicas de PersuasÃÂ£o','OratÃÂ³ria e ComunicaÃÂ§ÃÂ£o Assertiva','PNL Ã¢ÂÂ ProgramaÃÂ§ÃÂ£o NeurolinguÃÂ­stica']},
  {name:'Desenvolvimento', sub:'Transforme sua mentalidade e atinja o prÃÂ³ximo nÃÂ­vel', courses:[], soon:['InteligÃÂªncia Emocional na PrÃÂ¡tica','Produtividade e GestÃÂ£o do Tempo','LideranÃÂ§a']},
  {name:'Tecnologia', sub:'A tecnologia chegou para ficar Ã¢ÂÂ aprenda a lucrar com ela', courses:[], soon:['InteligÃÂªncia Artificial na PrÃÂ¡tica','ProgramaÃÂ§ÃÂ£o para Iniciantes','AutomaÃÂ§ÃÂ£o Digital']},
  {name:'Psicologia', sub:'Compreenda o comportamento humano e use isso a seu favor', courses:[], soon:['Psicologia Comportamental','NeurociÃÂªncia e Comportamento','Psicologia das RelaÃÂ§ÃÂµes']},
  {name:'HistÃÂ³ria', sub:'Quem nÃÂ£o conhece a histÃÂ³ria estÃÂ¡ condenado a repeti-la', courses:[], soon:['HistÃÂ³ria do Brasil Completa','Grandes CivilizaÃÂ§ÃÂµes Antigas','HistÃÂ³ria ContemporÃÂ¢nea']},
  {name:'Filosofia', sub:'Pense melhor, decida melhor, viva melhor', courses:[], soon:['Filosofia para a Vida Real','Grandes FilÃÂ³sofos da HistÃÂ³ria','ÃÂtica e Pensamento CrÃÂ­tico']},
  {name:'InglÃÂªs', sub:'O idioma que abre portas no mundo inteiro', courses:[], soon:['InglÃÂªs do Zero ao Fluente','Business English','InglÃÂªs para Viagens']},
  {name:'BÃÂ­blia / Teologia', sub:'Aprofunde sua fÃÂ© com estudo sÃÂ©rio e contextualizado', courses:[], soon:['Estudo BÃÂ­blico Completo','Teologia SistemÃÂ¡tica','Panorama do Antigo Testamento']},
  {name:'Biografias', sub:'Aprenda com quem construiu histÃÂ³ria e mudou o mundo', courses:[], soon:['LÃÂ­deres que Mudaram o Mundo','Empreendedores VisionÃÂ¡rios','GÃÂªnios da CiÃÂªncia']},
  {name:'Engenharia', sub:'Conhecimento tÃÂ©cnico de alta precisÃÂ£o e aplicaÃÂ§ÃÂ£o real', courses:[], soon:['InstalaÃÂ§ÃÂµes HidrÃÂ¡ulicas e GÃÂ¡s','Fundamentos de Engenharia Civil','Projetos Estruturais']},
  {name:'MecÃÂ¢nica', sub:'Do bÃÂ¡sico ao avanÃÂ§ado em manutenÃÂ§ÃÂ£o e diagnÃÂ³stico automotivo', courses:[], soon:['MecÃÂ¢nica BÃÂ¡sica Automotiva','DiagnÃÂ³stico e ManutenÃÂ§ÃÂ£o','ElÃÂ©trica Automotiva']},
  {name:'Ã°ÂÂÂ Ebooks', sub:'Materiais de leitura aprofundados sobre os temas que mais importam', courses:[], soon:['China x EUA','Israel x IrÃÂ£','Devocional 2026','Estamos PrÃÂ³ximos do Fim?'], isEbook:true}
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
    icon: 'Ã°ÂÂÂ',
    color: 'rgba(91,127,255,.1)',
    borderColor: 'rgba(91,127,255,.4)',
    name: 'Trilha Empreendedor Digital',
    desc: 'Do zero ao negÃÂ³cio digital lucrativo. Aprenda trÃÂ¡fego pago, negÃÂ³cios inteligentes e nichos lucrativos na sequÃÂªncia ideal para empreender online.',
    badge: 'Ã°ÂÂÂ Empreendedor Digital',
    courseIds: ['tp', 'ni', 'nl']
  },
  {
    id: 'estrategista',
    icon: 'Ã°ÂÂÂ',
    color: 'rgba(34,197,94,.1)',
    borderColor: 'rgba(34,197,94,.35)',
    name: 'Trilha Estrategista Global',
    desc: 'Entenda o mundo como ele funciona e use esse conhecimento nos seus negÃÂ³cios. GeopolÃÂ­tica + NegÃÂ³cios Inteligentes para uma visÃÂ£o estratÃÂ©gica completa.',
    badge: 'Ã°ÂÂÂ Estrategista Global',
    courseIds: ['gp', 'ni']
  },
  {
    id: 'cidadao',
    icon: 'Ã°ÂÂÂÃ¯Â¸Â',
    color: 'rgba(59,130,246,.1)',
    borderColor: 'rgba(59,130,246,.35)',
    name: 'Trilha CidadÃÂ£o Consciente',
    desc: 'Entenda como o Brasil funciona por dentro. PolÃÂ­tica Brasileira + GeopolÃÂ­tica AvanÃÂ§ada para uma visÃÂ£o crÃÂ­tica e estratÃÂ©gica do mundo e do seu paÃÂ­s.',
    badge: 'Ã°ÂÂÂÃ¯Â¸Â CidadÃÂ£o Consciente',
    courseIds: ['pb', 'gp']
  },
  {
    id: 'completa',
    icon: 'Ã°ÂÂÂ',
    color: 'rgba(245,158,11,.1)',
    borderColor: 'rgba(245,158,11,.35)',
    name: 'Trilha Completa Matheus Academy',
    desc: 'O percurso definitivo. Todos os cursos principais em sequÃÂªncia lÃÂ³gica para quem quer dominar trÃÂ¡fego, negÃÂ³cios, geopolÃÂ­tica, polÃÂ­tica, persuasÃÂ£o e nichos.',
    badge: 'Ã°ÂÂÂ Mestre Academy',
    courseIds: ['tp', 'ni', 'gp', 'pb', 'nl', 'mp']
  }
];

/* ============================================================
   UTILITÃÂRIOS GLOBAIS
   FunÃÂ§ÃÂµes auxiliares disponÃÂ­veis para todas as pÃÂ¡ginas.
   ============================================================ */

/** Retorna apenas os cursos ativos */
function MA_getActiveCourses() {
  return MA_COURSES.filter(function(c) { return c.active !== false; });
}

/** Busca um curso pelo id */
function MA_getCourseById(id) {
  return MA_COURSES.find(function(c) { return c.id === id; }) || null;
}

/** Monta as categorias com os cursos ativos distribuÃÂ­dos */
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
