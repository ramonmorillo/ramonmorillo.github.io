# 3. El prompt maestro real

La especificación siguiente es el encargo original recibido para desarrollar esta versión de FarmaInforme y su tutorial. Se conserva como material docente, no como prueba de que todos sus criterios se hayan superado. El registro de pruebas y límites está en limitaciones.md. No depende de código privado: los módulos de esta implementación están en herramientas/farmainforme/ del mismo repositorio.

## Cómo reutilizarlo

Primero pide al agente que inspeccione el repositorio. Después proporciona esta especificación; adapta únicamente los requisitos institucionales que conozcas. Funcionalidad: modalidades, formulario, borradores y exportación. Técnica: web estática modular sin backend ni claves. Visual: reutilizar componentes y comprobar móvil y teclado. Seguridad: datos ficticios, fuentes trazables y revisión humana. Estos cuatro grupos permiten detectar si el agente está cumpliendo el encargo o solo presentando una interfaz.

La implementación eligió PDF mediante el diálogo de impresión, DOCX Open XML local y consultas bibliográficas manuales; no interpretó el encargo como autorización para transmitir informes ni para implantar reglas clínicas. El prompt es una especificación, no una garantía de equivalencia entre resultados de distintos agentes.

## Especificación original

# MISIÓN: DESARROLLO INTEGRAL DE FARMAINFORME Y SU TUTORIAL DOCENTE

Actúa como un equipo multidisciplinar de máximo nivel formado por:

- Ingeniero senior de software y arquitecto de aplicaciones web.
- Especialista en experiencia de usuario y diseño de herramientas sanitarias.
- Farmacéutico especialista en Farmacia Hospitalaria experto en evaluación de medicamentos.
- Experto en metodología GENESIS-SEFH, informes de Comisiones de Farmacia y solicitudes especiales.
- Especialista en seguridad, protección de datos y calidad del software sanitario.
- Experto en formación práctica mediante inteligencia artificial y programación asistida por agentes.

Tu misión es desarrollar **dos productos complementarios y completamente coordinados**:

**PRODUCTO A: FarmaInforme**, aplicación funcional para generar informes farmacoterapéuticos.

**PRODUCTO B: Aprende a construir FarmaInforme**, guía práctica, interactiva y reproducible que explique cómo crear la aplicación utilizando Claude Code o Codex.

Ambos formarán parte del taller de inteligencia artificial aplicada a la Farmacia Hospitalaria de Santiago de Compostela, dentro del apartado «Soluciones personalizadas del taller».

Trabaja con autonomía, eficiencia y rigor. No solicites confirmaciones continuas para decisiones técnicas ordinarias.

---

# FASE 0. AUDITORÍA Y REUTILIZACIÓN

Antes de escribir código:

1. Analiza la estructura de los repositorios disponibles.
2. Localiza la página `santiago-16-noviembre.html`.
3. Identifica el apartado «Soluciones personalizadas del taller».
4. Examina tecnologías, estilos, componentes y mecanismos de navegación existentes.
5. Identifica módulos reutilizables: generación PDF, exportación Word, formularios, validación y almacenamiento local.
6. Reutiliza código y componentes cuando sea técnicamente conveniente.
7. No modifiques otras aplicaciones o herramientas clínicas existentes.
8. No introduzcas dependencias innecesarias.
9. Mantén un registro de decisiones arquitectónicas.

Si un repositorio no está disponible, no lo inventes ni modifiques otro como sustituto.

Prioriza una arquitectura modular, fácil de mantener y gratuita.

---

# PRODUCTO A. APLICACIÓN FARMAINFORME

## 1. Objetivo

Desarrollar una aplicación web que permita a los farmacéuticos de hospital elaborar informes estandarizados, estructurados, editables y exportables.

La herramienta debe servir para mejorar la eficiencia documental sin sustituir el juicio profesional.

Debe poder funcionar con datos ficticios durante el taller y permitir su personalización posterior.

## 2. Tipos de informes

Incorporar inicialmente tres módulos.

### A. Informe de solicitud especial — SOLES

Formulario estructurado con:

- Datos administrativos mínimos.
- Medicamento solicitado.
- Principio activo y presentación.
- Indicación clínica.
- Situación regulatoria de la indicación y medicamento.
- Motivo de la solicitud.
- Tratamientos previos y resultados.
- Alternativas disponibles.
- Justificación clínica.
- Evidencia científica aportada.
- Evaluación de eficacia y seguridad.
- Aspectos económicos, cuando proceda.
- Recomendación farmacoterapéutica.
- Condiciones de utilización y seguimiento.
- Fecha, autor, versión y estado del informe.

