"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, CalendarCheck, Send, Workflow, type LucideIcon } from "lucide-react";
import { IndexLabel } from "@/components/ui/index-label";
import { CornerBrackets } from "@/components/ui/corner-brackets";

type Service = {
  icon: LucideIcon;
  title: string;
  story: string;
  bullets: string[];
  tools: string[];
};

const services: Service[] = [
  {
    icon: MessageSquare,
    title: "E-mail & WhatsApp AI-Agent",
    story:
      "Het is 23:40. Een potentiële klant stuurt een vraag via WhatsApp. Jij slaapt. Onze AI-agent leest het bericht, herkent wat er gevraagd wordt, antwoordt in jouw tone-of-voice en boekt zo nodig direct een afspraak in je agenda. Als jij morgenochtend wakker wordt, is de lead al warm.",
    bullets: [
      "Beantwoordt vragen 24/7, in jouw stijl",
      "Kwalificeert leads en boekt afspraken automatisch",
      "Schakelt naadloos door naar jou bij twijfel",
    ],
    tools: ["GoHighLevel", "WhatsApp API", "n8n"],
  },
  {
    icon: CalendarCheck,
    title: "Leadopvolging & Klantcommunicatie",
    story:
      "Een lead komt binnen, via je website, een advertentie of een aanbeveling, en landt automatisch op één centrale plek. Vanaf dat moment neemt het systeem het over: een welkomstmail binnen seconden, een herinnering vlak voor de afspraak zodat niemand meer wegblijft, en na afronding een vriendelijk verzoek om een review. Geen stap wordt overgeslagen, jij hoeft er niet aan te denken.",
    bullets: [
      "Welkomstmail direct na aanmelding",
      "Automatische herinneringen voor afspraken",
      "Review-verzoeken na afronding, zonder handmatig werk",
    ],
    tools: ["GoHighLevel", "Make", "n8n"],
  },
  {
    icon: Send,
    title: "Cold Outreach via LinkedIn & E-mail",
    story:
      "Nieuwe klanten werven kost tijd: prospects zoeken, berichten personaliseren, opvolgen, weer opvolgen. Wij bouwen outreach-systemen die dit voor je overnemen. Gepersonaliseerde eerste berichten gaan automatisch de deur uit via LinkedIn en e-mail, follow-ups worden getimed verstuurd, en reacties komen rechtstreeks bij jou binnen. Jij voert het gesprek, niet de zoektocht ernaar.",
    bullets: [
      "Doelgroeplijsten en persona's opbouwen",
      "Gepersonaliseerde berichten + automatische follow-ups",
      "Reacties direct zichtbaar, geen lead tussen wal en schip",
    ],
    tools: ["LinkedIn", "Smartlead", "Apollo"],
  },
  {
    icon: Workflow,
    title: "CRM & Workflow-koppelingen",
    story:
      "Data staat vaak verspreid: in spreadsheets, mailboxen, losse tools die niet met elkaar praten. Wij koppelen jouw systemen aan elkaar, zodat een nieuwe klant, een afspraak of een betaling automatisch op de juiste plek terechtkomt. Geen dubbel werk, geen handmatig overtypen, geen data die verdwijnt tussen twee tools.",
    bullets: [
      "Eén centrale plek voor al je klantdata",
      "Automatische synchronisatie tussen je tools",
      "Minder handwerk, minder fouten",
    ],
    tools: ["GoHighLevel", "Make", "n8n"],
  },
];

function ServiceDetailBody({ service, showTitle = true }: { service: Service; showTitle?: boolean }) {
  const Icon = service.icon;
  return (
    <>
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
    <section id="diensten" className="px-4 py-36 bg-[#050508] relative">
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
