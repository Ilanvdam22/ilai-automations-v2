import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FAQ from "@/components/sections/FAQ";
import { Mail, Phone } from "lucide-react";
import { Headline } from "@/components/ui/headline";

export const metadata: Metadata = {
  title: "Veelgestelde vragen | ILAI Automations",
  description: "Antwoorden op de meest gestelde vragen over AI-automatisering voor B2B-bedrijven.",
};

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#050508] pt-16">
        <FAQ />

        {/* Uitgebreide contact-sectie */}
        <div className="px-4 py-20 border-t border-white/5">
          <div className="max-w-3xl mx-auto">
            <div className="glass rounded-2xl p-10 flex flex-col md:flex-row items-start gap-10">
              {/* Links: tekst */}
              <div className="flex-1">
                <Headline as="h3" size="md" className="text-white mb-3">
                  Staat je vraag er niet bij?
                </Headline>
                <p className="text-slate-400 leading-relaxed">
                  We beantwoorden hem graag persoonlijk. Stuur ons een berichtje via WhatsApp of
                  e-mail. We reageren binnen 2 minuten.
                </p>
              </div>
              {/* Rechts: contactmogelijkheden */}
              <div className="flex flex-col gap-4 flex-shrink-0">
                <a
                  href="https://wa.me/31686377856"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#00d4ff] text-black font-semibold text-sm hover:bg-[#00d4ff]/90 transition-all duration-200 glow-blue"
                >
                  <Phone size={16} />
                  App via WhatsApp
                </a>
                <a
                  href="mailto:info@ilaiautomations.nl"
                  className="flex items-center gap-3 px-6 py-3.5 rounded-full border border-[#00d4ff]/40 text-[#00d4ff] font-semibold text-sm hover:bg-[#00d4ff]/10 transition-all duration-200"
                >
                  <Mail size={16} />
                  Stuur een e-mail
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

    </>
  );
}