IMPORTANTE: no presuponer que SOLES es un modelo único nacional. Permitir adaptar los apartados a los formularios y circuitos de cada hospital.

Distinguir claramente entre solicitud interna, valoración farmacoterapéutica y autorización administrativa cuando corresponda.

### B. Informe para Comisión de Farmacia y Terapéutica

Basarse conceptualmente en los estándares metodológicos GENESIS-SEFH y el programa MADRE, sin reproducir indebidamente materiales protegidos.

Incluir:

- Identificación del medicamento.
- Indicación y población candidata.
- Situación regulatoria.
- Problema clínico.
- Alternativas terapéuticas.
- Eficacia comparada.
- Seguridad.
- Calidad y limitaciones de la evidencia.
- Posicionamiento terapéutico.
- Evaluación económica.
- Impacto presupuestario, si existen datos.
- Propuesta de inclusión, restricción o no inclusión.
- Condiciones de utilización.
- Indicadores de seguimiento.
- Bibliografía verificable.

Permitir elegir entre informe breve y evaluación extensa.

### C. Informe de evaluación farmacoterapéutica individualizada

Incluir:

- Motivo de evaluación.
- Tratamiento propuesto.
- Contexto clínico relevante.
- Tratamientos concomitantes.
- Alternativas.
- Beneficio y riesgos esperados.
- Evidencia disponible.
- Aspectos de adherencia y seguridad.
- Plan de seguimiento.
- Conclusión profesional.

El formulario debe permitir omitir apartados que no procedan, justificando la omisión cuando sea relevante.

---

## 3. Experiencia de usuario

Diseñar una interfaz moderna, profesional, responsive y accesible.

Estructura recomendada:

1. Pantalla de bienvenida.
2. Selección del tipo de informe.
3. Asistente de cumplimentación por pasos.
4. Indicador de progreso.
5. Validaciones contextuales.
6. Vista previa del informe.
7. Edición final.
8. Exportación.
9. Historial local de borradores.
10. Ayuda y demostración.

Incorporar campos dinámicos y texto de ayuda.

Evitar formularios innecesariamente extensos en una única pantalla.

Mostrar claramente los campos obligatorios, opcionales y no aplicables.

Incluir un modo demostración con tres casos ficticios, uno por modalidad.

---

## 4. Fuentes de información

Evaluar la integración opcional con fuentes públicas:

- API CIMA de la AEMPS.
- PubMed mediante NCBI E-utilities.
- ClinicalTrials.gov.
- Fuentes oficiales de información regulatoria.
- Recursos públicos del grupo GENESIS-SEFH.

La integración debe ser modular.

Si una API presenta restricciones, errores de conexión o limitaciones CORS, proporcionar un mecanismo alternativo que no exponga credenciales.

Nunca inventar información científica, referencias, resultados de ensayos, estados regulatorios o condiciones de financiación.

Cada afirmación científica relevante debe poder asociarse a una fuente o quedar identificada como información aportada por el usuario pendiente de verificación.

No incorporar scraping indiscriminado ni asumir licencias de reutilización inexistentes.

---

## 5. Motor de elaboración del informe

Crear un motor de plantillas que:

- Transforme los datos introducidos en un documento estructurado.
- Organice automáticamente apartados y subtítulos.
- Genere tablas cuando proceda.
- Identifique información incompleta.
- Permita editar manualmente el documento.
- Mantenga consistencia terminológica.
- Incorpore bibliografía aportada y verificada.
- Distinga hechos, interpretación y recomendaciones.

En la versión inicial, debe funcionar sin necesidad de servicios externos de inteligencia artificial.

No simular redacción generativa ni afirmar que existe análisis automático de evidencia si únicamente se están rellenando plantillas.

Diseñar una arquitectura que permita incorporar posteriormente un motor de IA opcional, sujeto a disponibilidad, privacidad y validación.

---

## 6. Exportación profesional

Implementar:

- Exportación DOCX editable.
- Exportación PDF.
- Vista previa para impresión.
- Posibilidad de copiar el contenido.

La plantilla debe tener una estética profesional y permitir configurar:

- Hospital.
- Servicio de Farmacia.
- Autor.
- Fecha.
- Tipo de informe.
- Versión.
- Logotipo institucional aportado por el usuario.

