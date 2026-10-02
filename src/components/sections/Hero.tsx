"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import OrbitingCirclesGlobe from "@/components/ui/orbiting-circles-02";

const line1 = "Jouw business verdient".split(" ");
const line2 = "een team dat nooit stopt.".split(" ");
const subline = "Wij bouwen een AI-workflow die 24/7 voor jou werkt.";

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
      {/* Achtergrondfoto onder de globe */}
      <Image
        src="/images/hero-stad.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-bottom opacity-90 pointer-events-none select-none"
      />

      {/* Orbiting-circles globe i.p.v. 3D-bol */}
      <div className="absolute inset-0 flex items-center justify-center">
        <OrbitingCirclesGlobe />
      </div>

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
            AI-automatisering voor MKB en sport
          </span>
        </motion.div>

        <h1 className="font-heading font-medium uppercase text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-white leading-[0.95] overflow-visible">
          <span className="block">
            {line1.map((word, i) => (
              <motion.span
                key={`l1-${i}`}
                custom={i}
                variants={wordVariants}
                initial="hidden"
                animate="visible"
                className={`inline-block mr-[0.25em] ${word === "business" ? "text-[#00d4ff] glow-text" : ""}`}
              >
                {word}
              </motion.span>
            ))}
          </span>
          <span className="block">
            {line2.map((word, i) => {
              const globalIdx = line1.length + i;
              const isHighlighted = word === "nooit" || word === "stopt.";
              return (
                <motion.span
                  key={`l2-${i}`}
                  custom={globalIdx}
                  variants={wordVariants}
                  initial="hidden"
                  animate="visible"
                  className={`inline-block mr-[0.25em] pb-1 ${isHighlighted ? "gradient-text" : ""}`}
                >
                  {word}
                </motion.span>
              );
            })}
          </span>
        </h1>

        <motion.p
          className="mt-5 text-lg sm:text-xl md:text-2xl text-slate-300 font-normal normal-case"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          {subline}
        </motion.p>
      </div>

      {/* Knoppen */}
      <div className="absolute bottom-0 left-0 right-0 z-20 text-center px-6 pb-16">
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
