import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import About from "@/components/sections/About";

export const metadata: Metadata = {
  title: "Over ons | ILAI Automations",
  description: "Leer meer over ILAI Automations en hoe wij B2B-bedrijven helpen met AI-automatisering voor leads, opvolging en outreach.",
};

const stats = [
  { value: "< 2 min", label: "Gemiddelde responstijd" },
  { value: "24/7", label: "Altijd actief, ook in het weekend" },
  { value: "5 stappen", label: "Van gesprek tot live automatisering" },
];

export default function OverPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#050508]">
        <About />

        {/* Missie sectie */}
        <div className="px-4 py-24 border-t border-white/5">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-xs font-mono tracking-widest text-[#00d4ff] border border-[#00d4ff]/30 px-4 py-1.5 rounded-full mb-8 bg-[#00d4ff]/5">
              Onze missie
            </span>
            <blockquote className="font-heading font-medium uppercase tracking-tight leading-[0.95] text-3xl sm:text-4xl md:text-5xl text-white mb-8">
              &ldquo;Elke ondernemer verdient meer tijd voor zijn bedrijf,{" "}
              <span className="gradient-text">niet voor zijn inbox.</span>&rdquo;
            </blockquote>
            <p className="text-slate-400 text-lg leading-relaxed">
              ILAI Automations is opgericht vanuit één overtuiging: ondernemers die hun bedrijf
              laten groeien, moeten niet vastzitten aan administratie en opvolging. Wij nemen dat over, met AI die
              nooit slaapt, nooit vergeet en altijd op tijd reageert.
            </p>
          </div>
        </div>

        {/* Stats sectie */}
        <div className="px-4 py-20 border-t border-white/5">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-3">
                <span className="text-5xl font-black text-[#00d4ff] glow-text">{stat.value}</span>
                <span className="font-mono uppercase tracking-widest text-slate-500 text-xs max-w-[160px]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

      </main>
      <Footer />

    </>
  );
}
