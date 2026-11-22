# Pinto en ruta · Guía turística interactiva

Proyecto frontend sin frameworks, desarrollado con **HTML5, CSS3 y JavaScript moderno**. Pensado como ejercicio de maquetación avanzada, diseño de sistemas, accesibilidad e interacción.

## Ejecutar el proyecto

1. Descomprime la carpeta `pinto-guia-avanzada`.
2. Abre una terminal dentro de esa carpeta.
3. Ejecuta:

   ```bash
   python -m http.server 8000
   ```

4. Abre `http://localhost:8000` en tu navegador.

También puedes abrir `index.html` directamente, aunque un servidor local es la forma recomendada.

## Estructura

```text
pinto-guia-avanzada/
├── index.html             # Estructura y contenido de las vistas
├── styles.css             # Design tokens, componentes, estados y responsive
├── app.js                 # Navegación, filtros, tema, planificador y pasaporte
├── README.md              # Instrucciones y características
└── FUENTES_VISUALES.md    # Procedencia y condición de las fotografías
```

## Características incluidas

- Navegación por vistas con **Navigation Drawer** lateral, overlay móvil y cierre con Escape.
- Filtros rápidos: paseo tranquilo, zonas de sombra e interior/lluvia.
- Design tokens mediante variables CSS para paleta, tipografías, espaciados, bordes y sombras.
- Estados de interacción: hover, active, focus-visible, disabled y estados seleccionados.
- Cuatro accesos de categoría con ilustraciones SVG flat integradas en el propio HTML.
- Carrusel horizontal de fotografías con botones anterior/siguiente y barra de progreso.
- Comparador visual «máquina del tiempo» con control deslizante. La imagen del pasado es una ilustración conceptual, no una fotografía histórica.
- Planificador con fecha, hora y tipo de visita.
- **Termómetro preventivo actualizado:** junio, julio, agosto y septiembre, de 13:00 a 19:00 inclusive, activan el estado «Extremo». El mensaje avisa de episodios severos que pueden superar los 35–40 °C y recomienda evitar la exposición al sol, cambiar el paseo exterior por una actividad de interior y consultar la previsión oficial. La franja es una regla preventiva de la aplicación, no una predicción de temperatura real.
- Estimación de afluencia simulada. No son datos de ocupación ni alertas oficiales en directo.
- Pasaporte Pinteño con sellos dorados, curiosidades desbloqueables, barra de progreso y persistencia en `localStorage`.
- Modo claro/oscuro persistente, con preferencia del sistema como opción inicial.
- Diseño adaptable a escritorio, tablet y móvil; respeta `prefers-reduced-motion`.
- Si una foto externa no carga, se oculta el elemento de imagen y se conserva el fondo visual de la tarjeta.

## Personalización

- Cambia colores, tipografías, radios, espaciados y sombras desde `:root` y `html[data-theme="dark"]` en `styles.css`.
- Añade una nueva sección creando un `<section class="view">`, añadiendo su botón `data-nav` y registrando su etiqueta en `navLabels` de `app.js`.
- Añade un nuevo sello en el objeto `STAMPS` y un bloque con `data-stamp` para ampliar el Pasaporte Pinteño.
- Para añadir un filtro, registra su configuración en `FILTERS` y asigna la etiqueta correspondiente en `data-tags` de las tarjetas.
- Para sustituir fotografías, edita el atributo `src` de cada `<img>` de `index.html`; conserva `alt`, `loading="lazy"` y `data-fallback`.

## Fuentes de contenido y revisión antes de publicar

- Turismo de Pinto: https://www.turismopinto.es/visitanos/
- Rutas y Parque Juan Carlos I: https://www.turismopinto.es/visitanos/rutas/
- Ombligos de Pinto y puntos de venta: https://www.turismopinto.es/visitanos/eventos/
- Patrimonio de Pinto: https://www.visitmadrid.es/donde-ir/area-metropolitana-madrid/pinto
- Recomendaciones de la Comunidad de Madrid frente al calor: https://www.comunidad.madrid/salud/calor-salud
- Fotografías: consulta `FUENTES_VISUALES.md`.

Los horarios, accesos, precios, aforos, actividades deportivas y disponibilidad pueden cambiar. Verifica siempre la información con el Ayuntamiento o la entidad correspondiente antes de la visita. Las imágenes se cargan desde sus páginas de origen y requieren conexión a Internet. Comprueba las condiciones de uso de cada fotografía antes de reutilizarla o redistribuirla en otros proyectos.
