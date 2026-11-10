# Prompts reutilizables

Estos prompts acompañan la especificación original del paso 3. Son herramientas docentes para auditoría y extensión; no son registros de una auditoría institucional realizada por terceros.

## Prompt de auditoría

```text
Audita FarmaInforme en herramientas/farmainforme/ sin cambiar otras herramientas.
Lee docs/tutorial/arquitectura.md y los tests existentes. Revisa los tres tipos,
las dos variantes CFT, validación, omisiones justificadas, fuente por apartado,
edición manual, logo, guardado/recuperación/borrado y errores de almacenamiento.
Ejecuta npm run test:farmainforme y python3 scripts/test-farmainforme.py.
Abre los DOCX y extrae texto de los PDF generados; no basta con ver una descarga.
Busca XSS, URL inseguras, transmisión de datos, referencias inventadas y secretos.
Prueba teclado y móviles. Distingue pruebas aprobadas, fallidas y no ejecutadas.
No elimines aserciones ni ocultes fallos. Corrige errores ordinarios y repite
solo las pruebas afectadas. Informa archivos cambiados y límites pendientes.
No publiques, cambies reglas clínicas ni modifiques materiales del taller.
```

## Prompt de personalización

```text
En una rama de ejercicio añade a FarmaInforme la modalidad de conciliación
documental descrita en docs/tutorial/06-personalizacion.md. Conserva los tres
tipos existentes, los límites docentes y la ausencia de llamadas API.
Declara campos en schema.mjs y genera un ejemplo ficticio en core.mjs.
Actualiza textos de interfaz, tests Node, prueba de navegador y documentación.
Comprueba borrador, edición, DOCX y PDF. No inventes reglas de conciliación
clínica, bibliografía ni decisiones terapéuticas. Entrega diff y resultados.
```

## Prompt para una posible integración futura de IA

```text
Solo evalúa, no implementes todavía: propone un motor opcional de redacción
para FarmaInforme. Define qué datos recibiría, validación, revisión humana,
trazabilidad y controles institucionales. Nunca pongas claves en el frontend.
Separa un eventual servidor del sitio estático. Documenta coste, licencias,
privacidad y fallos. Mantén el modo de plantillas sin IA plenamente funcional.
No transmitas datos ni solicites datos de pacientes para esta evaluación.
```
