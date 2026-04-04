#!/usr/bin/env python3
"""
Matheus Academy — Gerador Automático de Capas IA
Detecta novos cursos no courses.js, gera capas com DALL-E 3 e salva em assets/capas/
"""

import os
import re
import json
import subprocess
import requests
import time
from pathlib import Path

# ── CONFIGURAÇÃO ───────────────────────────────────────────────────────────────
OPENAI_KEY    = os.environ.get('OPENAI_API_KEY', '')
COURSES_FILE  = 'data/courses.js'
CAPAS_DIR     = Path('assets/capas')
QUALITY       = 'hd'       # 'standard' (~$0.04) ou 'hd' (~$0.08)
SIZE          = '1792x1024' # 16:9
STYLE         = 'vivid'    # 'vivid' (dramático) ou 'natural' (realista)
DELAY_ENTRE   = 3          # segundos entre gerações (evita rate limit)

# ── TEMPLATES DE PROMPT POR CATEGORIA ─────────────────────────────────────────
# Cada categoria tem um prompt-base cinematográfico no padrão solicitado
PROMPTS_POR_CATEGORIA = {
    'Geopolítica': {
        'base': 'global geopolitics world power conflicts chess game of nations',
        'visual': 'shadowy silhouette of powerful figure before glowing world map, chess pieces as nations, war room with screens',
        'lighting': 'dramatic gold and navy blue cinematic lighting, volumetric fog, deep shadows',
        'mood': 'mysterious intense documentary Netflix-style'
    },
    'Atualize-se! Notícias Mais Relevantes da Semana': {
        'base': 'breaking news urgent current events journalism investigation',
        'visual': 'dramatic newsroom atmosphere, glowing screens with headlines, tension in the air',
        'lighting': 'cinematic red and white news lighting, urgent atmosphere, spotlight on subject',
        'mood': 'urgent investigative documentary Netflix breaking news style'
    },
    'Negócios': {
        'base': 'business success financial growth entrepreneurship money strategy',
        'visual': 'dramatic business environment, financial charts, professional silhouette commanding success',
        'lighting': 'cinematic gold and dark blue business lighting, volumetric success glow',
        'mood': 'powerful entrepreneurial documentary Netflix wealthy success style'
    },
    'PNL': {
        'base': 'psychology influence persuasion NLP neurolinguistic programming mind power',
        'visual': 'glowing human brain with neural pathways, psychological influence, chess pieces, mind map',
        'lighting': 'dramatic purple violet bioluminescent brain glow, absolute darkness contrast',
        'mood': 'mysterious intellectual psychology documentary Netflix dark mind style'
    },
    'Desenvolvimento': {
        'base': 'personal development human potential growth mindset transformation',
        'visual': 'silhouette of person transforming, glowing energy emanating, journey metaphor',
        'lighting': 'cinematic warm golden transformation light, volumetric growth glow, darkness to light',
        'mood': 'inspiring transformational human potential documentary Netflix style'
    },
    'Tecnologia': {
        'base': 'technology digital innovation artificial intelligence future tech',
        'visual': 'futuristic digital environment, glowing interfaces, tech silhouette commanding data',
        'lighting': 'electric blue and cyan digital lighting, holographic glow, dark tech atmosphere',
        'mood': 'futuristic innovative tech documentary Netflix digital style'
    },
    '_default': {
        'base': 'educational course learning knowledge expertise mastery',
        'visual': 'dramatic symbolic representation of expertise, powerful visual metaphor, light of knowledge',
        'lighting': 'cinematic dramatic lighting, strong contrast, atmospheric depth',
        'mood': 'authoritative expert educational documentary Netflix style'
    }
}

