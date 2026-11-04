# ramonmorillo.es

Web profesional de **Ramón Morillo Verdugo**: farmacia hospitalaria, investigación y herramientas digitales. Se publica con GitHub Pages en el dominio `ramonmorillo.es` (archivo `CNAME`).

Auditoría y decisiones del rediseño de noviembre de 2026: [AUDITORIA_REDISENO_2026-11.md](AUDITORIA_REDISENO_2026-11.md).

## Arquitectura

Sitio estático sin framework ni dependencias. Las páginas se **generan** a partir de datos estructurados y el HTML resultante se versiona en el repositorio, de modo que GitHub Pages lo sirve directamente, sin proceso de compilación en el servidor.

| Archivo | Contenido |
|---|---|
| `data/catalogo.json` | Herramientas: categorías, estados, tipos de acceso, tipos de IA y una ficha por aplicación |
| `data/conferencias.json` | Ponencias y participaciones en eventos |
| `data/investigacion.json` | Líneas de investigación y publicaciones (PMID, DOI) |
| `scripts/build-site.mjs` | Generador: escribe `index.html`, `proyectos/`, `investigacion/`, `conferencias/`, `sobre-mi/`, `contacto/`, `privacidad/`, `formacion/` (transición), `404.html`, `sitemap.xml` y `robots.txt` |
| `scripts/validate-catalog.mjs` | Validación de datos y comprobación de que el HTML está al día |
| `scripts/audit-github.mjs` | Contraste del catálogo con los repositorios públicos de GitHub (bajo demanda) |
| `assets/css/site.css`, `assets/js/site.js` | Sistema de diseño y mejoras progresivas (búsqueda, filtros, menú móvil) |

El contenido es legible sin JavaScript. Las páginas de los talleres (`foco-3-octubre.html`, `sevilla-14-octubre.html`, `santiago-16-noviembre.html`) y sus recursos son independientes y no se generan.

## Mantenimiento

Requisito: Node.js 18 o superior.

### Añadir una herramienta

1. Añade un objeto a `tools` en `data/catalogo.json`. Campos obligatorios: `id` (estable, minúsculas y guiones), `name`, `repo`, `category`, `areas`, `tags`, `status`, `access`, `summary`, `problem`, `audience`, `features`, `ai`, `validation`, `authorship`, `updated`. Opcionales: `url`, `urlLabel`, `aiNote`, `registration`, `recognition`, `research`, `docs`, `featured`, `page`.
2. Reglas: `access: "publico"` exige `url`; `access: "interno"` no admite `url`; las fichas de `category: "gestion"` son siempre internas; `updated` es la fecha del último commit, no de validación.
3. Para una página propia, indica `"page": "nombre-de-ruta"` y se generará `/proyectos/nombre-de-ruta/`.
4. Ejecuta:

```bash
npm run build
```

```bash
npm test
```

### Añadir una conferencia

Añade un objeto a `events` en `data/conferencias.json` (`id`, `date` AAAA-MM-DD, `title`, `event`, `city`, `type`, `topics`; opcionales `end`, `venue`, `organizer`, `summary`, `href`, `programUrl`, `photo`, `photoAlt`, `visible`) y ejecuta `npm run build` y `npm test`. Solo participaciones con evidencia.

### Revisar el catálogo frente a GitHub

```bash
npm run audit:github
```

```bash
npm run audit:github -- --check-urls
```

Lista repositorios no catalogados, fichas desactualizadas y, con `--check-urls`, enlaces que no responden. No modifica nada.

### Vista previa local

```bash
python3 -m http.server 8765
```

Abre `http://127.0.0.1:8765/`. Las rutas son absolutas desde la raíz del dominio.

## Contenido heredado

La antigua plataforma formativa (SPA en `js/app.js`, `js/teaching.js` y `data/*.js`) ya no se carga desde ninguna página. Las páginas estáticas formativas (`modulos/`, `perfiles/`, `recursos/`) se conservan para no romper enlaces antiguos, marcadas `noindex`. Las rutas antiguas con almohadilla redirigen a las páginas nuevas o a `/formacion/`. `npm run validate-content` sigue validando los datos heredados.

## Autoría y licencias

Textos: © Ramón Morillo Verdugo. El modelo CMO es obra colectiva de la SEFH. Cada herramienta tiene su propio repositorio y condiciones. Tipografías Inter y Source Serif 4: SIL Open Font License 1.1 (`assets/fonts/`). Desarrollo asistido por herramientas de IA bajo dirección y revisión del autor.

Contacto: [ramon.morillo.verdugo@gmail.com](mailto:ramon.morillo.verdugo@gmail.com).
