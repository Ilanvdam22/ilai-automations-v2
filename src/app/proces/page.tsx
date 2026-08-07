import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Process from "@/components/sections/Process";
import { Check } from "lucide-react";
import { Headline } from "@/components/ui/headline";

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
    <>
      <Navbar />
      <main className="bg-[#050508] pt-16">
        <Process />

        {/* Garantie sectie */}
        <div className="px-4 py-24 border-t border-white/5">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-mono tracking-widest text-[#00d4ff] border border-[#00d4ff]/30 px-4 py-1.5 rounded-full mb-5 bg-[#00d4ff]/5">
                Onze garantie
              </span>
              <Headline size="lg" className="text-white">
                Wat je van ons mag verwachten.
              </Headline>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {guarantees.map((g) => (
                <div
                  key={g}
                  className="glass rounded-xl px-6 py-5 flex items-start gap-4"
                >
                  <div className="w-6 h-6 rounded-full bg-[#00d4ff]/15 border border-[#00d4ff]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={13} className="text-[#00d4ff]" />
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{g}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />

    </>
  );
}
