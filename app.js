(() => {
  'use strict';

  const root = document.documentElement;
  const themeButton = document.getElementById('themeToggle');
  const menuButton = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const closeLightbox = document.getElementById('lightboxClose');

  const safeStorage = {
    get(key, fallback) {
      try { return localStorage.getItem(key) || fallback; }
      catch (_) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); }
      catch (_) { /* La página sigue funcionando aunque el navegador bloquee el almacenamiento. */ }
    }
  };

  function setTheme(theme) {
    const normalized = theme === 'dark' ? 'dark' : 'light';
    root.dataset.theme = normalized;
    if (themeButton) {
      themeButton.textContent = normalized === 'dark' ? '☀' : '☾';
      themeButton.setAttribute('aria-pressed', String(normalized === 'dark'));
      themeButton.setAttribute('aria-label', normalized === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro');
      themeButton.title = normalized === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro';
    }
    safeStorage.set('process-theme', normalized);
  }

  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  setTheme(safeStorage.get('process-theme', prefersDark ? 'dark' : 'light'));
  themeButton?.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  function setMobileNav(open, restoreFocus = false) {
    if (!mobileNav || !menuButton) return;
    mobileNav.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    if (open) {
      mobileNav.querySelector('a')?.focus({ preventScroll: true });
    } else if (restoreFocus) {
      menuButton.focus({ preventScroll: true });
    }
  }

  menuButton?.addEventListener('click', () => setMobileNav(mobileNav.hidden));
  mobileNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMobileNav(false));
  });

  let lastFocusedElement = null;

  function openLightbox(link) {
    if (!lightbox || !lightboxImage || !closeLightbox) return;
    lastFocusedElement = document.activeElement;
    lightboxImage.src = link.href;
    lightboxImage.alt = link.querySelector('img')?.alt || 'Captura ampliada';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeLightbox.focus({ preventScroll: true });
  }

  function hideLightbox() {
    if (!lightbox || !lightboxImage) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.removeAttribute('src');
    document.body.style.overflow = '';
    if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus({ preventScroll: true });
  }

  document.querySelectorAll('.shot').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      openLightbox(link);
    });
  });

  closeLightbox?.addEventListener('click', hideLightbox);
  lightbox?.addEventListener('click', event => {
    if (event.target === lightbox) hideLightbox();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (lightbox?.classList.contains('open')) hideLightbox();
      if (mobileNav && !mobileNav.hidden) setMobileNav(false, true);
    }

    // Mantiene el foco dentro del visor de capturas cuando está abierto.
    if (event.key === 'Tab' && lightbox?.classList.contains('open') && closeLightbox) {
      event.preventDefault();
      closeLightbox.focus();
    }
  });
})();
