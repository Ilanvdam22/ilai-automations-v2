import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail } from "lucide-react";
import { Headline } from "@/components/ui/headline";

export const metadata: Metadata = {
  title: "E-mail- en outreachbeleid | ILAI Automations",
  description:
    "Beleid van ILAI Automations rondom zakelijke e-mailoutreach, afmelden en gegevensverwerking.",
};

export default function OutreachPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#050508] pt-32 pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          <Headline as="h1" size="lg" className="text-white mb-6">
            E-mail- en outreachbeleid
          </Headline>

          <p className="text-slate-400 leading-relaxed mb-8">
            Laatst bijgewerkt: 31 augustus 2026
          </p>

          <div className="space-y-8 text-slate-300 leading-relaxed">
            <section>
              <Headline as="h2" size="md" className="text-white mb-3">
                Wie we zijn
              </Headline>
              <p>
                ILAI Automations is een eenmanszaak gevestigd in Den Helder (BTW-nummer
                NL005465836B32), opgericht door Ilan van Dam. Wij bouwen op maat gemaakte
                automatiseringen voor MKB-bedrijven, zoals WhatsApp-automatiseringen,
                lead-opvolging, CRM-automatiseringen en e-mailautomatiseringen.
              </p>
            </section>

            <section>
              <Headline as="h2" size="md" className="text-white mb-3">
                Welke domeinen dit beleid dekt
              </Headline>
              <p>
                Dit beleid geldt voor alle zakelijke e-mailcommunicatie die ILAI Automations
                verstuurt, ongeacht vanaf welk domein. Naast onze hoofdwebsite
                ilaiautomations.com gebruiken wij de volgende domeinen uitsluitend voor
                zakelijke e-mailoutreach:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-1 text-slate-300">
                <li>ilai-agency.com</li>
                <li>ilaiagency.com</li>
              </ul>
              <p className="mt-3">
                Deze domeinen worden niet gebruikt voor een publieke website en dienen alleen om
                onze reguliere hoofddomein te ontlasten bij het versturen van zakelijke
                e-mails (best practice binnen e-mailoutreach).
              </p>
            </section>

            <section>
              <Headline as="h2" size="md" className="text-white mb-3">
                Waarom wij e-mailen
              </Headline>
              <p>
                Wij benaderen bedrijven met een relevant, zakelijk aanbod op het gebied van
                AI-automatisering. Onze e-mails zijn persoonlijk en handmatig opgesteld of
                specifiek voor de doelgroep afgestemd, en bevatten altijd een duidelijke
                afzender en manier om af te melden.
              </p>
            </section>

            <section>
              <Headline as="h2" size="md" className="text-white mb-3">
                Afmelden
              </Headline>
              <p>
                Wilt u geen e-mail meer van ons ontvangen? Stuur dan een bericht met
                &quot;afmelden&quot; naar{" "}
                <a href="mailto:info@ilaiautomations.nl" className="text-[#00d4ff] hover:underline">
                  info@ilaiautomations.nl
                </a>{" "}
                of reageer op de ontvangen e-mail. Wij verwerken elk afmeldverzoek binnen 48 uur
                en verwijderen uw gegevens vervolgens uit onze verzendlijst.
              </p>
            </section>

            <section>
              <Headline as="h2" size="md" className="text-white mb-3">
                Gegevensverwerking
              </Headline>
              <p>
                Wij verzamelen alleen zakelijke contactgegevens (naam, bedrijfsnaam, functie,
                zakelijk e-mailadres) uit openbare of legitiem verkregen bronnen, en gebruiken
                deze uitsluitend voor zakelijke outreach. Wij verkopen of delen deze gegevens
                niet met derden. Gegevens worden verwijderd op verzoek of zodra ze niet langer
                nodig zijn.
              </p>
            </section>

            <section>
              <Headline as="h2" size="md" className="text-white mb-3">
                Contact
              </Headline>
              <p className="mb-4">
                Vragen over dit beleid? Neem gerust contact op.
              </p>
              <a
                href="mailto:info@ilaiautomations.nl"
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#00d4ff] text-black font-semibold text-sm hover:bg-[#00d4ff]/90 transition-all duration-200 glow-blue"
              >
                <Mail size={16} />
                Stuur een e-mail
              </a>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
