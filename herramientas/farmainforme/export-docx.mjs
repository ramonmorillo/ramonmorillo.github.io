// DOCX Open XML mínimo: ZIP sin compresión, relaciones, estilos, cabecera y pie.
// No se disfraza HTML como .doc; el archivo contiene XML editable real.
import { blocks } from './core.mjs';
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const xml = s => decoder.decode(encoder.encode(String(s))).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
const declaration = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const ns = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
const paragraph = (text, style = '') => `<w:p>${style ? `<w:pPr><w:pStyle w:val="${style}"/></w:pPr>` : ''}<w:r>${String(text).split('\n').map(s => `<w:t xml:space="preserve">${xml(s)}</w:t>`).join('<w:br/>')}</w:r></w:p>`;
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) { crc ^= byte; for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0); }
  return (crc ^ 0xffffffff) >>> 0;
}
export function zip(entries) {
  const files = [], directory = []; let offset = 0;
  for (const [name, value] of entries) {
    const filename = encoder.encode(name), bytes = typeof value === 'string' ? encoder.encode(value) : value;
    const header = new Uint8Array(30 + filename.length), h = new DataView(header.buffer);
    h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true);
    h.setUint16(12, 33, true); // 1980-01-01, sin fecha personal en el contenedor.
    h.setUint32(14, crc32(bytes), true); h.setUint32(18, bytes.length, true); h.setUint32(22, bytes.length, true); h.setUint16(26, filename.length, true); header.set(filename, 30);
    const central = new Uint8Array(46 + filename.length), c = new DataView(central.buffer);
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(14, 33, true);
    c.setUint32(16, crc32(bytes), true); c.setUint32(20, bytes.length, true); c.setUint32(24, bytes.length, true); c.setUint16(28, filename.length, true); c.setUint32(42, offset, true); central.set(filename, 46);
    files.push(header, bytes); directory.push(central); offset += header.length + bytes.length;
  }
  const size = directory.reduce((n, item) => n + item.length, 0), end = new Uint8Array(22), e = new DataView(end.buffer);
  e.setUint32(0, 0x06054b50, true); e.setUint16(8, entries.length, true); e.setUint16(10, entries.length, true); e.setUint32(12, size, true); e.setUint32(16, offset, true);
  return new Blob([...files, ...directory, end], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
}
export function createDocx(report) {
  const content = blocks(report).map(b => b.kind === 'table' ? `<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders>${['top','left','bottom','right','insideH','insideV'].map(side => `<w:${side} w:val="single" w:sz="4" w:color="B8C4D0"/>`).join('')}</w:tblBorders></w:tblPr><w:tblGrid><w:gridCol w:w="4800"/><w:gridCol w:w="4800"/></w:tblGrid>${b.rows.map(row => `<w:tr>${row.map(cell => `<w:tc>${paragraph(cell)}</w:tc>`).join('')}</w:tr>`).join('')}</w:tbl>` : paragraph(b.text, b.kind === 'title' ? 'Title' : b.kind === 'h' ? 'Heading1' : '')).join('');
  let image = '', imageType = '', imageBytes;
  if (report.logo) {
    imageType = report.logo.startsWith('data:image/png;') ? 'png' : 'jpeg';
    imageBytes = Uint8Array.from(atob(report.logo.split(',')[1]), c => c.charCodeAt(0));
    const ratio = (report.logoWidth || 1) / (report.logoHeight || 1), cx = Math.round(Math.min(160, 64 * ratio) * 9525), cy = Math.round(cx / ratio);
    image = `<w:p><w:r><w:drawing><wp:inline xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="1" name="Logotipo aportado por el usuario"/><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="1" name="Logotipo"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rIdLogo"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`;
  }
  const relns = 'http://schemas.openxmlformats.org/package/2006/relationships', office = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
  const entries = [
    ['[Content_Types].xml', declaration + `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>${image ? `<Default Extension="${imageType}" ContentType="image/${imageType}"/>` : ''}${[['document','document.main'],['styles','styles'],['header1','header'],['footer1','footer']].map(([name, type]) => `<Override PartName="/word/${name}.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.${type}+xml"/>`).join('')}</Types>`],
    ['_rels/.rels', declaration + `<Relationships xmlns="${relns}"><Relationship Id="rId1" Type="${office}/officeDocument" Target="word/document.xml"/></Relationships>`],
    ['word/document.xml', declaration + `<w:document ${ns}><w:body>${image}${content}<w:sectPr><w:headerReference w:type="default" r:id="rIdHeader"/><w:footerReference w:type="default" r:id="rIdFooter"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="500" w:footer="500"/></w:sectPr></w:body></w:document>`],
    ['word/styles.xml', declaration + `<w:styles ${ns}><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="22"/></w:rPr></w:rPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:pPr><w:spacing w:after="120"/></w:pPr></w:style>${[['Title','32'],['Heading1','26']].map(([id,size]) => `<w:style w:type="paragraph" w:styleId="${id}"><w:name w:val="${id}"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/></w:pPr><w:rPr><w:b/><w:color w:val="1D3557"/><w:sz w:val="${size}"/></w:rPr></w:style>`).join('')}</w:styles>`],
    ['word/_rels/document.xml.rels', declaration + `<Relationships xmlns="${relns}">${[['Styles','styles','styles.xml'],['Header','header','header1.xml'],['Footer','footer','footer1.xml'],...(image ? [['Logo','image',`media/logo.${imageType}`]] : [])].map(([id,type,target]) => `<Relationship Id="rId${id}" Type="${office}/${type}" Target="${target}"/>`).join('')}</Relationships>`],
    ['word/header1.xml', declaration + `<w:hdr ${ns}>${paragraph(`${report.meta.hospital} · ${report.meta.servicio}`)}</w:hdr>`],
    ['word/footer1.xml', declaration + `<w:ftr ${ns}><w:p><w:r><w:t>FarmaInforme · Revisión profesional obligatoria · Página </w:t></w:r><w:fldSimple w:instr="PAGE"/></w:p></w:ftr>`],
  ];
  if (image) entries.push([`word/media/logo.${imageType}`, imageBytes]);
  return zip(entries);
}
