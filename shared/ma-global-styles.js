/*
 * Matheus Academy Global Styles Injection
 * Provides CSS variables and shared footer across all pages
 */

(function() {
  // Inject CSS variables and global styles
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    :root {
      --ma-blue: #4b8bff;
      --ma-blue-dark: #2563eb;
      --ma-gold: #f59e0b;
      --ma-gold-dark: #d97706;
      --ma-neon: #00d4ff;
      --ma-purple: #a855f7;
      --ma-green: #22c55e;
      --ma-red: #ef4444;
    }

    /* Global footer styles */
    .ma-global-footer {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding: 24px;
      margin-top: 32px;
      text-align: center;
      background: rgba(0, 0, 0, 0.2);
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.7);
    }

    .ma-global-footer a {
      color: var(--ma-blue);
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .ma-global-footer a:hover {
      color: var(--ma-neon);
    }

    .ma-global-footer-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
    }

    .ma-global-footer-links {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
      align-items: center;
    }

    .ma-global-footer-links a {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid rgba(75, 139, 255, 0.2);
      transition: all 0.2s ease;
    }

    .ma-global-footer-links a:hover {
      border-color: var(--ma-neon);
      background: rgba(0, 212, 255, 0.05);
    }

    .ma-global-footer-copyright {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.75rem;
    }

    @media (max-width: 640px) {
      .ma-global-footer {
        padding: 16px;
        margin-top: 24px;
      }

      .ma-global-footer-links {
        gap: 8px;
      }

      .ma-global-footer-links a {
        padding: 5px 10px;
        font-size: 0.75rem;
      }
    }
  `;
  document.head.appendChild(styleSheet);

  // Inject footer into pages (except index.html)
  function injectFooter() {
    // Don't inject if we're on index.html (it has its own footer)
    const isIndexPage = window.location.pathname.endsWith('/') ||
                       window.location.pathname.endsWith('index.html');

    if (isIndexPage) return;

    // Don't inject if footer already exists
    if (document.querySelector('.ma-global-footer')) return;

    // Find the main content container or body
    const mainContent = document.querySelector('main') ||
                       document.querySelector('.course-content') ||
                       document.body;

    const footer = document.createElement('footer');
    footer.className = 'ma-global-footer';
    footer.innerHTML = `
      <div class="ma-global-footer-content">
        <div class="ma-global-footer-links">
          <a href="/planos.html" title="Planos e Preços">Planos</a>
          <span style="color: rgba(255, 255, 255, 0.3);">·</span>
          <a href="https://instagram.com/matheusacademy" target="_blank" title="Instagram" class="ig">
            <span>📱 Instagram</span>
          </a>
          <span style="color: rgba(255, 255, 255, 0.3);">·</span>
          <a href="https://t.me/matheusacademy" target="_blank" title="Telegram" class="tg">
            <span>✈️ Telegram</span>
          </a>
        </div>
        <div class="ma-global-footer-copyright">
          © 2025 Matheus Academy · Conhecimento que transforma
        </div>
      </div>
    `;

    // Append to main content or body
    if (mainContent) {
      mainContent.appendChild(footer);
    } else {
      document.body.appendChild(footer);
    }
  }

  // Inject footer when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFooter);
  } else {
    injectFooter();
  }

  // Also observe for dynamic content changes
  if (window.MutationObserver) {
    const observer = new MutationObserver(() => {
      if (!document.querySelector('.ma-global-footer')) {
        injectFooter();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
