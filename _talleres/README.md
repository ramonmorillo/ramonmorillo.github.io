# Talleres con acceso por clave

Las páginas `/sevilla-14-octubre.html` y `/santiago-16-noviembre.html` se publican **cifradas**. Solo quien introduce la clave del taller puede descifrar en su navegador la página completa y sus materiales.

Esta carpeta guarda las **fuentes en claro**. Jekyll (GitHub Pages) no publica las carpetas cuyo nombre empieza por `_`, así que no se sirven en ramonmorillo.es. **Sí son visibles en GitHub**, porque el repositorio es público (ver «Límites»).

## Cómo funciona

| Pieza | Función |
|---|---|
| `_talleres/<id>.html` | Página original del taller. Aquí se edita el contenido. |
| `_talleres/assets/<id>/…`, `_talleres/data/…` | Materiales (TXT, CSV, PDF, planificador) y datos de los módulos (menú ChatGPT, SciSpace, Google IA). Los mismos que antes estaban en `assets/` y `data/`. |
| `_talleres/talleres.json` | Datos de la pantalla de acceso (título, ciudad, fecha, lugar) y el nombre de la variable de entorno de cada clave. **No contiene claves.** |
| `scripts/talleres-cifrar.mjs` | Genera `<id>.html` en la raíz: pantalla de acceso + contenido cifrado. No usa dependencias externas. |
| `assets/js/taller-acceso.js`, `assets/css/taller-acceso.css` | Descifrado y diseño de la pantalla de acceso (comunes a ambos talleres). No contienen secretos. |

- **Cifrado**: AES-256-GCM. La clave AES se deriva de la contraseña con PBKDF2-SHA-256 (600 000 iteraciones) y una sal aleatoria por página. Cada taller se cifra con su propia clave: la de Sevilla no abre Santiago ni al revés (lo comprueba `npm run talleres:verify`).
- **Qué se cifra**: todo el `<body>` original, los tres archivos de datos (se incrustan) y los materiales descargables (se incrustan y, tras desbloquear, se sirven como archivos locales `blob:` con su nombre original). La cabecera, el pie, el título, la descripción y la hoja de estilos siguen siendo públicos.
- **Clave tolerante**: se ignoran los espacios al principio y al final y las mayúsculas, porque el teclado del móvil suele poner la primera letra en mayúscula («Sevilla» = «sevilla»).
- **Persistencia**: tras acertar, se guarda en `sessionStorage` la clave AES derivada (nunca la contraseña), solo para ese taller y solo en esa pestaña. Al recargar o al volver desde otra página en la misma pestaña, la página se abre sola. Al cerrar la pestaña se olvida. Si se cambia la clave o se regenera la página, la clave guardada deja de servir y se vuelve a pedir.

## Cambiar una clave

1. Elige la nueva clave. No la escribas en ningún archivo que vaya al repositorio.
2. Regenera solo ese taller (Node.js 18 o superior). Ejemplo para Sevilla:

```bash
CLAVE_SEVILLA='nueva-clave' npm run talleres -- sevilla-14-octubre
```

   Para Santiago, la variable es `CLAVE_SANTIAGO` y el identificador es `santiago-16-noviembre`. Si no defines la variable, el script pide la clave por teclado sin mostrarla.
3. Comprueba y publica:

```bash
npm run talleres:check
```

```bash
git add sevilla-14-octubre.html && git commit -m "Taller Sevilla: nueva clave" && git push
```

Quien tuviera la página abierta con la clave anterior tendrá que introducir la nueva. Los enlaces públicos no cambian.

**Alternativa sin variables**: crea `_talleres/claves.local.json` con `{"sevilla-14-octubre": "…", "santiago-16-noviembre": "…"}`. Ese archivo está en `.gitignore` y nunca se sube. Así, `npm run talleres` regenera ambas páginas sin preguntar.

## Cambiar el contenido de un taller

Edita `_talleres/<id>.html` o sus materiales en `_talleres/assets/<id>/` o `_talleres/data/`, y regenera con su clave (paso 2 anterior). Si olvidas regenerar, `npm run talleres:check` falla y avisa de que la página publicada está desactualizada. Esa comprobación no necesita clave: compara una huella de las fuentes.

Para añadir otro taller protegido, copia su página a `_talleres/<id>.html`, mueve sus materiales a `_talleres/assets/<id>/` y añade una entrada a `talleres.json`.

## Comprobaciones

