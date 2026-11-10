// Configuración propia; no reproduce formularios oficiales ni el programa MADRE.
export const TYPES = {
  soles: 'Solicitud especial · SOLES adaptable',
  cft: 'Comisión de Farmacia y Terapéutica',
  individual: 'Evaluación farmacoterapéutica individualizada',
};
export const STEPS = ['Identificación', 'Medicamento y contexto', 'Valoración', 'Fuentes y evidencia', 'Propuesta y seguimiento', 'Revisión y exportación'];
const field = (id, label, step, extra = {}) => ({ id, label, step, kind: 'textarea', ...extra });
export const COMMON = [
  field('medicamento', 'Medicamento solicitado o propuesto', 1, { required: true, kind: 'text' }),
  field('principio', 'Principio activo', 1, { kind: 'text' }),
  field('presentacion', 'Presentación', 1, { kind: 'text' }),
  field('indicacion', 'Indicación y población candidata', 1, { required: true }),
  field('regulatoria', 'Situación regulatoria del medicamento y la indicación', 1, { scientific: true, help: 'Distingue autorización, uso fuera de ficha técnica y financiación. No se comprueban automáticamente.' }),
  field('alternativas', 'Alternativas disponibles', 2, { scientific: true }),
  field('evidencia', 'Evidencia científica aportada y sus limitaciones', 3, { scientific: true, help: 'Separa resultados, aplicabilidad e incertidumbre. Asocia una fuente o quedará pendiente de verificación.' }),
  field('seguridad', 'Evaluación de seguridad y riesgos', 3, { scientific: true }),
  field('economia', 'Evaluación económica: supuestos y limitaciones', 3),
  field('pacientes', 'Número de pacientes por año (opcional)', 3, { kind: 'number', integer: true }),
  field('costeNuevo', 'Coste anual por paciente del tratamiento propuesto, € (opcional)', 3, { kind: 'number' }),
  field('costeActual', 'Coste anual por paciente de la alternativa, € (opcional)', 3, { kind: 'number' }),
  field('recomendacion', 'Recomendación o conclusión profesional', 4, { required: true, classification: 'Recomendación profesional' }),
  field('condiciones', 'Condiciones de utilización', 4, { classification: 'Recomendación profesional' }),
  field('seguimiento', 'Plan e indicadores de seguimiento', 4, { required: true, classification: 'Recomendación profesional' }),
];
export const SPECIFIC = {
  soles: [
    field('circuito', 'Circuito y destinatario de la solicitud', 1, { kind: 'select', options: ['Solicitud interna', 'Valoración farmacoterapéutica', 'Tramitación de autorización administrativa'], required: true, help: 'El informe no concede ninguna autorización. SOLES no es un modelo nacional único: adapta el circuito a tu hospital.' }),
    field('motivo', 'Motivo de la solicitud', 1, { required: true }),
    field('previos', 'Tratamientos previos y resultados', 2, { scientific: true }),
    field('justificacion', 'Justificación clínica', 2, { scientific: true, classification: 'Interpretación profesional' }),
    field('eficacia', 'Evaluación de eficacia', 3, { scientific: true }),
  ],
  cft: [
    field('problema', 'Problema clínico y necesidad de evaluación', 1, { required: true }),
    field('eficacia', 'Eficacia comparada', 3, { scientific: true }),
    field('calidad', 'Calidad, sesgos y limitaciones de la evidencia', 3, { scientific: true, extensive: true }),
    field('posicionamiento', 'Posicionamiento terapéutico propuesto', 4, { extensive: true, scientific: true, classification: 'Interpretación profesional' }),
    field('propuesta', 'Propuesta a la Comisión', 4, { kind: 'select', options: ['Inclusión', 'Inclusión restringida', 'No inclusión', 'Pendiente de evaluación'], required: true }),
  ],
  individual: [
    field('motivo', 'Motivo de la evaluación', 1, { required: true }),
    field('contexto', 'Contexto clínico relevante (solo ficticio en esta versión)', 1, { scientific: true }),
    field('concomitantes', 'Tratamientos concomitantes', 2, { scientific: true }),
    field('beneficio', 'Beneficio esperado y balance beneficio-riesgo', 3, { scientific: true, classification: 'Interpretación profesional' }),
    field('adherencia', 'Aspectos de adherencia y seguridad de uso', 4, { scientific: true }),
  ],
};
export function fieldsFor(type, variant = 'extenso') {
  return [...COMMON, ...(SPECIFIC[type] || [])].filter(f => !(type === 'cft' && variant === 'breve' && f.extensive)).sort((a, b) => a.step - b.step);
}
export const META = [
  { id: 'hospital', label: 'Hospital', required: true },
  { id: 'servicio', label: 'Servicio', required: true },
  { id: 'autor', label: 'Autor profesional', required: true },
  { id: 'fecha', label: 'Fecha', kind: 'date', required: true },
  { id: 'version', label: 'Versión', required: true },
  { id: 'estado', label: 'Estado', kind: 'select', options: ['Borrador', 'En revisión', 'Revisado por el autor'] },
  { id: 'codigo', label: 'Referencia interna no identificativa (opcional)' },
];
