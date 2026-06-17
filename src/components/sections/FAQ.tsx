"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import TiltCard from "@/components/ui/tilt-card";

const faqs = [
  {
    question: "Wat kost een automatisering?",
    answer:
      "De prijs hangt af van de scope en complexiteit. Na het kennismakingsgesprek ontvang je een transparante prijsopgave. Geen verborgen kosten, geen verrassingen achteraf.",
  },
  {
    question: "Hoe lang duurt het om alles op te zetten?",
    answer:
      "Gemiddeld 1 à 2 weken van het eerste gesprek tot live. Eenvoudige flows kunnen binnen enkele dagen klaar zijn. We houden je tijdens het gehele proces op de hoogte.",
  },
  {
    question: "Heb ik technische kennis nodig om dit te gebruiken?",
    answer:
      "Nee. Wij regelen alles technisch van A tot Z. Jij hoeft alleen te vertellen wat je wilt bereiken, wij zorgen dat het werkt.",
  },
  {
    question: "Werkt dit ook voor kleine bedrijven in de bewegingssector?",
    answer:
      "Absoluut. We werken met sportscholen, personal trainers, fysiotherapeuten, yogastudio's en meer. Juist voor solo-ondernemers en kleine studio's is automatisering het meest waardevol. Het geeft jou je tijd terug.",
  },
  {
    question: "Wat als de automatisering niet doet wat ik wil?",
    answer:
      "We blijven aanpassen totdat het werkt zoals jij het wilt. De review-call en aanpassingsfase zijn standaard inbegrepen. Wij stoppen pas als jij tevreden bent.",
  },
  {
    question: "Welke tools gebruiken jullie en moet ik die zelf aanschaffen?",
    answer:
      "We werken met GoHighLevel, n8n en Make. We adviseren je welke tools je nodig hebt, helpen bij het aanmaken van accounts en regelen alle technische koppelingen.",
  },
  {
    question: "Zijn mijn klantgegevens veilig? (AVG/GDPR)",
    answer:
      "Ja. We werken uitsluitend met AVG-conforme tools en verwerken geen klantdata buiten de EU zonder expliciete toestemming. Privacy staat bij ons voorop.",
  },
  {
    question: "Kan ik de automatisering later uitbreiden?",
    answer:
      "Ja. We bouwen modulair, zodat je eenvoudig nieuwe flows kunt toevoegen naarmate je bedrijf groeit. Je begint klein en schaalt op wanneer jij dat wilt.",
  },
  {
    question: "Zit ik vast aan een contract of kan ik stoppen wanneer ik wil?",
    answer:
      "Je zit nergens aan vast. We werken op basis van duidelijke afspraken per project, zonder langlopende verplichtingen of automatische verlengingen.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="min-h-screen px-4 py-36 bg-[#050508]">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.span
            className="inline-block text-xs font-mono tracking-widest text-[#00d4ff] border border-[#00d4ff]/30 px-4 py-1.5 rounded-full mb-6 bg-[#00d4ff]/5"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Veelgestelde vragen
          </motion.span>
          <motion.h1
            className="text-4xl sm:text-5xl font-bold text-white tracking-tight"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Alles wat je{" "}
            <span className="gradient-text">wil weten.</span>
          </motion.h1>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            const num = String(i + 1).padStart(2, "0");
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.045 }}
              >
                <TiltCard
                  maxTilt={4}
                  scale={1.01}
                  className={`rounded-xl overflow-visible ${isOpen ? "border border-[#00d4ff]/25" : "border border-transparent"}`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className={`w-full text-left px-6 py-5 glass rounded-xl flex items-center gap-4 transition-all duration-200 ${
                      isOpen ? "rounded-b-none" : ""
                    }`}
                  >
                    {/* Nummer badge */}
                    <span className="text-xs font-mono text-[#00d4ff]/50 flex-shrink-0 w-7">
                      {num}
                    </span>
                    <span className="flex-1 font-semibold text-white text-sm leading-snug text-left">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown size={18} className="text-[#00d4ff]" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pt-4 pb-5 text-slate-400 text-sm leading-relaxed bg-white/[0.015] rounded-b-xl border-t border-[#00d4ff]/10">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-slate-500 mb-6">Staat jouw vraag er niet bij?</p>
          <a
            href="/contact"
            className="inline-block px-8 py-3.5 rounded-full border border-[#00d4ff]/40 text-[#00d4ff] font-semibold hover:bg-[#00d4ff]/10 transition-all duration-200"
          >
            Stel je vraag direct →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
