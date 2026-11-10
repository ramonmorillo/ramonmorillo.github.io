# 6. Personalización para otro hospital

## Cambios pequeños y comprobables

- Tipos, campos y textos de ayuda: schema.mjs, objetos TYPES y SPECIFIC y lista COMMON.
- Reglas, omisiones y documento: core.mjs. Mantén identificación, trazabilidad y aviso de revisión.
- Datos de demostración: demoReport() en core.mjs. Usa medicamentos y escenarios expresamente ficticios, sin citas aparentes.
- Hospital, servicio, autor, fecha y logotipo: primer paso del formulario, sin editar código. El circuito SOLES debe coincidir con el autorizado en tu centro.
- Fuentes documentales: sources.mjs, proveedores oficiales y consultas explícitas. Añadir un enlace no implementa una integración API.
- Estética: tokens de site.css y estilos aislados de farmainforme.css. Evita afectar otras páginas.
- Estructura DOCX: export-docx.mjs; impresión PDF: reglas @media print y @page. Comprueba ambos formatos tras cada cambio.

Las condiciones administrativas, la financiación y las reglas clínicas deben proceder de tu institución o de fuentes comprobadas; no las deduzcas del ejemplo docente.

## Reto: informe de conciliación documental

En una rama de ejercicio, añade una cuarta modalidad ficticia de conciliación documental; no implementes decisiones clínicas ni recomendaciones de ajuste de dosis.

1. Añade una clave conciliacion a TYPES con nombre claro.
2. Añade SPECIFIC.conciliacion con campos: motivo, fuentes documentales contrastadas y discrepancias que requieren revisión. Marca motivo como obligatorio y los campos relevantes como científicos. Reutiliza el resto de COMMON.
3. Amplía descriptions en app.mjs para explicar esta modalidad; revisa que la tarjeta tiene un número o etiqueta apropiados. No asumas que añadir un nombre al catálogo completa todos los textos.
4. Extiende demoReport con un ejemplo inequívocamente ficticio. No inventes resultados reales.
5. Añade un caso Node y un recorrido de navegador; las tres modalidades anteriores deben seguir pasando.
6. Exporta ambos formatos y comprueba que coinciden con la vista previa.

Criterios: la nueva modalidad aparece en la bienvenida, valida sus campos, guarda y recupera un borrador, muestra fuentes pendientes y exporta sin perder la información. Si alguna condición falla, el módulo sigue en desarrollo.

## Antes de uso institucional

Solicita validación farmacéutica, evaluación de riesgos, requisitos de accesibilidad y autorización del centro. El almacenamiento local sin cifrar y los documentos descargados necesitan controles institucionales propios. No conviertas una contraseña JavaScript en un supuesto sistema de autenticación.
