# 2. Preparación del entorno

## Reproducir la aplicación existente

El repositorio real es https://github.com/ramonmorillo/ramonmorillo.github.io. La implementación está en herramientas/farmainforme/; la documentación, en docs/tutorial/. No existe un segundo repositorio dedicado a FarmaInforme.

En un terminal con Git, Node.js 18 o superior y Python 3:

```sh
git clone https://github.com/ramonmorillo/ramonmorillo.github.io.git
cd ramonmorillo.github.io
git switch -c ejercicio/farmainforme
python3 -m http.server 8765 --bind 127.0.0.1
```

En tu ordenador abre la ruta /herramientas/farmainforme/ del servidor local. El tutorial está en /herramientas/farmainforme/tutorial.html. No abras index.html con file://: los módulos JavaScript necesitan un servidor HTTP. La aplicación no necesita npm install ni compilación.

Si ya trabajas en un checkout de un entorno en la nube, úsalo: cada tarea ya está aislada. No crees un worktree salvo petición explícita. Comprueba git status antes de trabajar y conserva cambios ajenos. En entornos cuya interfaz no admita vistas previas locales, usa pruebas HTTP y navegador automatizado.

## Crear tu propio proyecto

En GitHub crea un repositorio para el ejercicio. Copia herramientas/farmainforme/, assets/css/site.css y sus fuentes locales assets/fonts/, assets/favicon.svg, docs/tutorial/, tests/farmainforme.test.mjs y scripts/test-farmainforme.py. Conserva las rutas o actualiza conjuntamente los enlaces absolutos. Las licencias de las tipografías están en assets/fonts/ y deben mantenerse. Revisa las condiciones del contenido del repositorio antes de redistribuirlo.

Para un repositorio de proyecto publicado en /nombre-repositorio/ necesitas adaptar todas las rutas que empiezan por /; esta versión se diseñó para la raíz del dominio ramonmorillo.es. No elimines contenido ajeno para simplificar una copia.

## Con Claude Code

Instala y autentica Claude Code mediante su documentación oficial vigente: https://code.claude.com/docs/. Entra en la carpeta del proyecto y abre una sesión con el comando claude. Proporciona la especificación del paso 3 y pide primero una auditoría de los archivos existentes. La autenticación del agente no se incorpora a la aplicación ni al repositorio. Disponibilidad y coste del agente dependen de tu cuenta.

## Con Codex

Usa Codex en tu editor, terminal o entorno en la nube según tu instalación, siguiendo https://developers.openai.com/codex/. En la nube selecciona el repositorio y su rama; localmente abre la carpeta con la herramienta instalada. Comprueba qué archivos puede editar y qué comandos puede ejecutar. No asumas que la autenticación, las herramientas de navegador o las dependencias de pruebas de otro entorno están disponibles.

## Flujo básico

```sh
git status --short
npm run test:farmainforme
git diff --check
git diff --stat
```

Lee las diferencias antes de hacer un commit. Nunca incluyas contraseñas, borradores ni datos de pacientes. El código se publica, pero los procesos y las sesiones del navegador no viajan con él.
