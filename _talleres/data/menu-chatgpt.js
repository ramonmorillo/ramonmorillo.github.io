// Contenido del bloque «El menú + de ChatGPT» del taller de Sevilla (14-10-2026).
// Para ampliar o corregir, edita solo este archivo: js/menu-chatgpt.js lo dibuja en la página.
// Basado en la guía didáctica del menú «+» (captura de la cuenta del docente, 8-10-2026).
window.MENU_CHATGPT = {
  types: {
    entrada: 'Entrada de información',
    generacion: 'Generación de contenido',
    organizacion: 'Organización',
    consulta: 'Consulta externa',
    desarrollo: 'Desarrollo e integración',
    especializada: 'Herramienta especializada'
  },
  levels: { inicial: 'Inicial', intermedio: 'Intermedio', avanzado: 'Avanzado' },
  cards: [
    {
      id: 'archivos', icon: '📎', name: 'Añadir fotos y archivos', type: 'entrada', level: 'inicial', access: 'general',
      availability: 'Función general, con límites por cuenta, formato y tamaño.',
      what: 'Carga documentos e imágenes desde el ordenador para que ChatGPT los examine: resumir, comparar, transformar o extraer contenido. No busca nada fuera por sí sola, y puede fallar con PDF escaneados, gráficos o tablas complejas.',
      use: 'Comparar versiones de un PNT, interpretar una tabla de resultados, revisar una presentación docente o resumir un protocolo, siempre sin información personal.',
      exercise: 'Sube el protocolo ficticio de conciliación y el registro ficticio de conciliaciones. Pide que identifique los incumplimientos, con el apartado y la fila que respaldan cada uno.',
      materials: [
        { label: 'Protocolo ficticio de conciliación (TXT)', href: 'assets/sevilla-14-octubre/protocolo-conciliacion-ficticio.txt' },
        { label: 'Registro ficticio de conciliaciones (CSV)', href: 'assets/sevilla-14-octubre/registro-conciliacion-ficticio.csv' }
      ],
      prompt: 'Actúa como farmacéutico de hospital responsable de calidad. Analiza los dos archivos adjuntos: un protocolo FICTICIO de conciliación de la medicación al ingreso y un registro FICTICIO de conciliaciones.\nIdentifica todos los incumplimientos del protocolo que haya en el registro. Para cada uno, indica el apartado del protocolo y la fila del registro que lo respaldan.\nAntes de dar un caso por incumplido, comprueba si el paciente entra en el ámbito del protocolo.\nSepara hechos comprobables de hipótesis. Presenta una tabla con problema, evidencia, impacto y acción sugerida. No inventes datos que falten.',
      check: 'Son 5 incumplimientos: C02 (conciliación a las 30 horas), C03 (una sola fuente), C04 (comunicación al médico a las 36 horas), C06 (no registrado) y C10 (discrepancia sin comunicación registrada). Dos trampas: C07 parece incumplir, pero está fuera del ámbito del protocolo (59 años y 3 medicamentos); C09 se concilió a las 24 horas exactas y cumple el plazo de «como máximo 24 horas».',
      link: { href: '#chatgpt', label: 'También usas archivos en el ejercicio 2.2' }
    },
    {
      id: 'biblioteca', icon: '📚', name: 'Añadir archivos de la biblioteca', type: 'entrada', level: 'inicial', access: 'general',
      availability: 'Depende de la biblioteca y de los archivos accesibles en tu cuenta.',
      what: 'Busca y reutiliza archivos que ya están guardados en la biblioteca de ChatGPT, sin volver a subirlos. No es lo mismo que Google Drive: la biblioteca y los conectores tienen permisos, alcance y búsqueda distintos.',
      use: 'Recuperar una plantilla de evaluación de medicamentos, reutilizar una presentación docente o comparar borradores guardados.',
      exercise: 'Si tu cuenta tiene biblioteca, localiza una versión anterior de una plantilla docente no sensible y pide las diferencias con una versión nueva que subas en ese momento.',
      prompt: 'Usa la plantilla seleccionada de mi biblioteca como referencia. Compárala con el documento que adjunto ahora.\nSeñala qué apartados se mantienen, cuáles han cambiado y qué información falta. Incluye referencias a los fragmentos originales.\nSi no puedes acceder al archivo de la biblioteca, dímelo antes de continuar.',
      check: 'Comprueba que ha usado de verdad el archivo que seleccionaste: pídele el título y la primera frase del documento de la biblioteca y compáralos con el original.'
    },
    {
      id: 'imagen', icon: '🖼️', name: 'Crear imagen', type: 'generacion', level: 'inicial', access: 'general',
      availability: 'Según el acceso a generación de imágenes de tu cuenta; la cuenta gratuita tiene un límite diario.',
      what: 'Crea o modifica imágenes a partir de instrucciones. Sirve para ilustraciones conceptuales. No des por buena la precisión clínica ni el texto que aparezca dentro de la imagen: dosis, nombres o esquemas farmacológicos pueden salir mal.',
      use: 'Ilustrar una consulta de atención farmacéutica, la portada de un material docente o una escena neutra para explicar entrevista motivacional o telefarmacia.',
      exercise: 'Diseña una ilustración horizontal de una farmacéutica hospitalaria haciendo una entrevista motivacional en consulta, sin personas identificables, sin logotipos y sin texto.',
      prompt: 'Crea una ilustración editorial horizontal 16:9, de estilo profesional y accesible, de una farmacéutica hospitalaria conversando con un paciente adulto en una consulta de seguimiento.\nAmbiente sanitario realista, lenguaje corporal empático, sin texto dentro de la imagen, sin marcas ni datos clínicos.\nDeja espacio libre a la derecha para el titular de una diapositiva.',
      check: 'Revisa que la escena es coherente y que no ha aparecido texto clínico inventado: etiquetas de medicamentos, pantallas con datos o carteles con dosis.',
      link: { href: '#chatgpt', label: 'Imagen con texto para pacientes: ejercicio 2.1' }
    },
    {
      id: 'proyecto', icon: '🗂️', name: 'Trabajar en un proyecto', type: 'organizacion', level: 'intermedio', access: 'general',
      availability: 'Según el acceso a proyectos de tu cuenta.',
      what: 'Agrupa conversaciones y materiales de un objetivo que dura semanas. Mantiene el contexto del proyecto, pero no es una memoria perfecta, ni un gestor documental regulado, ni un lugar para datos asistenciales.',
      use: 'Preparar un curso para residentes, redactar procedimientos, diseñar un estudio observacional o coordinar una revisión de la literatura.',
      exercise: 'Crea el proyecto ficticio «Curso de seguridad de medicamentos 2026», añade los objetivos y un documento base, y abre dos conversaciones separadas: una para el temario y otra para la evaluación.',
      prompt: 'Para este proyecto docente, utiliza únicamente los objetivos y archivos aportados.\nDiseña la estructura de un curso de 90 minutos sobre prevención de errores de medicación dirigido a residentes de Farmacia Hospitalaria.\nEn otro paso elaboraremos 5 preguntas de evaluación.\nSeñala claramente cualquier información que requiera verificación externa.',
      check: 'En la segunda conversación, pide las preguntas de evaluación sin repetir el contexto. Comprueba que se basan en el temario y los objetivos del proyecto, no en un curso genérico.',
      link: { href: '#chatgpt', label: 'Proyectos y GPTs: apartado 2.6' }
    },
    {
      id: 'skill-creator', icon: '🧩', name: 'skill-creator', type: 'especializada', level: 'avanzado', access: 'instalada',
      availability: 'Aparece instalada en la cuenta del docente. Su comportamiento depende de su implementación.',
      what: 'Asistente para convertir un procedimiento repetible en instrucciones reutilizables: qué entradas pide, qué pasos sigue, qué controles aplica y cómo presenta el resultado. No entrena un modelo nuevo ni garantiza que la skill funcione sola o esté disponible para otras personas.',
      use: 'Estandarizar la revisión formal de protocolos, una lista de extracción bibliográfica o el control de calidad de una tabla de evaluación farmacoterapéutica.',
      exercise: 'Prepara una skill ficticia de lectura crítica de ensayos que pida la pregunta PICO, el diseño, la muestra, el desenlace principal, el análisis y la aplicabilidad, y que siempre separe datos de interpretación.',
      prompt: 'Ayúdame a diseñar una skill reutilizable llamada «Lectura crítica de ensayos clínicos FH».\nEntradas: PDF del artículo y pregunta PICO.\nSalida: tabla PICO, diseño, tamaño muestral, desenlace principal, efecto absoluto y relativo (solo si están disponibles), riesgo de sesgo, aplicabilidad y dudas pendientes.\nExige la cita de página o sección de cada dato y no inventes nunca cifras.\nDefine las instrucciones, la secuencia de pasos y unas pruebas con un artículo ficticio.',
      check: 'Prueba la skill con un documento sin desenlace principal explícito. Si se inventa uno en lugar de decir que no consta, la skill no está lista.',
      link: { href: '#claude', label: 'Skills en Claude: apartado 1.4' }
    },
    {
      id: 'busqueda', icon: '🌐', name: 'Búsqueda web', type: 'consulta', level: 'inicial', access: 'general',
      availability: 'Según la función de búsqueda de tu cuenta y la conexión.',
      what: 'Busca páginas y fuentes publicadas en internet. Es útil para información actualizada y enlaces originales, pero que haya citas no garantiza que la página sea correcta ni pertinente.',
      use: 'Localizar la ficha técnica vigente, alertas de la AEMPS, recomendaciones de guías, resoluciones públicas o literatura reciente.',
      exercise: 'Compara la ficha técnica y un documento de recomendaciones sobre el manejo de un medicamento que elija el docente, con fecha de consulta y enlaces. Sin responder a ninguna situación de un paciente concreto.',
      prompt: 'Busca fuentes primarias oficiales y actuales sobre [MEDICAMENTO O TEMA]. Prioriza la AEMPS, la EMA y organismos científicos competentes.\nExtrae: indicación autorizada, fecha de actualización, precauciones importantes y puntos de controversia.\nCita URL verificables y separa las indicaciones autorizadas de las recomendaciones de guías.\nSi hay discrepancias entre fuentes, explícalas sin resolverlas por suposición.',
      check: 'Abre al menos dos enlaces y comprueba la fecha de actualización y que el párrafo citado dice lo que la respuesta le atribuye.',
      link: { href: '#chatgpt', label: 'Búsqueda e investigación en profundidad: apartado 2.8' }
    },
    {
      id: 'supabase', icon: '🗄️', name: 'Supabase', type: 'desarrollo', level: 'avanzado', access: 'instalada',
      availability: 'Requiere conectar el servicio, con los permisos adecuados. En el taller se ve como demostración del docente.',
      what: 'Acceso a funciones permitidas de Supabase, una plataforma con bases de datos PostgreSQL, autenticación y otros servicios. Según los permisos, puede consultar estructuras y datos o hacer operaciones de administración. No hace falta para usar ChatGPT en la práctica clínica.',
      use: 'Entender una base de datos de investigación simulada, revisar tablas y relaciones, o detectar errores de esquema y de políticas de acceso en un prototipo.',
      exercise: 'Demostración: sobre un proyecto de prueba sin información real, con tablas pacientes_demo, visitas_demo e intervenciones_demo, pedir un informe de consistencia y consultas SQL solo de lectura.',
      prompt: 'En el proyecto de demostración autorizado, inspecciona solamente el esquema de las tablas pacientes_demo, visitas_demo e intervenciones_demo.\nPropón consultas SQL SELECT para contar pacientes por visita y detectar visitas huérfanas.\nNO ejecutes cambios, migraciones, DELETE, UPDATE ni modificaciones de las políticas RLS.\nExplica primero qué acceso tienes y qué limitaciones observas.',
      check: 'Comprueba el nombre del proyecto antes de empezar y verifica al final que no se ha hecho ningún cambio.'
    },
    {
      id: 'github', icon: '🐙', name: 'GitHub', type: 'desarrollo', level: 'avanzado', access: 'instalada',
      availability: 'Requiere conectar GitHub, con permisos sobre el repositorio. En el taller se ve como demostración del docente.',
      what: 'Consulta y, si lo autorizas, gestiona código, incidencias (issues), solicitudes de cambio (pull requests) y publicación. No es lo mismo que Codex, que es un entorno de programación con su propio flujo de trabajo.',
      use: 'Auditar una web docente, revisar una incidencia de un formulario, leer el historial de cambios o preparar una mejora de accesibilidad sin romper nada.',
      exercise: 'Demostración sobre un repositorio de prueba del docente: solo auditoría de accesibilidad y propuesta de issue, sin fusionar ni publicar cambios.',
      prompt: 'Revisa este repositorio en modo lectura. Localiza la página principal y detecta hasta 5 mejoras de accesibilidad, navegación y claridad para farmacéuticos de hospital.\nIndica los archivos afectados, el riesgo de romper algo, las pruebas recomendadas y redacta el texto de una issue.\nNo modifiques archivos, no crees ramas ni hagas merge ni despliegue sin mi aprobación.',
      check: 'Comprueba que las rutas de archivo que cita existen y que el repositorio no tiene cambios nuevos.'
    },
    {
      id: 'template-creator', icon: '📝', name: 'Template Creator', type: 'especializada', level: 'intermedio', access: 'instalada',
      availability: 'Depende de la herramienta instalada; en la captura indica que guarda las plantillas como «personal skills».',
      what: 'Ayuda a definir estructuras repetibles de peticiones o entregables. Una plantilla puede estandarizar un informe, pero no valida por sí sola los datos ni las decisiones clínicas.',
      use: 'Ficha estándar de evaluación de medicamentos, acta de comisión, informe de revisión de un protocolo o resumen estructurado de un artículo.',
      exercise: 'Crea la plantilla «Evaluación preliminar de un medicamento», con campos obligatorios y trazabilidad.',
      prompt: 'Diseña una plantilla reutilizable para la evaluación preliminar de medicamentos en una comisión de farmacia: principio activo, indicación, población, comparador, evidencia clave, magnitud del beneficio, seguridad, incertidumbres, impacto organizativo y bibliografía verificable.\nAñade un campo «dato no disponible» y otro «pendiente de validación farmacéutica».\nLa salida debe ser clara, editable y sin conclusiones inventadas.',
      check: 'Úsala con dos medicamentos ficticios y comprueba que mantiene la estructura sin fabricar evidencia: los campos sin fuente deben quedar como «dato no disponible».',
      link: { href: '#claude', label: 'Esqueleto de informe para la CFT: ejercicio 1.3' }
    },
    {
      id: 'presentations', icon: '📊', name: 'Presentations', type: 'generacion', level: 'intermedio', access: 'instalada',
      availability: 'Depende de la herramienta instalada. Comprueba en la propia sesión qué formato final puedes descargar.',
      what: 'Crea o edita diapositivas a partir de un guion, un documento o una petición. No des por hecho que el resultado será siempre un PPTX editable ni que estarán disponibles todas las opciones de diseño.',
      use: 'Sesión para residentes, comunicación a una comisión, presentación de resultados agregados de un estudio o material para pacientes.',
      exercise: 'Elabora 6 diapositivas sobre conciliación de la medicación con un caso ficticio y una pregunta final. Puedes partir del protocolo ficticio de la tarjeta «Añadir fotos y archivos».',
      prompt: 'Diseña una presentación de 6 diapositivas para residentes de Farmacia Hospitalaria sobre conciliación de la medicación al ingreso hospitalario. Audiencia: nivel inicial.\nEstructura: objetivo, problema, procedimiento, caso ficticio, errores frecuentes y pregunta final.\nUsa frases breves, notas del ponente y referencias cuando aparezcan cifras o recomendaciones. No inventes estadísticas.\nIndica qué formato de archivo puedes generar de forma verificable.',
      check: 'Revisa referencias, textos y orden, y abre el archivo descargado para comprobar si es realmente editable.'
    }
  ],
  itinerary: [
    { time: '10 min', title: 'Estación A · Trabajar con información', text: 'Subir el protocolo y el registro ficticios y comparar contra una plantilla de la biblioteca, si está habilitada.', cards: ['archivos', 'biblioteca'] },
    { time: '10 min', title: 'Estación B · Verificar evidencia', text: 'Búsqueda web de una fuente oficial y control de alucinaciones: abrir los enlaces y comprobar fecha y párrafo.', cards: ['busqueda'] },
    { time: '10 min', title: 'Estación C · Comunicar', text: 'Ilustración para una diapositiva y mini presentación.', cards: ['imagen', 'presentations'] },
    { time: '5 min', title: 'Cierre', text: 'Elegir proyecto, skill o plantilla para continuar. GitHub y Supabase, como demostración del docente, sin exigir cuentas a los asistentes.', cards: ['proyecto', 'skill-creator', 'template-creator', 'github', 'supabase'] }
  ],
  quiz: [
    { q: 'Necesitas comparar un PNT y un CSV ficticio. ¿Qué opción abres?', options: ['archivos', 'busqueda', 'biblioteca'], answer: 'archivos', why: 'Los archivos están en tu ordenador: se suben con «Añadir fotos y archivos».' },
    { q: 'Buscas la última versión oficial de una ficha técnica.', options: ['busqueda', 'archivos', 'proyecto'], answer: 'busqueda', why: 'Búsqueda web, y después comprobar en la AEMPS o la EMA la fecha de actualización.' },
    { q: 'Quieres mantener varias conversaciones de un mismo curso con el mismo contexto.', options: ['proyecto', 'template-creator', 'biblioteca'], answer: 'proyecto', why: 'Un proyecto agrupa conversaciones y materiales de un mismo objetivo.' },
    { q: 'Quieres reutilizar un PDF que ya guardaste en ChatGPT.', options: ['biblioteca', 'archivos', 'github'], answer: 'biblioteca', why: 'Si ya está guardado en ChatGPT, no hace falta volver a subirlo: está en la biblioteca.' },
    { q: 'Quieres una portada sin texto para una sesión.', options: ['imagen', 'presentations', 'template-creator'], answer: 'imagen', why: 'Crear imagen. Pedirla sin texto evita el punto débil de las imágenes generadas.' },
    { q: 'Necesitas que el análisis bibliográfico se haga siempre con los mismos pasos y controles.', options: ['skill-creator', 'template-creator', 'proyecto'], answer: 'skill-creator', why: 'skill-creator define un procedimiento: pasos, controles y salida. Template Creator se centra en el formato del entregable.' },
    { q: 'Quieres un formato fijo para los informes de la comisión.', options: ['template-creator', 'skill-creator', 'presentations'], answer: 'template-creator', why: 'Template Creator estandariza la estructura del entregable. La frontera con una skill es difusa: en la captura, las plantillas se guardan como «personal skills».' },
    { q: 'Quieres preparar una sesión con diapositivas.', options: ['presentations', 'imagen', 'proyecto'], answer: 'presentations', why: 'Presentations, comprobando después que el archivo es realmente editable.' },
    { q: 'Quieres revisar una pull request de una web.', options: ['github', 'supabase', 'busqueda'], answer: 'github', why: 'Las pull requests están en GitHub; Supabase es una base de datos.' },
    { q: 'Quieres analizar la estructura de tablas de un prototipo.', options: ['supabase', 'github', 'archivos'], answer: 'supabase', why: 'Supabase, con un proyecto de prueba y en modo solo lectura.' }
  ]
};
