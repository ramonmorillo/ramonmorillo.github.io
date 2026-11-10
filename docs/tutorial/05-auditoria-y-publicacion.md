# 5. Auditoría y publicación

## Auditoría previa

Usa el prompt de auditoría de prompts-reutilizables.md. Exige evidencia de ejecución y un listado de límites; no permitas cambiar afirmaciones para convertir un test fallido en aprobado.

Revisa las tres modalidades, errores, omisiones, edición, borradores, borrado, logotipo, fuentes, DOCX, PDF, teclado y móviles. Comprueba que no hay tráfico de informes, referencias fabricadas, credenciales, renderizado de HTML aportado ni modificaciones de otras herramientas.

El consentimiento del revisor habilita las exportaciones; no certifica la revisión. La edición libre no vuelve a analizar el texto ni sus referencias. Abre el DOCX en el procesador de textos que se utilizará en el hospital y revisa paginación y logotipo. En PDF selecciona A4 y cabeceras/pies del navegador si necesitas números de página. La exportación PDF depende del diálogo de impresión, no de un servicio remoto.

## GitHub Pages en este repositorio

Las páginas se sirven desde la raíz y el dominio personalizado está en CNAME. La integración de Santiago conserva su cifrado estático; la aplicación y la documentación son públicas y no heredan su clave. No hay que añadir un backend ni ejecutar el generador general del sitio para servir FarmaInforme.

```sh
git status --short
npm run test:farmainforme
python3 scripts/test-farmainforme.py
git diff --check
```

Revisa las diferencias, crea un commit limitado a FarmaInforme y al enlace de la ficha del taller. En un proyecto compartido sube tu rama y abre una PR a main. No hagas force-push. La fusión o publicación requieren la autorización correspondiente; una rama subida no significa que la web esté actualizada.

## Verificación tras publicar

1. Confirma que GitHub Pages ha desplegado el SHA esperado y que su ejecución termina correctamente.
2. Abre la ruta /herramientas/farmainforme/ en el dominio publicado.
3. Carga una demostración, revisa y exporta un DOCX y un PDF.
4. Abre el tutorial y copia el prompt.
5. Desbloquea Santiago y sigue sus enlaces a aplicación y tutorial.
6. Si hay caché, recarga sin caché; no declares un éxito remoto basándote únicamente en un archivo local.

Si el entorno bloquea el dominio o no dispone de permisos de publicación, registra exactamente lo comprobado y deja la verificación remota como pendiente. No simules una URL de despliegue ni solicites credenciales en el frontend.

## Ejercicio

Audita un fallo introducido en una copia de ejercicio: cambia un identificador de campo sin cambiar el test. Lee el error, corrígelo en su origen y vuelve a ejecutar la prueba. Después revisa el diff para demostrar que no se debilitó la aserción.
