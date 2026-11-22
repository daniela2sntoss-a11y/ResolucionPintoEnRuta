# Pinto en ruta — documentación cronológica del proceso

Esta carpeta contiene la página de documentación del proceso de desarrollo de **Pinto en ruta**.

## Organización del contenido

La página separa dos bloques para mantener el orden solicitado:

1. **Proceso principal con ChatGPT:** siete fases cronológicas que recogen los prompts, las soluciones entregadas, las correcciones detectadas y los ZIP de cada iteración.
2. **Comparación final:** únicamente al final aparecen las dos implementaciones alternativas obtenidas con Claude y Gemini, junto con el prompt consolidado, capturas y archivos HTML originales.

Las capturas de las versiones ChatGPT están en `capturas/chatgpt/`. Las capturas de las soluciones alternativas están únicamente en `capturas/alternativas/`.

## Estructura

- `index.html`: página de documentación.
- `styles.css`: diseño responsive, modo claro/oscuro y estilos de la cronología.
- `app.js`: navegación móvil, cambio de tema y visor ampliable de capturas.
- `capturas/chatgpt/`: capturas de las interfaces de las versiones desarrolladas durante el proceso principal.
- `capturas/alternativas/`: capturas finales de las dos soluciones externas, mostradas solo en la última sección.
- `versiones/chatgpt/`: código fuente de las sucesivas entregas de ChatGPT, organizado por fase.
- `descargas/chatgpt/`: ZIP de cada entrega para volver a descargarla.
- `versiones/claude/` y `versiones/gemini/`: HTML finales de las soluciones alternativas.

## Ejecución local

Abre `index.html` en un navegador moderno o inicia un servidor local:

```bash
python -m http.server 8000
```

Abre `http://localhost:8000`.

## Publicación en GitHub Pages

1. Sube **todo el contenido** de esta carpeta al repositorio, conservando las rutas y subcarpetas.
2. En GitHub entra en **Settings → Pages**.
3. Selecciona **Deploy from a branch**, rama `main` y carpeta `/ (root)`.
4. Guarda los cambios y abre la URL que GitHub Pages muestre.

## Responsive y accesibilidad

La documentación se adapta a escritorio, tablet y móvil. Incluye navegación móvil, imágenes fluidas, enlaces táctiles, visor de capturas, foco visible, soporte de teclado, `prefers-reduced-motion`, áreas seguras de dispositivos móviles y un tema claro/oscuro cuya preferencia se guarda cuando el navegador permite `localStorage`.

Las capturas de las páginas de guía son vistas de las interfaces HTML entregadas. Las fotografías remotas de las aplicaciones pueden requerir conexión a Internet; los archivos históricos facilitados por la usuaria se conservan en los ZIP de sus respectivas versiones.
