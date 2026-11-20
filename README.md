# Sitio estilo battle.rip (estático)

Abre `index.html` (o usa `npx serve .`). Sin build.

- `js/data.js` → todo el contenido: nombre, IP, Discord, rankings, tienda, pase, sanciones, aperturas.
- `js/main.js` → header/footer, páginas, copiar IP, cuenta regresiva, login (demo, conecta tu API).
- `css/styles.css` → CSS compilado de battle.rip (Tailwind + componentes bento/glass) + estilos de docs.
- `css/extra.css` → fuentes (Google Fonts) y ajustes propios.
- Páginas: index, novedades, tienda, ranking, pase, sanciones, entrar, cuenta.

Cambia "TuRed" y el logo (`img/logo.svg`). Los CSS solo incluyen las clases Tailwind que usa battle.rip: si añades clases nuevas, usa `extra.css`.
