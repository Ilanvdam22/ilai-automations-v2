import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Services from "@/components/sections/Services";
import BottomSphere from "@/components/sections/BottomSphere";
import { Dumbbell, User, Heart, Leaf, Shield, Music } from "lucide-react";


export const metadata: Metadata = {
  title: "Diensten | ILAI Automations",
  description: "Bekijk onze AI-automatiseringsdiensten voor de bewegingssector: sportscholen, personal trainers, fysiotherapeuten, yogastudio's en meer.",
};

const industries = [
  { icon: Dumbbell, label: "Sportscholen & Gyms", desc: "Van leads tot vaste leden, volledig geautomatiseerd." },
  { icon: User, label: "Personal Trainers", desc: "Opvolging zonder handwerk, meer tijd voor je klanten." },
  { icon: Heart, label: "Fysiotherapeuten", desc: "Intake, herinneringen en onboarding op autopilot." },
  { icon: Leaf, label: "Yogastudio's", desc: "Vul je lessen automatisch en verlaag no-shows." },
  { icon: Shield, label: "Vechtsporten", desc: "Proeftraining-aanvragen automatisch kwalificeren." },
  { icon: Music, label: "Dansstudio's", desc: "Audities en inschrijvingen zonder handmatige opvolging." },
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
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
            Alles wat je nodig hebt om{" "}
            <span className="gradient-text">automatisch te groeien.</span>
          </h1>
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
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Voor iedereen in de{" "}
                <span className="gradient-text">bewegingssector.</span>
              </h2>
              <p className="text-slate-400 mt-4 max-w-xl mx-auto">
                Of je nu een grote sportschool runt of solo personal trainer bent, onze automatiseringen werken voor elke onderneming in sport en beweging.
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
                      <p className="font-semibold text-white text-sm mb-1">{ind.label}</p>
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
