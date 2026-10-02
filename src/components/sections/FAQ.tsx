"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import TiltCard from "@/components/ui/tilt-card";
import { Headline } from "@/components/ui/headline";
import { IndexLabel } from "@/components/ui/index-label";

const faqs = [
  {
    question: "Wat kost een automatisering?",
    answer:
      "De prijs hangt af van de scope en complexiteit. Na het kennismakingsgesprek ontvang je een transparante prijsopgave. Geen verborgen kosten, geen verrassingen achteraf.",
  },
  {
    question: "Hoe lang duurt het om alles op te zetten?",
    answer:
      "De eerste automatiseringen staan meestal binnen 1 tot 3 weken live. In de eerste maand bouwen we het complete systeem, daarna verbeteren we het doorlopend. We houden je tijdens het hele proces op de hoogte.",
  },
  {
    question: "Heb ik technische kennis nodig om dit te gebruiken?",
    answer:
      "Nee. Wij regelen alles technisch van A tot Z. Jij hoeft alleen te vertellen wat je wilt bereiken, wij zorgen dat het werkt.",
  },
  {
    question: "Werkt dit ook voor kleine bedrijven?",
    answer:
      "Absoluut. Onze focus ligt op sportscholen, personal trainers en fysiotherapeuten, maar we werken voor elk MKB-bedrijf. Juist voor solo-ondernemers en kleine teams is automatisering het meest waardevol. Het geeft jou je tijd terug.",
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
    question: "Hoe lang loopt een traject?",
    answer:
      "Een traject loopt zes maanden. In de eerste maand bouwen we alles, daarna verbeteren we het doorlopend. Aan het einde evalueren we samen of je verlengt. Er is geen automatische verlenging.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="min-h-screen px-4 py-36">
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
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Headline as="h1" size="xl" className="text-white">
              Alles wat je <span className="gradient-text">wil weten.</span>
            </Headline>
          </motion.div>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
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
                    aria-expanded={isOpen}
                    className={`w-full text-left px-6 py-5 glass rounded-xl flex items-center gap-4 transition-all duration-200 ${
                      isOpen ? "rounded-b-none" : ""
                    }`}
                  >
                    {/* Nummer badge */}
                    <IndexLabel
                      current={i + 1}
                      total={faqs.length}
                      color="rgba(0,212,255,0.5)"
                      className="flex-shrink-0 w-16 whitespace-nowrap"
                    />
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
          <Link
            href="/contact"
            className="inline-block px-8 py-3.5 rounded-full border border-[#00d4ff]/40 text-[#00d4ff] font-semibold hover:bg-[#00d4ff]/10 transition-all duration-200"
          >
            Stel je vraag direct →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
