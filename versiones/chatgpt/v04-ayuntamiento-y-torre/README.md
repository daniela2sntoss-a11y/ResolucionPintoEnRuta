# Pinto en ruta · Actualización de la Máquina del Tiempo

Esta versión conserva la guía interactiva y actualiza dos componentes:

1. **Carrusel «Un paseo en imágenes»**: flechas anterior/siguiente, desplazamiento horizontal táctil, arrastre con ratón, teclado, indicador de progreso y soporte para movimiento reducido.
2. **Máquina del Tiempo**: incluye únicamente dos comparaciones, Casa Consistorial y Torre de Éboli. Usa las dos fotografías históricas aportadas por la usuaria y vistas contemporáneas con atribución y licencia.

## Ejecutar en local

Abre una terminal dentro de la carpeta y ejecuta:

```bash
python -m http.server 8000
```

Abre `http://localhost:8000` en el navegador.

## Archivos principales

- `index.html`: estructura de la guía.
- `styles.css`: diseño, carrusel y comparador.
- `app.js`: navegación, carrusel, Máquina del Tiempo y lógica de interacción.
- `assets/historic/casa-consistorial-antigua.jpg`: fotografía antigua aportada por la usuaria.
- `assets/historic/torre-eboli-antigua.jpg`: fotografía antigua aportada por la usuaria.
- `FUENTES_VISUALES.md`: créditos y licencias de las vistas contemporáneas.

Las fotografías contemporáneas se cargan desde Wikimedia Commons; para verlas es necesaria una conexión a Internet. Las fotografías antiguas aportadas por la usuaria están guardadas dentro del proyecto y se publican junto con los demás recursos.
