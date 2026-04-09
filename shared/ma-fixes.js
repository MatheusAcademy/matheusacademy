/**
 * Matheus Academy Multi-Fix Script
 * Implements: SEO meta tags, LGPD cookie consent, localStorage cleanup,
 * error monitoring, lazy loading, and structured data injection
 *
 * Inject this script into the <head> or early in <body> for best results
 */

(function() {
  'use strict';

  // ==================== CONFIG ====================
  const CONFIG = {
    siteUrl: 'https://matheusacademy.com.br',
    metaDescription: 'Matheus Academy — Plataforma de cursos online gratuitos sobre geopolítica, negócios, finanças, política, filosofia e muito mais. Aprenda com conteúdo exclusivo e atualizado.',
    ogImage: 'https://matheusacademy.com.br/shared/icon-192.png',
    privacyPolicyUrl: '#politica-privacidade',
    cookieConsentKey: 'ma_cookie_consent',
    maxErrorsStored: 50,
    bannerBgColor: '#1a1a2e'
  };

  // ==================== GLOBAL ERROR MONITORING ====================
  window.__MA_ERRORS = [];

  window.onerror = function(message, source, lineno, colno, error) {
    const errorObj = {
      message,
      source,
      line: lineno,
      column: colno,
      timestamp: new Date().toISOString(),
      stack: error?.stack || 'N/A'
    };

    window.__MA_ERRORS.push(errorObj);
    if (window.__MA_ERRORS.length > CONFIG.maxErrorsStored) {
      window.__MA_ERRORS.shift();
    }

    console.log('[MA-ERROR]', errorObj);
    return false;
  };

  window.addEventListener('unhandledrejection', function(event) {
    const errorObj = {
      message: event.reason?.message || String(event.reason),
      source: 'unhandledrejection',
      timestamp: new Date().toISOString(),
      stack: event.reason?.stack || 'N/A'
    };

    window.__MA_ERRORS.push(errorObj);
    if (window.__MA_ERRORS.length > CONFIG.maxErrorsStored) {
      window.__MA_ERRORS.shift();
    }

    console.log('[MA-ERROR]', errorObj);
  });

  // ==================== UTILITY FUNCTIONS ====================

  function metaExists(property, attr) {
    attr = attr || 'name';
    return document.querySelector('meta[' + attr + '="' + property + '"]') !== null;
  }

  function injectMeta(property, content, attr) {
    attr = attr || 'name';
    if (metaExists(property, attr)) return;
    var meta = document.createElement('meta');
    meta.setAttribute(attr, property);
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  }

  function getCanonicalUrl() {
    var url = new URL(window.location.href);
    url.search = '';
    return url.toString();
  }

  function extractCourseName() {
    var title = document.title || '';
    var pathname = window.location.pathname;
    var match = pathname.match(/\/(?:cursos?|courses?|aulas?|lessons?)\/([^/?]+)/);
    if (match) {
      return decodeURIComponent(match[1]).replace(/[-_]/g, ' ');
    }
    return title.split('|')[0].trim();
  }

  function cleanUndefinedKeys() {
    try {
      var keysToRemove = [];
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key && key.startsWith('undefined')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(function(key) { localStorage.removeItem(key); });
      if (keysToRemove.length > 0) {
        console.log('[MA-FIX] Cleaned up ' + keysToRemove.length + ' undefined keys from localStorage');
      }
    } catch (e) {
      console.warn('[MA-FIX] Could not clean localStorage:', e);
    }
  }

  // ==================== SEO META TAGS INJECTION ====================

  function injectSeoTags() {
    var courseName = extractCourseName();
    var isCoursePage = courseName && courseName !== document.title;

    var ogTitle = isCoursePage
      ? courseName + ' — Matheus Academy'
      : 'Matheus Academy — Cursos Online Gratuitos';

    var ogDesc = isCoursePage
      ? 'Aprenda ' + courseName + ' com a Matheus Academy. Cursos online gratuitos sobre geopolítica, negócios, finanças, política, filosofia e muito mais.'
      : CONFIG.metaDescription;

    injectMeta('description', ogDesc);
    injectMeta('og:title', ogTitle, 'property');
    injectMeta('og:description', ogDesc, 'property');
    injectMeta('og:image', CONFIG.ogImage, 'property');
    injectMeta('og:url', window.location.href, 'property');
    injectMeta('og:type', 'website', 'property');
    injectMeta('og:locale', 'pt_BR', 'property');
    injectMeta('twitter:card', 'summary_large_image', 'name');
    injectMeta('twitter:title', ogTitle, 'name');
    injectMeta('twitter:description', ogDesc, 'name');
    injectMeta('robots', 'index, follow', 'name');

    var canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = getCanonicalUrl();
      document.head.appendChild(canonical);
    }
  }

  // ==================== JSON-LD STRUCTURED DATA ====================

  function injectStructuredData() {
    var existing = document.querySelector('script[type="application/ld+json"]');
    if (existing) return;

    var organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'Matheus Academy',
      'url': CONFIG.siteUrl,
      'logo': CONFIG.ogImage,
      'description': 'Plataforma de cursos online gratuitos sobre geopolítica, negócios, finanças, política, filosofia e muito mais'
    };

    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(organizationSchema);
    document.head.appendChild(script);
  }

  // ==================== LAZY LOADING FOR IMAGES ====================

  function enableLazyLoading() {
    var images = document.querySelectorAll('img:not([loading])');
    images.forEach(function(img) {
      img.setAttribute('loading', 'lazy');
    });
  }

  // ==================== LGPD COOKIE CONSENT BANNER ====================

  function createAndInjectCookieBanner() {
    try {
      var consent = localStorage.getItem(CONFIG.cookieConsentKey);
      if (consent) {
        console.log('[MA-FIX] Cookie consent already recorded:', consent);
        return;
      }
    } catch (e) {
      console.warn('[MA-FIX] Could not read localStorage for consent:', e);
    }

    var styleElement = document.createElement('style');
    styleElement.textContent = '#ma-cookie-banner{position:fixed;bottom:0;left:0;right:0;background-color:' + CONFIG.bannerBgColor + ';border-top:1px solid rgba(255,255,255,0.1);padding:20px;z-index:9999;animation:ma-slide-up .4s ease-out;box-shadow:0 -4px 12px rgba(0,0,0,0.3)}@keyframes ma-slide-up{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}#ma-cookie-banner-content{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;font-size:14px;line-height:1.5}#ma-cookie-banner-text{flex:1;min-width:250px}#ma-cookie-banner-text a{color:#4a9eff;text-decoration:none;border-bottom:1px solid rgba(74,158,255,.5)}#ma-cookie-banner-text a:hover{color:#7bb3ff}#ma-cookie-banner-buttons{display:flex;gap:12px;flex-wrap:wrap}.ma-cookie-btn{padding:10px 20px;border:none;border-radius:4px;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s ease;font-family:inherit}#ma-cookie-accept{background:#10b981;color:#fff}#ma-cookie-accept:hover{background:#059669}#ma-cookie-reject{background:transparent;color:#d1d5db;border:1px solid #4b5563}#ma-cookie-reject:hover{background:rgba(255,255,255,.05);color:#fff}@media(max-width:768px){#ma-cookie-banner-content{flex-direction:column;align-items:flex-start}#ma-cookie-banner-buttons{width:100%}.ma-cookie-btn{flex:1;min-width:120px}}';
    document.head.appendChild(styleElement);

    var banner = document.createElement('div');
    banner.id = 'ma-cookie-banner';
    banner.innerHTML = '<div id="ma-cookie-banner-content"><div id="ma-cookie-banner-text">Este site utiliza cookies e armazenamento local para melhorar sua experiência e salvar seu progresso nos cursos. Ao continuar navegando, você concorda com nossa <a href="' + CONFIG.privacyPolicyUrl + '">Política de Privacidade</a>.</div><div id="ma-cookie-banner-buttons"><button id="ma-cookie-accept" class="ma-cookie-btn">Aceitar</button><button id="ma-cookie-reject" class="ma-cookie-btn">Recusar</button></div></div>';
    document.body.appendChild(banner);

    document.getElementById('ma-cookie-accept').addEventListener('click', function() {
      try {
        localStorage.setItem(CONFIG.cookieConsentKey, JSON.stringify({status:'accepted',timestamp:new Date().toISOString()}));
      } catch(e) {}
      banner.remove();
    });

    document.getElementById('ma-cookie-reject').addEventListener('click', function() {
      try {
        localStorage.setItem(CONFIG.cookieConsentKey, JSON.stringify({status:'rejected',timestamp:new Date().toISOString()}));
      } catch(e) {}
      banner.remove();
    });
  }

  // ==================== INITIALIZATION ====================

  function init() {
    cleanUndefinedKeys();
    injectSeoTags();
    injectStructuredData();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        enableLazyLoading();
        createAndInjectCookieBanner();
      });
    } else {
      enableLazyLoading();
      createAndInjectCookieBanner();
    }

    if (window.MutationObserver) {
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.addedNodes.length) {
            mutation.addedNodes.forEach(function(node) {
              if (node.nodeType === 1 && node.tagName === 'IMG' && !node.hasAttribute('loading')) {
                node.setAttribute('loading', 'lazy');
              } else if (node.nodeType === 1) {
                var imgs = node.querySelectorAll('img:not([loading])');
                imgs.forEach(function(img) {
                  img.setAttribute('loading', 'lazy');
                });
              }
            });
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  init();
})();