# Prompts específicos para cursos já conhecidos (prioridade sobre categoria)
PROMPTS_ESPECIFICOS = {
    'gp': '''Ultra realistic cinematic Netflix-style thumbnail, 8K photorealistic.
TITLE TEXT overlaid on image: bold white glowing text "GEOPOLITICA AVANCADA" at bottom third.
Main scene: dramatic war room at night — shadowy silhouette of a powerful leader standing before a massive illuminated world map on wall, chess pieces as nations (USA flag, China flag, Russia flag pieces) on dark oak table, classified documents scattered. Real world map showing tension zones glowing red: Middle East, Ukraine, Taiwan.
Logos/flags: USA flag, China flag, Russia flag visible as chess piece symbols.
Real data overlaid: "27 MODULOS • 271 TOPICOS • 90 HORAS".
Lighting: volumetric gold cinematic fog, god rays through venetian blinds, dramatic shadows, film noir atmosphere.
Color grading: dark gold, deep navy blue, high contrast. DOF bokeh background. Ultra sharp foreground.
NO cartoon, NO flat design, PHOTOREALISTIC only.''',

    'bm': '''Ultra realistic cinematic crime documentary Netflix-style thumbnail, 8K photorealistic.
TITLE TEXT overlaid: bold red glowing text "CASO BANCO MASTER" center-bottom, "R$52 BILHOES" in yellow above.
Main scene: burning Brazilian bank vault cracked open, stacks of real Brazilian reais (R$) banknotes on fire inside, police investigation tape "POLICIA FEDERAL" across frame, CPI congressional hearing gavel, newspaper headlines "FRAUDE BANCARIA" visible.
Real logos: Banco Master logo on cracked wall, CPI Brazil seal, STF symbol.
Real numbers: "R$52.000.000.000" burning in the scene.
Lighting: emergency red sirens flashing, fire orange glow from vault, smoke, volumetric emergency lighting.
Color grading: cinematic deep red and dark charcoal, high contrast investigative documentary style.
NO cartoon, PHOTOREALISTIC crime scene only.''',

    'ii': '''Ultra realistic cinematic war documentary Netflix-style thumbnail, 8K photorealistic.
TITLE TEXT overlaid: "ISRAEL x IRA" bold white text center, "GUERRA 2025" below in red.
Main scene: split composition — left side Israeli flag waving over Jerusalem skyline with Iron Dome missiles, right side Iranian flag over Tehran with ballistic missiles launching, massive explosion of light erupting at center between both nations, smoke and fire.
Real flags: Israel Star of David flag (blue white), Iran flag (green white red with emblem) both clearly visible and realistic.
Real landmarks: Dome of the Rock Jerusalem left, Tehran Milad Tower right silhouette.
Lighting: split orange explosion center, cold blue left Israel side, hot red right Iran side, volumetric war smoke.
Color grading: cinematic split complementary, high contrast war journalism style.
NO cartoon, PHOTOREALISTIC flags and landmarks.''',

    'cp': '''Ultra realistic cinematic sports Netflix-style thumbnail, 8K photorealistic.
TITLE TEXT overlaid: "COPA DO MUNDO 2026" bold gold glowing text top, "O HEXA VEM?" in green bottom.
Main scene: FIFA World Cup golden trophy in dramatic spotlight on stadium grass, massive 80000 crowd stadium background blurred bokeh lights, Brazilian green-yellow flag waves prominently, USA Mexico Canada host nation flags visible in crowd, confetti falling.
Real elements: Official FIFA World Cup 2026 trophy design (realistic gold metallic), Brazilian flag (green yellow diamond blue circle stars), stadium Metlife USA silhouette.
Real data: "48 SELECOES • 104 JOGOS • 3 PAISES" overlaid in small text.
Lighting: single dramatic spotlight from above creating golden halo on trophy, stadium flood lights bokeh background, volumetric fog on grass.
Color grading: cinematic gold and deep midnight blue, epic sports documentary style.
NO cartoon, PHOTOREALISTIC trophy and flags.''',

    'bc': '''Ultra realistic cinematic financial revolution Netflix-style thumbnail, 8K photorealistic.
TITLE TEXT overlaid: "BITCOIN" massive bold orange glowing title top, "A MOEDA QUE MUDOU O MUNDO" white below, "$109.000 ATH" in gold corner.
Main scene: giant golden Bitcoin coin (B symbol) rising like a sun from darkness over crumbling old stone bank buildings, real Bitcoin price chart candlestick going parabolic to $109K ATH overlaid on image, digital light streams replacing old finance.
Real logos: Bitcoin official orange B logo symbol, Bloomberg/Reuters price chart style ticker.
Real data: "$109,000 ATH 2025", "HALVING 2024", "ETF APROVADO" text elements in scene.
Lighting: dramatic volumetric orange gold rays from Bitcoin like sunrise, cold blue neon chart data reflections, crumbling stone bank in dark shadow.
Color grading: cinematic warm gold and electric blue, financial revolution documentary style.
NO cartoon, PHOTOREALISTIC Bitcoin symbol and charts.''',

    'ctp': '''Ultra realistic cinematic entrepreneurship Netflix-style thumbnail, 8K photorealistic.
TITLE TEXT overlaid: "TRAFEGO PAGO" bold blue glowing title, "DOMINANDO OS ADS" below, "ROAS 8.4x" in green corner badge.
Main scene: dark silhouette entrepreneur at curved holographic dashboard showing real Meta Ads, Google Ads, TikTok Ads interfaces with exploding metrics — ROAS 8.4x green arrow up, CTR 4.7%, CPC R$0.38, revenue chart going vertical to the right, digital money particles flowing.
Real platform logos: Meta (Facebook Instagram) blue logo, Google Ads colorful G, TikTok black logo, YouTube red logo visible on holographic screens.
Real metrics displayed: "ROAS 8.4x", "R$ 0,38 CPC", "CTR 4.7%", "CONVERSAO 12.3%" as holographic data.
Lighting: electric blue neon from screens, volumetric digital data streams, dark futuristic command center atmosphere.
Color grading: cinematic electric blue and gold accents, high contrast tech entrepreneurship style.
NO cartoon, PHOTOREALISTIC interfaces and logos.''',

    'ctep': '''Ultra realistic cinematic psychology Netflix-style thumbnail, 8K photorealistic.
TITLE TEXT overlaid: "TECNICAS DE PERSUASAO" bold purple glowing title, "O PODER DA INFLUENCIA" white subtitle.
Main scene: detailed anatomically correct glowing human brain floating in absolute darkness, visible electric purple synaptic lightning bolts firing between neural pathways, chess pieces being moved by invisible hand around the brain representing psychological manipulation, mirror reflections showing different emotional states.
Real psychological concepts as floating text elements: "ESCASSEZ", "RECIPROCIDADE", "PROVA SOCIAL", "AUTORIDADE", "RAPPORT" glowing around brain.
Lighting: bioluminescent violet purple light emanating from brain interior, electric neural spark flashes, absolute black void contrast, mysterious atmosphere.
Color grading: cinematic deep purple and electric violet, extreme high contrast dark psychology documentary style.
NO cartoon, PHOTOREALISTIC brain anatomy and neural effects.''',

    'nlf': '''Ultra realistic cinematic dystopian Netflix-style thumbnail, 8K photorealistic.
TITLE TEXT overlaid: "LEI FELCA" bold red warning title, "CENSURA NO BRASIL" below, "MODELO CHINES" in red alert style.
Main scene: massive digital surveillance eye made of circuit boards and binary code watching through cracked screen, heavy iron padlock chained around glowing fiber optic internet cable, Chinese Great Firewall visual — screens showing "ACESSO NEGADO" "ERROR 403" "CENSURADO" in red, Brazil flag cracked with digital chains overlaid.
Real flags/symbols: Brazil flag (green yellow blue) with cracks and digital chains, China flag (red yellow stars) in background glow, VPN blocked symbol.
Real text elements: "VPN BLOQUEADO", "ACESSO NEGADO 403", "MONITORADO", "FELCA 2025" as warning overlays.
Lighting: red emergency warning light, cold surveillance blue screen glow, dark server room atmosphere, ominous shadows.
Color grading: cinematic crimson red and dark charcoal, dystopian surveillance documentary style.
NO cartoon, PHOTOREALISTIC flags and surveillance elements.''',

    'ie': '''Ultra realistic cinematic human potential Netflix-style thumbnail, 8K photorealistic.
TITLE TEXT overlaid: "INTELIGENCIA EMOCIONAL" bold rose gold glowing title, "DOMINE SUAS EMOCOES" white subtitle.
Main scene: calm human silhouette in meditation pose with luminous anatomically visible glowing heart radiating warm rose gold light outward in visible concentric emotional waves, five pillars of emotional intelligence floating as glowing labels: "AUTOCONHECIMENTO", "AUTOCONTROLE", "EMPATIA", "MOTIVACAO", "HAB. SOCIAIS", serene dark void with floating golden ember particles rising like stars.
Real EQ model: Daniel Goleman 5 pillars visible as holographic text elements around the figure.
Real visual: heartbeat ECG pulse line integrated into composition, brain-heart connection neural light thread.
Lighting: warm bioluminescent rose gold heart glow, volumetric emotional light waves expanding outward, contrasting dark void, warm ember particles.
Color grading: cinematic warm rose gold and deep violet, high contrast human potential documentary style.
NO cartoon, PHOTOREALISTIC human silhouette and effects.'
}


def log(msg, emoji='ℹ️'):
    print(f"{emoji}  {msg}", flush=True)


def montar_prompt(curso_id, curso_nome, curso_desc, curso_cat):
    """Monta o prompt cinematográfico para o curso."""
    
    # 1. Prompt específico (maior prioridade)
    if curso_id in PROMPTS_ESPECIFICOS:
        return PROMPTS_ESPECIFICOS[curso_id]
    
    # 2. Template por categoria
    template = PROMPTS_POR_CATEGORIA.get(curso_cat, PROMPTS_POR_CATEGORIA['_default'])
    
    prompt = f"""Ultra realistic cinematic YouTube thumbnail, dramatic storytelling scene about {curso_nome}: {curso_desc}, {template['base']}, highly detailed, 8K, photorealistic style.
Main subject: symbolic representation (NO real person) — {template['visual']}, realistic lighting and textures.
Scene composition: dynamic angle, subject slightly off-center rule of thirds, foreground and background depth, realistic immersive environment.
Lighting: {template['lighting']}, volumetric light, strong contrast, glow effects, atmospheric depth.
Background: immersive environment related to {curso_nome}, realistic textures, depth blur bokeh, particles, smoke, light rays.
Mood: {template['mood']}, mysterious, intense, high value.
Color grading: cinematic high contrast, DOF, motion blur subtle, ultra sharp details.
NO cartoon, NO flat design, NO illustration, NO vector style, NO real persons, NO square composition."""
    
    return prompt.strip()


def extrair_cursos_do_js(conteudo):
    """Extrai lista de cursos do courses.js."""
    cursos = []
    
    # Encontrar todos os blocos de objeto de curso
    blocos = re.findall(r'\{[^{}]+id:\s*[\'"](\w+)[\'"][^{}]+\}', conteudo, re.DOTALL)
    
    # Parser mais robusto: encontrar cada {objeto} e extrair campos
    padrao_objeto = re.compile(r'\{\s*(?:[^{}]|\{[^{}]*\})*\s*\}', re.DOTALL)
    
    for match in padrao_objeto.finditer(conteudo):
        bloco = match.group(0)
        
        id_m    = re.search(r'id:\s*[\'"](\w+)[\'"]', bloco)
        nome_m  = re.search(r'name:\s*[\'"]([^\'"]+)[\'"]', bloco)
        desc_m  = re.search(r'desc:\s*[\'"]([^\'"]+)[\'"]', bloco)
        cat_m   = re.search(r'cat:\s*[\'"]([^\'"]+)[\'"]', bloco)
        
        if id_m and nome_m:
            cursos.append({
                'id':   id_m.group(1),
                'nome': nome_m.group(1),
                'desc': desc_m.group(1) if desc_m else '',
                'cat':  cat_m.group(1) if cat_m else '_default'
            })
    
    return cursos


def detectar_novos_cursos(cursos_atuais):
    """Retorna TODOS os cursos — regera capas sempre, mesmo as existentes."""
    for curso in cursos_atuais:
        log(f"Vai gerar capa: {curso['nome']} [{curso['id']}]", '🎨')
    return cursos_atuais


def gerar_capa_dalle(curso):
    """Gera a capa usando DALL-E 3 e salva em assets/capas/."""
    if not OPENAI_KEY:
        log("OPENAI_API_KEY não encontrada! Configure nos Secrets do GitHub.", '❌')
        return False
    
    prompt = montar_prompt(
        curso['id'],
        curso['nome'],
        curso['desc'],
        curso['cat']
    )
    
    log(f"Gerando: {curso['nome']}...", '🎨')
    log(f"Prompt: {prompt[:100]}...", '📝')
    
    try:
        response = requests.post(
            'https://api.openai.com/v1/images/generations',
            headers={
                'Authorization': f'Bearer {OPENAI_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                'model': 'dall-e-3',
                'prompt': prompt,
                'n': 1,
                'size': SIZE,
                'quality': QUALITY,
                'style': STYLE
            },
            timeout=120
        )
        
        if response.status_code != 200:
            err = response.json().get('error', {}).get('message', response.text)
            log(f"Erro DALL-E: {err}", '❌')
            return False
        
        data = response.json()
        image_url = data['data'][0]['url']
        
        # Baixar a imagem
        img_response = requests.get(image_url, timeout=60)
        if img_response.status_code != 200:
            log(f"Erro ao baixar imagem", '❌')
            return False
        
        # Salvar
        CAPAS_DIR.mkdir(parents=True, exist_ok=True)
        capa_path = CAPAS_DIR / f"{curso['id']}.jpg"
        capa_path.write_bytes(img_response.content)
        
        log(f"✓ Capa salva: {capa_path} ({len(img_response.content)//1024}KB)", '✅')
        return True
        
    except requests.exceptions.Timeout:
        log(f"Timeout ao gerar capa de {curso['nome']}", '⏰')
        return False
    except Exception as e:
        log(f"Erro inesperado: {e}", '❌')
        return False


def atualizar_courses_js(courses_path, cursos_gerados):
    """Adiciona campo coverImg nos cursos que tiveram capa gerada."""
    conteudo = Path(courses_path).read_text(encoding='utf-8')
    
    for curso_id in cursos_gerados:
        capa_url = f"assets/capas/{curso_id}.jpg"
        
        # Verificar se já tem coverImg
        if f"id: '{curso_id}'" in conteudo or f'id: "{curso_id}"' in conteudo:
            # Encontrar o bloco do curso e adicionar coverImg se não existir
            padrao = rf"(id:\s*['\"]){curso_id}(['\"])"
            match = re.search(padrao, conteudo)
            
            if match:
                # Verificar se já tem coverImg nesse bloco
                pos = match.start()
                # Pegar contexto ao redor (200 chars depois)
                contexto = conteudo[pos:pos+500]
                
                if 'coverImg' not in contexto:
                    # Adicionar coverImg após o id
                    novo = f"id: '{curso_id}',\n    coverImg: '{capa_url}'"
                    conteudo = conteudo.replace(
                        f"id: '{curso_id}'",
                        novo,
                        1
                    )
                    log(f"Adicionado coverImg para {curso_id}", '📝')
    
    Path(courses_path).write_text(conteudo, encoding='utf-8')


def main():
    log("=" * 60, '')
    log("MATHEUS ACADEMY — GERADOR AUTOMÁTICO DE CAPAS IA", '🎓')
    log("=" * 60, '')
    
    if not OPENAI_KEY:
        log("OPENAI_API_KEY não configurada! Abortando.", '❌')
        log("Configure em: GitHub repo → Settings → Secrets → OPENAI_API_KEY", '💡')
        exit(1)
    
    # Verificar se courses.js existe
    courses_path = Path(COURSES_FILE)
    if not courses_path.exists():
        # Tentar caminho alternativo (raiz do repo)
        alt = Path('courses.js')
        if alt.exists():
            courses_path = alt
        else:
            log(f"courses.js não encontrado em {COURSES_FILE} nem na raiz!", '❌')
            exit(1)
    
    log(f"Lendo cursos de: {courses_path}", '📖')
    conteudo = courses_path.read_text(encoding='utf-8')
    cursos = extrair_cursos_do_js(conteudo)
    log(f"Total de cursos encontrados: {len(cursos)}", '📊')
    
    # Detectar quais precisam de capa
    novos = detectar_novos_cursos(cursos)
    
    if not novos:
        log("Todos os cursos já têm capas geradas! Nada a fazer.", '✅')
        exit(0)
    
    log(f"Capas a gerar: {len(novos)}", '🎯')
    
    gerados_ok = []
    
    for i, curso in enumerate(novos):
        log(f"[{i+1}/{len(novos)}] {curso['emoji'] if 'emoji' in curso else '📚'} {curso['nome']}", '🔄')
        
        ok = gerar_capa_dalle(curso)
        
        if ok:
            gerados_ok.append(curso['id'])
        
        # Delay entre gerações
        if i < len(novos) - 1:
            log(f"Aguardando {DELAY_ENTRE}s...", '⏳')
            time.sleep(DELAY_ENTRE)
    
    # Atualizar courses.js com os coverImg
    if gerados_ok:
        log(f"Atualizando {courses_path} com coverImg...", '📝')
        atualizar_courses_js(str(courses_path), gerados_ok)
    
    log("=" * 60, '')
    log(f"Concluído! {len(gerados_ok)}/{len(novos)} capas geradas.", '🏁')
    
    if len(gerados_ok) < len(novos):
        falhas = len(novos) - len(gerados_ok)
        log(f"{falhas} capa(s) falharam — verifique os logs acima.", '⚠️')
    
    log("=" * 60, '')


if __name__ == '__main__':
    main()
