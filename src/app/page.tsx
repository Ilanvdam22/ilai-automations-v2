import type { Viewport } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GymSection from "@/components/gym-world/GymSection";
import FaqList from "@/components/site/FaqList";
import { Arrow, Section, body, button, h2, h3, label, textLink } from "@/components/site/ui";
import { faqs, services, site } from "@/lib/content";
import { faqJsonLd, organizationJsonLd, serializeJsonLd, websiteJsonLd } from "@/lib/jsonld";

export const viewport: Viewport = { themeColor: "#000000" };

export default function Home() {
  return (
    <>
      {[organizationJsonLd, websiteJsonLd, faqJsonLd(faqs.slice(0, 5))].map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
        />
      ))}
      {/* Samenvatting in platte HTML voor screenreaders en crawlers zonder JavaScript */}
      <section className="sr-only" aria-label="Samenvatting">
        <h2>Wat ILAI Automations doet</h2>
        <p>{site.description}</p>
        <p>
          ILAI Automations is gevestigd in {site.city}. Oplevering van de eerste automatiseringen
          duurt meestal 1 tot 3 weken. Plan een gratis kennismaking via de contactpagina of mail
          naar {site.email}.
        </p>
      </section>

      <Navbar />
      <main>
        <GymSection />

        <Section>
          <h2 className={h2}>Wat ILAI voor je regelt</h2>
          <ul className="mt-12 border-t border-white/15">
            {services.map((s, i) => (
              <li key={s.slug} className="grid gap-4 border-b border-white/15 py-8 md:grid-cols-[5rem_1fr_auto] md:items-baseline">
                <span className={label}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className={h3}>{s.title}</h3>
                  <p className={`${body} mt-3 max-w-2xl`}>{s.story}</p>
                </div>
                <Link href={`/diensten#${s.slug}`} className={`${textLink} whitespace-nowrap`}>
                  Lees meer
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section>
          <div className="grid gap-12 lg:grid-cols-[22rem_1fr]">
            <div>
              <h2 className={h2}>Veelgestelde vragen</h2>
              <Link href="/faq" className={`${textLink} mt-8 inline-block`}>
                Alle vragen
              </Link>
            </div>
            <FaqList items={faqs.slice(0, 5)} />
          </div>
        </Section>

        <Section>
          <h2 className={`${h2} max-w-3xl`}>Benieuwd wat dit voor jouw zaak doet?</h2>
          <p className={`${body} mt-6 max-w-xl`}>Een gratis gesprek van 45 minuten, zonder verplichtingen. We reageren dezelfde dag.</p>
          <Link href="/contact" className={`${button} mt-10`}>
            Plan een gratis gesprek <Arrow />
          </Link>
        </Section>
      </main>
      <Footer />
    </>
  );
}
