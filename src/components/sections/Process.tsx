"use client";
import { motion } from "framer-motion";
import { Phone, Wrench, ClipboardCheck, Sliders, Rocket } from "lucide-react";
import TiltCard from "@/components/ui/tilt-card";
import { Headline } from "@/components/ui/headline";

const steps = [
  {
    icon: Phone,
    title: "Kennismakingsgesprek",
    description:
      "We plannen een gratis gesprek om jouw situatie te begrijpen. Waar lopen leads vast? Welke opvolging kost jou de meeste tijd? Na dit gesprek weten we precies wat we gaan automatiseren.",
  },
  {
    icon: Wrench,
    title: "Automatisering op maat bouwen",
    description:
      "Wij bouwen de flows volledig op jouw wensen: DM-assistent, intake-opvolging, onboarding. Jij hoeft niks te doen. Wij houden je op de hoogte van de voortgang.",
  },
  {
    icon: ClipboardCheck,
    title: "Review-call + prijsopgave",
    description:
      "We lopen samen door de gebouwde automatisering. Werkt alles zoals gewenst? Dan ontvang je een definitieve, transparante prijsopgave zonder verrassingen.",
  },
  {
    icon: Sliders,
    title: "Laatste aanpassingen",
    description:
      "Op basis van jouw feedback passen we de flows aan totdat alles precies goed is. We stoppen pas als jij tevreden bent.",
  },
  {
    icon: Rocket,
    title: "Live zetten & genieten",
    description:
      "Alles wordt geactiveerd en getest. Vanaf nu werkt jouw bedrijf ook als jij er niet bij bent. Leads worden opgevolgd, afspraken ingeboekt, nieuwe klanten verwelkomd.",
  },
];

export default function Process() {
  return (
    <section className="min-h-screen px-4 py-36 bg-[#050508] relative">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-24">
          <motion.span
            className="inline-block text-xs font-mono tracking-widest text-[#00d4ff] border border-[#00d4ff]/30 px-4 py-1.5 rounded-full mb-6 bg-[#00d4ff]/5"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Hoe het werkt
          </motion.span>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Headline as="h1" size="xl" className="text-white">
              Van gesprek tot{" "}
              <span className="gradient-text">automatisering</span>
              <br />in 5 stappen.
            </Headline>
          </motion.div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Animated vertical line */}
          <motion.div
            className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-[#00d4ff] via-[#7c3aed]/60 to-transparent"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformOrigin: "top" }}
          />

          <div className="space-y-16">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const num = String(i + 1).padStart(2, "0");
              return (
                <motion.div
                  key={step.title}
                  className="flex gap-8 relative"
                  initial={{ opacity: 0, x: -32 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                >
                  {/* Ambient step number */}
                  <span className="absolute -right-4 top-1/2 -translate-y-1/2 text-[120px] font-black text-white/[0.025] select-none leading-none pointer-events-none">
                    {num}
                  </span>

                  {/* Icon circle */}
                  <div className="relative flex-shrink-0 z-10">
                    <div className="w-12 h-12 rounded-full bg-[#050508] border border-[#00d4ff]/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.1)]">
                      <Icon size={20} className="text-[#00d4ff]" />
                    </div>
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#00d4ff] text-black text-[9px] font-black flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>

                  {/* Card */}
                  <TiltCard maxTilt={6} scale={1.02} className="flex-1 glass rounded-2xl p-8 z-10">
                    <h3 className="font-heading font-medium uppercase tracking-tight text-xl text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">{step.description}</p>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-24"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-slate-400 mb-8 text-lg">
            Klaar om te starten? Stap 1 begint met één gesprek.
          </p>
          <a
            href="/contact"
            className="inline-block px-10 py-4 rounded-full bg-[#00d4ff] text-black font-bold text-base hover:bg-[#00d4ff]/90 transition-all duration-200 glow-blue"
          >
            Plan een gratis gesprek
          </a>
        </motion.div>
      </div>
    </section>
  );
}
