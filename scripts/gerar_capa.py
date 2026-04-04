#!/usr/bin/env python3
"""
Matheus Academy - Gerador de Capas v4 PREMIUM
DALL-E 3 gera fundo + Python adiciona:
- Titulo bold com sombra
- Bandeiras reais (internet ou PIL fallback)
- Logos de empresas (Meta, Google, TikTok, Bitcoin, etc)
- Silhuetas de lideres identificaveis
- Fotos de lugares famosos quando disponivel
- Dados e numeros reais
"""
import os, re, time, io, math, urllib.request, ssl
from pathlib import Path
import requests
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

OPENAI_KEY   = os.environ.get('OPENAI_API_KEY', '')
COURSES_FILE = 'data/courses.js'
CAPAS_DIR    = Path('assets/capas')
QUALITY      = 'hd'
SIZE         = '1024x1792'
STYLE        = 'vivid'
DELAY_ENTRE  = 4

def log(msg):
    print(f"  {msg}", flush=True)

# ── DOWNLOAD COM FALLBACK ──────────────────────────────────────────────────────
def baixar_imagem(url, fallback_fn=None):
    """Tenta baixar imagem. Se falhar, usa fallback PIL."""
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
            'Accept': 'image/png,image/jpeg,image/*',
        })
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            data = resp.read()
        img = Image.open(io.BytesIO(data)).convert('RGBA')
        log(f"OK download: {url[:60]}...")
        return img
    except Exception as e:
        log(f"Fallback (sem internet): {str(e)[:50]}")
        if fallback_fn:
            return fallback_fn()
        return None

# ── FONTES ────────────────────────────────────────────────────────────────────
def get_font(size, bold=True):
    cands = [
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
        '/usr/share/fonts/truetype/freefont/FreeSansBold.ttf' if bold else '/usr/share/fonts/truetype/freefont/FreeSans.ttf',
    ]
    for c in cands:
        try: return ImageFont.truetype(c, size)
        except: continue
    return ImageFont.load_default()

# ── BANDEIRAS ─────────────────────────────────────────────────────────────────
def draw_star(d, cx, cy, r, color):
    pts = []
    for i in range(5):
        a = math.radians(-90 + i*72)
        pts.append((cx + r*math.cos(a), cy + r*math.sin(a)))
        a2 = math.radians(-90 + i*72 + 36)
        pts.append((cx + r*0.38*math.cos(a2), cy + r*0.38*math.sin(a2)))
    d.polygon(pts, fill=color)

