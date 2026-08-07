"use client";
import { motion } from "framer-motion";
import { MessageSquare, CalendarCheck, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Headline } from "@/components/ui/headline";
import { IndexLabel } from "@/components/ui/index-label";

const features = [
  {
    icon: MessageSquare,
    title: "24/7 automatische opvolging",
    description:
      "Je AI-assistent beantwoordt Instagram-DM's en WhatsApp-berichten dag en nacht. Geen lead gaat meer verloren.",
    color: "#00d4ff",
    tint: "bg-[#00d4ff]/[0.05]",
  },
  {
    icon: CalendarCheck,
    title: "Geen no-shows meer",
    description:
      "Slimme reminders en gepersonaliseerde opvolgsequenties halveren je no-show rate, volledig automatisch.",
    color: "#7c3aed",
    tint: "bg-[#7c3aed]/[0.06]",
  },
  {
    icon: TrendingUp,
    title: "Van lead tot klant",
    description:
      "Koude leads worden automatisch opgewarmd en door de funnel begeleid totdat ze betalend klant zijn.",
    color: "#00d4ff",
    tint: "bg-white/[0.02]",
  },
];

export default function HomeFeatures() {
  return (
    <section className="relative py-32 bg-[#050508]">
      {/* Separator lijn */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-[#00d4ff]/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 text-center mb-16">
        <motion.p
          className="text-slate-500 text-sm font-mono tracking-widest uppercase mb-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Waarom ILAI Automations
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Headline size="lg" className="text-white">
            Jouw bedrijf groeit, <span className="gradient-text">ook als jij slaapt.</span>
          </Headline>
        </motion.div>
      </div>

      {/* Platte full-bleed kleurblokken */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 border-y border-white/5">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              className={`${f.tint} px-8 py-12 border-b md:border-b-0 md:border-r border-white/5 last:border-none`}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
            >
              <IndexLabel current={i + 1} total={features.length} className="block mb-8" />
              <Icon size={22} style={{ color: f.color }} className="mb-5" />
              <h3 className="font-heading font-medium uppercase tracking-tight text-lg text-white mb-3">
                {f.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
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
    </section>
  );
}
