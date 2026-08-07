import type { Metadata } from "next";
import Script from "next/script";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, ShieldCheck } from "lucide-react";
import { LinkedinIcon, InstagramIcon } from "@/components/ui/social-icons";
import { Headline } from "@/components/ui/headline";

export const metadata: Metadata = {
  title: "Contact & Booking | ILAI Automations",
  description: "Plan een gratis strategiegesprek met ILAI Automations.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#050508] pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            {/* Linkerkolom */}
            <div className="flex-shrink-0 lg:w-80 pt-2">
              <span className="inline-block text-xs font-mono tracking-widest text-[#00d4ff] border border-[#00d4ff]/30 px-3 py-1 rounded-full mb-5 bg-[#00d4ff]/5">
                Gratis gesprek
              </span>
              <Headline as="h1" size="md" className="text-white mb-4">
                Plan een gesprek
              </Headline>
              <p className="text-slate-400 leading-relaxed mb-10">
                Kies een moment dat je uitkomt. We bespreken in 30 minuten wat
                automatisering voor jouw business kan doen.
              </p>

              <div className="space-y-4 mb-10">
                <a
                  href="mailto:info@ilaiautomations.nl"
                  className="flex items-center gap-3 text-slate-300 hover:text-[#00d4ff] transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#00d4ff]/10 border border-[#00d4ff]/20 flex items-center justify-center flex-shrink-0">
                    <Mail size={16} className="text-[#00d4ff]" />
                  </div>
                  <span className="text-sm">info@ilaiautomations.nl</span>
                </a>
                <a
                  href="https://wa.me/31686377856"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-300 hover:text-[#00d4ff] transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#00d4ff]/10 border border-[#00d4ff]/20 flex items-center justify-center flex-shrink-0">
                    <Phone size={16} className="text-[#00d4ff]" />
                  </div>
                  <span className="text-sm">+31 6 86377856 (WhatsApp)</span>
                </a>
                <a
                  href="https://www.linkedin.com/company/ilai-automations/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-300 hover:text-[#00d4ff] transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#00d4ff]/10 border border-[#00d4ff]/20 flex items-center justify-center flex-shrink-0">
                    <LinkedinIcon size={16} className="text-[#00d4ff]" />
                  </div>
                  <span className="text-sm">linkedin.com/company/ilai-automations</span>
                </a>
                <a
                  href="https://www.instagram.com/ilai.automations/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-300 hover:text-[#00d4ff] transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#00d4ff]/10 border border-[#00d4ff]/20 flex items-center justify-center flex-shrink-0">
                    <InstagramIcon size={16} className="text-[#00d4ff]" />
                  </div>
                  <span className="text-sm">@ilai.automations</span>
                </a>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <ShieldCheck size={18} className="text-[#00d4ff] flex-shrink-0 mt-0.5" />
                <p className="text-slate-500 text-sm leading-relaxed">
                  Geen verplichtingen. Geen verkoopgesprek. Puur strategisch.
                </p>
              </div>
            </div>

            {/* Rechterkolom: GHL booking widget */}
            <div className="flex-1 w-full">
              <div className="rounded-2xl overflow-hidden" style={{ background: "transparent" }}>
                <iframe
                  src="https://api.leadconnectorhq.com/widget/booking/OWYzthi7EWvVPaMHvHn0"
                  style={{
                    width: "100%",
                    minHeight: "700px",
                    border: "none",
                    overflow: "hidden",
                    borderRadius: "16px",
                    filter: "invert(1) hue-rotate(180deg) brightness(0.88) contrast(0.95)",
                  }}
                  scrolling="no"
                  id="OWYzthi7EWvVPaMHvHn0_1780761456567"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="lazyOnload" />

    </>
  );
}