def _flag_brasil(w=120, h=80):
    img = Image.new('RGBA', (w, h), (0,155,58,255))
    d = ImageDraw.Draw(img)
    d.polygon([(w//2,4),(w-4,h//2),(w//2,h-4),(4,h//2)], fill=(255,223,0,255))
    r = h//5
    cx, cy = w//2, h//2
    d.ellipse([cx-r,cy-r,cx+r,cy+r], fill=(0,39,118,255))
    d.rectangle([cx-r,cy-2,cx+r,cy+2], fill=(255,255,255,255))
    return img

def _flag_eua(w=120, h=80):
    img = Image.new('RGBA', (w, h), (255,255,255,255))
    d = ImageDraw.Draw(img)
    fh = h/13
    for i in range(13):
        if i%2==0: d.rectangle([0,int(i*fh),w,int((i+1)*fh)], fill=(178,34,52,255))
    d.rectangle([0,0,w//2,int(fh*7)], fill=(60,59,110,255))
    for row in range(5):
        for col in range(6 if row%2==0 else 5):
            sx = 5+col*9+(4 if row%2==1 else 0)
            sy = 3+row*8
            if sx<w//2 and sy<int(fh*7):
                d.ellipse([sx-2,sy-2,sx+2,sy+2], fill=(255,255,255,255))
    return img

def _flag_china(w=120, h=80):
    img = Image.new('RGBA', (w, h), (222,41,16,255))
    d = ImageDraw.Draw(img)
    draw_star(d, 15, 12, 11, (255,213,0,255))
    draw_star(d, 30, 5,  5,  (255,213,0,255))
    draw_star(d, 36, 14, 5,  (255,213,0,255))
    draw_star(d, 32, 24, 5,  (255,213,0,255))
    draw_star(d, 22, 30, 5,  (255,213,0,255))
    return img

def _flag_russia(w=120, h=80):
    img = Image.new('RGBA', (w, h), (255,255,255,255))
    d = ImageDraw.Draw(img)
    f = h//3
    d.rectangle([0,f,w,f*2], fill=(0,57,166,255))
    d.rectangle([0,f*2,w,h], fill=(213,43,30,255))
    return img

def _flag_israel(w=120, h=80):
    img = Image.new('RGBA', (w, h), (255,255,255,255))
    d = ImageDraw.Draw(img)
    azul = (0,56,184,255)
    f = h//5
    d.rectangle([0,f,w,f*2], fill=azul)
    d.rectangle([0,f*3,w,f*4], fill=azul)
    cx, cy, r = w//2, h//2, h//5
    for tri, inv in [(0, False),(1, True)]:
        pts = []
        for i in range(6):
            a = math.radians(i*60 + (90 if inv else -90))
            pts.append((cx + r*math.cos(a), cy + (r//3 if inv else -r//3) + r*0.6*math.sin(a)))
        d.polygon(pts, outline=azul, width=2)
    return img

def _flag_ira(w=120, h=80):
    img = Image.new('RGBA', (w, h), (255,255,255,255))
    d = ImageDraw.Draw(img)
    f = h//3
    d.rectangle([0,0,w,f],   fill=(36,124,60,255))
    d.rectangle([0,f*2,w,h], fill=(186,0,0,255))
    cx, cy = w//2, h//2
    d.ellipse([cx-8,cy-8,cx+8,cy+8], fill=(186,0,0,255))
    return img

def _flag_mexico(w=120, h=80):
    img = Image.new('RGBA', (w, h), (255,255,255,255))
    d = ImageDraw.Draw(img)
    fw = w//3
    d.rectangle([0,0,fw,h],   fill=(0,104,71,255))
    d.rectangle([fw*2,0,w,h], fill=(206,17,38,255))
    d.ellipse([w//2-8,h//2-8,w//2+8,h//2+8], fill=(100,80,40,200))
    return img

def _flag_canada(w=120, h=80):
    img = Image.new('RGBA', (w, h), (255,255,255,255))
    d = ImageDraw.Draw(img)
    fw = w//4
    d.rectangle([0,0,fw,h],   fill=(255,0,0,255))
    d.rectangle([fw*3,0,w,h], fill=(255,0,0,255))
    draw_star(d, w//2, h//2, 16, (255,0,0,255))
    return img

def _flag_palestina(w=120, h=80):
    img = Image.new('RGBA', (w, h), (255,255,255,255))
    d = ImageDraw.Draw(img)
    f = h//3
    d.rectangle([0,0,w,f],   fill=(0,0,0,255))
    d.rectangle([0,f*2,w,h], fill=(0,150,57,255))
    d.polygon([(0,0),(w//3,h//2),(0,h)], fill=(206,17,38,255))
    return img

def _flag_ucrania(w=120, h=80):
    img = Image.new('RGBA', (w, h), (0,91,187,255))
    d = ImageDraw.Draw(img)
    d.rectangle([0,h//2,w,h], fill=(255,213,0,255))
    return img

# Bandeiras via internet (flagcdn.com) com fallback PIL
BANDEIRAS_CDN = {
    'BR': ('https://flagcdn.com/w160/br.png', _flag_brasil),
    'US': ('https://flagcdn.com/w160/us.png', _flag_eua),
    'CN': ('https://flagcdn.com/w160/cn.png', _flag_china),
    'RU': ('https://flagcdn.com/w160/ru.png', _flag_russia),
    'IL': ('https://flagcdn.com/w160/il.png', _flag_israel),
    'IR': ('https://flagcdn.com/w160/ir.png', _flag_ira),
    'MX': ('https://flagcdn.com/w160/mx.png', _flag_mexico),
    'CA': ('https://flagcdn.com/w160/ca.png', _flag_canada),
    'PS': ('https://flagcdn.com/w160/ps.png', _flag_palestina),
    'UA': ('https://flagcdn.com/w160/ua.png', _flag_ucrania),
}

def get_bandeira(codigo, w=110, h=74):
    url, fallback = BANDEIRAS_CDN.get(codigo, (None, None))
    if url:
        img = baixar_imagem(url, fallback)
        if img:
            return img.resize((w, h), Image.LANCZOS)
    if fallback:
        return fallback(w, h)
    return None

# ── LOGOS DE EMPRESAS ─────────────────────────────────────────────────────────
def logo_bitcoin(size=90):
    img = Image.new('RGBA', (size,size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    d.ellipse([0,0,size-1,size-1], fill=(247,147,26,255))
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', int(size*0.56))
        d.text((size//2+2,size//2), 'B', font=font, fill=(255,255,255,255), anchor='mm')
    except: pass
    return img

def logo_meta(w=130, h=44):
    img = Image.new('RGBA', (w,h), (0,0,0,0))
    d = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 30)
        d.text((w//2,h//2), 'Meta', font=font, fill=(0,114,255,255), anchor='mm')
    except: d.text((5,5),'META',fill=(0,114,255,255))
    return img

def logo_google(w=130, h=44):
    img = Image.new('RGBA', (w,h), (0,0,0,0))
    d = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 26)
        cores = [(66,133,244,255),(234,67,53,255),(251,188,4,255),(66,133,244,255),(52,168,83,255),(234,67,53,255)]
        letras = list('Google')
        x = 4
        for letra, cor in zip(letras, cores):
            d.text((x, h//2), letra, font=font, fill=cor, anchor='lm')
            bb = d.textbbox((x,h//2), letra, font=font, anchor='lm')
            x = bb[2]+1
    except: d.text((4,8),'Google',fill=(66,133,244,255))
    return img

def logo_tiktok(size=90):
    img = Image.new('RGBA', (size,size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0,0,size-1,size-1], radius=16, fill=(0,0,0,255))
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', int(size*0.42))
        d.text((size//2+3,size//2+3),'TK',font=font,fill=(0,255,239,180),anchor='mm')
        d.text((size//2-3,size//2-3),'TK',font=font,fill=(254,44,85,180),anchor='mm')
        d.text((size//2,size//2),'TK',font=font,fill=(255,255,255,255),anchor='mm')
    except: pass
    return img

def logo_youtube(w=130, h=44):
    img = Image.new('RGBA', (w,h), (0,0,0,0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0,4,w-1,h-4], radius=8, fill=(255,0,0,255))
    tri_pts = [(w//2-10,h//2-10),(w//2+14,h//2),(w//2-10,h//2+10)]
    d.polygon(tri_pts, fill=(255,255,255,255))
    return img

def logo_openai(size=90):
    img = Image.new('RGBA', (size,size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    d.ellipse([0,0,size-1,size-1], fill=(16,16,16,255))
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', int(size*0.35))
        d.text((size//2,size//2),'AI',font=font,fill=(255,255,255,255),anchor='mm')
    except: pass
    return img

def logo_banco_central(w=130, h=60):
    img = Image.new('RGBA', (w,h), (0,0,0,0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0,0,w-1,h-1], radius=6, fill=(0,83,156,255))
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 16)
        d.text((w//2,h//2-8),'BANCO',font=font,fill=(255,255,255,255),anchor='mm')
        d.text((w//2,h//2+10),'CENTRAL',font=font,fill=(255,213,0,255),anchor='mm')
    except: pass
    return img

# ── SILHUETAS DE LIDERES (sem foto real) ──────────────────────────────────────
def silhueta_presidente_eua(h=160):
    """Silhueta reconhecivel - cabelo caracteristico tipo Trump"""
    w = int(h*0.7)
    img = Image.new('RGBA', (w,h), (0,0,0,0))
    d = ImageDraw.Draw(img)
    cx = w//2
    cor = (255,255,255,220)
    # Cabelo loiro volumoso (caracteristico)
    d.ellipse([cx-26,2,cx+26,38], fill=(*cor[:3],180))
    d.polygon([(cx-26,20),(cx-32,4),(cx-20,2)], fill=(255,220,100,200))
    d.polygon([(cx+26,20),(cx+32,4),(cx+20,2)], fill=(255,220,100,200))
    # Rosto
    d.ellipse([cx-20,10,cx+20,48], fill=cor)
    # Gravata vermelha
    d.polygon([(cx-5,50),(cx+5,50),(cx+3,90),(cx,95),(cx-3,90)], fill=(200,0,0,255))
    # Corpo terno preto
    d.polygon([(cx-28,48),(cx+28,48),(cx+35,h),(cx-35,h)], fill=(40,40,40,230))
    # Lapelas
    d.polygon([(cx-28,48),(cx-5,50),(cx-20,75)], fill=(255,255,255,200))
    d.polygon([(cx+28,48),(cx+5,50),(cx+20,75)], fill=(255,255,255,200))
    return img

def silhueta_lider_china(h=160):
    """Silhueta de lider chines - uniforme Mao"""
    w = int(h*0.7)
    img = Image.new('RGBA', (w,h), (0,0,0,0))
    d = ImageDraw.Draw(img)
    cx = w//2
    cor = (255,255,255,220)
    # Cabelo preto liso
    d.ellipse([cx-22,2,cx+22,40], fill=(20,20,20,240))
    # Rosto
    d.ellipse([cx-18,12,cx+18,46], fill=cor)
    # Uniforme Mao (gola alta verde)
    d.polygon([(cx-25,45),(cx+25,45),(cx+32,h),(cx-32,h)], fill=(60,100,60,240))
    d.rectangle([cx-8,45,cx+8,60], fill=(60,100,60,240))
    return img

def silhueta_tecnico_futbol(h=160):
    """Silhueta de tecnico de futebol com prancheta"""
    w = int(h*0.7)
    img = Image.new('RGBA', (w,h), (0,0,0,0))
    d = ImageDraw.Draw(img)
    cx = w//2
    cor = (255,255,255,210)
    d.ellipse([cx-20,2,cx+20,42], fill=cor)
    d.polygon([(cx-26,40),(cx+26,40),(cx+30,h),(cx-30,h)], fill=(0,80,160,230))
    # Prancheta
    d.rounded_rectangle([cx+20,60,cx+50,100], radius=3, fill=(200,200,200,220))
    d.line([(cx+25,70),(cx+45,70)], fill=(0,0,0,200), width=2)
    d.line([(cx+25,78),(cx+45,78)], fill=(0,0,0,200), width=2)
    d.line([(cx+25,86),(cx+40,86)], fill=(0,0,0,200), width=2)
    return img

def silhueta_empresario(h=160):
    """Silhueta de empresario tech"""
    w = int(h*0.7)
    img = Image.new('RGBA', (w,h), (0,0,0,0))
    d = ImageDraw.Draw(img)
    cx = w//2
    cor = (255,255,255,210)
    d.ellipse([cx-20,2,cx+20,42], fill=cor)
    # Camiseta preta (Steve Jobs / Zuckerberg style)
    d.polygon([(cx-26,40),(cx+26,40),(cx+30,h),(cx-30,h)], fill=(20,20,20,240))
    # Gola redonda
    d.arc([cx-10,38,cx+10,52], 0, 180, fill=(40,40,40,200), width=3)
    return img

# ── ELEMENTOS POR CURSO ───────────────────────────────────────────────────────
ELEMENTOS_CURSO = {
    'gp': {
        'bandeiras': [('US','EUA'),('CN','CHINA'),('RU','RUSSIA')],
        'logos':     [],
        'silhuetas': [silhueta_presidente_eua, silhueta_lider_china],
        'sub':       'PODER  CONFLITO  GEOPOLITICA GLOBAL',
        'cor':       (212,175,55),
        'tags':      ['GUERRA COMERCIAL','OTAN','BRICS','HEGEMONIA'],
    },
    'bm': {
        'bandeiras': [('BR','BRASIL')],
        'logos':     [logo_banco_central],
        'silhuetas': [],
        'sub':       'R$52 BILHOES  CPI  FRAUDE BANCARIA',
        'cor':       (220,38,38),
        'tags':      ['R$52.000.000.000','CPI 2025','POLICIA FEDERAL','STF'],
    },
    'ii': {
        'bandeiras': [('IL','ISRAEL'),('IR','IRA')],
        'logos':     [],
        'silhuetas': [],
        'sub':       'GUERRA  ORIENTE MEDIO  2025',
        'cor':       (249,115,22),
        'tags':      ['IRON DOME','MISSEIS BALÍSTICOS','HEZBOLLAH','IRGC'],
    },
    'cp': {
        'bandeiras': [('BR','BRASIL'),('US','EUA'),('MX','MEXICO')],
        'logos':     [],
        'silhuetas': [silhueta_tecnico_futbol],
        'sub':       'FIFA WORLD CUP 2026  EUA  MEXICO  CANADA',
        'cor':       (34,197,94),
        'tags':      ['48 SELECOES','104 JOGOS','3 PAISES','O HEXA VEM?'],
    },
    'bc': {
        'bandeiras': [],
        'logos':     [logo_bitcoin],
        'silhuetas': [silhueta_empresario],
        'sub':       'ATH $109.000  HALVING 2024  ETF APROVADO',
        'cor':       (249,115,22),
        'tags':      ['$109K ATH','HALVING 2024','ETF BITCOIN','BLOCKCHAIN'],
    },
    'ctp': {
        'bandeiras': [],
        'logos':     [logo_meta, logo_google, logo_tiktok, logo_youtube],
        'silhuetas': [silhueta_empresario],
        'sub':       'META  GOOGLE  TIKTOK  YOUTUBE  ROAS 8.4x',
        'cor':       (59,130,246),
        'tags':      ['ROAS 8.4x','CTR 4.7%','CPC R$0,38','CONV 12.3%'],
    },
    'ctep': {
        'bandeiras': [],
        'logos':     [],
        'silhuetas': [],
        'sub':       'INFLUENCIA  PNL  PERSUASAO  PSICOLOGIA',
        'cor':       (168,85,247),
        'tags':      ['ESCASSEZ','RECIPROCIDADE','PROVA SOCIAL','RAPPORT'],
    },
    'nlf': {
        'bandeiras': [('BR','BRASIL'),('CN','CHINA')],
        'logos':     [],
        'silhuetas': [silhueta_lider_china],
        'sub':       'CENSURA  VIGILANCIA  INTERNET  FELCA 2025',
        'cor':       (220,38,38),
        'tags':      ['ERROR 403','VPN BLOQUEADO','ACESSO NEGADO','FELCA'],
    },
    'ie': {
        'bandeiras': [],
        'logos':     [],
        'silhuetas': [],
        'sub':       'AUTOCONHECIMENTO  EMPATIA  MOTIVACAO  SUCESSO',
        'cor':       (244,63,94),
        'tags':      ['DANIEL GOLEMAN','5 PILARES','QE > QI','LIDERANÇA'],
    },
}

PROMPTS = {
    'gp':   'Ultra realistic cinematic 8K: dramatic dark war room at night, massive illuminated world map on wall showing tension zones, chess pieces on dark oak table, classified documents, multiple screens. No text. No flags. Photorealistic. Dark gold and navy blue. Volumetric god rays.',
    'bm':   'Ultra realistic cinematic 8K crime documentary: massive cracked steel bank vault door open revealing fire and burning cash inside, police investigation tape, emergency red lights flashing, dark abandoned bank hall, smoke. No text. Photorealistic. Crimson red and dark charcoal.',
    'ii':   'Ultra realistic cinematic 8K war documentary: massive explosion of fire over Middle Eastern desert city skyline at dusk, military jets silhouettes, smoke columns rising dramatically, cinematic war atmosphere. No text. Photorealistic. Split orange and cold blue cinematic.',
    'cp':   'Ultra realistic cinematic 8K sports: FIFA World Cup golden trophy alone on stadium grass, single dramatic spotlight from above, massive packed 80000 spectator stadium bokeh background, volumetric fog on grass, confetti. No text. Photorealistic. Cinematic gold and deep blue.',
    'bc':   'Ultra realistic cinematic 8K finance: giant golden coin rising from darkness like a sun over crumbling old stone bank buildings, parabolic chart going vertical to sky, digital light streams replacing old finance. No text. Photorealistic. Dark gold and electric blue neon.',
    'ctp':  'Ultra realistic cinematic 8K tech entrepreneurship: dark futuristic command center, massive curved holographic dashboard with rocket trajectory performance chart exploding upward, digital money particles, data streams. No text. Photorealistic. Electric blue and gold.',
    'ctep': 'Ultra realistic cinematic 8K psychology: anatomically detailed glowing human brain floating in absolute darkness, electric purple synaptic lightning bolts firing between neural pathways, chess pieces floating, mysterious atmosphere. No text. Photorealistic. Deep purple and electric violet.',
    'nlf':  'Ultra realistic cinematic 8K dystopian surveillance: massive circuit board surveillance eye watching through cracked screen, iron chains on glowing cables, dark server room with red warning lights. No text. Photorealistic. Crimson red and dark charcoal.',
    'ie':   'Ultra realistic cinematic 8K human potential: serene human silhouette in meditation with glowing heart visible through chest radiating rose gold light in concentric waves, ember particles rising in dark void. No text. Photorealistic. Warm rose gold and deep violet.',
}

PROMPTS_CAT = {
    'Geopolitica':     'Ultra realistic cinematic 8K: dramatic war room, world map tension zones glowing, chess pieces. No text. No flags. Photorealistic. Dark gold.',
    'Atualize-se':     'Ultra realistic cinematic 8K: dramatic newsroom at night, glowing screens urgency. No text. Photorealistic. Red and white news lighting.',
    'Negocios':        'Ultra realistic cinematic 8K: dark executive boardroom, city skyline, financial charts growth. No text. Photorealistic. Gold and dark blue.',
    'PNL':             'Ultra realistic cinematic 8K: glowing brain neural pathways darkness, mysterious psychological atmosphere. No text. Photorealistic. Purple cinematic.',
    'Desenvolvimento': 'Ultra realistic cinematic 8K: silhouette mountain summit glowing energy epic landscape. No text. Photorealistic. Warm golden light.',
    'Tecnologia':      'Ultra realistic cinematic 8K: futuristic digital environment holographic interfaces electric blue. No text. Photorealistic.',
    '_default':        'Ultra realistic cinematic 8K: dramatic academy environment light shafts knowledge atmosphere. No text. Photorealistic. Dramatic cinematic lighting.',
}

# ── COMPOSICAO FINAL ──────────────────────────────────────────────────────────
def compor_capa(img_fundo, curso):
    w, h = img_fundo.size
    result = img_fundo.copy().convert('RGBA')
    ov     = Image.new('RGBA', (w, h), (0,0,0,0))
    d      = ImageDraw.Draw(ov)

    cid   = curso['id']
    nome  = curso['nome'].upper()
    elem  = ELEMENTOS_CURSO.get(cid, {
        'bandeiras':[], 'logos':[], 'silhuetas':[],
        'sub': curso.get('cat',''), 'cor':(91,127,255), 'tags':[]
    })
    cor  = elem['cor']
    sub  = elem['sub']
    tags = elem.get('tags', [])

    # Gradiente escuro EMBAIXO (area do titulo)
    gh = int(h * 0.55)
    for y in range(gh):
        alpha = int(240 * (y/gh)**1.6)
        d.rectangle([0, h-gh+y, w, h-gh+y+1], fill=(0,0,0,alpha))

    # Gradiente escuro em CIMA (area das bandeiras/logos)
    th = int(h * 0.30)
    for y in range(th):
        alpha = int(190 * (1-y/th)**1.4)
        d.rectangle([0, y, w, y+1], fill=(0,0,0,alpha))

    # Linha colorida topo
    d.rectangle([0, 0, w, 10], fill=(*cor, 255))

    # ── BANDEIRAS (topo) ──────────────────────────────────────────────────────
    bnd_list = elem.get('bandeiras', [])
    if bnd_list:
        bw, bh = 110, 74
        gap = 20
        n = len(bnd_list)
        total_w = n*bw + (n-1)*gap
        bx0 = (w - total_w) // 2
        by  = 22
        font_lbl = get_font(22)
        for i, (codigo, label) in enumerate(bnd_list):
            bx = bx0 + i*(bw+gap)
            flag = get_bandeira(codigo, bw, bh)
            if flag:
                # Sombra
                shadow = Image.new('RGBA', (bw+8, bh+8), (0,0,0,120))
                ov.paste(shadow, (bx-2, by+2), shadow)
                # Borda branca
                bordered = Image.new('RGBA', (bw+4, bh+4), (255,255,255,240))
                bordered.paste(flag.resize((bw,bh), Image.LANCZOS), (2,2))
                ov.paste(bordered, (bx-2, by-2), bordered)
            # Label
            lx = bx + bw//2
            ly = by + bh + 10
            d.text((lx+2, ly+2), label, font=font_lbl, fill=(0,0,0,220), anchor='mt')
            d.text((lx,   ly),   label, font=font_lbl, fill=(255,255,255,255), anchor='mt')

    # ── LOGOS (abaixo das bandeiras ou no topo) ───────────────────────────────
    logos_fns = elem.get('logos', [])
    if logos_fns and not bnd_list:
        # Logos no centro-topo quando nao tem bandeiras
        logos_imgs = []
        for fn in logos_fns[:4]:
            try:
                lg = fn()
                logos_imgs.append(lg)
            except: pass
        if logos_imgs:
            total_lw = sum(l.size[0] for l in logos_imgs) + (len(logos_imgs)-1)*16
            lx0 = (w - total_lw) // 2
            ly0 = 30
            for lg in logos_imgs:
                ov.paste(lg, (lx0, ly0), lg)
                lx0 += lg.size[0] + 16
    elif logos_fns and bnd_list:
        # Logos menores abaixo das bandeiras
        bh_total = 74 + 10 + 22 + 10  # bandeira + label
        logos_imgs = []
        for fn in logos_fns[:4]:
            try:
                lg = fn()
                # Redimensionar para caber
                ratio = 35 / max(lg.size)
                new_w = int(lg.size[0]*ratio)
                new_h = int(lg.size[1]*ratio)
                lg = lg.resize((new_w, new_h), Image.LANCZOS)
                logos_imgs.append(lg)
            except: pass
        if logos_imgs:
            total_lw = sum(l.size[0] for l in logos_imgs) + (len(logos_imgs)-1)*12
            lx0 = (w - total_lw) // 2
            ly0 = 22 + bh_total + 10
            for lg in logos_imgs:
                ov.paste(lg, (lx0, ly0), lg)
                lx0 += lg.size[0] + 12

    # ── SILHUETAS (laterais) ──────────────────────────────────────────────────
    silhuetas_fns = elem.get('silhuetas', [])
    if silhuetas_fns:
        sil_h = int(h * 0.35)
        posicoes = [(30, h - sil_h - 180), (w - 130, h - sil_h - 180)]
        for i, fn_sil in enumerate(silhuetas_fns[:2]):
            try:
                sil = fn_sil(sil_h)
                sx, sy = posicoes[i]
                if sx + sil.size[0] < w and sy > 0:
                    # Sombra difusa
                    sil_blur = sil.copy().filter(ImageFilter.GaussianBlur(8))
                    sil_shadow = Image.new('RGBA', sil.size, (0,0,0,0))
                    dark = Image.new('RGBA', sil.size, (0,0,0,160))
                    sil_shadow.paste(dark, mask=sil_blur.split()[3])
                    ov.paste(sil_shadow, (sx+5, sy+5), sil_shadow)
                    ov.paste(sil, (sx, sy), sil)
            except Exception as e:
                log(f"Silhueta erro: {e}")

    # ── TAGS FLUTUANTES (contexto) ────────────────────────────────────────────
    if tags:
        font_tag = get_font(20, bold=False)
        ty_base  = h - int(h*0.52) + 20
        for i, tag in enumerate(tags[:4]):
            tx = 30 + (i % 2) * (w//2 - 40)
            ty = ty_base + (i // 2) * 36
            # Pill background
            bb = d.textbbox((tx, ty), tag, font=font_tag)
            pad = 8
            d.rounded_rectangle([bb[0]-pad, bb[1]-4, bb[2]+pad, bb[3]+4],
                                  radius=6, fill=(0,0,0,140))
            d.rounded_rectangle([bb[0]-pad, bb[1]-4, bb[2]+pad, bb[3]+4],
                                  radius=6, outline=(*cor, 100), width=1)
            d.text((tx, ty), tag, font=font_tag, fill=(*cor, 220))

    # ── TITULO PRINCIPAL ──────────────────────────────────────────────────────
    font_titulo = get_font(78)
    font_sub    = get_font(28)
    font_meta   = get_font(22, bold=False)

    palavras = nome.split()
    linhas, atual = [], ''
    for p in palavras:
        teste = (atual+' '+p).strip()
        bb = d.textbbox((0,0), teste, font=font_titulo)
        if bb[2] > w-80 and atual:
            linhas.append(atual); atual = p
        else:
            atual = teste
    if atual: linhas.append(atual)

    line_h = 88
    total_lh = len(linhas)*line_h
    ty = h - 55 - int(h*0.18) - total_lh

    for i, linha in enumerate(linhas):
        lx = w//2
        ly = ty + i*line_h
        # Sombra multipla
        for dx, dy in [(4,4),(3,3),(2,2)]:
            d.text((lx+dx,ly+dy), linha, font=font_titulo, fill=(0,0,0,180), anchor='mt')
        # Texto branco
        d.text((lx, ly), linha, font=font_titulo, fill=(255,255,255,255), anchor='mt',
               stroke_width=4, stroke_fill=(0,0,0,200))

    # Linha decorativa
    sep_y = ty + len(linhas)*line_h + 14
    for px in range(60, w-60):
        alpha = int(230 * math.sin(math.pi*(px-60)/(w-120)))
        d.point((px, sep_y), fill=(*cor, alpha))
        d.point((px, sep_y+1), fill=(*cor, alpha))
        d.point((px, sep_y+2), fill=(*cor, alpha//2))

    # Subtitulo
    d.text((w//2, sep_y+16), sub, font=font_sub, fill=(*cor, 245), anchor='mt',
           stroke_width=2, stroke_fill=(0,0,0,190))

    # Metadados
    meta = f"{curso.get('hours','?')}H  |  {curso.get('modules','?')} MODULOS  |  {curso.get('topics','?')} TOPICOS"
    d.text((w//2, h-30), meta, font=font_meta, fill=(200,200,200,220), anchor='mb',
           stroke_width=1, stroke_fill=(0,0,0,160))

    result = Image.alpha_composite(result, ov)
    return result.convert('RGB')

# ── EXTRACAO CURSOS ───────────────────────────────────────────────────────────
def extrair_cursos(conteudo):
    cursos = []
    for m in re.compile(r'\{\s*(?:[^{}]|\{[^{}]*\})*\s*\}', re.DOTALL).finditer(conteudo):
        b = m.group(0)
        id_m = re.search(r"id:\s*['\"](\w+)['\"]", b)
        nm_m = re.search(r"name:\s*['\"]([^'\"]+)['\"]", b)
        if id_m and nm_m:
            cursos.append({
                'id':      id_m.group(1),
                'nome':    nm_m.group(1),
                'desc':    (re.search(r"desc:\s*['\"]([^'\"]+)['\"]", b) or type('',(),{'group':lambda s,x:''})()).group(1),
                'cat':     (re.search(r"cat:\s*['\"]([^'\"]+)['\"]",  b) or type('',(),{'group':lambda s,x:'_default'})()).group(1),
                'hours':   (re.search(r"hours:\s*(\d+)",    b) or type('',(),{'group':lambda s,x:'?'})()).group(1),
                'modules': (re.search(r"modules:\s*(\d+)",  b) or type('',(),{'group':lambda s,x:'?'})()).group(1),
                'topics':  (re.search(r"topics:\s*(\d+)",   b) or type('',(),{'group':lambda s,x:'?'})()).group(1),
            })
    return cursos

def gerar_capa(curso):
    if not OPENAI_KEY:
        log("OPENAI_API_KEY nao configurada!"); return False

    prompt = PROMPTS.get(curso['id'])
    if not prompt:
        cat_key = next((k for k in PROMPTS_CAT if k in curso['cat']), '_default')
        prompt  = PROMPTS_CAT[cat_key]

    log(f"DALL-E 3: {curso['nome']}...")
    try:
        r = requests.post(
            'https://api.openai.com/v1/images/generations',
            headers={'Authorization':f'Bearer {OPENAI_KEY}','Content-Type':'application/json'},
            json={'model':'dall-e-3','prompt':prompt,'n':1,'size':SIZE,'quality':QUALITY,'style':STYLE},
            timeout=120
        )
        if r.status_code != 200:
            log(f"Erro DALL-E: {r.json().get('error',{}).get('message',r.text)}"); return False

        url       = r.json()['data'][0]['url']
        img_bytes = requests.get(url, timeout=60).content
        fundo     = Image.open(io.BytesIO(img_bytes)).convert('RGBA').resize((1024,1792), Image.LANCZOS)

        log(f"Compondo elementos...")
        final = compor_capa(fundo, curso)

        CAPAS_DIR.mkdir(parents=True, exist_ok=True)
        path = CAPAS_DIR / f"{curso['id']}.jpg"
        final.save(str(path), 'JPEG', quality=93)
        log(f"Salvo: {path} ({path.stat().st_size//1024}KB)")
        return True
    except requests.exceptions.Timeout:
        log(f"Timeout: {curso['nome']}"); return False
    except Exception as e:
        log(f"Erro: {e}"); return False

def atualizar_courses_js(cp, gerados):
    txt = Path(cp).read_text(encoding='utf-8')
    for cid in gerados:
        url = f"assets/capas/{cid}.jpg"
        pat = f"id: '{cid}'"
        if pat in txt:
            pos = txt.find(pat)
            if 'coverImg' not in txt[pos:pos+500]:
                txt = txt.replace(pat, f"id: '{cid}',\n    coverImg: '{url}'", 1)
                log(f"coverImg: {cid}")
    Path(cp).write_text(txt, encoding='utf-8')

def main():
    log("="*50)
    log("MATHEUS ACADEMY - GERADOR DE CAPAS v4 PREMIUM")
    log("DALL-E 3 + Bandeiras Reais + Logos + Silhuetas")
    log("="*50)
    if not OPENAI_KEY:
        log("Configure OPENAI_API_KEY nos Secrets do GitHub!"); exit(1)

    cp = Path(COURSES_FILE)
    if not cp.exists(): cp = Path('courses.js')
    if not cp.exists(): log("courses.js nao encontrado!"); exit(1)

    txt    = cp.read_text(encoding='utf-8')
    cursos = extrair_cursos(txt)
    log(f"Cursos encontrados: {len(cursos)}")

    ok = []
    for i, c in enumerate(cursos):
        log(f"[{i+1}/{len(cursos)}] {c['nome']}")
        if gerar_capa(c): ok.append(c['id'])
        if i < len(cursos)-1: time.sleep(DELAY_ENTRE)

    if ok: atualizar_courses_js(str(cp), ok)
    log(f"Concluido: {len(ok)}/{len(cursos)} capas geradas.")

if __name__ == '__main__':
    main()
