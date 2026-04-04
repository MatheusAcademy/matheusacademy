#!/usr/bin/env python3
"""
Matheus Academy - Gerador Automatico de Capas v5 SVG
- Gera capa SVG cinematografica APENAS para cursos NOVOS (sem capa ainda)
- Se ja tem capa = nao sobrescreve (voce pode trocar manualmente)
- Zero custo, zero IA externa, 100% controlado
"""
import os, re, time, math
from pathlib import Path

COURSES_FILE = 'data/courses.js'
CAPAS_DIR    = Path('assets/capas')

def log(msg): print(f"  {msg}", flush=True)

# ── TEMAS VISUAIS POR CURSO ───────────────────────────────────────────────────
TEMAS = {
    'gp': {
        'nome': 'GEOPOLITICA AVANCADA',
        'sub':  'PODER · CONFLITO · ECONOMIA GLOBAL',
        'cor1': '#1a1200', 'cor2': '#0a0800',
        'accent': '#f59e0b', 'accent2': '#d97706',
        'icone': '🌍',
        'elementos': 'globe',
    },
    'bm': {
        'nome': 'CASO BANCO MASTER',
        'sub':  'R$52 BILHOES · CPI · FRAUDE',
        'cor1': '#1a0000', 'cor2': '#0d0000',
        'accent': '#dc2626', 'accent2': '#991b1b',
        'icone': '🏦',
        'elementos': 'bank',
    },
    'ii': {
        'nome': 'GUERRA ISRAEL x IRA',
        'sub':  'ORIENTE MEDIO · 2025',
        'cor1': '#0a0014', 'cor2': '#05000a',
        'accent': '#f97316', 'accent2': '#3b82f6',
        'icone': '⚔️',
        'elementos': 'war',
    },
    'cp': {
        'nome': 'COPA DO MUNDO 2026',
        'sub':  'EUA · MEXICO · CANADA',
        'cor1': '#001400', 'cor2': '#000a00',
        'accent': '#f59e0b', 'accent2': '#16a34a',
        'icone': '🏆',
        'elementos': 'trophy',
    },
    'bc': {
        'nome': 'BITCOIN',
        'sub':  'ATH $109K · HALVING · ETF',
        'cor1': '#140800', 'cor2': '#0a0400',
        'accent': '#f97316', 'accent2': '#fb923c',
        'icone': '₿',
        'elementos': 'bitcoin',
    },
    'ctp': {
        'nome': 'TRAFEGO PAGO',
        'sub':  'META · GOOGLE · TIKTOK · ROAS 8.4x',
        'cor1': '#000a1a', 'cor2': '#00050f',
        'accent': '#3b82f6', 'accent2': '#60a5fa',
        'icone': '📊',
        'elementos': 'ads',
    },
    'ctep': {
        'nome': 'TECNICAS DE PERSUASAO',
        'sub':  'INFLUENCIA · PNL · PSICOLOGIA',
        'cor1': '#0d0014', 'cor2': '#080009',
        'accent': '#a855f7', 'accent2': '#c084fc',
        'icone': '🧠',
        'elementos': 'brain',
    },
    'nlf': {
        'nome': 'LEI FELCA',
        'sub':  'CENSURA · VIGILANCIA · INTERNET',
        'cor1': '#140000', 'cor2': '#0a0005',
        'accent': '#dc2626', 'accent2': '#7c3aed',
        'icone': '🔒',
        'elementos': 'eye',
    },
    'ie': {
        'nome': 'INTELIGENCIA EMOCIONAL',
        'sub':  'AUTOCONHECIMENTO · EMPATIA · SUCESSO',
        'cor1': '#140008', 'cor2': '#0a0005',
        'accent': '#f43f5e', 'accent2': '#fb7185',
        'icone': '❤️',
        'elementos': 'heart',
    },
}

TEMA_DEFAULT = {
    'nome': 'NOVO CURSO',
    'sub':  'MATHEUS ACADEMY',
    'cor1': '#000a1a', 'cor2': '#00050f',
    'accent': '#5b7fff', 'accent2': '#818cf8',
    'icone': '🎓',
    'elementos': 'default',
}

