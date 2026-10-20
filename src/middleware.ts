import { NextRequest, NextResponse } from "next/server";
import { prefersMarkdown } from "@/lib/negotiation";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isRead = req.method === "GET" || req.method === "HEAD";

  if (isRead && pathname !== "/md" && !pathname.startsWith("/md/") && prefersMarkdown(req.headers.get("accept"))) {
    const url = req.nextUrl.clone();
    url.pathname = "/md" + (pathname === "/" ? "" : pathname);
    return NextResponse.rewrite(url);
  }
  const res = NextResponse.next();
  res.headers.append("Vary", "Accept");
  return res;
}

export const config = {
  // Alles behalve Next-internals en bestanden met een extensie (afbeeldingen, llms.txt, sitemap.xml, ...).
  matcher: ["/((?!_next/|api/|.*\\.[a-zA-Z0-9]+$).*)"],
};
