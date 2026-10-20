// Bepaalt of een Accept-header Markdown boven HTML verkiest (RFC 9110, q-waarden).
export function prefersMarkdown(accept: string | null | undefined): boolean {
  if (!accept) return false;
  let markdown = 0;
  let html = 0;
  for (const part of accept.split(",")) {
    const [rawType, ...params] = part.trim().split(";");
    const type = rawType.trim().toLowerCase();
    const qParam = params.map((p) => p.trim()).find((p) => p.toLowerCase().startsWith("q="));
    const parsed = qParam ? parseFloat(qParam.slice(2)) : 1;
    const q = Number.isNaN(parsed) ? 1 : parsed;
    if (type === "text/markdown") markdown = Math.max(markdown, q);
    else if (type === "text/html" || type === "application/xhtml+xml") html = Math.max(html, q);
  }
  return markdown > 0 && markdown >= html;
}
