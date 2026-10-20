import type { Metadata } from "next";
import Page from "@/components/site/Page";
import { PageTitle, Section, body, h3 } from "@/components/site/ui";
import { privacySections } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacyverklaring | ILAI Automations",
  description:
    "Hoe ILAI Automations omgaat met persoonsgegevens: welke gegevens we verwerken, waarom, met wie we ze delen en welke rechten je hebt.",
};

export default function PrivacyPage() {
  return (
    <Page crumbs={[{ name: "Privacy", path: "/privacy" }]}>
      <PageTitle title="Privacyverklaring" />
      <Section>
        <div className="max-w-3xl space-y-12">
          {privacySections.map((section) => (
            <section key={section.title}>
              <h2 className={h3}>{section.title}</h2>
              {section.paragraphs.map((p) => (
                <p key={p} className={`${body} mt-4`}>
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </Section>
    </Page>
  );
}
