import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { NextRequest } from "next/server";
import { prefersMarkdown } from "@/lib/negotiation";
import { getMarkdown, markdownPaths, notFoundMarkdown } from "@/lib/markdown";
import { middleware } from "@/middleware";
import { GET } from "@/app/md/[[...slug]]/route";
import { organizationJsonLd, serializeJsonLd } from "@/lib/jsonld";
import sitemap from "@/app/sitemap";

describe("prefersMarkdown", () => {
  it.each([
    ["text/markdown", true],
    ["text/markdown, text/html;q=0.5", true],
    ["text/html, text/markdown;q=0.9", false],
    ["text/html", false],
    ["*/*", false],
    ["text/markdown;q=0", false],
    [null, false],
  ])("%s -> %s", (accept, expected) => {
    expect(prefersMarkdown(accept)).toBe(expected);
  });
});

describe("middleware", () => {
  const req = (path: string, accept: string, method = "GET") =>
    new NextRequest(`https://www.ilaiautomations.com${path}`, { method, headers: { accept } });

  it("herschrijft Markdown-verzoeken naar de md-route", () => {
    const res = middleware(req("/diensten", "text/markdown"));
    expect(res.headers.get("x-middleware-rewrite")).toContain("/md/diensten");
  });
  it("herschrijft de homepage naar /md", () => {
    expect(middleware(req("/", "text/markdown")).headers.get("x-middleware-rewrite")).toMatch(/\/md$/);
  });
  it("laat HTML-verzoeken ongemoeid en zet Vary: Accept", () => {
    const res = middleware(req("/", "text/html"));
    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
    expect(res.headers.get("vary")).toContain("Accept");
  });
  it("herschrijft niet bij POST", () => {
    expect(middleware(req("/", "text/markdown", "POST")).headers.get("x-middleware-rewrite")).toBeNull();
  });
});

describe("md-route", () => {
  const call = (slug?: string[]) => GET(new Request("https://x.test/md"), { params: { slug } });

  it.each(markdownPaths)("%s geeft 200 Markdown met Vary: Accept", async (path) => {
    const res = await call(path === "/" ? undefined : path.slice(1).split("/"));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toMatch(/^text\/markdown/);
    expect(res.headers.get("vary")).toBe("Accept");
    expect((await res.text()).startsWith("# ")).toBe(true);
  });

  it("geeft 404 met Markdown-body en links voor onbekende paden", async () => {
    const res = await call(["bestaat", "niet"]);
    const body = await res.text();
    expect(res.status).toBe(404);
    expect(res.headers.get("content-type")).toMatch(/^text\/markdown/);
    expect(body.length).toBeGreaterThan(20);
    expect(body).toContain("/llms.txt");
    expect(body).toContain("/sitemap.xml");
  });

  it("normaliseert slashes", () => {
    expect(getMarkdown("/faq/")).toBe(getMarkdown("/faq"));
    expect(notFoundMarkdown("/x")).toContain("`/x`");
  });
});

describe("JSON-LD", () => {
  it("bevat Organization met contactPoint en PostalAddress", () => {
    expect(organizationJsonLd["@type"]).toContain("Organization");
    expect(organizationJsonLd.contactPoint.contactType).toBeTruthy();
    expect(organizationJsonLd.contactPoint.email).toContain("@");
    expect(organizationJsonLd.address["@type"]).toBe("PostalAddress");
  });
  it("ontsnapt < in de geserialiseerde JSON", () => {
    expect(serializeJsonLd({ a: "</script>" })).not.toContain("</script>");
  });
});

describe("llms.txt en sitemap", () => {
  const llms = readFileSync("public/llms.txt", "utf8");
  it("volgt het llms.txt-formaat en bevat when-to-use", () => {
    expect(llms.startsWith("# ")).toBe(true);
    expect(llms).toMatch(/^> /m);
    expect(llms).toMatch(/^## Wanneer .*\(when to use\)/m);
  });
  it("sitemap bevat /privacy en alle md-paden", () => {
    const urls = sitemap().map((s) => new URL(s.url).pathname.replace(/\/$/, "") || "/");
    for (const p of markdownPaths) expect(urls).toContain(p);
  });
});
