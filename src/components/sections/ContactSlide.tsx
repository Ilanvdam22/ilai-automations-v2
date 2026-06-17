import { Mail, Phone, ShieldCheck } from "lucide-react";
import { LinkedinIcon, InstagramIcon } from "@/components/ui/social-icons";

export default function ContactSlide() {
  return (
    <section className="h-screen overflow-y-auto flex items-center px-4 bg-[#050508]">
      <div className="max-w-6xl mx-auto w-full py-16">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Linkerkolom */}
          <div className="flex-1 lg:max-w-md">
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
              Plan een gesprek
            </h1>
            <p className="text-slate-400 leading-relaxed mb-8">
              Kies een moment dat je uitkomt. We bespreken in 30 minuten wat
              automatisering voor jouw business kan doen.
            </p>

            <div className="space-y-4 mb-8">
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

            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <ShieldCheck size={18} className="text-[#00d4ff] flex-shrink-0 mt-0.5" />
              <p className="text-slate-400 text-sm leading-relaxed">
                Geen verplichtingen. Geen verkoopgesprek. Puur strategisch.
              </p>
            </div>
          </div>

          {/* Rechterkolom: GHL booking widget */}
          <div className="flex-1 w-full">
            <div className="glass rounded-xl border border-[#00d4ff]/20 overflow-hidden p-1">
              <iframe
                src="https://api.leadconnectorhq.com/widget/booking/OWYzthi7EWvVPaMHvHn0"
                style={{
                  width: "100%",
                  minHeight: "600px",
                  border: "none",
                  overflow: "hidden",
                  borderRadius: "10px",
                }}
                scrolling="no"
                id="OWYzthi7EWvVPaMHvHn0_contact_slide"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
