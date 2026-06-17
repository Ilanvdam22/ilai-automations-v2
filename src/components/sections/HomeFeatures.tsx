"use client";
import { motion } from "framer-motion";
import { MessageSquare, CalendarCheck, TrendingUp } from "lucide-react";
import TiltCard from "@/components/ui/tilt-card";
import Link from "next/link";

const features = [
  {
    icon: MessageSquare,
    title: "24/7 automatische opvolging",
    description:
      "Je AI-assistent beantwoordt Instagram-DM's en WhatsApp-berichten dag en nacht. Geen lead gaat meer verloren.",
    color: "#00d4ff",
  },
  {
    icon: CalendarCheck,
    title: "Geen no-shows meer",
    description:
      "Slimme reminders en gepersonaliseerde opvolgsequenties halveren je no-show rate, volledig automatisch.",
    color: "#7c3aed",
  },
  {
    icon: TrendingUp,
    title: "Van lead tot vast lid",
    description:
      "Koude leads worden automatisch opgewarmd en door de funnel begeleid totdat ze betalend lid zijn.",
    color: "#00d4ff",
  },
];

export default function HomeFeatures() {
  return (
    <section className="relative px-4 py-32 bg-[#050508]">
      {/* Separator lijn */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-[#00d4ff]/30 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            className="text-slate-500 text-sm font-mono tracking-widest uppercase mb-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Waarom ILAI Automations
          </motion.p>
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Jouw studio, gym of praktijk groeit,{" "}
            <span className="gradient-text">ook als jij slaapt.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.12 }}
              >
                <TiltCard maxTilt={10} scale={1.03} className="glass rounded-2xl p-8 h-full">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}
                  >
                    <Icon size={22} style={{ color: f.color }} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        {/* Mini CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            href="/diensten"
            className="text-[#00d4ff] font-semibold hover:text-[#00d4ff]/80 transition-colors inline-flex items-center gap-2 group"
          >
            Bekijk alle diensten
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
