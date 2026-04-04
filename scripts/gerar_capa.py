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
    'gp': 'Ultra realistic cinematic YouTube thumbnail, dramatic storytelling scene about global geopolitics and world power conflicts, highly detailed, 8K, photorealistic style. Main subject: shadowy silhouette of powerful figure before massive glowing world map, chess pieces as nations on dark oak table. Lighting: volumetric gold fog, strong contrast deep shadows. Background: war room with glowing map screens, smoke particles, bokeh. Color grading: cinematic dark gold and navy blue, high contrast. DOF, ultra sharp. NO cartoon, NO flat design, NO illustration.',

    'bm': 'Ultra realistic cinematic YouTube thumbnail, dramatic storytelling scene about the biggest financial fraud scandal in Brazilian banking history, highly detailed, 8K, photorealistic style. Main subject: cracked heavy vault door opening to darkness revealing burning cash inside, crime scene atmosphere with police tape. Lighting: cinematic red orange fire light, volumetric smoke, emergency lights. Background: abandoned bank ruins at night, smoldering, depth blur bokeh. Color grading: cinematic red and dark charcoal, high contrast. NO cartoon, NO flat design.',

    'ii': 'Ultra realistic cinematic YouTube thumbnail, dramatic storytelling scene about the Israel Iran military conflict in the Middle East 2025, highly detailed, 8K, photorealistic style. Main subject: two opposing symbolic national flags splitting apart as massive light explosion erupts between them over desert city. Lighting: split cinematic orange explosion one side cold blue other, volumetric smoke. Background: Middle East city skyline at dusk, fire, depth blur bokeh. Color grading: cinematic blue vs orange split, high contrast. NO cartoon.',

    'cp': 'Ultra realistic cinematic YouTube thumbnail, dramatic storytelling scene about FIFA World Cup 2026 USA Mexico Canada, highly detailed, 8K, photorealistic style. Main subject: golden World Cup trophy alone on stadium pitch, dramatic single spotlight from above, volumetric fog rising from grass. Scene: low angle looking up, massive packed stadium background. Lighting: golden spotlight halo, stadium bokeh lights, fog catching beams. Color grading: cinematic gold and deep blue, high contrast. NO cartoon.',

    'bc': 'Ultra realistic cinematic YouTube thumbnail, dramatic storytelling scene about Bitcoin cryptocurrency revolutionizing world finance, highly detailed, 8K, photorealistic style. Main subject: giant glowing golden Bitcoin symbol rising like a sun from darkness, stock charts reflected in metallic surface. Lighting: dramatic volumetric gold orange rays, neon blue chart reflections. Background: dark financial district, crumbling bank pillars replaced by digital light, bokeh. Color grading: cinematic gold and electric blue, high contrast. NO cartoon.',

    'ctp': 'Ultra realistic cinematic YouTube thumbnail, dramatic storytelling scene about mastering paid digital advertising for massive online revenue, highly detailed, 8K, photorealistic style. Main subject: dark silhouette at enormous curved holographic screens showing ROAS 8x performance charts exploding upward, money as digital particles. Lighting: electric blue and neon, volumetric data streams, screen glow haze. Background: dark futuristic command center, blue cascading data. Color grading: cinematic electric blue and gold, high contrast. NO cartoon.',

    'ctep': 'Ultra realistic cinematic YouTube thumbnail, dramatic storytelling scene about psychological persuasion and influence over the human mind, highly detailed, 8K, photorealistic style. Main subject: detailed glowing translucent human brain in absolute darkness, electric synaptic lightning bolts firing between neural pathways, purple bioluminescence within. Lighting: bioluminescent violet from brain interior, electric neural sparks, absolute darkness contrast. Color grading: cinematic deep purple and electric violet, extreme contrast. NO cartoon.',

    'nlf': 'Ultra realistic cinematic YouTube thumbnail, dramatic storytelling scene about internet censorship and digital surveillance like China Great Firewall in Brazil, highly detailed, 8K, photorealistic style. Main subject: massive digital eye made of circuits and binary code through cracked surveillance screen, heavy iron padlock on glowing fiber optic cable. Lighting: red warning emergency light, computer screen glow, atmospheric danger. Background: dark server room screens flashing ERROR 403 CENSORED in red, code rain. Color grading: cinematic crimson red and dark charcoal, high contrast. NO cartoon.',

    'ie': 'Ultra realistic cinematic YouTube thumbnail, dramatic storytelling scene about emotional intelligence mastering human emotions for success, highly detailed, 8K, photorealistic style. Main subject: calm human silhouette in meditation with luminous glowing heart visible through chest, warm rose gold light radiating in concentric waves. Lighting: bioluminescent heart glow, volumetric emotional light waves, surrounding darkness contrast. Background: dark serene void, floating ember particles upward, bokeh. Color grading: cinematic warm rose gold and deep violet, high contrast. NO cartoon.'
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
    """Detecta cursos que ainda não têm capa gerada."""
    novos = []
    for curso in cursos_atuais:
        capa_path = CAPAS_DIR / f"{curso['id']}.jpg"
        capa_path_png = CAPAS_DIR / f"{curso['id']}.png"
        if not capa_path.exists() and not capa_path_png.exists():
            novos.append(curso)
            log(f"Novo curso sem capa: {curso['nome']} [{curso['id']}]", '🆕')
    return novos


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