# ── ELEMENTOS VISUAIS SVG POR TIPO ────────────────────────────────────────────
def elementos_globe():
    return '''
    <!-- Meridianos e paralelos -->
    <g opacity="0.15" stroke="#f59e0b" stroke-width="0.5" fill="none">
      <ellipse cx="512" cy="380" rx="280" ry="280"/>
      <ellipse cx="512" cy="380" rx="280" ry="100"/>
      <ellipse cx="512" cy="380" rx="280" ry="180"/>
      <ellipse cx="512" cy="380" rx="100" ry="280"/>
      <ellipse cx="512" cy="380" rx="180" ry="280"/>
      <line x1="512" y1="100" x2="512" y2="660"/>
    </g>
    <!-- Continentes abstratos -->
    <g opacity="0.3">
      <ellipse cx="380" cy="320" rx="90" ry="60" fill="#1d3a1a" stroke="#22c55e" stroke-width="1"/>
      <ellipse cx="580" cy="280" rx="70" ry="50" fill="#1a1d3a" stroke="#3b82f6" stroke-width="1"/>
      <ellipse cx="460" cy="430" rx="55" ry="40" fill="#1d1a3a" stroke="#a855f7" stroke-width="1"/>
      <ellipse cx="640" cy="400" rx="45" ry="35" fill="#3a1a1a" stroke="#ef4444" stroke-width="1"/>
    </g>
    <!-- Pontos de tensao -->
    <circle cx="520" cy="340" r="8" fill="#ef4444" opacity="0.9"/>
    <circle cx="520" cy="340" r="18" fill="none" stroke="#ef4444" stroke-width="1.5" opacity="0.5"/>
    <circle cx="520" cy="340" r="30" fill="none" stroke="#ef4444" stroke-width="1" opacity="0.25"/>
    <circle cx="390" cy="310" r="6" fill="#3b82f6" opacity="0.8"/>
    <circle cx="390" cy="310" r="14" fill="none" stroke="#3b82f6" stroke-width="1" opacity="0.4"/>
    <circle cx="620" cy="370" r="6" fill="#ef4444" opacity="0.8"/>
    <circle cx="620" cy="370" r="14" fill="none" stroke="#ef4444" stroke-width="1" opacity="0.4"/>
    <!-- Linhas de conexao -->
    <path d="M390,310 Q505,260 520,340" fill="none" stroke="#f59e0b" stroke-width="1" stroke-dasharray="4,3" opacity="0.4"/>
    <path d="M620,370 Q570,300 520,340" fill="none" stroke="#ef4444" stroke-width="1" stroke-dasharray="4,3" opacity="0.4"/>
    <!-- Pecas de xadrez -->
    <g fill="#f59e0b" opacity="0.2">
      <rect x="200" y="580" width="20" height="50" rx="3"/>
      <circle cx="210" cy="570" r="15"/>
      <rect x="280" y="600" width="20" height="40" rx="3"/>
      <circle cx="290" cy="590" r="13"/>
      <rect x="740" y="580" width="20" height="50" rx="3"/>
      <circle cx="750" cy="570" r="15"/>
    </g>'''

def elementos_bank():
    return '''
    <!-- Predio bancario -->
    <g opacity="0.4">
      <rect x="262" y="200" width="500" height="400" fill="#1a0000" stroke="#dc2626" stroke-width="1.5"/>
      <polygon points="262,200 512,120 762,200" fill="#0d0000" stroke="#dc2626" stroke-width="1.5"/>
      <!-- Colunas -->
      <rect x="290" y="220" width="30" height="380" fill="#111" stroke="#dc2626" stroke-width="0.5" opacity="0.8"/>
      <rect x="360" y="220" width="30" height="380" fill="#111" stroke="#dc2626" stroke-width="0.5" opacity="0.8"/>
      <rect x="430" y="220" width="30" height="380" fill="#111" stroke="#dc2626" stroke-width="0.5" opacity="0.8"/>
      <rect x="500" y="220" width="30" height="380" fill="#111" stroke="#dc2626" stroke-width="0.5" opacity="0.8"/>
      <rect x="570" y="220" width="30" height="380" fill="#111" stroke="#dc2626" stroke-width="0.5" opacity="0.8"/>
      <rect x="640" y="220" width="30" height="380" fill="#111" stroke="#dc2626" stroke-width="0.5" opacity="0.8"/>
      <rect x="710" y="220" width="30" height="380" fill="#111" stroke="#dc2626" stroke-width="0.5" opacity="0.8"/>
    </g>
    <!-- Cofre quebrado -->
    <circle cx="512" cy="420" r="100" fill="#0a0000" stroke="#dc2626" stroke-width="3" opacity="0.8"/>
    <circle cx="512" cy="420" r="75" fill="none" stroke="#dc2626" stroke-width="2" opacity="0.5"/>
    <!-- Raios do cofre -->
    <g stroke="#dc2626" stroke-width="2" opacity="0.6">
      <line x1="512" y1="320" x2="512" y2="340"/>
      <line x1="512" y1="500" x2="512" y2="520"/>
      <line x1="412" y1="420" x2="432" y2="420"/>
      <line x1="592" y1="420" x2="612" y2="420"/>
    </g>
    <!-- Notas caindo -->
    <g opacity="0.5" fill="#22c55e">
      <rect x="350" y="490" width="40" height="20" rx="2" transform="rotate(-15,370,500)"/>
      <rect x="580" y="510" width="40" height="20" rx="2" transform="rotate(10,600,520)"/>
      <rect x="450" y="540" width="40" height="20" rx="2" transform="rotate(-5,470,550)"/>
      <rect x="630" y="470" width="40" height="20" rx="2" transform="rotate(20,650,480)"/>
    </g>
    <!-- R$52bi -->
    <text x="512" y="430" text-anchor="middle" fill="#dc2626" font-family="Arial" font-weight="900" font-size="36" opacity="0.9">R$52bi</text>'''

def elementos_war():
    return '''
    <!-- Explosao central -->
    <radialGradient id="expGrad" cx="50%" cy="55%" r="40%">
      <stop offset="0%" stop-color="#f97316" stop-opacity="0.6"/>
      <stop offset="50%" stop-color="#dc2626" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    <rect x="0" y="0" width="1024" height="1792" fill="url(#expGrad)"/>
    <!-- Ondas de explosao -->
    <circle cx="512" cy="900" r="150" fill="none" stroke="#f97316" stroke-width="2" opacity="0.4"/>
    <circle cx="512" cy="900" r="250" fill="none" stroke="#f97316" stroke-width="1.5" opacity="0.3"/>
    <circle cx="512" cy="900" r="380" fill="none" stroke="#f97316" stroke-width="1" opacity="0.2"/>
    <!-- Misseis -->
    <g opacity="0.5" stroke="#ffffff" stroke-width="2">
      <line x1="200" y1="600" x2="480" y2="880"/>
      <line x1="820" y1="580" x2="545" y2="870"/>
      <line x1="300" y1="400" x2="495" y2="860"/>
    </g>
    <!-- Silhueta cidade -->
    <g fill="#0a0010" opacity="0.7">
      <rect x="50" y="1000" width="60" height="200"/>
      <rect x="130" y="950" width="80" height="250"/>
      <rect x="230" y="1020" width="50" height="180"/>
      <rect x="640" y="960" width="70" height="240"/>
      <rect x="730" y="990" width="90" height="210"/>
      <rect x="840" y="940" width="60" height="260"/>
      <rect x="920" y="1010" width="50" height="190"/>
    </g>'''

