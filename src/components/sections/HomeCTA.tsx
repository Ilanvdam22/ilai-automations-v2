"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Headline } from "@/components/ui/headline";
import { CornerBrackets } from "@/components/ui/corner-brackets";

export default function HomeCTA() {
  return (
    <section className="relative px-4 py-32 bg-[#050508]">
      {/* Top separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00d4ff]/20 to-transparent" />

      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Headline size="lg" className="text-white mb-5">
            Benieuwd wat wij voor jouw bedrijf kunnen doen?
          </Headline>
        </motion.div>
        <motion.p
          className="text-slate-400 text-lg leading-relaxed mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Plan een gratis kennismaking of bekijk eerst de vijf pilaren van ons aanbod.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CornerBrackets color="#00d4ff">
            <Link
              href="/contact"
              className="px-8 py-4 rounded-full bg-[#00d4ff] text-black font-bold hover:bg-[#00d4ff]/90 transition-all duration-200 glow-blue block"
            >
              Plan een gratis gesprek
            </Link>
          </CornerBrackets>
          <Link
            href="/diensten"
            className="px-8 py-4 rounded-full border border-[#00d4ff]/40 text-[#00d4ff] font-semibold hover:bg-[#00d4ff]/10 transition-all duration-200"
          >
            Bekijk onze diensten
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