| Orden | Qué comprueba | ¿Necesita clave? |
|---|---|---|
| `npm run talleres:check` | Las páginas publicadas están cifradas y al día, ninguna sección aparece en claro y ningún material protegido se ha vuelto a copiar en la ruta pública. Además, que no existe `.nojekyll`. | No |
| `npm run talleres:verify` | Cada página se descifra con su clave, el contenido coincide con la fuente y la clave de un taller no abre el otro. | Sí |
| `npm run validate-google-ia`, `node scripts/validate-recursos-ia.js` | Validadores previos; ahora leen las fuentes de `_talleres/`. | No |

## Mantenimiento de las soluciones personalizadas de Santiago

El apartado `#soluciones-personalizadas` está en la fuente `santiago-16-noviembre.html` de esta carpeta. Reutiliza los componentes `materials`, `lesson`, `lesson-extended` y los desplegables nativos del taller; no necesita estilos, scripts ni dependencias adicionales.

Cada ficha mantiene un identificador `data-solucion` (`informe`, `pnt`, `stock`, `agenda`) y tres apartados: uso, construcción y reto. Los avisos `data-recurso="aplicacion|tutorial|prompts|repositorio"` son los puntos de incorporación de futuros recursos: sustituye cada aviso por un enlace con nombre descriptivo solo cuando el destino exista y esté comprobado. Conserva el estado «En preparación» hasta que la solución esté disponible y verificada. Los pasos comunes de construcción se mantienen una sola vez en `#soluciones-metodo`.

FarmaInforme se mantiene de forma independiente en `https://github.com/ramonmorillo/farmainforme`. Su aplicación pública está prevista en `https://ramonmorillo.github.io/farmainforme/` y el tutorial en `tutorial.html` de esa ruta. Comprueba primero la publicación del nuevo repositorio y solo después fusiona la actualización de enlaces del taller. La aplicación y su documentación son públicas y no heredan la clave del taller. Las otras tres herramientas permanecen sin cambios.

Mantén los tutoriales, prompts y materiales que deban compartir la protección del taller dentro de `_talleres/`, siguiendo el mecanismo existente de incrustación de datos y recursos. Un enlace externo no hereda el cifrado ni el control de acceso de esta página.

Después de editar, regenera **solo Santiago** con su clave actual mediante `npm run talleres -- santiago-16-noviembre`, y ejecuta `npm run talleres:check` y `npm run talleres:verify -- santiago-16-noviembre`. No uses una clave de prueba en la salida que se vaya a publicar. Sin la clave actual, la fuente puede revisarse y probarse en una copia temporal, pero la página pública permanece pendiente de regeneración.

## Límites de la protección (léelos)

1. **El repositorio es público.** Las fuentes en claro de `_talleres/` y todo el historial de git (incluidas las versiones anteriores, sin cifrar, de estas páginas y sus materiales) se pueden leer en github.com. El cifrado impide acceder por la web (ramonmorillo.es), pero no por GitHub. Para cerrar esa vía sin coste no hay solución sencilla: habría que mover las fuentes a un repositorio privado y reescribir el historial del público, una operación destructiva que conviene decidir aparte. Publicar Pages desde un repositorio privado requiere un plan de pago de GitHub.
2. **Copias ya existentes.** Lo que se publicó en abierto hasta hoy puede seguir en cachés, en el Internet Archive o en descargas de asistentes.
3. **La fortaleza depende de la clave.** El cifrado es robusto, pero una clave como «sevilla» o «santiago» se adivina enseguida: es lo primero que probaría cualquiera, y además se puede probar sin conexión contra el archivo descargado. PBKDF2 solo frena las pruebas masivas. Es adecuado para material docente ficticio, no para nada confidencial. Si quieres más protección, usa claves no relacionadas con la ciudad.
4. **Quien conoce la clave puede compartirla** o compartir los archivos descargados. Ningún sistema estático lo evita.
5. **Sin JavaScript** solo se ve la pantalla de acceso con un aviso. La página original estaba pensada para leerse sin JavaScript; esa ventaja se pierde a cambio del cifrado.
6. **Recursos que siguen públicos a propósito**: la foto de la sesión de Sevilla (`assets/sevilla-14-octubre/foto-sesion-sevilla.webp`, que usa `/conferencias/`), la skill de VIH del taller Foco (`assets/foco-3-octubre/…zip`, de otra conferencia), las hojas de estilo y los scripts que dibujan los módulos (`js/*.js`, sin contenido docente), y las páginas `herramientas-ia.html`, `diccionario-ia.html` y `encuesta-previa.html`.
7. **El planificador de pautas** se abre en una pestaña nueva como archivo local. Si se cierra la página del taller, esa pestaña no puede recargarse: hay que volver a abrirlo desde el taller.
8. **`sessionStorage` es por pestaña**: al abrir el taller en una pestaña nueva se vuelve a pedir la clave.