def elementos_trophy():
    return '''
    <!-- Estadio -->
    <ellipse cx="512" cy="500" rx="400" ry="320" fill="none" stroke="#16a34a" stroke-width="2" opacity="0.5"/>
    <ellipse cx="512" cy="500" rx="340" ry="260" fill="none" stroke="#16a34a" stroke-width="1" opacity="0.3"/>
    <!-- Gramado -->
    <ellipse cx="512" cy="500" rx="280" ry="200" fill="#052e16" opacity="0.6"/>
    <ellipse cx="512" cy="500" rx="200" ry="145" fill="#065f46" opacity="0.5"/>
    <ellipse cx="512" cy="500" rx="120" ry="90" fill="#052e16" opacity="0.5"/>
    <circle cx="512" cy="500" r="50" fill="none" stroke="#fff" stroke-width="1" opacity="0.2"/>
    <!-- Taca dourada -->
    <path d="M452,320 C432,320 420,340 420,360 C420,400 440,430 470,445 L465,480 L445,495 L575,495 L555,480 L550,445 C580,430 600,400 600,360 C600,340 588,320 568,320 Z" fill="#f59e0b" opacity="0.9"/>
    <rect x="480" y="490" width="60" height="8" rx="2" fill="#d97706"/>
    <ellipse cx="512" cy="498" rx="50" ry="8" fill="#f59e0b"/>
    <!-- Brilho na taca -->
    <path d="M452,320 C432,320 420,340 420,360 C420,400 440,430 470,445 L465,480 L445,495 L575,495 L555,480 L550,445 C580,430 600,400 600,360 C600,340 588,320 568,320 Z" fill="none" stroke="#fde68a" stroke-width="2" opacity="0.6"/>
    <!-- Estrelas -->
    <text x="512" y="400" text-anchor="middle" fill="#7c2d12" font-size="18" opacity="0.8">★★★★★★</text>
    <!-- Holofotes -->
    <g opacity="0.15" stroke="#f59e0b" stroke-width="30" stroke-linecap="round">
      <line x1="100" y1="150" x2="500" y2="490"/>
      <line x1="924" y1="150" x2="524" y2="490"/>
    </g>'''

def elementos_bitcoin():
    return '''
    <!-- Grade de mercado -->
    <g opacity="0.06" stroke="#f97316" stroke-width="0.5">
      <line x1="0" y1="200" x2="1024" y2="200"/>
      <line x1="0" y1="350" x2="1024" y2="350"/>
      <line x1="0" y1="500" x2="1024" y2="500"/>
      <line x1="0" y1="650" x2="1024" y2="650"/>
      <line x1="128" y1="0" x2="128" y2="900"/>
      <line x1="256" y1="0" x2="256" y2="900"/>
      <line x1="384" y1="0" x2="384" y2="900"/>
      <line x1="512" y1="0" x2="512" y2="900"/>
      <line x1="640" y1="0" x2="640" y2="900"/>
      <line x1="768" y1="0" x2="768" y2="900"/>
      <line x1="896" y1="0" x2="896" y2="900"/>
    </g>
    <!-- Grafico candlestick -->
    <g>
      <line x1="100" y1="720" x2="100" y2="640" stroke="#22c55e" stroke-width="1.5"/>
      <rect x="92" y="680" width="16" height="40" fill="#22c55e" opacity="0.8"/>
      <line x1="160" y1="680" x2="160" y2="590" stroke="#22c55e" stroke-width="1.5"/>
      <rect x="152" y="630" width="16" height="45" fill="#22c55e" opacity="0.8"/>
      <line x1="220" y1="650" x2="220" y2="570" stroke="#ef4444" stroke-width="1.5"/>
      <rect x="212" y="600" width="16" height="40" fill="#ef4444" opacity="0.8"/>
      <line x1="280" y1="580" x2="280" y2="480" stroke="#22c55e" stroke-width="1.5"/>
      <rect x="272" y="510" width="16" height="50" fill="#22c55e" opacity="0.8"/>
      <line x1="340" y1="500" x2="340" y2="400" stroke="#22c55e" stroke-width="1.5"/>
      <rect x="332" y="420" width="16" height="60" fill="#22c55e" opacity="0.8"/>
      <line x1="400" y1="440" x2="400" y2="360" stroke="#ef4444" stroke-width="1.5"/>
      <rect x="392" y="380" width="16" height="40" fill="#ef4444" opacity="0.8"/>
      <line x1="460" y1="380" x2="460" y2="280" stroke="#22c55e" stroke-width="1.5"/>
      <rect x="452" y="300" width="16" height="60" fill="#22c55e" opacity="0.8"/>
      <line x1="520" y1="300" x2="520" y2="200" stroke="#22c55e" stroke-width="1.5"/>
      <rect x="512" y="220" width="16" height="60" fill="#22c55e" opacity="0.8"/>
    </g>
    <!-- Linha de tendencia ATH -->
    <polyline points="100,720 160,660 220,630 280,550 340,470 400,420 460,350 520,270 580,220 640,180" fill="none" stroke="#f97316" stroke-width="2.5" opacity="0.8"/>
    <circle cx="640" cy="180" r="8" fill="#f97316"/>
    <text x="660" y="175" fill="#f97316" font-family="Arial" font-weight="700" font-size="20">ATH $109K</text>
    <!-- Simbolo Bitcoin grande -->
    <circle cx="512" cy="520" r="160" fill="#f97316" opacity="0.12"/>
    <circle cx="512" cy="520" r="140" fill="none" stroke="#f97316" stroke-width="2" opacity="0.3"/>
    <text x="512" y="575" text-anchor="middle" fill="#f97316" font-family="Arial" font-weight="900" font-size="140" opacity="0.25">₿</text>'''

