export function sanitizeFieldName(name: string): string {
  // keep alphanumerics and underscores; replace spaces and hyphens with underscore
  const trimmed = String(name ?? '').trim();
  const replaced = trimmed.replace(/[\s-]+/g, '_');
  const cleaned = replaced.replace(/[^a-zA-Z0-9_]/g, '');
  // ensure it doesn't start with a number
  return cleaned.replace(/^([0-9])/, '_$1');
}
