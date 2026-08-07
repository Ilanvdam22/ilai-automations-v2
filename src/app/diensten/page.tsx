import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Services from "@/components/sections/Services";
import BottomSphere from "@/components/sections/BottomSphere";
import { Briefcase, Building2, Users, ShoppingBag, GraduationCap, Store } from "lucide-react";
import { Headline } from "@/components/ui/headline";


export const metadata: Metadata = {
  title: "Diensten | ILAI Automations",
  description: "Bekijk onze AI-automatiseringsdiensten voor B2B-bedrijven: leadopvolging, cold outreach, WhatsApp- en e-mailagents en CRM-koppelingen.",
};

const industries = [
  { icon: Briefcase, label: "Dienstverleners & Consultancy", desc: "Van eerste contact tot getekende opdracht, automatisch opgevolgd." },
  { icon: Building2, label: "Vastgoed & Makelaardij", desc: "Elke aanvraag direct beantwoord, elke bezichtiging bevestigd." },
  { icon: Users, label: "Recruitment & Bureaus", desc: "Kandidaten en opdrachtgevers automatisch op elkaar afgestemd." },
  { icon: ShoppingBag, label: "E-commerce & Retail", desc: "Klantvragen en reviews afgehandeld zonder handmatig werk." },
  { icon: GraduationCap, label: "Coaches & Opleiders", desc: "Intakes, herinneringen en opvolging volledig geautomatiseerd." },
  { icon: Store, label: "Lokale & MKB-bedrijven", desc: "Nooit meer een lead die tussen wal en schip valt." },
];

export default function DienstenPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#050508]">
        {/* Page header */}
        <div className="pt-40 pb-8 px-4 text-center max-w-3xl mx-auto">
          <span className="inline-block text-xs font-mono tracking-widest text-[#00d4ff] border border-[#00d4ff]/30 px-4 py-1.5 rounded-full mb-6 bg-[#00d4ff]/5">
            Onze diensten
          </span>
          <Headline as="h1" size="xl" className="text-white mb-6">
            Alles wat je nodig hebt om{" "}
            <span className="gradient-text">automatisch te groeien.</span>
          </Headline>
          <p className="text-slate-400 text-lg leading-relaxed">
            Van eerste DM tot vaste klant. Wij bouwen de systemen die het voor jou regelen.
            Volledig op de achtergrond. Altijd aan.
          </p>
        </div>

        {/* Services grid */}
        <Services />

        {/* Voor wie sectie */}
        <div className="px-4 py-24 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-mono tracking-widest text-[#00d4ff] border border-[#00d4ff]/30 px-4 py-1.5 rounded-full mb-5 bg-[#00d4ff]/5">
                Voor wie?
              </span>
              <Headline size="lg" className="text-white">
                Voor elk bedrijf dat{" "}
                <span className="gradient-text">wil groeien.</span>
              </Headline>
              <p className="text-slate-400 mt-4 max-w-xl mx-auto">
                Of je nu een groeiende scale-up runt of solo-ondernemer bent, onze automatiseringen werken voor elk B2B-bedrijf dat leads en opvolging niet meer handmatig wil doen.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {industries.map((ind) => {
                const Icon = ind.icon;
                return (
                  <div
                    key={ind.label}
                    className="glass rounded-xl p-6 flex items-start gap-4 hover:border-[#00d4ff]/25 transition-colors duration-300"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#00d4ff]/10 border border-[#00d4ff]/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-[#00d4ff]" />
                    </div>
                    <div>
                      <p className="font-mono uppercase tracking-wide text-white text-xs mb-1">{ind.label}</p>
                      <p className="text-slate-500 text-xs leading-relaxed">{ind.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      <BottomSphere />
      </main>
      <Footer />

    </>
  );
}
