import type { Metadata } from "next";
import Page from "@/components/site/Page";
import FaqList from "@/components/site/FaqList";
import { PageTitle, Section, body, button, h2, textLink } from "@/components/site/ui";
import { faqs, site } from "@/lib/content";
import { faqJsonLd, serializeJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Veelgestelde vragen | ILAI Automations",
  description: "Antwoorden op de meest gestelde vragen over AI-automatisering voor MKB-bedrijven en de sportsector.",
};

export default function FAQPage() {
  return (
    <Page crumbs={[{ name: "FAQ", path: "/faq" }]}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd(faqs)) }} />
      <PageTitle title="Alles wat je wil weten." />

      <Section>
        <FaqList items={faqs} />
      </Section>

      <Section>
        <h2 className={h2}>Staat je vraag er niet bij?</h2>
        <p className={`${body} mt-6 max-w-xl text-lg`}>
          We beantwoorden hem graag persoonlijk. Stuur ons een berichtje via WhatsApp of e-mail. We reageren dezelfde dag.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className={button}>
            App via WhatsApp
          </a>
          <a href={`mailto:${site.email}`} className={textLink}>
            Stuur een e-mail
          </a>
        </div>
      </Section>
    </Page>
  );
}
