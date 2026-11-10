# Arquitectura y registro de decisiones · FarmaInforme v1

## Auditoría de partida

Repositorio disponible: ramonmorillo/ramonmorillo.github.io. Web estática, HTML y CSS propios, Node >=18 para scripts. Sin framework ni dependencias declaradas. No se localizaron bibliotecas DOCX/PDF o formularios reutilizables; el generador Python de un PDF docente no es un motor que pueda ejecutarse en el navegador. No se consultaron ni inventaron otros repositorios. La rama de desarrollo creada fue feature/farmainforme.

## Módulos

```text
herramientas/farmainforme/
  index.html             estructura accesible y política de seguridad
  farmainforme.css       extensión aislada de los tokens de assets/css/site.css
  schema.mjs             configuración común y específica de informes
  core.mjs               estado, validación, fuentes, bloques y almacenamiento
  app.mjs                asistente, edición, revisión y eventos DOM
  export-docx.mjs        ZIP y Open XML editable, sin dependencia de red
  sources.mjs            proveedores y consultas externas deliberadas
  tutorial.html          seis pasos, documentos y ejercicio
  tutorial.mjs           lectura segura de Markdown, copia y marcas de sesión
docs/tutorial/           nueve documentos públicos que lee el tutorial
tests/farmainforme.test.mjs
scripts/test-farmainforme.py
```

## Decisiones

1. Sin backend ni IA. Se ordenan datos en una plantilla; no se simula análisis de evidencia. Evita coste, claves y tráfico clínico. Un motor futuro debe ser opcional, explícito y autorizado; no existe en esta versión.
2. Estado con esquema versionado. Se aceptan únicamente propiedades conocidas; no se mezcla JSON local con objetos de configuración. El guardado es manual, máximo 15 borradores, con errores visibles y sin sobrescribir un historial ilegible.
3. Cada apartado científico puede asociar una referencia. La marca de verificación es humana; si falta o no está marcada se muestra «pendiente». La bibliografía solo procede de entradas del usuario.
4. Documento intermedio por bloques. La misma información alimenta vista previa, texto y DOCX; la vista previa se imprime a PDF. Tras edición manual se conservan metadatos, bibliografía y aviso; el texto libre no se analiza automáticamente.
5. DOCX real. Se implementa un subconjunto reducido de OPC/OOXML y ZIP almacenado, con CRC32. Sin HTML renombrado, macros, scripts o relaciones externas. Cabecera, pie PAGE, tabla económica e imagen PNG/JPEG opcional. No intenta sustituir una biblioteca ofimática completa.
6. PDF nativo. window.print abre el diálogo; el usuario elige Guardar como PDF. No hay descarga automática de PDF independiente del navegador. Numeración mediante la opción de cabeceras/pies del navegador; DOCX incorpora un campo PAGE.
7. Fuentes públicas como adaptador manual. Se evaluaron CIMA, PubMed/E-utilities, ClinicalTrials.gov y GENESIS. No se necesita automatizar API para la versión inicial: se evitan CORS, cuotas, cambios de esquema y credenciales. Se abren consultas explícitas y se incorporan referencias manualmente. No se afirma que las APIs o los estados regulatorios hayan sido validados.
8. DOM seguro, sin innerHTML con entradas de usuario. URLs de fuentes HTTPS sin credenciales; logo limitado por tipo, firma, dimensiones y tamaño. CSP bloquea conexiones de la aplicación; la guía solo puede leer documentos del mismo origen. No hay telemetría ni scripts de terceros.
9. La aplicación y el tutorial son públicos. Solo la ficha y su contenido del taller permanecen en el cifrado existente. No se modifica taller-acceso.js ni los otros tres proyectos. Los enlaces externos no heredan el acceso del taller.
10. No se incorpora la herramienta al catálogo general ni se regenera el sitio completo: es un recurso del taller. Se conserva el fallo previo de sitemap.xml como incidencia independiente.

## Contrato del documento

El informe almacena type, variant, meta, values, omissions, sources, sourceFor y finalText. Los campos se definen en schema.mjs; los bloques son title, h, p y table. La ampliación de fuentes o plantillas debe conservar las pruebas de ambas exportaciones y los límites de privacidad.

## Datos que permanecen

localStorage: solo farmainforme.borradores.v1, al guardar expresamente. sessionStorage: solo marcas del tutorial, sin informes. Durante una sesión el formulario mantiene datos en memoria. Los archivos descargados, impresiones y portapapeles no se eliminan desde el borrado local. Los metadatos de acceso HTTP del alojamiento no están bajo el control del JavaScript.
