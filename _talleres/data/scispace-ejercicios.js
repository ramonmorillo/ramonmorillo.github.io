// Contenido del módulo «SciSpace: de la pregunta clínica a la evidencia científica» (taller de Sevilla, 14-10-2026).
// Para corregir o ampliar, edita solo este archivo: js/scispace.js lo dibuja en la página.
// Cada ejercicio tiene dos juegos de instrucciones: «alumno» (práctica individual) y «profesor» (demostración proyectada).
window.SCISPACE_EJERCICIOS = {
  url: 'https://scispace.com/',
  levels: { inicial: 'Inicial', intermedio: 'Intermedio' },
  exercises: [
    {
      id: 'consulta', minutes: 10, level: 'inicial', feature: 'Literature Review',
      title: 'Resolver una consulta farmacoterapéutica',
      objective: 'Pasar de una pregunta clínica a una tabla de estudios que puedas comprobar uno a uno.',
      case: 'Un médico pregunta si las intervenciones farmacéuticas mejoran la adherencia al tratamiento antirretroviral.',
      steps: {
        alumno: [
          'Abre SciSpace y entra en Literature Review (o la búsqueda con IA equivalente de tu cuenta).',
          'Pega el prompt y lanza la búsqueda.',
          'De la tabla resultante, elige las tres publicaciones que te parezcan más relevantes para la pregunta del médico.',
          'Verifica al menos una referencia: abre su DOI o búscala en PubMed y comprueba título, autores, año y diseño.',
          'Anota si la respuesta distingue lo que procede del resumen y lo que procede del texto completo.'
        ],
        profesor: [
          'Proyecta SciSpace y lanza la búsqueda con el prompt en directo.',
          'Pide al grupo que, mirando la tabla, proponga las tres publicaciones más relevantes y justifique por qué.',
          'Abre en directo el DOI o la ficha de PubMed de una de ellas y comparad título, autores, año y diseño con lo que dice la tabla.',
          'Señala qué columnas proceden del resumen y cuáles del texto completo, y pregunta qué implica para la fiabilidad del dato.'
        ]
      },
      prompt: 'Busca estudios publicados entre 2020 y 2026 que evalúen intervenciones lideradas por farmacéuticos para mejorar la adherencia al tratamiento antirretroviral en adultos con VIH. Prioriza ensayos clínicos y revisiones sistemáticas. Presenta una tabla con autor, año, diseño, número de pacientes, intervención, resultados de adherencia y principales limitaciones. Incluye DOI o enlace a la publicación cuando estén disponibles. Diferencia los resultados procedentes del resumen de los obtenidos del texto completo. No inventes referencias ni resultados.',
      checks: [
        'La publicación existe: el DOI o el enlace llevan al artículo descrito.',
        'Título, autores y año coinciden con la fuente original.',
        'El diseño y el número de pacientes coinciden con el artículo, no solo con el resumen.',
        'Los estudios son de adultos con VIH y la intervención la lideran farmacéuticos.',
        'Queda claro qué resultados salen del resumen y cuáles del texto completo.'
      ],
      outcome: 'Formular una búsqueda acotada y verificar una referencia generada con IA antes de usarla para responder a una consulta.'
    },
    {
      id: 'pdf', minutes: 10, level: 'inicial', feature: 'Chat with PDF',
      title: 'Analizar críticamente un artículo científico',
      objective: 'Usar el asistente como apoyo a la lectura crítica, exigiendo que cada dato tenga su página o fragmento.',
      case: 'Necesitas evaluar un artículo para presentarlo en una sesión clínica del servicio.',
      material: 'Usa el PDF que facilite el docente o un artículo de acceso abierto elegido previamente (por ejemplo, de PubMed Central). No subas documentos de pacientes ni información confidencial.',
      steps: {
        alumno: [
          'Abre Chat with PDF en SciSpace y sube el artículo.',
          'Pega el prompt.',
          'Elige dos resultados cuantitativos de la respuesta y localízalos en el PDF original, en la página o fragmento que indica.',
          'Apunta qué información dice el asistente que no ha podido localizar y comprueba si de verdad falta en el artículo.',
          'Decide si estás de acuerdo con su valoración de las conclusiones y por qué.'
        ],
        profesor: [
          'Sube en directo el artículo elegido para la sesión y lanza el prompt.',
          'Pide a dos asistentes que busquen en el PDF, cada uno, uno de los resultados cuantitativos citados.',
          'Comparad en voz alta la página o fragmento que indica la herramienta con lo que dice el artículo.',
          'Abre el debate: ¿están justificadas las conclusiones por los datos? ¿Coincide el grupo con la herramienta?'
        ]
      },
      prompt: 'Analiza este artículo como farmacéutico hospitalario experto en metodología de investigación. Identifica la pregunta de investigación, diseño, tamaño muestral, criterios de inclusión, variable principal, resultados cuantitativos y limitaciones metodológicas. Explica si las conclusiones están justificadas por los datos. Indica el fragmento o página que respalda cada respuesta y señala expresamente la información que no puedas localizar.',
      checks: [
        'Los dos resultados elegidos aparecen en el PDF, con las mismas cifras y en la página o fragmento indicado.',
        'El tamaño muestral es el analizado y no se confunde con el de reclutados o aleatorizados.',
        'La variable principal es la que declaran los autores, no una secundaria.',
        'Lo que la herramienta no encuentra aparece como «no localizado» y no como un dato inventado.',
        'La valoración de las conclusiones se apoya en resultados concretos del artículo.'
      ],
      outcome: 'Usar un asistente de lectura sin delegar el juicio crítico: cada dato se localiza en el documento original.'
    },
    {
      id: 'comparar', minutes: 10, level: 'intermedio', feature: 'Extract Data',
      title: 'Comparar varios estudios simultáneamente',
      objective: 'Construir una matriz comparativa en la que cada dato tenga una fuente identificable.',
      case: 'Estás preparando una revisión sobre telefarmacia y adherencia en enfermedades crónicas.',
      steps: {
        alumno: [
          'Selecciona hasta cinco estudios pertinentes sobre telefarmacia y adherencia.',
          'Abre Extract Data o la funcionalidad equivalente disponible en tu cuenta.',
          'Crea las columnas de comparación que indica el prompt, o pega el prompt si la herramienta lo admite.',
          'Revisa que cada celda procede de la publicación: abre al menos dos estudios y comprueba dos datos de cada uno.',
          'Exporta la matriz si tu plan lo permite.'
        ],
        profesor: [
          'Muestra en directo cómo seleccionar los estudios y abrir Extract Data.',
          'Crea con el grupo las columnas del prompt y explica por qué cada una importa en una revisión.',
          'Elige una celda «sospechosa» (por ejemplo, una significación estadística) y comprobadla juntos en el artículo.',
          'Enseña dónde se exporta la matriz y aclara si tu plan lo permite.'
        ]
      },
      alternative: 'Si tu plan limita el número de estudios o no incluye Extract Data, trabaja con menos estudios, o usa Literature Review y compara sus resultados de forma manual en una tabla propia.',
      prompt: 'Compara estos cinco estudios sobre telefarmacia en pacientes con enfermedades crónicas. Extrae para cada publicación: autor, año, país, diseño, tamaño muestral, población, tipo de intervención, duración del seguimiento, medida de adherencia, resultado cuantitativo principal, significación estadística cuando esté disponible y limitaciones. Presenta una matriz comparativa. No completes campos mediante suposiciones. Identifica la fuente de cada dato.',
      checks: [
        'Cada celda tiene una fuente identificable en la publicación.',
        'Los campos sin dato aparecen vacíos o como «no disponible», no rellenados por aproximación.',
        'La medida de adherencia está especificada (registro de dispensación, cuestionario, recuento…) y no se presenta como equivalente entre estudios.',
        'El resultado principal y su significación coinciden con el artículo.',
        'Los estudios son de verdad sobre telefarmacia y enfermedades crónicas.'
      ],
      outcome: 'Montar una matriz de extracción trazable y detectar los datos que la IA rellena sin respaldo.'
    },
    {
      id: 'contradictorios', minutes: 10, level: 'intermedio', feature: 'Literature Review',
      title: 'Investigar resultados contradictorios',
      objective: 'Entender por qué una revisión debe interpretar las diferencias metodológicas y no limitarse a contar estudios favorables.',
      case: 'Algunos estudios encuentran mejoras con la telefarmacia y otros no.',
      steps: {
        alumno: [
          'Lanza el prompt en Literature Review.',
          'Clasifica los estudios de la respuesta en favorables, neutros y desfavorables.',
          'Elige dos estudios con resultados distintos y compara población, diseño, medida de adherencia y duración del seguimiento.',
          'Separa en dos columnas lo que está documentado en los estudios y lo que es una hipótesis explicativa de la herramienta.',
          'Verifica al menos una referencia de cada grupo.'
        ],
        profesor: [
          'Lanza el prompt en directo y muestra la clasificación de estudios.',
          'Pregunta al grupo: si hay más estudios favorables, ¿podemos concluir que la telefarmacia funciona? Recoge respuestas.',
          'Compara en pantalla dos estudios discordantes: población, diseño, medida de adherencia y seguimiento.',
          'Señala qué explicaciones están documentadas y cuáles son hipótesis de la herramienta.'
        ]
      },
      prompt: 'Analiza la evidencia publicada entre 2020 y 2026 sobre el impacto de la telefarmacia en la adherencia farmacoterapéutica en adultos con enfermedades crónicas. Identifica estudios con resultados favorables, neutros o desfavorables. Compara las poblaciones, diseños, métodos de medición de adherencia, duración del seguimiento y riesgo de sesgo cuando pueda evaluarse. Explica qué diferencias metodológicas podrían contribuir a los resultados discordantes. Separa los hallazgos documentados de las hipótesis explicativas e incluye referencias verificables.',
      checks: [
        'Hay estudios de los tres tipos o, si no los hay, la herramienta lo dice.',
        'Las diferencias metodológicas citadas aparecen de verdad en los artículos.',
        'Los hallazgos documentados y las hipótesis están claramente separados.',
        'No se concluye por recuento («más estudios a favor, luego funciona»).',
        'Las referencias de cada grupo existen y coinciden con lo descrito.'
      ],
      outcome: 'Interpretar resultados discordantes a partir de la metodología, en lugar de contar estudios a favor y en contra.'
    },
    {
      id: 'oportunidad', minutes: 10, level: 'intermedio', feature: 'Literature Review',
      title: 'Identificar una oportunidad de investigación',
      objective: 'Usar la revisión como punto de partida de un proyecto, sin confundir «no aparece» con «no se ha estudiado».',
      case: 'Quieres plantear un proyecto sobre estratificación asistencial y experiencia del paciente.',
      steps: {
        alumno: [
          'Lanza el prompt en Literature Review.',
          'Revisa los diseños, instrumentos y poblaciones que encuentra, y las limitaciones que se repiten.',
          'Elige una de las tres preguntas de investigación propuestas.',
          'Reformúlala como pregunta PICO (o equivalente): población, intervención o exposición, comparador y resultado.',
          'Anota qué búsquedas adicionales harías, por ejemplo en PubMed con descriptores MeSH, para confirmar que es un vacío real.'
        ],
        profesor: [
          'Lanza el prompt en directo y repasa con el grupo los instrumentos de PROM y PREM que aparecen.',
          'Elegid entre todos una de las preguntas propuestas.',
          'Construid juntos la pregunta PICO en la pizarra o en pantalla.',
          'Explica por qué la ausencia de resultados en una herramienta no demuestra un vacío de evidencia y qué búsqueda sistemática haría falta.'
        ]
      },
      prompt: 'Revisa la literatura publicada entre 2020 y 2026 sobre modelos de estratificación del paciente aplicados a atención farmacéutica y sus efectos sobre resultados comunicados por los pacientes (PROM) y experiencias comunicadas por los pacientes (PREM). Identifica los diseños utilizados, instrumentos de medición, poblaciones estudiadas y limitaciones recurrentes. Propón tres preguntas de investigación potencialmente relevantes y especifica qué búsquedas adicionales serían necesarias para confirmar que representan auténticos vacíos de evidencia. No afirmes que un tema no ha sido estudiado únicamente porque no aparezca en los resultados iniciales.',
      checks: [
        'Los instrumentos de PROM y PREM citados existen y se usan en los estudios referenciados.',
        'Las preguntas propuestas se apoyan en limitaciones encontradas, no en suposiciones.',
        'La herramienta no afirma que un tema «no se ha estudiado» sin una búsqueda adicional.',
        'Tu pregunta PICO tiene población, intervención o exposición, comparador y resultado definidos.',
        'Las búsquedas adicionales son concretas: bases de datos, términos y filtros.'
      ],
      outcome: 'Convertir una revisión inicial en una pregunta PICO y en un plan de búsqueda que confirme si el vacío es real.'
    }
  ],
  checklist: [
    '¿Existe realmente la publicación citada?',
    '¿Coinciden el tamaño muestral y el diseño con el original?',
    '¿La conclusión está respaldada por los resultados?',
    '¿Se han identificado las limitaciones metodológicas?',
    '¿Se ha diferenciado evidencia documentada de interpretación generada por IA?'
  ]
};
