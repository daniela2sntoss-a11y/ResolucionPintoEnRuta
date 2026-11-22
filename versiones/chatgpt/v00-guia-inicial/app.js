'use strict';

(() => {
  const root = document.documentElement;
  const navButtons = document.querySelectorAll('[data-nav]');
  const views = document.querySelectorAll('.view');
  const themeButtons = document.querySelectorAll('[data-theme-toggle]');
  const sidebar = document.getElementById('sidebar');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileScrim = document.getElementById('mobile-scrim');
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  const allowedViews = new Set([...views].map((view) => view.id));

  function setTheme(theme) {
    const nextTheme = theme === 'dark' ? 'dark' : 'light';
    root.dataset.theme = nextTheme;
    try {
      localStorage.setItem('pinto-a-mano-theme', nextTheme);
    } catch (error) {
      // La aplicación sigue funcionando aunque el navegador bloquee localStorage.
    }
    if (themeMeta) {
      themeMeta.setAttribute('content', nextTheme === 'dark' ? '#151d1a' : '#f5f4ee');
    }
    themeButtons.forEach((button) => {
      const isDark = nextTheme === 'dark';
      button.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      button.setAttribute('title', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      const symbol = button.querySelector('.theme-symbol');
      const label = button.querySelector('.theme-label');
      if (symbol) symbol.textContent = isDark ? '☀' : '☾';
      if (label) label.textContent = isDark ? 'Modo claro' : 'Modo oscuro';
    });
  }

  function closeMobileMenu() {
    sidebar.classList.remove('open');
    mobileScrim.classList.remove('visible');
    mobileMenu.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-label', 'Abrir menú');
  }

  function navigateTo(viewId) {
    if (!allowedViews.has(viewId)) return;

    views.forEach((view) => {
      const isActive = view.id === viewId;
      view.classList.toggle('active', isActive);
      view.hidden = !isActive;
      if (isActive) {
        // Reinicia la animación cuando se vuelve a una sección ya visitada.
        view.style.animation = 'none';
        void view.offsetHeight;
        view.style.animation = '';
      }
    });

    document.querySelectorAll('.nav-link[data-nav]').forEach((button) => {
      const isActive = button.dataset.nav === viewId;
      button.classList.toggle('active', isActive);
      if (isActive) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });

    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });

    // Actualiza el fragmento de la URL para que se puedan compartir secciones.
    if (window.location.hash !== `#${viewId}`) {
      history.replaceState(null, '', `#${viewId}`);
    }
  }

  navButtons.forEach((button) => {
    button.addEventListener('click', () => navigateTo(button.dataset.nav));
  });

  themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
    });
  });

  mobileMenu.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('open');
    mobileScrim.classList.toggle('visible', isOpen);
    mobileMenu.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });

  mobileScrim.addEventListener('click', closeMobileMenu);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMobileMenu();
  });

  // Recupera el tema guardado y respeta la preferencia del sistema la primera vez.
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem('pinto-a-mano-theme');
  } catch (error) {
    // No hay problema si el almacenamiento local no está disponible.
  }
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(savedTheme || (systemPrefersDark ? 'dark' : 'light'));

  // Permite abrir la página directamente en una sección concreta usando #lugares, #barrios, etc.
  const initialView = window.location.hash.replace('#', '');
  if (allowedViews.has(initialView)) navigateTo(initialView);
})();
