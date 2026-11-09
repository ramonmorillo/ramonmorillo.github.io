// Catálogo «Ecosistema Google IA» de la sección Recursos del taller de Sevilla (14-10-2026).
// Para añadir una herramienta, copia un objeto de «tools» y rellena todos los campos; js/google-ia.js la dibuja sola.
// access: 'gratis' (sin coste, en fase experimental) · 'limites' (gratuita con límites de uso) · 'suscripcion' (requiere plan de pago).
// accessNote resume lo verificado en la fecha de reviewedAt; lo que no se pudo confirmar se dice expresamente.
window.GOOGLE_IA = {
  reviewedAt: '2026-10-14',
  categories: ['Diseño', 'Comunicación', 'Audio/Vídeo', 'Desarrollo', 'Creatividad'],
  accessLevels: {
    gratis: 'Gratuita · experimental',
    limites: 'Gratuita con límites',
    suscripcion: 'Requiere suscripción'
  },
  tools: [
    {
      id: 'stitch', name: 'Google Stitch', url: 'https://stitch.withgoogle.com/',
      icon: 'layout', categories: ['Diseño', 'Desarrollo'], access: 'limites',
      accessNote: 'Experimento de Google Labs sin coste, con créditos diarios de generación que se renuevan cada día.',
      description: 'Diseña interfaces, pantallas y prototipos de aplicaciones a partir de instrucciones en lenguaje natural, sin conocimientos avanzados de programación.',
      example: 'Prototipo de una aplicación para el seguimiento farmacoterapéutico de pacientes con VIH: adherencia, problemas relacionados con medicamentos y evolución clínica.',
      prompt: 'Diseña la interfaz de una aplicación web destinada a farmacéuticos de hospital para el seguimiento de pacientes con VIH. Incluye un panel de pacientes, registro de adherencia, problemas relacionados con medicamentos, intervenciones farmacéuticas y evolución longitudinal. Utiliza una estética sanitaria moderna, profesional y accesible. Trabaja exclusivamente con datos ficticios.'
    },
    {
      id: 'pomelli', name: 'Google Pomelli', url: 'https://labs.google.com/pomelli/',
      icon: 'megaphone', categories: ['Comunicación', 'Diseño'], access: 'gratis',
      accessNote: 'Experimento de Google Labs para mayores de 18 años. Disponible en la UE, incluida España, pero solo en inglés.',
      description: 'Crea contenidos gráficos, materiales de comunicación, identidad visual y campañas coherentes con una marca o proyecto.',
      example: 'Materiales visuales para divulgar una jornada científica sobre adherencia terapéutica o para presentar una iniciativa de telefarmacia.',
      prompt: 'Crea una propuesta de comunicación visual para unas jornadas de actualización en atención farmacéutica hospitalaria. El público objetivo son farmacéuticos de hospital. La identidad visual debe transmitir innovación, rigor científico y cercanía al paciente. Propón materiales promocionales, imágenes y textos breves para su difusión.'
    },
    {
      id: 'flow-music', name: 'Google Flow Music', url: 'https://flowmusic.google/',
      icon: 'music', categories: ['Audio/Vídeo', 'Creatividad'], access: 'limites',
      accessNote: 'Registro gratuito con créditos diarios; planes de pago para más uso. Mayores de 18 años con edad verificada.',
      description: 'Genera canciones, composiciones musicales y contenidos sonoros con ayuda de la IA.',
      example: 'Breve pieza musical original para introducir una presentación docente sobre seguridad del medicamento o adherencia terapéutica.',
      prompt: 'Compón una pieza instrumental original de 30 segundos para la introducción de una jornada sobre innovación en Farmacia Hospitalaria. Estilo moderno, inspirador, elegante y profesional, con piano y elementos electrónicos suaves. Sin voz, sin referencias a artistas concretos y con un final apropiado para dar paso a una presentación.'
    },
    {
      id: 'ai-studio', name: 'Google AI Studio', url: 'https://aistudio.google.com/',
      icon: 'sparkle', categories: ['Desarrollo'], access: 'limites',
      accessNote: 'Uso gratuito con límites por minuto y por día; España figura entre las regiones admitidas. La API de pago no es necesaria para el ejercicio.',
      description: 'Experimenta con los modelos Gemini, prueba instrucciones, analiza distintos tipos de contenido y desarrolla prototipos de aplicaciones con IA.',
      example: 'Prototipo que analiza un caso clínico ficticio y extrae información estructurada para una valoración farmacoterapéutica.',
      prompt: 'Actúa como asistente para la extracción estructurada de información farmacoterapéutica. A partir de un caso clínico ficticio, identifica edad, diagnósticos, tratamientos, comorbilidades, posibles problemas relacionados con medicamentos y datos ausentes. Presenta los resultados en una tabla. No inventes información, diferencia datos explícitos de inferencias y señala los aspectos que requieren validación profesional.'
    },
    {
      id: 'antigravity', name: 'Google Antigravity', url: 'https://antigravity.google/',
      icon: 'code', categories: ['Desarrollo'], access: 'limites',
      accessNote: 'Plan individual sin coste con límites semanales que Google no cuantifica y ha cambiado varias veces. Se instala en el ordenador.',
      description: 'Entorno de desarrollo con agentes de IA que ayudan a crear, modificar, depurar y verificar aplicaciones.',
      example: 'Aplicación sencilla para registrar intervenciones farmacéuticas y visualizar sus resultados.',
      prompt: 'Desarrolla una aplicación web local para el registro de intervenciones farmacéuticas realizadas en una consulta externa hospitalaria. Incluye fecha, paciente ficticio, categoría de intervención, medicamento, aceptación de la intervención y resultado. Añade un dashboard de actividad y exportación CSV. Utiliza datos simulados y evita dependencias de servicios de pago. Incorpora validaciones y pruebas básicas.'
    },
    {
      id: 'flow', name: 'Google Flow', url: 'https://flow.google/',
      icon: 'film', categories: ['Audio/Vídeo', 'Comunicación'], access: 'suscripcion',
      accessNote: 'La ayuda oficial exige Google AI Plus, Pro o Ultra (los créditos dependen del plan). Algunas fuentes citan créditos diarios gratuitos: no confirmado. España figura entre los países admitidos.',
      description: 'Genera y edita vídeos, escenas y secuencias audiovisuales con IA.',
      example: 'Vídeo educativo breve sobre la importancia de la adherencia al tratamiento, destinado a pacientes.',
      prompt: 'Crea una escena audiovisual educativa de aproximadamente 20 segundos, ambientada en una consulta de Farmacia Hospitalaria moderna. Un farmacéutico conversa con un paciente adulto sobre la importancia de mantener la adherencia al tratamiento. Ambiente cercano, profesional y realista, iluminación natural y sin mostrar datos clínicos identificables. Evita representar procedimientos clínicos incorrectos o mensajes sanitarios no validados.'
    },
    {
      id: 'mixboard', name: 'Google Mixboard', url: 'https://labs.google.com/mixboard/',
      icon: 'board', categories: ['Creatividad', 'Diseño'], access: 'gratis',
      accessNote: 'Experimento de Google Labs para mayores de 18 años, abierto en más de 180 países. No hemos podido confirmar que España esté en la lista oficial.',
      description: 'Crea tableros visuales de ideas que combinan imágenes, texto y conceptos para explorar y comparar propuestas creativas.',
      example: 'Tablero de ideas para mejorar la experiencia de los pacientes en una consulta externa de Farmacia Hospitalaria.',
      prompt: 'Crea un tablero visual de ideas para rediseñar la experiencia del paciente en una consulta externa de Farmacia Hospitalaria. Incluye ideas sobre acogida, educación terapéutica, adherencia, accesibilidad, telefarmacia y seguimiento personalizado. Utiliza una estética sanitaria moderna y organiza visualmente las propuestas por ámbitos de mejora.'
    }
  ]
};
