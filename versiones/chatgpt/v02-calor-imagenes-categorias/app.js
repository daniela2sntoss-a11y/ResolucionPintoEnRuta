'use strict';

(() => {
  const root = document.documentElement;
  const views = [...document.querySelectorAll('.view')];
  const navButtons = [...document.querySelectorAll('[data-nav]')];
  const themeButtons = [...document.querySelectorAll('[data-theme-toggle]')];
  const sidebar = document.getElementById('sidebar');
  const menuTrigger = document.getElementById('menu-trigger');
  const drawerClose = document.getElementById('drawer-close');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const breadcrumbCurrent = document.getElementById('breadcrumb-current');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const allowedViews = new Set(views.map((view) => view.id));
  const navLabels = {
    inicio: 'INICIO',
    lugares: 'PATRIMONIO',
    zonas: 'ZONAS Y BARRIOS',
    sabores: 'GASTRONOMÍA',
    ocio: 'DEPORTE Y OCIO',
    planifica: 'PLANIFICA TU VISITA',
    pasaporte: 'PASAPORTE PINTEÑO'
  };

  const FILTERS = {
    quiet: { label: 'Paseo tranquilo', message: 'lugares adecuados para un paseo tranquilo', tags: ['quiet'] },
    shade: { label: 'Zonas de sombra', message: 'lugares con arbolado o sombra habitual', tags: ['shade'] },
    interior: { label: 'Interior / lluvia', message: 'propuestas de interior o visita cultural', tags: ['interior'] }
  };

  const STAMPS = {
    torre: {
      title: 'Torre de Éboli',
      fact: 'La Torre de Pinto fue utilizada como prisión de Estado. Entre sus prisioneros más conocidos estuvo Ana de Mendoza, princesa de Éboli, por orden de Felipe II.',
      icon: '⌖'
    },
    parque: {
      title: 'Parque Juan Carlos I',
      fact: 'El parque municipal se inauguró en 1998 y reúne espacios de ocio como Arqueopinto, un auditorio, áreas deportivas y zonas infantiles.',
      icon: '♧'
    },
    iglesia: {
      title: 'Santo Domingo de Silos',
      fact: 'La iglesia parroquial está declarada Bien de Interés Cultural y su arquitectura combina rasgos del gótico tardío y del Renacimiento.',
      icon: '⌂'
    },
    egido: {
      title: 'Parque Egido de la Fuente',
      fact: 'El Egido de la Fuente es uno de los parques más antiguos del municipio. Conserva un templete de música y arbolado de gran porte.',
      icon: '❧'
    },
    centro: {
      title: 'Centro geográfico peninsular',
      fact: 'La tradición local identifica Pinto con el centro geográfico de la Península Ibérica. Esa idea está presente en el nombre de los Ombligos de Pinto: «ombligo» significa centro o punto medio.',
      icon: '◎'
    },
    planificador: {
      title: 'Primera planificación',
      fact: 'El nombre «Pinto» se relaciona en la tradición local con el centro geográfico de la Península Ibérica; los Ombligos de Pinto recogen esa idea en su propio nombre.',
      icon: '◷'
    }
  };

  const STORAGE_KEYS = {
    theme: 'pinto-en-ruta-theme-v1',
    stamps: 'pinto-en-ruta-stamps-v1'
  };

  let activeFilter = null;
  let toastTimeout = null;
  let earnedStamps = loadStamps();

  function safeStorageGet(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }

  function safeStorageSet(key, value) {
    try { localStorage.setItem(key, value); } catch { /* El sitio sigue funcionando sin almacenamiento. */ }
  }

  function loadStamps() {
    try {
      const parsed = JSON.parse(safeStorageGet(STORAGE_KEYS.stamps) || '[]');
      return Array.isArray(parsed) ? parsed.filter((key) => Object.hasOwn(STAMPS, key)) : [];
    } catch {
      return [];
    }
  }

  function setTheme(theme) {
    const next = theme === 'dark' ? 'dark' : 'light';
    root.dataset.theme = next;
    safeStorageSet(STORAGE_KEYS.theme, next);
    if (themeMeta) themeMeta.content = next === 'dark' ? '#141b17' : '#f5f4ee';
    themeButtons.forEach((button) => {
      const dark = next === 'dark';
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      const icon = button.querySelector('.theme-icon');
      const copy = button.querySelector('.theme-copy');
      if (icon) icon.textContent = dark ? '☀' : '☾';
      if (copy) copy.textContent = dark ? 'Modo claro' : 'Modo oscuro';
    });
  }

  function openDrawer() {
    sidebar.classList.add('is-open');
    drawerBackdrop.hidden = false;
    menuTrigger.setAttribute('aria-expanded', 'true');
    menuTrigger.setAttribute('aria-label', 'Cerrar menú');
    document.body.classList.add('drawer-open');
    drawerClose.focus();
  }

  function closeDrawer({ returnFocus = false } = {}) {
    sidebar.classList.remove('is-open');
    drawerBackdrop.hidden = true;
    menuTrigger.setAttribute('aria-expanded', 'false');
    menuTrigger.setAttribute('aria-label', 'Abrir menú');
    document.body.classList.remove('drawer-open');
    if (returnFocus && window.matchMedia('(max-width: 980px)').matches) menuTrigger.focus();
  }

  function navigateTo(viewId) {
    if (!allowedViews.has(viewId)) return;
    views.forEach((view) => {
      const active = view.id === viewId;
      view.hidden = !active;
      view.classList.toggle('is-visible', active);
      if (active) {
        view.style.animation = 'none';
        void view.offsetHeight;
        view.style.animation = '';
      }
    });
    document.querySelectorAll('.nav-item[data-nav]').forEach((button) => {
      const active = button.dataset.nav === viewId;
      button.classList.toggle('is-active', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    breadcrumbCurrent.textContent = navLabels[viewId] || 'PINTO';
    closeDrawer();
    const nextHash = `#${viewId}`;
    if (window.location.hash !== nextHash) history.replaceState(null, '', nextHash);
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  navButtons.forEach((button) => {
    button.addEventListener('click', () => navigateTo(button.dataset.nav));
  });

  themeButtons.forEach((button) => {
    button.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
  });

  menuTrigger.addEventListener('click', () => {
    if (sidebar.classList.contains('is-open')) closeDrawer({ returnFocus: true });
    else openDrawer();
  });
  drawerClose.addEventListener('click', () => closeDrawer({ returnFocus: true }));
  drawerBackdrop.addEventListener('click', () => closeDrawer({ returnFocus: true }));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && sidebar.classList.contains('is-open')) closeDrawer({ returnFocus: true });
    if (event.key === 'Tab' && sidebar.classList.contains('is-open') && window.matchMedia('(max-width: 980px)').matches) {
      const focusable = [...sidebar.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled])')]
        .filter((element) => element.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // Drawer filters: they route to the place directory and filter its cards.
  function applyFilter(filterKey) {
    activeFilter = Object.hasOwn(FILTERS, filterKey) ? filterKey : null;
    document.querySelectorAll('[data-filter]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.filter === activeFilter));
    });
    const cards = [...document.querySelectorAll('#places-grid .place-card')];
    let visibleCount = 0;
    cards.forEach((card) => {
      const tags = (card.dataset.tags || '').split(/\s+/);
      const visible = !activeFilter || tags.includes(activeFilter);
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    const status = document.getElementById('filter-status');
    const emptyState = document.getElementById('empty-state');
    const statusText = status.querySelector('span:last-child');
    statusText.textContent = activeFilter
      ? `Filtro: ${FILTERS[activeFilter].message} (${visibleCount})`
      : 'Mostrando todos los lugares destacados';
    emptyState.hidden = visibleCount !== 0;
    closeDrawer();
    navigateTo('lugares');
  }

  document.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      const next = button.dataset.filter === activeFilter ? null : button.dataset.filter;
      applyFilter(next);
    });
  });
  document.getElementById('clear-filters').addEventListener('click', () => applyFilter(null));
  document.getElementById('empty-clear').addEventListener('click', () => applyFilter(null));
  document.querySelectorAll('[data-filter-jump]').forEach((button) => {
    button.addEventListener('click', () => applyFilter(button.dataset.filterJump));
  });

  // Passport: card check-ins unlock a gold stamp and a local fact.
  const stampCountLabel = document.getElementById('nav-stamp-count');
  const passportProgressLabel = document.getElementById('passport-progress-label');
  const passportProgressBar = document.getElementById('passport-progress-bar');
  const passportMessage = document.getElementById('passport-message');
  const factList = document.getElementById('fact-list');
  const unlockedCount = document.getElementById('unlocked-count');
  const lockedMessage = document.getElementById('locked-message');
  const toast = document.getElementById('toast');

  function showToast(title, message) {
    document.getElementById('toast-title').textContent = title;
    document.getElementById('toast-message').textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove('is-visible'), 4200);
  }

  function renderPassport() {
    const total = Object.keys(STAMPS).length;
    const earned = earnedStamps.length;
    stampCountLabel.textContent = `${earned}/${total}`;
    passportProgressLabel.textContent = `${earned} de ${total} sellos`;
    passportProgressBar.style.width = `${(earned / total) * 100}%`;
    passportMessage.textContent = earned === total
      ? '¡Colección completa! Ya has reunido todos los recuerdos de esta guía.'
      : earned === 0
        ? 'Empieza por cualquier lugar o registra una fecha en el planificador.'
        : `¡Buen camino! Te quedan ${total - earned} ${total - earned === 1 ? 'sello' : 'sellos'} por descubrir.`;

    document.querySelectorAll('[data-stamp]').forEach((card) => {
      const key = card.dataset.stamp;
      const earnedThis = earnedStamps.includes(key);
      const seal = card.querySelector('.stamp');
      card.classList.toggle('is-earned', earnedThis);
      seal.classList.toggle('is-earned', earnedThis);
      seal.classList.toggle('seal-locked', !earnedThis);
      card.querySelector('.stamp-state').textContent = earnedThis ? 'Sello desbloqueado' : 'Por descubrir';
    });

    factList.querySelectorAll('.fact-card').forEach((node) => node.remove());
    const unlocked = earnedStamps.filter((key) => STAMPS[key]);
    lockedMessage.hidden = unlocked.length > 0;
    unlockedCount.textContent = `${unlocked.length} disponibles`;
    unlocked.forEach((key) => {
      const item = STAMPS[key];
      const article = document.createElement('article');
      article.className = 'fact-card';
      const icon = document.createElement('span');
      icon.className = 'fact-card-icon';
      icon.textContent = item.icon;
      const copy = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = item.title;
      const paragraph = document.createElement('p');
      paragraph.textContent = item.fact;
      const label = document.createElement('small');
      label.textContent = '✦ CURIOSIDAD DESBLOQUEADA';
      copy.append(title, paragraph, label);
      article.append(icon, copy);
      factList.append(article);
    });
  }

  function registerCheckin(key) {
    if (!Object.hasOwn(STAMPS, key)) return;
    const alreadyEarned = earnedStamps.includes(key);
    if (!alreadyEarned) {
      earnedStamps = [...earnedStamps, key];
      safeStorageSet(STORAGE_KEYS.stamps, JSON.stringify(earnedStamps));
      renderPassport();
      showToast('¡Sello dorado conseguido!', `${STAMPS[key].title}: has desbloqueado una curiosidad local.`);
    } else {
      showToast('Este sello ya es tuyo', `La curiosidad de ${STAMPS[key].title} ya está en tu pasaporte.`);
    }
  }

  document.querySelectorAll('[data-checkin]').forEach((button) => {
    button.addEventListener('click', () => registerCheckin(button.dataset.checkin));
  });
  document.getElementById('reset-passport').addEventListener('click', () => {
    earnedStamps = [];
    safeStorageSet(STORAGE_KEYS.stamps, JSON.stringify(earnedStamps));
    renderPassport();
    showToast('Pasaporte reiniciado', 'Puedes volver a descubrir todos los sellos.');
  });
  document.getElementById('toast-close').addEventListener('click', () => toast.classList.remove('is-visible'));
  renderPassport();

  // Gallery carousel.
  const gallery = document.getElementById('gallery-track');
  const galleryPrev = document.getElementById('gallery-prev');
  const galleryNext = document.getElementById('gallery-next');
  const galleryProgress = document.getElementById('gallery-progress');
  function updateGalleryControls() {
    const maxScroll = Math.max(1, gallery.scrollWidth - gallery.clientWidth);
    const percentage = Math.min(100, Math.max(25, ((gallery.scrollLeft + gallery.clientWidth * .25) / gallery.scrollWidth) * 100));
    galleryProgress.style.width = `${percentage}%`;
    galleryPrev.disabled = gallery.scrollLeft <= 2;
    galleryNext.disabled = gallery.scrollLeft >= maxScroll - 2;
  }
  function scrollGallery(direction) {
    const firstCard = gallery.querySelector('.gallery-card');
    if (!firstCard) return;
    const gap = parseFloat(getComputedStyle(gallery).columnGap) || 14;
    gallery.scrollBy({ left: direction * (firstCard.getBoundingClientRect().width + gap), behavior: 'smooth' });
  }
  galleryPrev.addEventListener('click', () => scrollGallery(-1));
  galleryNext.addEventListener('click', () => scrollGallery(1));
  gallery.addEventListener('scroll', updateGalleryControls, { passive: true });
  window.addEventListener('resize', updateGalleryControls);
  updateGalleryControls();

  // Before/after visual comparison.
  const timeSlider = document.getElementById('time-slider');
  const comparison = document.getElementById('comparison');
  timeSlider.addEventListener('input', () => {
    const value = `${timeSlider.value}%`;
    comparison.style.setProperty('--split', value);
    timeSlider.setAttribute('aria-valuetext', `Recreación visible al ${timeSlider.value} por ciento`);
  });

  // Planner: seasonal/hourly rules are deliberately heuristic, not live weather or crowd data.
  const plannerForm = document.getElementById('planner-form');
  const dateInput = document.getElementById('visit-date');
  const timeInput = document.getElementById('visit-time');
  const placeInput = document.getElementById('visit-place');
  const thermometerFill = document.getElementById('thermometer-fill');
  const heatLevel = document.getElementById('heat-level');
  const crowdLevel = document.getElementById('crowd-level');
  const heatReading = document.querySelector('.heat-reading');
  const plannerFeedback = document.getElementById('planner-feedback');

  function localDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Clasificación preventiva para Pinto/Madrid. No sustituye a AEMET ni a una alerta oficial.
  function classifyHeat(month, timeMinutes) {
    const isSummer = [6, 7, 8, 9].includes(month);
    const isWarmSeason = [5, 6, 7, 8, 9].includes(month);
    if (isSummer && timeMinutes >= 13 * 60 && timeMinutes <= 19 * 60) return 'extreme';
    if (isWarmSeason && timeMinutes >= 11 * 60 && timeMinutes < 20 * 60) return 'high';
    if (timeMinutes >= 12 * 60 && timeMinutes < 16 * 60) return 'medium';
    return 'low';
  }
  dateInput.min = localDateString();
  dateInput.value = localDateString();

  function unlockPlannerStamp() {
    registerCheckin('planificador');
  }

  dateInput.addEventListener('change', () => {
    if (dateInput.value) unlockPlannerStamp();
  });

  function updatePlannerFeedback({ heat, crowd, isOutdoor, dayName, dateText, timeText, placeLabel }) {
    heatReading.classList.remove('is-medium', 'is-high', 'is-extreme');
    plannerFeedback.classList.remove('is-warning', 'is-good', 'is-extreme');
    thermometerFill.style.width = heat === 'extreme' ? '100%' : heat === 'high' ? '86%' : heat === 'medium' ? '58%' : '18%';

    if (heat === 'extreme') {
      heatLevel.textContent = 'Extremo';
      heatReading.classList.add('is-extreme');
    } else if (heat === 'high') {
      heatLevel.textContent = 'Elevado';
      heatReading.classList.add('is-high');
    } else if (heat === 'medium') {
      heatLevel.textContent = 'Moderado';
      heatReading.classList.add('is-medium');
    } else {
      heatLevel.textContent = 'Suave';
    }

    crowdLevel.textContent = `Afluencia estimada: ${crowd === 'high' ? 'alta' : crowd === 'medium' ? 'media' : 'baja'}`;

    let title = 'Buena hora para salir';
    let message = `${placeLabel} a las ${timeText} parece una opción razonable según esta simulación para ${dayName}, ${dateText}. Comprueba la previsión antes de salir.`;
    let className = 'is-good';
    let icon = '✓';

    if (heat === 'extreme') {
      title = 'Alerta por calor extremo · evita el paseo al sol';
      message = isOutdoor
        ? `En Pinto/Madrid, junio–septiembre entre las 13:00 y las 19:00 es una franja preventiva de riesgo muy alto. En episodios severos pueden alcanzarse o superarse los 35–40 °C: evita la exposición directa y el ejercicio al aire libre. Mejor sal antes de las 11:00 o al atardecer. Como alternativa, elige un plan de interior: una pastelería del centro (Éboli, Martínez o El Pozo), Chocolates El Indio o un espacio cultural con horario confirmado.`
        : `La franja seleccionada coincide con el periodo preventivo de mayor riesgo de calor en verano. Tu actividad de interior es una opción más prudente; evita caminar o esperar al sol y confirma apertura y climatización del lugar. En episodios severos pueden alcanzarse o superarse los 35–40 °C.`;
      className = 'is-extreme';
      icon = '☀';
    } else if (heat === 'high') {
      title = 'Calor elevado: planifica con cuidado';
      message = isOutdoor
        ? `La combinación de estación y hora puede resultar calurosa. Prioriza sombra, agua y recorridos cortos; es preferible salir antes de las 11:00 o al final de la tarde. Si notas malestar, busca un lugar fresco.`
        : `El exterior puede estar caluroso en esta franja. Mantén el plan a cubierto, evita esperas al sol y comprueba las condiciones reales antes de desplazarte.`;
      className = 'is-warning';
      icon = '☀';
    } else if (crowd === 'high') {
      title = 'Puede haber más ambiente';
      message = `La combinación de día y hora suele coincidir con más movimiento. Para un paseo más tranquilo, prueba a primera hora de la mañana o al final de la tarde.`;
      className = 'is-warning';
      icon = '◌';
    } else if (heat === 'medium' && isOutdoor) {
      title = 'Plan cómodo con alguna precaución';
      message = `La franja puede ser templada o cálida. Busca tramos con sombra, lleva agua y ajusta la duración del paseo a las condiciones reales.`;
      className = 'is-good';
      icon = '✳';
    }

    plannerFeedback.classList.add(className);
    plannerFeedback.querySelector('.feedback-icon').textContent = icon;
    plannerFeedback.querySelector('strong').textContent = title;
    plannerFeedback.querySelector('p').textContent = message;
  }

  plannerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!plannerForm.reportValidity()) return;
    const selectedDate = new Date(`${dateInput.value}T12:00:00`);
    if (Number.isNaN(selectedDate.getTime())) return;
    const [hourText, minuteText] = timeInput.value.split(':');
    const hour = Number(hourText);
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDay();
    const isWeekend = day === 0 || day === 6;
    const timeMinutes = hour * 60 + Number(minuteText);
    const isOutdoor = ['park', 'egido', 'historic'].includes(placeInput.value);
    const placeLabels = {
      park: 'Parque Juan Carlos I',
      egido: 'Parque Egido',
      historic: 'Casco histórico',
      interior: 'Visita cultural de interior'
    };
    // Regla preventiva solicitada: junio-septiembre, de 13:00 a 19:00 inclusive.
    // No predice temperatura real: activa una alerta cualitativa para evitar exposición.
    const heat = classifyHeat(month, timeMinutes);

    let crowd = 'low';
    if (isWeekend && hour >= 11 && hour < 15) crowd = 'high';
    else if ((isWeekend && hour >= 18 && hour < 21) || (!isWeekend && hour >= 18 && hour < 20)) crowd = 'medium';

    const formattedDate = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(selectedDate);
    const dayName = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(selectedDate);
    const timeText = `${String(hour).padStart(2, '0')}:${String(Number(minuteText)).padStart(2, '0')}`;
    updatePlannerFeedback({ heat, crowd, isOutdoor, dayName, dateText: formattedDate, timeText, placeLabel: placeLabels[placeInput.value] });
    showToast('Plan revisado', `${formattedDate} · ${timeText}. Tu planificación queda registrada en el pasaporte.`);
    unlockPlannerStamp();
  });


  // Graceful image fallback: remote photos are optional; the designed color treatment remains visible.
  document.querySelectorAll('img[data-fallback]').forEach((image) => {
    image.addEventListener('error', () => {
      image.hidden = true;
      image.style.display = 'none';
      image.setAttribute('aria-hidden', 'true');
    }, { once: true });
  });

  // Restore theme, view and saved passport state.
  const savedTheme = safeStorageGet(STORAGE_KEYS.theme);
  const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  setTheme(savedTheme || (systemDark ? 'dark' : 'light'));
  const initialView = window.location.hash.replace('#', '');
  if (allowedViews.has(initialView)) navigateTo(initialView);
})();
