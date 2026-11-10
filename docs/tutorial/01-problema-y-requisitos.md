# 1. Del problema a la solución

## El problema real

Preparar un informe farmacoterapéutico exige reunir datos dispersos, mantener una estructura y revisar fuentes. FarmaInforme reduce el trabajo de organización documental. No determina si un medicamento es eficaz, apropiado, financiado o autorizado.

## Especificación de esta versión

- Tres modalidades: solicitud especial SOLES adaptable, Comisión de Farmacia y Terapéutica (breve o extensa) y valoración individualizada.
- Seis pasos: identificación, medicamento/contexto, valoración, fuentes, propuesta/seguimiento y revisión/exportación.
- Metadatos institucionales, omisiones justificadas, fuentes asociadas y bibliografía manual.
- Demostraciones completamente ficticias, sin medicamentos ni referencias científicas inventadas que se presenten como reales.
- Guardado local voluntario, recuperación y borrado de borradores.
- Edición final literal, DOCX Open XML editable y PDF mediante impresión del navegador.
- Logotipo PNG/JPEG aportado por el usuario, sin descargar imágenes institucionales.
- Sin backend, IA, credenciales, llamadas API, analítica o transmisión del informe.

## Lo que queda fuera

No hay búsqueda clínica automática, lectura crítica automatizada, generación de bibliografía, autorización administrativa, interoperabilidad hospitalaria, cuentas de usuario, sincronización o producto sanitario certificado. Un estado «Revisado por el autor» es una declaración del usuario, no una firma electrónica ni una auditoría independiente.

La solicitud interna, la valoración y la tramitación administrativa son circuitos diferentes. SOLES no se trata como un modelo nacional único. Las plantillas CFT son propias, con inspiración conceptual en evaluación de medicamentos: no reproducen MADRE ni prometen una evaluación oficial completa.

## Criterios verificables

1. Un informe vacío no permite avanzar sin identificar hospital, servicio, autor, fecha y versión.
2. Las tres demostraciones llegan a revisión sin errores de campos obligatorios.
3. Una omisión sin justificación impide avanzar; las fuentes sin verificar siguen marcadas como pendientes.
4. El presupuesto no aparece con datos parciales y admite coste cero.
5. DOCX y PDF contienen el tipo, hospital, medicamento y advertencias del documento mostrado.
6. Guardar, abrir y borrar no afecta al almacenamiento de otras aplicaciones.
7. Un texto con etiquetas HTML se muestra como texto, sin ejecutarse.

## Ejercicio

Escribe tres tareas repetitivas de tu servicio. Elige una cuyo resultado puedas comprobar. Define entrada, salida, cinco reglas y tres cosas que nunca debe decidir el programa. Traduce cada regla en una prueba concreta antes de pedir código al agente.