No incorporar logotipos oficiales sin disponer de autorización o de archivos facilitados legítimamente.

Incluir numeración de páginas, cabeceras y estructura coherente cuando el formato lo permita.

---

## 7. Privacidad y seguridad

Requisitos obligatorios:

- No utilizar datos reales de pacientes en los ejemplos.
- No transmitir información clínica a servicios externos sin una base de legitimación, evaluación de riesgos y autorización institucional.
- No incluir credenciales ni claves en el frontend.
- Explicar los límites del almacenamiento local.
- Incorporar posibilidad de borrar borradores y datos locales.
- Validar y sanear las entradas del usuario.
- Evitar inyección de HTML o scripts.
- No presentar la aplicación como producto sanitario certificado.
- Incorporar aviso de validación farmacéutica obligatoria.

La aplicación no debe tomar decisiones clínicas autónomas.

---

# PRODUCTO B. APRENDE A CONSTRUIR FARMAINFORME

## 8. Objetivo docente

Crear una guía que permita a un farmacéutico de hospital sin experiencia previa en programación comprender y reproducir la construcción de una herramienta similar.

Debe ser un tutorial basado en el desarrollo real de FarmaInforme.

No debe limitarse a explicar qué es GitHub o qué es Claude Code.

Debe enseñar a construir una aplicación funcional.

## 9. Tutorial interactivo en seis pasos

### Paso 1. Del problema a la solución

Explicar:

- Qué problema queremos resolver.
- Cómo identificar requisitos.
- Qué debe hacer la aplicación.
- Qué funcionalidades quedan fuera de alcance.
- Cómo redactar las especificaciones iniciales.

Incluir el ejemplo aplicado a FarmaInforme.

### Paso 2. Preparación del entorno

Explicar paso a paso:

- Crear un repositorio GitHub.
- Preparar Claude Code o Codex.
- Conectar el entorno de desarrollo.
- Identificar archivos y carpetas.
- Conocer el flujo de trabajo básico.

Incluir instrucciones diferenciadas cuando Claude Code y Codex no funcionen de la misma manera.

### Paso 3. El prompt maestro

Mostrar el prompt real utilizado para desarrollar la aplicación.

Permitir copiarlo mediante un botón.

Explicar las secciones del prompt y por qué se han incluido.

Diferenciar requisitos funcionales, técnicos, visuales y de seguridad.

### Paso 4. Construcción y pruebas

Explicar cómo el agente:

- Analiza el repositorio.
- Propone la arquitectura.
- Genera los componentes.
- Implementa las funcionalidades.
- Detecta errores.
- Realiza pruebas.

Añadir ejemplos reproducibles de comprobación y depuración.

### Paso 5. Auditoría y publicación

Proporcionar un segundo prompt para auditar el proyecto.

Explicar:

- Pruebas funcionales.
- Revisión de seguridad.
- Validación del contenido.
- Accesibilidad.
- Publicación con GitHub Pages.
- Comprobación de la web publicada.

### Paso 6. Personalización para otro hospital

Explicar cómo modificar:

- Tipos de informes.
- Campos de los formularios.
- Plantillas.
- Textos institucionales.
- Fuentes documentales.
- Estructura de exportación.
- Apariencia.

Incluir un ejercicio práctico en el que el alumno añada un tipo de informe adicional.

---

## 10. Documentación real y reutilizable

Crear en el repositorio una carpeta `/docs/tutorial/`.

Incorporar:

- `01-problema-y-requisitos.md`
- `02-preparacion-entorno.md`
- `03-prompt-maestro.md`
- `04-construccion-y-pruebas.md`
- `05-auditoria-y-publicacion.md`
- `06-personalizacion.md`
- `prompts-reutilizables.md`
- `arquitectura.md`
- `limitaciones.md`

Registrar los comandos, archivos y decisiones realmente utilizados.

No inventar capturas, resultados de ejecución, pruebas o acciones no realizadas.

Los prompts de la guía deben corresponder a una versión reproducible de la aplicación, no ser una transcripción que dependa de código privado inaccesible.

---

# INTEGRACIÓN CON EL TALLER DE SANTIAGO

## 11. Integración web

En el apartado «Soluciones personalizadas del taller», actualizar la tarjeta FarmaInforme.

La sección «Utiliza la solución» deberá contener:

- Descripción.
- Acceso a la aplicación.
- Caso práctico.
- Instrucciones de uso.
- Avisos de seguridad y limitaciones.

