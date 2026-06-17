"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Footer from "@/components/layout/Footer";
import FloatingOrbs from "@/components/ui/floating-orbs";

export default function CTA() {
  return (
    <section id="contact" className="relative bg-[#050508] overflow-hidden">
      <div className="relative min-h-[70vh] flex items-center justify-center px-4 py-36">
        <FloatingOrbs />

        <motion.div
          className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#00d4ff]/15 to-transparent pointer-events-none"
          animate={{ x: ["-40vw", "40vw", "-40vw"] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#7c3aed]/10 to-transparent pointer-events-none"
          animate={{ x: ["40vw", "-40vw", "40vw"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[900px] h-[600px] rounded-full bg-[#00d4ff]/4 blur-[140px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.span
            className="inline-block text-xs font-mono tracking-widest text-[#00d4ff] border border-[#00d4ff]/30 px-4 py-1.5 rounded-full mb-8 bg-[#00d4ff]/5"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Klaar om te starten?
          </motion.span>

          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-8 leading-tight"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Klaar om{" "}
            <span className="gradient-text">automatisch</span>
            <br />te groeien?
          </motion.h2>

          <motion.p
            className="text-slate-400 text-xl leading-relaxed mb-14 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Plan een gratis strategiegesprek. We kijken samen wat automatisering
            voor jouw bedrijf in de bewegingssector kan betekenen.
          </motion.p>

          <motion.div
            className="relative inline-block"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="absolute inset-0 rounded-full border border-[#00d4ff]/30 pulse-ring"
                style={{ animationDelay: `${i * 0.65}s` }}
              />
            ))}
            <Link
              href="/contact"
              className="relative inline-block px-12 py-5 rounded-full bg-[#00d4ff] text-black font-bold text-lg hover:bg-[#00d4ff]/90 transition-all duration-200 glow-blue z-10"
            >
              Plan nu een gratis gesprek
            </Link>
          </motion.div>
        </div>
      </div>

      <Footer />
    </section>
  );
}
