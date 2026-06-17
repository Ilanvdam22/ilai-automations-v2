"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const GenerativeArtScene = dynamic(
  () => import("@/components/ui/anomalous-matter-hero").then((m) => m.GenerativeArtScene),
  { ssr: false }
);

const line1 = "Jij zet mensen in beweging,".split(" ");
const line2 = "wij zetten jouw bedrijf in beweging.".split(" ");

const wordVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, delay: 0.6 + i * 0.07 },
  }),
};

export default function Hero() {
  return (
    <div className="relative min-h-screen bg-[#050508] overflow-hidden">
      {/* Sphere achtergrond */}
      <Suspense fallback={<div className="absolute inset-0 bg-[#050508]" />}>
        <GenerativeArtScene />
      </Suspense>

      {/* Gradient boven */}
      <div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-b from-[#050508] via-[#050508]/85 to-transparent z-[1] pointer-events-none" />
      {/* Gradient onder */}
      <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-[#050508] via-[#050508]/85 to-transparent z-[1] pointer-events-none" />

      {/* H1 */}
      <div className="absolute top-0 left-0 right-0 z-20 text-center px-6 pt-32 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0 }}
          className="mb-6"
        >
          <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#00d4ff]/40 text-[#00d4ff] text-xs font-mono tracking-widest bg-[#00d4ff]/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] mr-2 animate-pulse" />
            AI-automatisering voor de bewegingssector
          </span>
        </motion.div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-snug overflow-visible">
          <span className="block">
            {line1.map((word, i) => (
              <motion.span
                key={`l1-${i}`}
                custom={i}
                variants={wordVariants}
                initial="hidden"
                animate="visible"
                className={`inline-block mr-[0.25em] ${word === "beweging," ? "text-[#00d4ff] glow-text" : ""}`}
              >
                {word}
              </motion.span>
            ))}
          </span>
          <span className="block">
            {line2.map((word, i) => {
              const globalIdx = line1.length + i;
              const isBeweging = word === "beweging.";
              return (
                <motion.span
                  key={`l2-${i}`}
                  custom={globalIdx}
                  variants={wordVariants}
                  initial="hidden"
                  animate="visible"
                  className={`inline-block mr-[0.25em] pb-1 ${isBeweging ? "gradient-text" : ""}`}
                >
                  {word}
                </motion.span>
              );
            })}
          </span>
        </h1>
      </div>

      {/* Subtekst + knoppen */}
      <div className="absolute bottom-0 left-0 right-0 z-20 text-center px-6 pb-16">
        <motion.p
          className="text-slate-400 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed mb-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
        >
          ILAI Automations automatiseert je leads, intakes en opvolging
          zodat geen aanvraag meer verdwijnt en jij minder achter de laptop hangt.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
        >
          <Link
            href="/contact"
            className="px-8 py-3.5 rounded-full bg-[#00d4ff] text-black font-semibold text-sm hover:bg-[#00d4ff]/90 transition-all duration-200 glow-blue"
          >
            Plan een gratis gesprek
          </Link>
          <Link
            href="/diensten"
            className="px-8 py-3.5 rounded-full border border-[#00d4ff]/40 text-[#00d4ff] font-semibold text-sm hover:bg-[#00d4ff]/10 transition-all duration-200"
          >
            Bekijk wat we bouwen
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-slate-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.2 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>
    </div>
  );
}
