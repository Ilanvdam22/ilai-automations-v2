import type { ReactNode } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { breadcrumbJsonLd, serializeJsonLd } from "@/lib/jsonld";
import { container } from "./ui";
import MobileCta from "./MobileCta";

type Crumb = { name: string; path: string };

/**
 * Vaste opbouw van elke subpagina: menu, kruimelpad (zichtbaar en als JSON-LD),
 * inhoud, footer en op mobiel een vaste CTA-balk onderaan.
 */
export default function Page({ crumbs, children, cta = true }: { crumbs: Crumb[]; children: ReactNode; cta?: boolean }) {
  const trail = [{ name: "Home", path: "/" }, ...crumbs];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd(crumbs)) }} />
      <Navbar />
      <main className={`bg-black pt-28 text-white ${cta ? "pb-24 md:pb-0" : ""}`}>
        <nav aria-label="Kruimelpad" className={`${container} pb-8`}>
          <ol className="flex flex-wrap items-center gap-2 text-sm text-white/65">
            {trail.map((c, i) => {
              const last = i === trail.length - 1;
              return (
                <li key={c.path} className="flex items-center gap-2">
                  {last ? (
                    <span aria-current="page" className="text-white">
                      {c.name}
                    </span>
                  ) : (
                    <>
                      <Link href={c.path} className="hover:text-white hover:underline">
                        {c.name}
                      </Link>
                      <span aria-hidden>/</span>
                    </>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        {children}
      </main>
      <Footer />
      {cta && <MobileCta />}
    </>
  );
}
