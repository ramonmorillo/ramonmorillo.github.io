#!/usr/bin/env python3
"""Prueba funcional real. Requiere Playwright, python-docx, pypdf y Chromium.
Artefactos temporales; no escribe borradores ni documentos en el repositorio.
"""
import functools
import http.server
import json
import os
from pathlib import Path
import re
import shutil
import tempfile
import threading
import zipfile
import xml.etree.ElementTree as ET

from docx import Document
from pypdf import PdfReader
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = Path(tempfile.mkdtemp(prefix='farmainforme-pruebas-'))


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(QuietHandler, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
BASE = f'http://127.0.0.1:{server.server_port}'


def next_step(page, expected):
    page.locator('#next').click()
    expect(page.locator('#progress-label')).to_contain_text(f'Paso {expected}')


def check_docx(path, expected):
    with zipfile.ZipFile(path) as archive:
        assert archive.testzip() is None
        for name in archive.namelist():
            if name.endswith(('.xml', '.rels')):
                ET.fromstring(archive.read(name))
        assert 'w:instr="PAGE"' in archive.read('word/footer1.xml').decode()
        assert 'word/media/logo.png' in archive.namelist()
    document = Document(path)
    text = '\n'.join(p.text for p in document.paragraphs)
    for marker in expected:
        assert marker in text, (path, marker)
    assert document.tables
    assert any('200.00' in c.text for row in document.tables[0].rows for c in row.cells)
    assert document.inline_shapes


try:
    with sync_playwright() as playwright:
        chromium = os.environ.get('CHROMIUM_PATH') or shutil.which('chromium')
        browser = playwright.chromium.launch(**({'executable_path': chromium} if chromium else {}), headless=True, args=['--no-sandbox'])
        context = browser.new_context(accept_downloads=True, permissions=['clipboard-read', 'clipboard-write'])
        page = context.new_page()
        errors, outgoing, bad_responses = [], [], []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('request', lambda request: outgoing.append(request.url) if not request.url.startswith((BASE, 'data:', 'blob:')) else None)
        page.on('response', lambda response: bad_responses.append((response.status, response.url)) if response.status >= 400 else None)
        page.on('dialog', lambda dialog: dialog.accept())
        page.goto(BASE + '/herramientas/farmainforme/')
        cards = page.locator('#type-cards article')
        expect(cards).to_have_count(3)
        cards.nth(0).get_by_role('button', name='Crear informe', exact=True).click()
        page.locator('#next').click()
        expect(page.locator('#errors')).to_be_visible()
        expect(page.locator('#meta-hospital')).to_have_attribute('aria-invalid', 'true')
        page.locator('#close-report').click()
        print('PASS obligatorios y navegación con errores', flush=True)

        # PNG pequeño de prueba, creado por Chromium, sin descargar imágenes externas.
        logo = OUTPUT / 'logo.png'
        page.locator('h1').screenshot(path=str(logo))
        for index, kind in enumerate(['soles', 'cft', 'individual']):
            cards.nth(index).get_by_role('button', name='Cargar demostración ficticia').click()
            page.locator('#logo').set_input_files(logo)
            expect(page.locator('#status')).to_contain_text('Logotipo incorporado')
            next_step(page, 2)
            next_step(page, 3)
            page.locator('#alternativas-omit').check()
            page.locator('#next').click()
            expect(page.locator('#errors')).to_contain_text('justifica')
            page.locator('#alternativas-reason').fill('Omisión justificada exclusivamente para la demostración ficticia.')
            next_step(page, 4)
            if kind == 'cft':
                expect(page.locator('#calidad')).to_be_visible()
                page.locator('#variant').select_option('breve')
                expect(page.locator('#calidad')).to_have_count(0)
                page.locator('#variant').select_option('extenso')
                expect(page.locator('#calidad')).to_be_visible()
            page.get_by_role('button', name='Añadir fuente', exact=True).click()
            page.locator('.fi-source input[type=text]').nth(0).fill('Documento ficticio de prueba, sin evidencia clínica')
            page.locator('.fi-source input[type=url]').fill('javascript:alert(1)')
            page.locator('.fi-source input[type=text]').nth(1).fill('DOC-DEMO-001')
            page.locator('#next').click()
            expect(page.locator('#errors')).to_contain_text('HTTPS')
            page.locator('.fi-source input[type=url]').fill('')
            page.locator('#evidencia-source').select_option(index=1)
            next_step(page, 5)
            next_step(page, 6)
            for width in [360, 390, 768, 1440]:
                page.set_viewport_size({'width': width, 'height': 900})
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), (kind, 'revisión', width)
                assert page.locator('#document').evaluate('(e)=>e.scrollWidth <= e.clientWidth + 1'), (kind, 'documento', width)
            expect(page.locator('#warnings')).to_contain_text('pendiente')
            expect(page.locator('#docx')).to_be_disabled()
            page.locator('#reviewed').check()
            with page.expect_download() as download_info:
                page.locator('#docx').click()
            docx_path = OUTPUT / f'{kind}.docx'
            download_info.value.save_as(docx_path)
            check_docx(docx_path, ['Hospital Docente Ficticio', 'Medicamento Docente A', 'DEMOSTRACIÓN FICTICIA', 'No procede. Justificación:', 'DOC-DEMO-001', 'Control de revisión'])
            # Comprueba el botón y el mismo motor de impresión con un PDF real.
            page.evaluate('window.print = () => { window.printRequested = true; }')
            page.locator('#pdf').click()
            assert page.evaluate('window.printRequested')
            pdf_path = OUTPUT / f'{kind}.pdf'
            page.pdf(path=str(pdf_path), format='A4', print_background=True, prefer_css_page_size=True, display_header_footer=True, header_template='<span></span>', footer_template='<div style="font-size:8px;text-align:center;width:100%">Página <span class="pageNumber"></span> de <span class="totalPages"></span></div>')
            pdf = PdfReader(pdf_path)
            text = '\n'.join(p.extract_text() for p in pdf.pages)
            for marker in ['Hospital Docente Ficticio', 'Medicamento Docente A', 'DEMOSTRACIÓN FICTICIA', 'DOC-DEMO-001', 'Control de revisión']:
                assert marker in text, (kind, marker)
            assert 'Guardar borrador' not in text
            assert len(pdf.pages) >= 2
            page.locator('#copy-report').click()
            expect(page.locator('#status')).to_contain_text('Informe copiado')
            assert 'Hospital Docente Ficticio' in page.evaluate('navigator.clipboard.readText()')
            page.locator('.fi-editor summary').click()
            payload = '<img src=x onerror="window.PWNED=1"> Conclusión editada por el profesional'
            page.locator('#final-text').fill(payload)
            page.locator('#apply-edit').click()
            expect(page.locator('#document')).to_contain_text(payload)
            assert page.evaluate('window.PWNED') is None
            expect(page.locator('#docx')).to_be_disabled()
            page.locator('#reviewed').check()
            with page.expect_download() as edited_download:
                page.locator('#docx').click()
            edited_path = OUTPUT / f'{kind}-editado.docx'
            edited_download.value.save_as(edited_path)
            assert payload in '\n'.join(p.text for p in Document(edited_path).paragraphs)
            assert not page.evaluate('window.PWNED')
            page.locator('#save-draft').click()
            page.locator('#close-report').click()
            page.locator('#drafts .fi-draft').first.get_by_role('button', name='Abrir borrador').click()
            page.locator('#step-nav button').last.click()
            expect(page.locator('#document')).to_contain_text('Conclusión editada por el profesional')
            page.locator('#close-report').click()
            print(f'PASS {kind}: formulario, omisión, fuentes, DOCX, PDF ({len(pdf.pages)} páginas), edición literal y borrador', flush=True)

        # Historial tras recarga, borrado selectivo y conservación de otra aplicación.
        page.reload()
        expect(page.locator('#drafts .fi-draft')).to_have_count(3)
        page.locator('#drafts .fi-draft').first.get_by_role('button', name='Eliminar borrador').click()
        expect(page.locator('#drafts .fi-draft')).to_have_count(2)
        page.evaluate("localStorage.setItem('otra-aplicacion','conservar')")
        page.locator('#delete-all').click()
        expect(page.locator('#drafts')).to_contain_text('No hay borradores')
        assert page.evaluate("localStorage.getItem('otra-aplicacion')") == 'conservar'
        page.evaluate("localStorage.setItem('farmainforme.borradores.v1','roto')")
        page.reload()
        expect(page.locator('#drafts')).to_contain_text('datos dañados')
        page.locator('#delete-all').click()
        print('PASS recuperación, borrado y manejo de historial dañado', flush=True)

        for width in [360, 390, 768, 1440]:
            page.set_viewport_size({'width': width, 'height': 900})
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), width
        page.set_viewport_size({'width': 1440, 'height': 1000})
        page.screenshot(path=str(OUTPUT / 'bienvenida.png'), full_page=True)
        # Navegación por teclado: enfoca el primer botón y actívalo con Enter.
        page.locator('#type-cards article').first.get_by_role('button', name='Cargar demostración ficticia').focus()
        page.keyboard.press('Enter')
        for width in [360, 390, 768, 1440]:
            page.set_viewport_size({'width': width, 'height': 900})
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), width
        for control in page.locator('#report-form input:not([type=hidden]), #report-form textarea, #report-form select').all():
            assert control.evaluate('(e)=>e.labels.length>0'), control.get_attribute('id')
        # Revisión y captura móvil; ningún envío remoto mientras se trabaja.
        page.locator('#step-nav button').last.click()
        page.set_viewport_size({'width': 390, 'height': 844})
        page.screenshot(path=str(OUTPUT / 'revision-movil.png'), full_page=True)
        page.locator('#close-report').click()
        page.goto(BASE + '/herramientas/farmainforme/tutorial.html')
        for section in page.locator('section[id^=paso-]').all():
            section.locator('summary').click()
            expect(section.locator('[data-doc]')).to_have_attribute('data-loaded', 'true')
            section.locator('[data-progress]').check()
        expect(page.locator('#tutorial-progress')).to_contain_text('6 de 6')
        page.get_by_role('button', name='Copiar especificación original').click()
        expect(page.locator('#tutorial-status')).to_contain_text('Documento copiado')
        assert 'MISIÓN: DESARROLLO INTEGRAL' in page.evaluate('navigator.clipboard.readText()')
        page.get_by_role('button', name='Copiar prompts de auditoría y mejora').click()
        page.wait_for_function("async () => (await navigator.clipboard.readText()).includes('Prompt de auditoría')")
        assert 'Prompt de auditoría' in page.evaluate('navigator.clipboard.readText()')
        page.reload()
        expect(page.locator('#tutorial-progress')).to_contain_text('6 de 6')
        page.locator('#tutorial-reset').click()
        expect(page.locator('#tutorial-progress')).to_contain_text('0 de 6')
        for width in [360, 390, 768, 1440]:
            page.set_viewport_size({'width': width, 'height': 900})
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), width
        for link in page.locator('a[href]').all():
            href = link.get_attribute('href')
            if href.startswith('/') and '#' not in href:
                assert context.request.get(BASE + href).ok, href
            elif href.startswith('#'):
                assert page.locator(href).count(), href
        assert not outgoing, outgoing
        assert not errors, errors
        assert not bad_responses, bad_responses
        print('PASS móvil, etiquetas, teclado, tutorial de seis pasos, copia de prompts y enlaces locales; sin tráfico externo ni errores JS/HTTP', flush=True)
        # El tutorial mantiene contenido y rutas documentales con JS desactivado.
        no_js = browser.new_context(java_script_enabled=False)
        fallback = no_js.new_page()
        fallback.goto(BASE + '/herramientas/farmainforme/tutorial.html')
        expect(fallback.locator('h1')).to_contain_text('Construye FarmaInforme')
        fallback.locator('#paso-1 summary').click()
        expect(fallback.locator('a[href$="01-problema-y-requisitos.md"]')).to_be_visible()
        no_js.close()
        if os.environ.get('CLAVE_SANTIAGO'):
            page.route('https://static.cloudflareinsights.com/**', lambda route: route.abort())
            page.goto(BASE + '/santiago-16-noviembre.html#solucion-informe')
            expect(page.locator('#solucion-informe')).to_have_count(0)
            page.locator('input[type=password]').fill(os.environ['CLAVE_SANTIAGO'])
            page.locator('button[type=submit]').click()
            card = page.locator('#solucion-informe')
            expect(card).to_be_visible(timeout=15000)
            card.locator('summary').filter(has_text='Utiliza la solución').click()
            card.get_by_role('link', name='Abrir FarmaInforme', exact=True).click()
            expect(page.locator('#type-cards article')).to_have_count(3)
            page.go_back()
            expect(page.locator('#solucion-informe')).to_be_visible(timeout=15000)
            page.locator('#solucion-informe summary').filter(has_text='Aprende a construirla').click()
            page.get_by_role('link', name='Tutorial interactivo de seis pasos', exact=True).click()
            expect(page.locator('#paso-1')).to_be_visible()
            print('PASS integración: taller cifrado con clave actual, enlaces reales a aplicación y tutorial y reapertura de sesión', flush=True)
        else:
            print('NO EJECUTADA integración cifrada: define CLAVE_SANTIAGO solo en el entorno de pruebas para verificar el acceso real.', flush=True)
        browser.close()
        print('PASS contenido docente alternativo sin JavaScript', flush=True)
finally:
    server.shutdown()
print('Artefactos:', OUTPUT)