def elementos_ads():
    return '''
    <!-- Dashboard frame -->
    <rect x="62" y="80" width="900" height="620" rx="8" fill="#070d18" stroke="#1e3a5f" stroke-width="1.5" opacity="0.9"/>
    <rect x="62" y="80" width="900" height="36" rx="8" fill="#0d1421"/>
    <!-- Botoes mac style -->
    <circle cx="90" cy="98" r="7" fill="#ef4444" opacity="0.7"/>
    <circle cx="114" cy="98" r="7" fill="#f59e0b" opacity="0.7"/>
    <circle cx="138" cy="98" r="7" fill="#22c55e" opacity="0.7"/>
    <text x="512" y="103" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="13" letter-spacing="2">ADS MANAGER — DASHBOARD</text>
    <!-- Cards de metricas -->
    <rect x="90" y="130" width="190" height="100" rx="4" fill="#111827" stroke="#1e3a5f" stroke-width="0.5"/>
    <text x="185" y="165" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="13" letter-spacing="1">ROAS</text>
    <text x="185" y="205" text-anchor="middle" fill="#22c55e" font-family="Arial" font-weight="900" font-size="38">8.4x</text>
    <rect x="300" y="130" width="190" height="100" rx="4" fill="#111827" stroke="#1e3a5f" stroke-width="0.5"/>
    <text x="395" y="165" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="13" letter-spacing="1">CTR</text>
    <text x="395" y="205" text-anchor="middle" fill="#3b82f6" font-family="Arial" font-weight="900" font-size="38">4.7%</text>
    <rect x="510" y="130" width="190" height="100" rx="4" fill="#111827" stroke="#1e3a5f" stroke-width="0.5"/>
    <text x="605" y="165" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="13" letter-spacing="1">CPC</text>
    <text x="605" y="205" text-anchor="middle" fill="#f59e0b" font-family="Arial" font-weight="900" font-size="32">R$0,38</text>
    <rect x="720" y="130" width="200" height="100" rx="4" fill="#111827" stroke="#1e3a5f" stroke-width="0.5"/>
    <text x="820" y="165" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="13" letter-spacing="1">CONV.</text>
    <text x="820" y="205" text-anchor="middle" fill="#a855f7" font-family="Arial" font-weight="900" font-size="38">12.3%</text>
    <!-- Grafico de barras crescente -->
    <rect x="90" y="244" width="830" height="200" rx="4" fill="#0d1421" stroke="#1e3a5f" stroke-width="0.5"/>
    <text x="110" y="268" fill="#6b7280" font-family="Arial" font-size="12" letter-spacing="1">RECEITA DIARIA (R$)</text>
    <g fill="#3b82f6">
      <rect x="110" y="400" width="35" height="35" opacity="0.6"/>
      <rect x="165" y="385" width="35" height="50" opacity="0.65"/>
      <rect x="220" y="370" width="35" height="65" opacity="0.7"/>
      <rect x="275" y="380" width="35" height="55" opacity="0.65"/>
      <rect x="330" y="355" width="35" height="80" opacity="0.75"/>
      <rect x="385" y="335" width="35" height="100" opacity="0.8"/>
      <rect x="440" y="345" width="35" height="90" opacity="0.75"/>
      <rect x="495" y="318" width="35" height="117" opacity="0.85"/>
      <rect x="550" y="300" width="35" height="135" opacity="0.9"/>
      <rect x="605" y="308" width="35" height="127" opacity="0.85"/>
    </g>
    <rect x="660" y="282" width="35" height="153" fill="#22c55e" opacity="1"/>
    <rect x="715" y="268" width="35" height="167" fill="#22c55e" opacity="1"/>
    <rect x="770" y="252" width="35" height="183" fill="#22c55e" opacity="1"/>
    <rect x="825" y="240" width="55" height="195" fill="#22c55e" opacity="1"/>
    <!-- Labels plataformas -->
    <text x="110" y="462" fill="#4b7bff" font-family="Arial" font-weight="900" font-size="14">META ADS</text>
    <text x="320" y="462" fill="#ea4335" font-family="Arial" font-weight="900" font-size="14">GOOGLE ADS</text>
    <text x="580" y="462" fill="#00f2ea" font-family="Arial" font-weight="900" font-size="14">TIKTOK ADS</text>
    <text x="780" y="462" fill="#ff0000" font-family="Arial" font-weight="900" font-size="14">YOUTUBE</text>
    <!-- Funil -->
    <rect x="90" y="480" width="830" height="180" rx="4" fill="#0d1421" stroke="#1e3a5f" stroke-width="0.5"/>
    <text x="110" y="504" fill="#6b7280" font-family="Arial" font-size="12" letter-spacing="1">FUNIL DE CONVERSAO</text>
    <polygon points="90,520 930,520 860,640 160,640" fill="#3b82f6" opacity="0.12" stroke="#3b82f6" stroke-width="1"/>
    <polygon points="160,520 860,520 800,580 220,580" fill="#3b82f6" opacity="0.2"/>
    <polygon points="220,520 800,520 750,560 270,560" fill="#3b82f6" opacity="0.35"/>
    <text x="512" y="548" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="700" font-size="16">TRAFEGO → LEADS → VENDAS</text>'''

