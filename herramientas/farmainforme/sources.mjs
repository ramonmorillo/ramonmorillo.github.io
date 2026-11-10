// Búsqueda deliberada: solo se envía la consulta que escribe el usuario, nunca el informe.
// No se requiere API, credencial ni backend; la revisión e importación son manuales.
export const SOURCE_PROVIDERS = [
  { label: 'CIMA · AEMPS', base: 'https://cima.aemps.es/cima/publico/home.html', search: null, help: 'Busca el medicamento en CIMA y comprueba ficha técnica y fecha de revisión.' },
  { label: 'PubMed · NCBI', base: 'https://pubmed.ncbi.nlm.nih.gov/', search: 'term', help: 'Revisa el artículo original y registra el PMID o DOI.' },
  { label: 'ClinicalTrials.gov', base: 'https://clinicaltrials.gov/search', search: 'term', help: 'Un registro de ensayo no equivale a resultados publicados ni a autorización.' },
  { label: 'GENESIS · SEFH', base: 'https://gruposdetrabajo.sefh.es/genesis/', search: null, help: 'Consulta la metodología oficial y sus condiciones de reutilización. Esta plantilla no es un formulario oficial.' },
];
export function sourceURL(provider, query) {
  const u = new URL(provider.base);
  if (provider.search && query.trim()) u.searchParams.set(provider.search, query.trim().slice(0, 200));
  return u.href;
}
