import type { Metadata } from "next";
import Page from "@/components/site/Page";
import { PageTitle, Section, body, button, h3, textLink } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "E-mail- en outreachbeleid | ILAI Automations",
  description: "Beleid van ILAI Automations rondom zakelijke e-mailoutreach, afmelden en gegevensverwerking.",
};

export default function OutreachPolicyPage() {
  return (
    <Page crumbs={[{ name: "Outreachbeleid", path: "/outreach-policy" }]}>
      <PageTitle title="E-mail- en outreachbeleid" intro="Laatst bijgewerkt: 31 augustus 2026" />
      <Section>
        <div className={`${body} max-w-3xl space-y-12`}>
          <section>
            <h2 className={`${h3} text-white`}>Wie we zijn</h2>
            <p className="mt-4">
              ILAI Automations is een eenmanszaak gevestigd in Den Helder (BTW-nummer NL005465836B32), opgericht door Ilan van Dam. Wij
              bouwen op maat gemaakte automatiseringen voor MKB-bedrijven, zoals WhatsApp-automatiseringen, lead-opvolging,
              CRM-automatiseringen en e-mailautomatiseringen.
            </p>
          </section>

          <section>
            <h2 className={`${h3} text-white`}>Welke domeinen dit beleid dekt</h2>
            <p className="mt-4">
              Dit beleid geldt voor alle zakelijke e-mailcommunicatie die ILAI Automations verstuurt, ongeacht vanaf welk domein. Naast
              onze hoofdwebsite ilaiautomations.com gebruiken wij de volgende domeinen uitsluitend voor zakelijke e-mailoutreach:
            </p>
            <ul className="mt-4 list-inside list-disc space-y-1">
              <li>ilai-agency.com</li>
              <li>ilaiagency.com</li>
            </ul>
            <p className="mt-4">
              Deze domeinen worden niet gebruikt voor een publieke website en dienen alleen om onze reguliere hoofddomein te ontlasten
              bij het versturen van zakelijke e-mails (best practice binnen e-mailoutreach).
            </p>
          </section>

          <section>
            <h2 className={`${h3} text-white`}>Waarom wij e-mailen</h2>
            <p className="mt-4">
              Wij benaderen bedrijven met een relevant, zakelijk aanbod op het gebied van AI-automatisering. Onze e-mails zijn persoonlijk
              en handmatig opgesteld of specifiek voor de doelgroep afgestemd, en bevatten altijd een duidelijke afzender en manier om af
              te melden.
            </p>
          </section>

          <section>
            <h2 className={`${h3} text-white`}>Afmelden</h2>
            <p className="mt-4">
              Wilt u geen e-mail meer van ons ontvangen? Stuur dan een bericht met &quot;afmelden&quot; naar{" "}
              <a href="mailto:info@ilaiautomations.nl" className={textLink}>
                info@ilaiautomations.nl
              </a>{" "}
              of reageer op de ontvangen e-mail. Wij verwerken elk afmeldverzoek binnen 48 uur en verwijderen uw gegevens vervolgens uit
              onze verzendlijst.
            </p>
          </section>

          <section>
            <h2 className={`${h3} text-white`}>Gegevensverwerking</h2>
            <p className="mt-4">
              Wij verzamelen alleen zakelijke contactgegevens (naam, bedrijfsnaam, functie, zakelijk e-mailadres) uit openbare of
              legitiem verkregen bronnen, en gebruiken deze uitsluitend voor zakelijke outreach. Wij verkopen of delen deze gegevens niet
              met derden. Gegevens worden verwijderd op verzoek of zodra ze niet langer nodig zijn.
            </p>
          </section>

          <section>
            <h2 className={`${h3} text-white`}>Contact</h2>
            <p className="mt-4">Vragen over dit beleid? Neem gerust contact op.</p>
            <a href="mailto:info@ilaiautomations.nl" className={`${button} mt-6`}>
              Stuur een e-mail
            </a>
          </section>
        </div>
      </Section>
    </Page>
  );
}