def elementos_brain():
    return '''
    <!-- Cerebro glowing -->
    <radialGradient id="brainGlow" cx="50%" cy="45%" r="40%">
      <stop offset="0%" stop-color="#a855f7" stop-opacity="0.5"/>
      <stop offset="60%" stop-color="#7c3aed" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    <rect x="0" y="0" width="1024" height="1792" fill="url(#brainGlow)"/>
    <!-- Contorno cerebro -->
    <path d="M312,180 C260,180 210,230 210,290 C210,330 225,365 250,388 C228,408 215,438 215,470 C215,530 258,578 312,578 C328,592 350,600 375,600 L649,600 C674,600 696,592 712,578 C766,578 809,530 809,470 C809,438 796,408 774,388 C799,365 814,330 814,290 C814,230 764,180 712,180 C698,162 678,152 655,152 L369,152 C346,152 326,162 312,180 Z" fill="none" stroke="#a855f7" stroke-width="2" opacity="0.6"/>
    <!-- Divisao hemisferios -->
    <line x1="512" y1="152" x2="512" y2="600" stroke="#a855f7" stroke-width="1" stroke-dasharray="6,4" opacity="0.3"/>
    <!-- Sulcos -->
    <path d="M270,250 Q340,230 400,260 Q460,230 520,260 Q580,230 640,260 Q700,230 754,250" fill="none" stroke="#7c3aed" stroke-width="1.5" opacity="0.5"/>
    <path d="M250,320 Q320,300 390,325 Q460,300 530,325 Q600,300 670,325 Q720,300 770,320" fill="none" stroke="#7c3aed" stroke-width="1.5" opacity="0.45"/>
    <path d="M240,395 Q315,375 385,400 Q455,375 525,400 Q595,375 665,400 Q730,375 780,395" fill="none" stroke="#7c3aed" stroke-width="1.5" opacity="0.4"/>
    <path d="M248,468 Q320,448 395,470 Q468,448 540,470 Q613,448 685,470 Q748,448 776,468" fill="none" stroke="#7c3aed" stroke-width="1.4" opacity="0.35"/>
    <path d="M265,535 Q340,515 415,535 Q490,515 565,535 Q635,515 706,535 Q750,515 759,535" fill="none" stroke="#7c3aed" stroke-width="1.2" opacity="0.3"/>
    <!-- Neuronios -->
    <circle cx="320" cy="270" r="8" fill="#a855f7" opacity="0.9"/>
    <circle cx="512" cy="230" r="8" fill="#ec4899" opacity="0.9"/>
    <circle cx="704" cy="270" r="8" fill="#3b82f6" opacity="0.9"/>
    <circle cx="280" cy="390" r="7" fill="#a855f7" opacity="0.8"/>
    <circle cx="420" cy="350" r="7" fill="#ec4899" opacity="0.8"/>
    <circle cx="512" cy="440" r="9" fill="#a855f7" opacity="0.95"/>
    <circle cx="604" cy="350" r="7" fill="#3b82f6" opacity="0.8"/>
    <circle cx="744" cy="390" r="7" fill="#a855f7" opacity="0.8"/>
    <!-- Sinapses -->
    <line x1="320" y1="270" x2="512" y2="230" stroke="#a855f7" stroke-width="1.5" opacity="0.6"/>
    <line x1="512" y1="230" x2="704" y2="270" stroke="#ec4899" stroke-width="1.5" opacity="0.6"/>
    <line x1="320" y1="270" x2="280" y2="390" stroke="#a855f7" stroke-width="1.2" opacity="0.5"/>
    <line x1="512" y1="230" x2="420" y2="350" stroke="#ec4899" stroke-width="1.2" opacity="0.5"/>
    <line x1="512" y1="230" x2="604" y2="350" stroke="#3b82f6" stroke-width="1.2" opacity="0.5"/>
    <line x1="420" y1="350" x2="512" y2="440" stroke="#a855f7" stroke-width="1.2" opacity="0.5"/>
    <line x1="604" y1="350" x2="512" y2="440" stroke="#3b82f6" stroke-width="1.2" opacity="0.5"/>
    <!-- Pecas de xadrez -->
    <g opacity="0.2" fill="#a855f7">
      <rect x="180" y="480" width="30" height="60" rx="4"/>
      <circle cx="195" cy="470" r="20"/>
      <rect x="794" y="480" width="30" height="60" rx="4"/>
      <circle cx="809" cy="470" r="20"/>
    </g>'''

