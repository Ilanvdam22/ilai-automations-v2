import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Page from "@/components/site/Page";
import { Arrow, PageTitle, Section, body, button, h2, h3, label } from "@/components/site/ui";
import { services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Diensten | ILAI Automations",
  description:
    "Bekijk onze AI-automatiseringsdiensten voor MKB en sport: e-mail- en WhatsApp-agents, CRM-systeem en -automatisering, outreach en complete bedrijfsautomatisering.",
};

const industries = [
  { label: "Sportscholen & Gyms", desc: "Van proefles-aanvraag tot vast lid, automatisch opgevolgd." },
  { label: "Personal Trainers", desc: "Opvolging zonder handwerk, meer tijd voor je klanten." },
  { label: "Fysiotherapeuten", desc: "Intake, herinneringen en opvolging op de achtergrond." },
  { label: "Yoga- & Dansstudio's", desc: "Lessen vol en minder no-shows, zonder handmatig werk." },
  { label: "Coaches & Opleiders", desc: "Intakes, herinneringen en opvolging volledig geautomatiseerd." },
  { label: "Overig MKB", desc: "Nooit meer een lead die tussen wal en schip valt." },
];

// Beschrijvende alt-teksten voor de pilaarbeelden
const imageAlt: Record<string, string> = {
  agents: "Telefoon met een WhatsApp-gesprek dat automatisch wordt beantwoord",
  "crm-systeem": "Overzicht van klanten per fase in een CRM-systeem",
  "crm-automatisering": "Automatische herinneringen en opvolging na een afspraak",
  outreach: "Gepersonaliseerde e-mails en LinkedIn-berichten die in volgorde worden verstuurd",
  compleet: "Verschillende systemen die op elkaar zijn aangesloten",
};

export default function DienstenPage() {
  return (
    <Page crumbs={[{ name: "Diensten", path: "/diensten" }]}>
      <PageTitle
        title="Alles wat je nodig hebt om automatisch te groeien."
        intro="Van eerste DM tot vaste klant. Wij bouwen de systemen die het voor jou regelen. Volledig op de achtergrond. Altijd aan."
      />

      {/* Inhoudsopgave met interne links naar elke dienst */}
      <Section>
        <ol className="grid gap-x-12 gap-y-3 sm:grid-cols-2">
          {services.map((s, i) => (
            <li key={s.slug} className="flex gap-4">
              <span className={label}>{String(i + 1).padStart(2, "0")}</span>
              <Link href={`#${s.slug}`} className="text-white hover:text-accent hover:underline underline-offset-4">
                {s.title}
              </Link>
            </li>
          ))}
        </ol>
      </Section>

      {services.map((s, i) => (
        <Section key={s.slug} id={s.slug}>
          <div className="grid gap-12 md:grid-cols-[1fr_minmax(0,26rem)] md:items-start">
            <div>
              <p className={label}>
                {String(i + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
              </p>
              <h2 className={`${h2} mt-4`}>{s.title}</h2>
              <p className={`${body} mt-6 max-w-xl text-lg`}>{s.story}</p>
              <ul className="mt-8 max-w-xl border-t border-white/10">
                {s.bullets.map((b) => (
                  <li key={b} className="border-b border-white/10 py-3 text-white/85">
                    {b}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-white/65">Gebouwd met {s.tools.join(", ")}</p>
            </div>
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <Image src={s.image} alt={imageAlt[s.slug] ?? s.title} fill sizes="(min-width: 768px) 416px, 100vw" className="object-cover" />
            </div>
          </div>
        </Section>
      ))}

      <Section>
        <h2 className={h2}>Gebouwd voor sport en MKB.</h2>
        <p className={`${body} mt-6 max-w-2xl text-lg`}>
          Onze focus ligt op sportscholen, PT&apos;ers en fysiotherapeuten. Maar elk MKB-bedrijf dat leads en opvolging niet meer
          handmatig wil doen, kan bij ons terecht.
        </p>
        <dl className="mt-12 grid border-t border-white/10 sm:grid-cols-2">
          {industries.map((ind) => (
            <div key={ind.label} className="border-b border-white/10 py-6 sm:pr-12">
              <dt className={h3}>{ind.label}</dt>
              <dd className={`${body} mt-2`}>{ind.desc}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section>
        <h2 className={h2}>Benieuwd wat dit voor jouw bedrijf doet?</h2>
        <p className={`${body} mt-6 max-w-xl text-lg`}>Plan een gratis gesprek van 45 minuten. We reageren dezelfde dag.</p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Link href="/contact" className={button}>
            Plan een gratis gesprek
            <Arrow />
          </Link>
          <Link href="/proces" className="text-white underline decoration-white/40 underline-offset-[6px] hover:text-accent">
            Bekijk hoe we werken
          </Link>
        </div>
      </Section>
    </Page>
  );
}
