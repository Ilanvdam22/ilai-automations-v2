"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import AIChatDemo from "@/components/ui/ai-chat-demo";
import TiltCard from "@/components/ui/tilt-card";

const bullets = [
  "24/7 beschikbaar, ook in het weekend",
  "Gebouwd op bewezen tools: GHL, n8n, Make",
  "Geen technische kennis vereist van jouw kant",
];

export default function About() {
  return (
    <section
      id="over"
      className="min-h-screen flex items-center px-4 py-36 bg-[#050508] relative"
    >
      {/* Ambient glow achter chat demo */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#7c3aed]/5 blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="flex flex-col md:flex-row gap-20 items-center">
          {/* Linkerkolom */}
          <div className="flex-1">
            <motion.span
              className="inline-block text-xs font-mono tracking-widest text-[#00d4ff] border border-[#00d4ff]/30 px-4 py-1.5 rounded-full mb-6 bg-[#00d4ff]/5"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Over ILAI Automations
            </motion.span>

            <motion.h1
              className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-8 leading-tight"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Nooit meer een aanvraag die in een{" "}
              <span className="gradient-text">volle inbox</span> verdwijnt.
            </motion.h1>

            <motion.p
              className="text-slate-400 leading-relaxed mb-10 text-lg"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Elke week laten sportscholen, personal trainers, fysiotherapeuten en andere
              bewegingsprofessionals geld liggen, niet omdat ze slecht zijn in hun vak,
              maar omdat opvolging tijdrovend is. ILAI Automations lost dat op. Wij bouwen
              AI-systemen die jouw DM&apos;s beantwoorden, aanvragen kwalificeren en nieuwe
              klanten door de intake begeleiden. Volledig op de achtergrond. Altijd aan.
            </motion.p>

            <motion.ul
              className="space-y-5 mb-10"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-4">
                  <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/30 flex items-center justify-center">
                    <Check size={13} className="text-[#00d4ff]" />
                  </div>
                  <span className="text-slate-300">{bullet}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link
                href="/contact"
                className="text-[#00d4ff] hover:text-[#00d4ff]/80 font-semibold transition-colors inline-flex items-center gap-2 group text-lg"
              >
                Meer weten? Plan een gesprek{" "}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </motion.div>
          </div>

          {/* Rechterkolom: AI chat in TiltCard */}
          <motion.div
            className="flex-1 w-full flex justify-center"
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <TiltCard maxTilt={8} scale={1.02} className="w-full max-w-sm rounded-3xl">
              <AIChatDemo />
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