def elementos_eye():
    return '''
    <!-- Olho de vigilancia -->
    <ellipse cx="512" cy="420" rx="320" ry="210" fill="none" stroke="#dc2626" stroke-width="2.5" opacity="0.7"/>
    <!-- Palpebras -->
    <path d="M192,420 Q352,220 512,200 Q672,220 832,420" fill="#050010" stroke="#dc2626" stroke-width="1.5" opacity="0.6"/>
    <path d="M192,420 Q352,620 512,640 Q672,620 832,420" fill="#050010" stroke="#dc2626" stroke-width="1.5" opacity="0.6"/>
    <!-- Iris -->
    <circle cx="512" cy="420" r="140" fill="none" stroke="#dc2626" stroke-width="2" opacity="0.6"/>
    <circle cx="512" cy="420" r="100" fill="#1a0010" stroke="#dc2626" stroke-width="1.5" opacity="0.7"/>
    <!-- Pupila -->
    <circle cx="512" cy="420" r="60" fill="#dc2626" opacity="0.85"/>
    <circle cx="512" cy="420" r="30" fill="#050005"/>
    <!-- Reflexo -->
    <circle cx="488" cy="398" r="14" fill="#fff" opacity="0.25"/>
    <!-- Raios de vigilancia -->
    <g stroke="#dc2626" stroke-width="1" opacity="0.2">
      <line x1="512" y1="210" x2="512" y2="130"/>
      <line x1="832" y1="420" x2="920" y2="420"/>
      <line x1="192" y1="420" x2="104" y2="420"/>
      <line x1="750" y1="258" x2="820" y2="200"/>
      <line x1="274" y1="258" x2="204" y2="200"/>
    </g>
    <!-- Cadeado -->
    <rect x="432" y="580" width="160" height="130" rx="10" fill="#111" stroke="#dc2626" stroke-width="2" opacity="0.9"/>
    <path d="M462,580 Q462,520 512,520 Q562,520 562,580" fill="none" stroke="#dc2626" stroke-width="3" opacity="0.8"/>
    <circle cx="512" cy="628" r="22" fill="none" stroke="#dc2626" stroke-width="2" opacity="0.8"/>
    <rect x="505" y="628" width="14" height="35" rx="4" fill="#dc2626" opacity="0.8"/>
    <!-- Codigo ao fundo -->
    <g font-family="monospace" font-size="13" opacity="0.08" fill="#ef4444">
      <text x="30" y="100">01101100 CENSURA_ATIVA=TRUE</text>
      <text x="30" y="130">FIREWALL_ON ACCESS_DENIED 403</text>
      <text x="30" y="160">VPN_BLOCKED INTERNET_RESTRICTED</text>
      <text x="30" y="190">KEYWORD_BLOCKED: LIBERDADE</text>
      <text x="30" y="220">DEEP_PACKET_INSPECTION=ON</text>
    </g>
    <!-- Selos -->
    <rect x="80" y="720" width="240" height="55" fill="none" stroke="#dc2626" stroke-width="2" opacity="0.8"/>
    <text x="200" y="750" text-anchor="middle" fill="#dc2626" font-family="Arial" font-weight="900" font-size="18" letter-spacing="2">CENSURADO</text>
    <text x="200" y="768" text-anchor="middle" fill="#dc2626" font-family="Arial" font-size="12" letter-spacing="1">ERROR 403</text>
    <rect x="704" y="720" width="240" height="55" fill="#7c3aed" opacity="0.3" stroke="#7c3aed" stroke-width="2"/>
    <text x="824" y="750" text-anchor="middle" fill="#c4b5fd" font-family="Arial" font-weight="900" font-size="18" letter-spacing="2">BLOQUEADO</text>
    <text x="824" y="768" text-anchor="middle" fill="#c4b5fd" font-family="Arial" font-size="12" letter-spacing="1">VPN DETECT</text>'''

def elementos_heart():
    return '''
    <!-- Silhueta em meditacao -->
    <!-- Cabeca -->
    <circle cx="512" cy="280" r="70" fill="none" stroke="#f43f5e" stroke-width="1.5" opacity="0.4"/>
    <circle cx="512" cy="280" r="70" fill="#f43f5e" opacity="0.04"/>
    <!-- Pescoco -->
    <rect x="490" y="348" width="44" height="40" rx="6" fill="none" stroke="#f43f5e" stroke-width="1" opacity="0.3"/>
    <!-- Tronco -->
    <path d="M270,580 L320,388 L512,378 L704,388 L754,580 Q730,630 512,640 Q294,630 270,580 Z" fill="none" stroke="#f43f5e" stroke-width="1.5" opacity="0.38"/>
    <!-- Coracao luminoso -->
    <path d="M512,510 C512,510 452,470 452,432 C452,410 468,396 486,396 C496,397 504,403 512,412 C520,403 528,397 538,396 C556,396 572,410 572,432 C572,470 512,510 512,510 Z" fill="#f43f5e" opacity="0.9"/>
    <!-- Brilho do coracao -->
    <circle cx="512" cy="450" r="80" fill="#f43f5e" opacity="0.15"/>
    <circle cx="512" cy="450" r="130" fill="none" stroke="#f43f5e" stroke-width="1.5" opacity="0.25"/>
    <circle cx="512" cy="450" r="180" fill="none" stroke="#f43f5e" stroke-width="1" opacity="0.15"/>
    <circle cx="512" cy="450" r="240" fill="none" stroke="#f43f5e" stroke-width="0.8" opacity="0.08"/>
    <!-- Pulso cardiaco -->
    <polyline points="80,540 160,540 195,490 230,595 265,470 300,540 340,540 512,540 580,540 615,505 650,580 685,520 720,540 944,540" fill="none" stroke="#f43f5e" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" opacity="0.7"/>
    <!-- Particulas de luz -->
    <g fill="#f43f5e" opacity="0.5">
      <circle cx="200" cy="320" r="4"/>
      <circle cx="280" cy="240" r="3"/>
      <circle cx="180" cy="440" r="5"/>
      <circle cx="820" cy="300" r="4"/>
      <circle cx="760" cy="220" r="3"/>
      <circle cx="840" cy="420" r="5"/>
      <circle cx="350" cy="160" r="3"/>
      <circle cx="650" cy="155" r="3"/>
      <circle cx="450" cy="130" r="4"/>
      <circle cx="570" cy="145" r="3"/>
    </g>
    <!-- Labels 5 pilares -->
    <text x="512" y="70" text-anchor="middle" fill="#f43f5e" font-family="Arial" font-weight="700" font-size="18" opacity="0.8" letter-spacing="2">AUTOCONHECIMENTO</text>
    <text x="95" y="240" text-anchor="middle" fill="#fb7185" font-family="Arial" font-weight="700" font-size="15" opacity="0.75">AUTO-</text>
    <text x="95" y="260" text-anchor="middle" fill="#fb7185" font-family="Arial" font-weight="700" font-size="15" opacity="0.75">CONTROLE</text>
    <text x="929" y="240" text-anchor="middle" fill="#fb7185" font-family="Arial" font-weight="700" font-size="15" opacity="0.75">EMPATIA</text>
    <text x="85" y="480" text-anchor="middle" fill="#fda4af" font-family="Arial" font-weight="700" font-size="14" opacity="0.7">HAB.</text>
    <text x="85" y="498" text-anchor="middle" fill="#fda4af" font-family="Arial" font-weight="700" font-size="14" opacity="0.7">SOCIAIS</text>
    <text x="939" y="480" text-anchor="middle" fill="#fda4af" font-family="Arial" font-weight="700" font-size="14" opacity="0.7">MOTI-</text>
    <text x="939" y="498" text-anchor="middle" fill="#fda4af" font-family="Arial" font-weight="700" font-size="14" opacity="0.7">VACAO</text>'''