La sección «Aprende a construirla» deberá contener:

- Tutorial de seis pasos.
- Prompts copiables.
- Enlace al repositorio cuando esté disponible.
- Instrucciones de publicación.
- Ejercicio práctico.

Mantener las otras tres herramientas sin modificar.

Respetar la estética, estructura y comportamiento de la página actual.

No marcar como completado ningún módulo que no esté realmente funcional.

---

# INGENIERÍA Y CONTROL DE CALIDAD

## 12. Requisitos técnicos

Priorizar:

- HTML, CSS y JavaScript o el framework ya utilizado, según convenga.
- Arquitectura modular.
- Compatibilidad con GitHub Pages.
- Ausencia de backend cuando no sea necesario.
- Funcionamiento sin claves API.
- Componentes reutilizables.
- Diseño adaptable a móviles.
- Validaciones robustas.
- Dependencias mínimas.
- Documentación clara.

Evitar complejidad accidental.

No introducir Supabase ni otros servicios persistentes por defecto.

Si alguna funcionalidad requiere servidor, separar claramente esa necesidad y documentarla.

## 13. Pruebas obligatorias

Preparar y ejecutar, cuando el entorno lo permita:

- Creación de informes de las tres modalidades.
- Validación de campos obligatorios.
- Persistencia y recuperación de borradores.
- Eliminación de datos.
- Exportación DOCX y PDF.
- Edición de informes.
- Campos condicionales.
- Manejo de errores.
- Funcionamiento móvil.
- Accesibilidad básica.
- Ausencia de referencias científicas fabricadas.
- Coherencia entre aplicación y tutorial.
- Ausencia de enlaces rotos.

Corregir los errores encontrados antes de considerar finalizada una funcionalidad.

Si no es posible ejecutar alguna prueba, indicarlo explícitamente.

---

# MODO DE TRABAJO AGÉNTICO Y EFICIENCIA

Trabaja de forma autónoma siguiendo esta secuencia:

1. Inspeccionar lo existente.
2. Definir la arquitectura mínima.
3. Construir el núcleo funcional.
4. Implementar los tres tipos de informes.
5. Implementar exportación y almacenamiento.
6. Ejecutar pruebas.
7. Documentar el desarrollo real.
8. Crear el tutorial.
9. Integrar el contenido en la web de Santiago.
10. Auditar el resultado final.

No dediques tokens a describir repetidamente lo que vas a hacer.

No reescribas archivos completos cuando un cambio localizado sea suficiente.

No alteres repositorios ajenos al alcance de la tarea.

No elimines funcionalidades existentes.

No realices cambios irreversibles sin necesidad.

Si tienes permisos para crear ramas, trabaja preferentemente en una rama específica de desarrollo antes de proponer la integración final.

Resuelve de forma autónoma los problemas técnicos ordinarios.

Documenta los bloqueos que requieran permisos, credenciales, decisiones institucionales o información no disponible.

---

# CRITERIOS DE ACEPTACIÓN

El proyecto solamente podrá considerarse completado cuando:

1. FarmaInforme permita elaborar los tres tipos de informes.
2. Existan casos ficticios funcionales.
3. DOCX y PDF se hayan comprobado.
4. El usuario pueda editar y revisar el informe.
5. La aplicación no dependa obligatoriamente de una API de pago.
6. Existan controles básicos de privacidad y seguridad.
7. El tutorial documente fielmente el procedimiento de construcción.
8. Los prompts puedan copiarse y reutilizarse.
9. La tarjeta de Santiago tenga enlaces reales y operativos.
10. Se entregue un informe final de pruebas y limitaciones.

Si algún criterio no se alcanza, comunicarlo como pendiente y no afirmar que el desarrollo está terminado.

---

# ENTREGA FINAL

Al finalizar, proporcionar:

- URL de la aplicación, si se ha publicado.
- URL del repositorio.
- URL del tutorial, si se ha publicado.
- Resumen de funcionalidades implementadas.
- Archivos creados y modificados.
- Pruebas ejecutadas y resultados.
- Limitaciones conocidas.
- Funcionalidades pendientes.
- Recomendaciones para una segunda versión.

El objetivo es que FarmaInforme sea simultáneamente una herramienta útil para el farmacéutico de hospital y un ejemplo docente completo de desarrollo de aplicaciones mediante inteligencia artificial.

Comienza auditando el entorno y ejecuta el desarrollo con la máxima autonomía posible.