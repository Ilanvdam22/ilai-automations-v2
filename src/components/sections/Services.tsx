"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Users, CalendarCheck, Send, Workflow, type LucideIcon } from "lucide-react";
import { IndexLabel } from "@/components/ui/index-label";
import { CornerBrackets } from "@/components/ui/corner-brackets";

type Service = {
  icon: LucideIcon;
  title: string;
  story: string;
  bullets: string[];
  tools: string[];
  image: string;
};

const services: Service[] = [
  {
    icon: MessageSquare,
    title: "E-mail agent & WhatsApp agent",
    story:
      "De communicatie werkt voor je in plaats van andersom. Je WhatsApp agent reageert direct op binnenkomende berichten en je e-mail agent sorteert je inbox en zet concept-antwoorden voor je klaar. Geen enkele proefles-aanvraag of vraag blijft meer liggen.",
    bullets: [
      "WhatsApp agent reageert automatisch op binnenkomende berichten",
      "E-mail agent categoriseert mail en zet concept-antwoorden klaar",
      "Geen proefles-aanvraag of vraag blijft nog liggen",
    ],
    tools: ["WhatsApp", "E-mail", "n8n"],
    image: "/images/pilaar-agent.jpg",
  },
  {
    icon: Users,
    title: "CRM-systeem",
    story:
      "Klanten en deals komen vanzelf op de juiste plek, zonder handmatige invoer. Je ziet in één overzicht wie waar in het traject zit, en je formulieren, mail en WhatsApp zijn eraan gekoppeld.",
    bullets: [
      "Klanten automatisch in groepen",
      "Overzicht van wie waar in het traject zit",
      "Koppeling met formulieren, mail en WhatsApp",
    ],
    tools: ["GoHighLevel", "Make", "n8n"],
    image: "/images/pilaar-crm.jpg",
  },
  {
    icon: CalendarCheck,
    title: "CRM-automatisering",
    story:
      "Opvolging en herinneringen lopen vanzelf. Een nieuwe afspraak wordt automatisch gemeld en bijgeschreven, klanten krijgen een herinnering en na de proefles volgt automatisch een bericht om te horen hoe ze het vonden.",
    bullets: [
      "Nieuwe afspraak wordt automatisch gemeld en bijgeschreven",
      "Herinneringen voor afspraken",
      "Follow-ups op proefles- en hoe-vond-je-de-les berichten",
    ],
    tools: ["GoHighLevel", "Make", "n8n"],
    image: "/images/pilaar-automatisering.jpg",
  },
  {
    icon: Send,
    title: "Outreach",
    story:
      "Er blijven continu nieuwe aanvragen binnenkomen. We zetten gepersonaliseerde e-mails en LinkedIn-berichten voor je op, met de volgorde en timing automatisch geregeld.",
    bullets: [
      "Gepersonaliseerde e-mails en LinkedIn-berichten",
      "Opgezet met Smartlead en Heyreach",
      "Volgorde en timing automatisch geregeld",
    ],
    tools: ["Smartlead", "Heyreach", "LinkedIn"],
    image: "/images/pilaar-outreach.jpg",
  },
  {
    icon: Workflow,
    title: "Complete bedrijfsautomatisering",
    story:
      "Alles hierboven, samen met de rest van je repetitieve taken, draait op de achtergrond. We brengen je handmatige werk in kaart, automatiseren het en sluiten al je systemen op elkaar aan. Zo maken we je bedrijf compleet AI-proof.",
    bullets: [
      "Herhalende handmatige taken in kaart gebracht en geautomatiseerd",
      "Alle systemen (mail, CRM, WhatsApp, outreach) op elkaar aangesloten",
      "Bedrijf compleet AI-proof",
    ],
    tools: ["n8n", "Make", "Claude"],
    image: "/images/pilaar-compleet.jpg",
  },
];

function ServiceDetailBody({ service, showTitle = true }: { service: Service; showTitle?: boolean }) {
  const Icon = service.icon;
  return (
    <>
      <div className="relative aspect-[16/10] w-full mb-6 overflow-hidden rounded-xl border border-white/10">
        <Image
          src={service.image}
          alt=""
          fill
          sizes="(min-width: 768px) 560px, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex items-start gap-5 mb-6">
        <div className="p-3.5 rounded-xl bg-[#00d4ff]/10 border border-[#00d4ff]/20 flex-shrink-0">
          <Icon size={24} className="text-[#00d4ff]" />
        </div>
        {showTitle && (
          <h3 className="font-heading font-medium uppercase tracking-tight text-xl text-white leading-snug pt-1">
            {service.title}
          </h3>
        )}
      </div>

      <p className="text-slate-400 leading-relaxed mb-6 text-base">{service.story}</p>

      <ul className="space-y-2.5 mb-7">
        {service.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-3 text-sm text-slate-300">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#00d4ff] flex-shrink-0" />
            {bullet}
          </li>
        ))}
      </ul>

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
    </>
  );
}

export default function Services() {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Bepaalt de actieve dienst o.b.v. welk item door het midden van het scherm
    // scrolt. IntersectionObserver, geen scroll-eventlistener met handmatige
    // positieberekening (zelfde bewezen patroon als de globe-component).
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = itemRefs.current.findIndex((el) => el === entry.target);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const activeService = services[active];

  return (
    <section id="diensten" className="px-4 py-36 relative">
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

        {/* Sticky detail-paneel (alleen desktop) + scroll-lijst */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {/* Sticky paneel: volledig verhaal van de actieve dienst, alleen op md+.
              Op mobiel komt de inhoud i.p.v. hiervan direct onder het aangeklikte item. */}
          <div className="hidden md:block md:sticky md:top-28 self-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="glass rounded-2xl p-8 md:p-10"
              >
                <ServiceDetailBody service={activeService} />
              </motion.div>
            </AnimatePresence>

            <IndexLabel current={active + 1} total={services.length} className="block mt-6" />
          </div>

          {/* Lijst met dienst-namen */}
          <div className="flex flex-col">
            {services.map((service, i) => {
              const isActive = i === active;
              return (
                <div
                  key={service.title}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className="py-6 md:py-0 md:min-h-[55vh] flex flex-col md:items-center md:justify-center border-b border-white/5 md:border-none last:border-none"
                >
                  {isActive ? (
                    <CornerBrackets color="#00d4ff" className="self-start md:self-auto">
                      <button
                        onClick={() => {
                          setActive(i);
                          itemRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className="font-heading font-medium uppercase tracking-tight text-2xl sm:text-3xl text-[#00d4ff] text-left px-2 py-1"
                      >
                        {service.title}
                      </button>
                    </CornerBrackets>
                  ) : (
                    <button
                      onClick={() => {
                        setActive(i);
                        itemRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
                      }}
                      className="font-heading font-medium uppercase tracking-tight text-2xl sm:text-3xl text-slate-600 hover:text-slate-400 transition-colors text-left"
                    >
                      {service.title}
                    </button>
                  )}

                  {/* Mobiel: inhoud direct onder het aangeklikte item, geen scroll omhoog nodig */}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden md:hidden"
                      >
                        <div className="pt-6">
                          <ServiceDetailBody service={service} showTitle={false} />
                          <IndexLabel current={i + 1} total={services.length} className="block mt-2" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