def elementos_default():
    return '''
    <!-- Simbolo academico -->
    <circle cx="512" cy="420" r="200" fill="none" stroke="#5b7fff" stroke-width="1.5" opacity="0.3"/>
    <circle cx="512" cy="420" r="150" fill="none" stroke="#5b7fff" stroke-width="1" opacity="0.2"/>
    <text x="512" y="470" text-anchor="middle" fill="#5b7fff" font-family="Arial" font-size="120" opacity="0.2">🎓</text>
    <!-- Raios de luz -->
    <g stroke="#5b7fff" stroke-width="1" opacity="0.1">
      <line x1="512" y1="220" x2="512" y2="100"/>
      <line x1="654" y1="278" x2="722" y2="172"/>
      <line x1="712" y1="420" x2="840" y2="420"/>
      <line x1="654" y1="562" x2="722" y2="668"/>
      <line x1="370" y1="278" x2="302" y2="172"/>
      <line x1="312" y1="420" x2="184" y2="420"/>
    </g>'''

ELEMENTOS_MAP = {
    'globe': elementos_globe,
    'bank': elementos_bank,
    'war': elementos_war,
    'trophy': elementos_trophy,
    'bitcoin': elementos_bitcoin,
    'ads': elementos_ads,
    'brain': elementos_brain,
    'eye': elementos_eye,
    'heart': elementos_heart,
    'default': elementos_default,
}

# ── GERADOR SVG PRINCIPAL ─────────────────────────────────────────────────────
def gerar_svg(curso_id, curso_nome, horas, modulos, topicos):
    tema = TEMAS.get(curso_id, TEMA_DEFAULT.copy())
    tema['nome'] = curso_nome.upper()

    cor1   = tema['cor1']
    cor2   = tema['cor2']
    accent = tema['accent']
    acc2   = tema['accent2']
    sub    = tema['sub']
    elem   = ELEMENTOS_MAP.get(tema['elementos'], elementos_default)()

    # Quebrar titulo em linhas
    palavras = tema['nome'].split()
    linhas, atual = [], ''
    for p in palavras:
        teste = (atual + ' ' + p).strip()
        if len(teste) > 16 and atual:
            linhas.append(atual)
            atual = p
        else:
            atual = teste
    if atual: linhas.append(atual)

    font_size = 88 if max(len(l) for l in linhas) <= 12 else 72 if max(len(l) for l in linhas) <= 16 else 58
    line_h    = font_size + 10
    total_h   = len(linhas) * line_h
    ty_start  = 1792 - 80 - int(1792 * 0.18) - total_h

    titulo_svg = ''
    for i, linha in enumerate(linhas):
        y = ty_start + i * line_h + font_size
        titulo_svg += f'''
    <text x="516" y="{y+3}" text-anchor="middle" fill="#000000" font-family="Arial Black, Arial" font-weight="900" font-size="{font_size}" opacity="0.5">{linha}</text>
    <text x="512" y="{y}" text-anchor="middle" fill="#ffffff" font-family="Arial Black, Arial" font-weight="900" font-size="{font_size}" stroke="#000000" stroke-width="6" paint-order="stroke">{linha}</text>'''

    sep_y = ty_start + total_h + 14
    meta_txt = f"{horas}H  |  {modulos} MODULOS  |  {topicos} TOPICOS"

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1792" width="1024" height="1792">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="{cor1}"/>
      <stop offset="100%" stop-color="{cor2}"/>
    </linearGradient>
    <linearGradient id="acc" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="{accent}" stop-opacity="0"/>
      <stop offset="50%" stop-color="{accent}"/>
      <stop offset="100%" stop-color="{accent}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="acc2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{accent}"/>
      <stop offset="100%" stop-color="{acc2}"/>
    </linearGradient>
    <linearGradient id="fadeBottom" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="55%" stop-color="#000000" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.98"/>
    </linearGradient>
    <linearGradient id="fadeTop" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Fundo -->
  <rect width="1024" height="1792" fill="url(#bg)"/>

  <!-- Elementos visuais tematicos -->
  {elem}

  <!-- Gradiente escuro embaixo (area do titulo) -->
  <rect width="1024" height="1792" fill="url(#fadeBottom)"/>

  <!-- Gradiente escuro em cima -->
  <rect width="1024" height="340" fill="url(#fadeTop)"/>

  <!-- Linha de cor no topo -->
  <rect x="0" y="0" width="1024" height="10" fill="url(#acc2)"/>

  <!-- TITULO -->
  {titulo_svg}

  <!-- Linha decorativa -->
  <rect x="60" y="{sep_y}" width="904" height="5" fill="url(#acc)" opacity="0.9" rx="2"/>

  <!-- Subtitulo -->
  <text x="512" y="{sep_y + 40}" text-anchor="middle" fill="{accent}" font-family="Arial" font-weight="700" font-size="26" opacity="0.95"
    stroke="#000000" stroke-width="3" paint-order="stroke">{sub}</text>

  <!-- Metadados -->
  <text x="512" y="{1792 - 35}" text-anchor="middle" fill="#9ca3af" font-family="Arial" font-size="22" opacity="0.85"
    stroke="#000000" stroke-width="3" paint-order="stroke">{meta_txt}</text>

  <!-- Barra lateral esquerda -->
  <rect x="0" y="0" width="8" height="1792" fill="url(#acc2)" opacity="0.8"/>

