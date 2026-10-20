import { getMarkdown, normalizePath, notFoundMarkdown } from "@/lib/markdown";

// Intern doelwit van de rewrite in middleware.ts voor Accept: text/markdown.
const headers = {
  "Content-Type": "text/markdown; charset=utf-8",
  Vary: "Accept",
  "Cache-Control": "public, max-age=0, must-revalidate",
};

export function GET(_req: Request, { params }: { params: { slug?: string[] } }) {
  const path = normalizePath("/" + (params.slug ?? []).join("/"));
  const body = getMarkdown(path);
  if (body === null) {
    return new Response(notFoundMarkdown(path), { status: 404, headers });
  }
  return new Response(body, { status: 200, headers });
}
