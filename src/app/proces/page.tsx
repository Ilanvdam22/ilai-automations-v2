import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/site/Page";
import { Arrow, PageTitle, Section, body, button, h2, h3 } from "@/components/site/ui";
import { processSteps } from "@/lib/content";

export const metadata: Metadata = {
  title: "Ons Proces | ILAI Automations",
  description: "Van kennismakingsgesprek tot live automatisering in 5 stappen.",
};

const guarantees = [
  "Gratis kennismakingsgesprek, zonder verplichtingen",
  "We stoppen pas als jij 100% tevreden bent",
  "Geen technische kennis vereist van jouw kant",
  "Transparante prijsopgave, geen verborgen kosten",
];

export default function ProcesPage() {
  return (
    <Page crumbs={[{ name: "Proces", path: "/proces" }]}>
      <PageTitle title="Van gesprek tot automatisering in 5 stappen." />

      <Section>
        <ol className="border-t border-white/10">
          {processSteps.map((step, i) => (
            <li key={step.title} className="grid gap-4 border-b border-white/10 py-10 md:grid-cols-[8rem_1fr] md:gap-12">
              <span className="font-heading text-5xl font-bold tracking-[-0.04em] text-accent">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className={h3}>{step.title}</h2>
                <p className={`${body} mt-3 max-w-2xl`}>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <h2 className={h2}>Wat je van ons mag verwachten.</h2>
        <ul className="mt-10 grid border-t border-white/10 sm:grid-cols-2">
          {guarantees.map((g) => (
            <li key={g} className="border-b border-white/10 py-5 text-white/85 sm:pr-12">
              {g}
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <h2 className={h2}>Klaar om te starten?</h2>
        <p className={`${body} mt-6 text-lg`}>Stap 1 begint met één gesprek. We reageren dezelfde dag.</p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Link href="/contact" className={button}>
            Plan een gratis gesprek
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
