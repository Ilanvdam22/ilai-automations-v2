import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/site/Page";
import { PageTitle, Section, body, h3, textLink } from "@/components/site/ui";
import { site } from "@/lib/content";

// Bedankpagina na een aanvraag. Niet indexeren: alleen bedoeld als vervolg op het formulier.
export const metadata: Metadata = {
  title: "Bedankt voor je aanvraag | ILAI Automations",
  description: "Je aanvraag is binnen. We reageren dezelfde dag.",
  robots: { index: false, follow: true },
};

export default function BedanktPage() {
  return (
    <Page crumbs={[{ name: "Bedankt", path: "/bedankt" }]} cta={false}>
      <PageTitle title="Bedankt, je aanvraag is binnen." intro="We reageren dezelfde dag. Je hoeft verder niets te doen." />

      <Section>
        <h2 className={h3}>Wat er nu gebeurt</h2>
        <ol className="mt-6 max-w-2xl border-t border-white/10">
          <li className={`${body} border-b border-white/10 py-4`}>
            <span className="mr-4 font-mono text-accent">01</span>We bekijken je aanvraag en nemen dezelfde dag contact op.
          </li>
          <li className={`${body} border-b border-white/10 py-4`}>
            <span className="mr-4 font-mono text-accent">02</span>In een gratis gesprek van 45 minuten kijken we waar je tijd in
            verdwijnt.
          </li>
          <li className={`${body} border-b border-white/10 py-4`}>
            <span className="mr-4 font-mono text-accent">03</span>Je krijgt een transparante prijsopgave. Geen verplichtingen.
          </li>
        </ol>
        <p className={`${body} mt-8`}>
          Iets vergeten te vertellen? App ons op{" "}
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className={textLink}>
            {site.phoneDisplay}
          </a>{" "}
          of mail naar{" "}
          <a href={`mailto:${site.email}`} className={textLink}>
            {site.email}
          </a>
          .
        </p>
        <p className="mt-8 flex flex-wrap gap-6">
          <Link href="/diensten" className={textLink}>
            Bekijk de diensten
          </Link>
          <Link href="/proces" className={textLink}>
            Zo werkt het proces
          </Link>
          <Link href="/" className={textLink}>
            Terug naar home
          </Link>
        </p>
      </Section>
    </Page>
  );
}
