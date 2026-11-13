# Santiago 2026 · circuito QR y entrega de apuntes

Estado: **propuesta en rama, NO publicada y NO activada**.

## Arquitectura
1. QR con destino final `https://ramonmorillo.es/santiago-recursos.html`.
2. Página de solicitud `santiago-recursos.html` (el formulario permanece desactivado si no hay endpoint).
3. Google Apps Script `scripts/apuntes-santiago.gs` envía correo con enlace al material, sin guardar direcciones en un repositorio.
4. Cuaderno PDF: pendiente de seleccionar, generar y verificar antes de activar el envío.

## Activación manual necesaria
1. Revisar y completar aviso de privacidad (contacto de responsable, proveedor y plazo de conservación). No activar antes.
2. Crear un proyecto de Google Apps Script bajo la cuenta de correo desde la que se enviará.
3. Pegar el contenido de `scripts/apuntes-santiago.gs`. En Configuración del proyecto > Propiedades del script, definir `MATERIAL_URL` (URL HTTPS definitiva del PDF) y `CONTACT_EMAIL`.
4. Autorizar MailApp; publicar una aplicación web ejecutada como el propietario con acceso al público indicado. Evaluar riesgo de spam y cuotas.
5. Pegar la URL de despliegue `https://script.google.com/macros/s/.../exec` en la constante ENDPOINT de `santiago-recursos.html`.
6. Probar en móvil con correo real de ensayo: solicitud, mensaje, enlace, accesibilidad, spam, repetición y límites. **No crear enlace público a material restringido en repositorio abierto**.
7. Integrar un enlace en `_talleres/santiago-16-noviembre.html`, ejecutar `npm run talleres` y verificar el resultado cifrado. NO editar directamente el HTML publicado.
8. Generar QR definitivo solo después de comprobar la URL publicada y el flujo. Si se emplea el QR provisional, dirige a la URL prevista, no al correo.

## Precauciones
- No introducir pacientes ni datos clínicos; usar correo como único dato personal.
- Esta versión no contempla mailing comercial ni suscripciones.
- El Apps Script público no equivale a sistema antispam completo. Limitar cuotas y revisar abusos, considerar proveedor de correo transaccional si crece la demanda.
- No se crea cuenta, ni se almacena una lista de correos en Sheets.
- El enlace al PDF funciona para quien lo reciba; no es descarga individual ni autenticada.
- La clave SANTIAGO protege por cifrado la página del taller; no implica que el PDF público esté protegido.
- El material docente y sus derechos de reproducción deben verificarse antes de producir el cuaderno.

## Avances del 13-11-2026
- Cuaderno de 14 páginas ya generado, revisado y subido a Google Drive: https://drive.google.com/file/d/1xLdvrQKHxxVxE8K3kmc1AZZgE_giFBFQ/view
- Verificado que el archivo todavía pertenece solo al propietario: no consta permiso público. El propietario debe cambiar en Drive > Compartir > Acceso general > Cualquier persona con el enlace > Lector; comprobar en una ventana privada antes de activar.
- El QR PNG preparado fuera del repositorio se ha decodificado y dirige a https://ramonmorillo.es/santiago-recursos.html. Mantenerlo sin proyectar hasta verificar publicación y envío.
- Nueva práctica opcional de vibecoding y cobertura simplificada en el archivo fuente `_talleres/santiago-16-noviembre.html`, dentro del bloque 01 Claude. Generar la salida cifrada con `npm run talleres` antes de integrar la rama.
- El envío real no ha podido probarse: todavía falta desplegar Apps Script, obtener URL /exec y autorizar la cuenta que enviará correos. No simular recepción satisfactoria.
- Comprobar que el apartado de privacidad contiene los datos completos del responsable antes de habilitar el formulario.
