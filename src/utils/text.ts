/**
 * Normaliza un texto removiendo diacríticos/tildes y convirtiéndolo a minúsculas
 * para búsquedas insensibles a mayúsculas y acentos.
 */
export function normalizeText(text: string): string {
  if (!text) return ''
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}
