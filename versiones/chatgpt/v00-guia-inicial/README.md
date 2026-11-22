# Pinto a mano · Guía local

Mini aplicación web multipantalla sobre Pinto (Madrid), creada con HTML, CSS y JavaScript vanilla.

## Archivos

- `index.html`: estructura y contenido de las pantallas.
- `styles.css`: diseño, variables de tema, tarjetas, transiciones y breakpoints responsive.
- `app.js`: navegación entre secciones, menú móvil y alternancia claro/oscuro con persistencia en `localStorage`.

## Cómo probarla

1. Descarga y descomprime el proyecto.
2. Abre `index.html` en un navegador moderno.
3. Para probarla con un servidor local, entra en la carpeta y ejecuta:

   ```bash
   python -m http.server 8000
   ```

4. Abre `http://localhost:8000`.

No necesita frameworks ni dependencias de JavaScript. Las fuentes de Google Fonts y algunas imágenes externas requieren conexión a Internet. El resto de la aplicación funciona localmente.

## Funcionalidades incluidas

- Navegación entre Inicio, Lugares, Barrios, Gastronomía y Deporte/Ocio.
- Diseño responsive con menú lateral que se convierte en menú desplegable en móvil.
- Tema claro/oscuro con variables CSS y preferencia guardada.
- Transiciones suaves entre pantallas y efectos hover en tarjetas.
- Enlaces a mapas, Turismo de Pinto, VisitMadrid y el Ayuntamiento.
- Accesibilidad básica: etiquetas semánticas, estados `aria`, foco visible, botón para saltar al contenido y respeto por `prefers-reduced-motion`.

## Fuentes de contenido

- Turismo de Pinto: https://www.turismopinto.es/
- Monumentos: https://www.turismopinto.es/visitanos/monumentos/
- Rutas: https://www.turismopinto.es/visitanos/rutas/
- Eventos y Ombligos de Pinto: https://www.turismopinto.es/visitanos/eventos/
- VisitMadrid: https://www.visitmadrid.es/donde-ir/area-metropolitana-madrid/pinto
- Ayuntamiento de Pinto: https://www.ayto-pinto.es/

Los establecimientos gastronómicos son una selección orientativa, no un directorio oficial. Comprueba horarios, cartas y disponibilidad antes de ir. Los límites y denominaciones de barrios pueden variar según el criterio utilizado.