</svg>'''
    return svg

# ── EXTRAIR CURSOS ────────────────────────────────────────────────────────────
def extrair_cursos(conteudo):
    cursos = []
    for m in re.compile(r'\{\s*(?:[^{}]|\{[^{}]*\})*\s*\}', re.DOTALL).finditer(conteudo):
        b = m.group(0)
        id_m  = re.search(r"id:\s*['\"](\w+)['\"]", b)
        nm_m  = re.search(r"name:\s*['\"]([^'\"]+)['\"]", b)
        if not (id_m and nm_m): continue
        cursos.append({
            'id':      id_m.group(1),
            'nome':    nm_m.group(1),
            'hours':   (re.search(r"hours:\s*(\d+)",   b) or type('',(),{'group':lambda s,x:'0'})()).group(1),
            'modules': (re.search(r"modules:\s*(\d+)", b) or type('',(),{'group':lambda s,x:'0'})()).group(1),
            'topics':  (re.search(r"topics:\s*(\d+)",  b) or type('',(),{'group':lambda s,x:'0'})()).group(1),
        })
    return cursos

def detectar_novos(cursos):
    novos = []
    for c in cursos:
        jpg = CAPAS_DIR / f"{c['id']}.jpg"
        png = CAPAS_DIR / f"{c['id']}.png"
        svg = CAPAS_DIR / f"{c['id']}.svg"
        if not jpg.exists() and not png.exists() and not svg.exists():
            log(f"Novo sem capa: {c['nome']} [{c['id']}]")
            novos.append(c)
        else:
            log(f"Ja tem capa: {c['nome']} [{c['id']}] — mantendo")
    return novos

def gerar_capa(curso):
    svg = gerar_svg(
        curso['id'], curso['nome'],
        curso['hours'], curso['modules'], curso['topics']
    )
    CAPAS_DIR.mkdir(parents=True, exist_ok=True)
    path = CAPAS_DIR / f"{curso['id']}.svg"
    path.write_text(svg, encoding='utf-8')
    log(f"Capa SVG salva: {path}")
    return True

def atualizar_courses_js(cp, gerados):
    txt = Path(cp).read_text(encoding='utf-8')
    for cid in gerados:
        url = f"assets/capas/{cid}.svg"
        pat = f"id: '{cid}'"
        if pat in txt:
            pos = txt.find(pat)
            if 'coverImg' not in txt[pos:pos+400]:
                txt = txt.replace(pat, f"id: '{cid}',\n    coverImg: '{url}'", 1)
                log(f"coverImg adicionado: {cid}")
    Path(cp).write_text(txt, encoding='utf-8')

def main():
    log("="*50)
    log("MATHEUS ACADEMY - GERADOR SVG AUTOMATICO v5")
    log("Gera capa apenas para cursos NOVOS")
    log("="*50)

    cp = Path(COURSES_FILE)
    if not cp.exists(): cp = Path('courses.js')
    if not cp.exists(): log("courses.js nao encontrado!"); exit(1)

    txt    = cp.read_text(encoding='utf-8')
    cursos = extrair_cursos(txt)
    log(f"Cursos encontrados: {len(cursos)}")

    novos = detectar_novos(cursos)
    if not novos:
        log("Nenhum curso novo! Nada a fazer.")
        exit(0)

    log(f"Capas a gerar: {len(novos)}")
    ok = []
    for c in novos:
        log(f"Gerando: {c['nome']}")
        if gerar_capa(c): ok.append(c['id'])

    if ok: atualizar_courses_js(str(cp), ok)
    log(f"Concluido! {len(ok)} capas geradas.")

if __name__ == '__main__':
    main()
