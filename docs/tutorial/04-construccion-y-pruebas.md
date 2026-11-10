# 4. Construcción y pruebas

## Orden real de implementación

Se auditó una web estática sin dependencias npm ni módulos de DOCX/PDF reutilizables. Se creó la rama feature/farmainforme. La implementación sigue este orden:

1. schema.mjs declara tipos, metadatos, campos, obligatoriedad y diferencias CFT breve/extensa.
2. core.mjs valida, normaliza borradores, genera bloques de documento y calcula el presupuesto con datos completos.
3. export-docx.mjs genera un ZIP Open XML real, con texto escapado, estilos, tablas, imagen, cabecera y numeración.
4. app.mjs conecta el asistente, fuentes, revisión, historial y exportación con elementos DOM seguros.
5. index.html y farmainforme.css presentan la interfaz y su versión imprimible.
6. tutorial.html y tutorial.mjs presentan estos mismos documentos, prompts copiables y marcas de progreso.

Las plantillas no inventan prosa ni bibliografía. Para un motor de IA futuro, conserva el contrato de bloques, añade una revisión explícita del texto propuesto y evalúa privacidad, servidor y autorización antes de enviar datos. Esta versión no contiene una integración IA oculta o simulada.

## Ejecutar las pruebas reales

Desde la raíz:

```sh
npm run test:farmainforme
python3 scripts/test-farmainforme.py
git diff --check
npm run talleres:check
npm run validate-google-ia
node scripts/validate-recursos-ia.js
npm test
```

El primer comando usa node:test, sin instalar paquetes. El segundo requiere herramientas de desarrollo: Playwright para Python, python-docx, pypdf y un Chromium compatible. No son dependencias que se descarguen a los usuarios de la aplicación. Las versiones verificadas fueron Playwright 1.62.0, python-docx 1.2.0 y pypdf 6.10.0, ya instaladas en el entorno; no se ejecutó una instalación de paquetes para desarrollar esta versión. En un entorno nuevo puedes preparar un entorno virtual fuera del repositorio e instalar esos paquetes, manteniendo verificación TLS, con pip; después instala Chromium con python -m playwright install chromium si no tienes uno. El script busca chromium en PATH o CHROMIUM_PATH; si no existe usa el navegador de Playwright. No uses versiones de navegador de procedencia desconocida.

La comprobación cifrada de Santiago se ejecuta solo si la clave actual está disponible en CLAVE_SANTIAGO en el proceso de pruebas. Sin ella, el script informa esa parte como NO EJECUTADA; no uses una clave de prueba para sustituir la página pública ni guardes claves en scripts o documentación.

El script de navegador levanta su servidor temporal, escribe DOCX/PDF y capturas en una carpeta temporal fuera del checkout y se detiene con código de error si una aserción falla. Comprueba el texto extraído de los documentos y abre DOCX con python-docx. El informe de resultados y sus limitaciones están en limitaciones.md. No interpretes una prueba que no llegó a ejecutarse como aprobada.

## Depuración reproducible

- Si no carga app.mjs, comprueba servidor HTTP, MIME de los módulos y consola del navegador. No desactives la política de seguridad para ocultar un error.
- Si no avanza el asistente, sigue el enlace del resumen de errores hasta el campo obligatorio; una omisión necesita motivo.
- Si no aparece el presupuesto, aporta los tres números; no sustituyas un dato desconocido por cero.
- Si no guarda, el navegador puede bloquear localStorage o agotar su cuota. Copia/exporta el documento antes de borrar datos. Un historial dañado no se sobrescribe silenciosamente.
- Si una fuente no responde, consulta el original por separado y registra su identificador; no marques como verificada una referencia que no has leído.
- Si la página cifrada no coincide con la fuente, regenera solo Santiago con su clave actual usando el mecanismo del repositorio. Nunca edites el ciphertext ni publiques una salida cifrada con una clave de prueba.

## Ejercicio

Introduce un coste negativo y justifica un apartado como «No procede». Comprueba el error y su corrección. Añade una referencia documental ficticia claramente rotulada como tal y observa que solo cambia de estado cuando tú marcas la comprobación. Exporta y busca esas mismas etiquetas en los dos formatos.
