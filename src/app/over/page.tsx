import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/site/Page";
import { Arrow, PageTitle, Section, body, button, h2 } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Over ons | ILAI Automations",
  description:
    "Leer meer over ILAI Automations en hoe wij MKB-bedrijven en de sportsector helpen met AI-automatisering voor leads, opvolging en outreach.",
};

const bullets = [
  "24/7 beschikbaar, ook in het weekend",
  "Gebouwd op bewezen tools: GHL, n8n, Make",
  "Geen technische kennis vereist van jouw kant",
];

const stats = [
  { value: "< 2 min", label: "Reactie op een nieuwe lead" },
  { value: "24/7", label: "Altijd actief, ook in het weekend" },
  { value: "5 stappen", label: "Van gesprek tot live automatisering" },
];

export default function OverPage() {
  return (
    <Page crumbs={[{ name: "Over", path: "/over" }]}>
      <PageTitle
        title="Nooit meer een aanvraag die in een volle inbox verdwijnt."
        intro="Elke week laten bedrijven omzet liggen, niet omdat hun product of dienst niet goed is, maar omdat opvolging tijdrovend is. ILAI Automations lost dat op. Wij bouwen AI-systemen die jouw berichten beantwoorden, leads kwalificeren en nieuwe klanten actief benaderen. Volledig op de achtergrond. Altijd aan."
      />

      <Section>
        <ul className="max-w-2xl border-t border-white/10">
          {bullets.map((b) => (
            <li key={b} className="border-b border-white/10 py-4 text-lg text-white/85">
              {b}
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <blockquote className={`${h2} max-w-4xl`}>
          &ldquo;Elke ondernemer verdient meer tijd voor zijn bedrijf, niet voor zijn inbox.&rdquo;
        </blockquote>
        <p className={`${body} mt-8 max-w-2xl text-lg`}>
          ILAI Automations is opgericht vanuit één overtuiging: ondernemers die hun bedrijf laten groeien, moeten niet vastzitten aan
          administratie en opvolging. Wij nemen dat over, met AI die nooit slaapt, nooit vergeet en altijd op tijd reageert.
        </p>
      </Section>

      <Section>
        <dl className="grid gap-12 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-heading text-5xl font-bold tracking-[-0.04em] text-white">{s.value}</dd>
              <dd className="mt-3 text-white/75">{s.label}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section>
        <h2 className={h2}>Meer weten?</h2>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Link href="/contact" className={button}>
            Plan een gesprek
            <Arrow />
          </Link>
          <Link href="/diensten" className="text-white underline decoration-white/40 underline-offset-[6px] hover:text-accent">
            Bekijk de diensten
          </Link>
        </div>
      </Section>
    </Page>
  );
}
