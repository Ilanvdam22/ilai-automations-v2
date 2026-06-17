"use client";
import { motion } from "framer-motion";
import { MessageSquare, CalendarCheck, Zap, Users } from "lucide-react";
import TiltCard from "@/components/ui/tilt-card";

const services = [
  {
    icon: MessageSquare,
    title: "AI DM & WhatsApp Assistent",
    description:
      "Jouw AI-assistent beantwoordt Instagram-DM's en WhatsApp-berichten 24/7, kwalificeert leads automatisch en stuurt ze door naar jouw agenda. Zonder dat jij erbij hoeft te zijn.",
    tools: ["GoHighLevel", "n8n", "Make"],
    accent: "from-[#00d4ff]/20 to-transparent",
  },
  {
    icon: CalendarCheck,
    title: "Kennismaking & Intake Flows",
    description:
      "Slimme opvolgsequenties halveren je no-show rate. Van aanvraag tot verschijnen op de afspraak, volledig geautomatiseerd met gepersonaliseerde reminders.",
    tools: ["GHL Workflows", "WhatsApp API"],
    accent: "from-[#7c3aed]/20 to-transparent",
  },
  {
    icon: Zap,
    title: "Lead Nurturing & CRM Automatisering",
    description:
      "Van koude lead tot betalende klant: bouw automatische funnels die prospects opwarmen, bezwaren wegnemen en converteren op de juiste momenten.",
    tools: ["GoHighLevel", "Make", "n8n"],
    accent: "from-[#00d4ff]/20 to-transparent",
  },
  {
    icon: Users,
    title: "Onboarding & Klantbeheer",
    description:
      "Nieuwe klanten worden automatisch door het onboarding-traject begeleid: welkomstberichten, programma's, check-ins. Jij hoeft niks handmatig te doen.",
    tools: ["GHL", "n8n"],
    accent: "from-[#7c3aed]/20 to-transparent",
  },
];

export default function Services() {
  return (
    <section id="diensten" className="min-h-screen px-4 py-36 bg-[#050508] relative">
      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[600px] rounded-full bg-[#00d4ff]/3 blur-[160px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.span
            className="inline-block text-xs font-mono tracking-widest text-[#00d4ff] border border-[#00d4ff]/30 px-4 py-1.5 rounded-full mb-6 bg-[#00d4ff]/5"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Wat we bouwen
          </motion.span>
          <motion.p
            className="text-2xl sm:text-3xl font-semibold text-white max-w-xl mx-auto leading-snug"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Automatisering die voor jou werkt, ook als jij slaapt.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
              >
                <TiltCard
                  maxTilt={10}
                  scale={1.03}
                  className="glass rounded-2xl p-10 h-full"
                >
                  {/* Top accent gradient */}
                  <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${service.accent}`} />

                  <div className="flex items-start gap-5 mb-6">
                    <div className="p-3.5 rounded-xl bg-[#00d4ff]/10 border border-[#00d4ff]/20 flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Icon size={24} className="text-[#00d4ff]" />
                    </div>
                    <h3 className="text-xl font-bold text-white leading-snug pt-1">
                      {service.title}
                    </h3>
                  </div>

                  <p className="text-slate-400 leading-relaxed mb-6 text-base">
                    {service.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {service.tools.map((tool) => (
                      <span
                        key={tool}
                        className="text-[11px] font-mono text-[#00d4ff]/70 bg-[#00d4ff]/5 border border-[#00d4ff]/15 px-2.5 py-1 rounded-full"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
