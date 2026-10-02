import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { LinkedinIcon, InstagramIcon } from "@/components/ui/social-icons";

export default function Footer() {
  return (
    <footer className="relative bg-[#050508] border-t border-[#00d4ff]/20">
      {/* Neon separator glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00d4ff]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Logo + tagline */}
          <div className="md:col-span-1">
            <div className="flex items-baseline gap-1.5 mb-3">
              <span className="font-heading font-medium text-xl text-[#00d4ff] uppercase tracking-wide">ILAI</span>
              <span className="font-mono text-[10px] text-slate-400 tracking-widest uppercase">
                Automations
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              AI-automatisering voor MKB-bedrijven in Nederland, met focus op sport en beweging.
            </p>
          </div>

          {/* Navigatie */}
          <div>
            <h4 className="font-mono text-white text-xs mb-4 tracking-widest uppercase">
              Navigatie
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "Diensten", href: "/diensten" },
                { label: "Proces", href: "/proces" },
                { label: "Over ons", href: "/over" },
                { label: "FAQ", href: "/faq" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-[#00d4ff] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Diensten */}
          <div>
            <h4 className="font-mono text-white text-xs mb-4 tracking-widest uppercase">
              Diensten
            </h4>
            <ul className="space-y-2.5">
              {[
                "E-mail agent & WhatsApp agent",
                "CRM-systeem",
                "CRM-automatisering",
                "Outreach",
                "Complete bedrijfsautomatisering",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="/diensten"
                    className="text-slate-400 hover:text-[#00d4ff] transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-mono text-white text-xs mb-4 tracking-widest uppercase">
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info@ilaiautomations.nl"
                  className="flex items-center gap-2 text-slate-400 hover:text-[#00d4ff] transition-colors text-sm"
                >
                  <Mail size={15} />
                  info@ilaiautomations.nl
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/31686377856"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-[#00d4ff] transition-colors text-sm"
                >
                  <Phone size={15} />
                  +31 6 86377856
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/ilai-automations/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-[#00d4ff] transition-colors text-sm"
                >
                  <LinkedinIcon size={15} />
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/ilai.automations/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-[#00d4ff] transition-colors text-sm"
                >
                  <InstagramIcon size={15} />
                  @ilai.automations
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-slate-500 text-sm">
            <p>© {new Date().getFullYear()} ILAI Automations. Alle rechten voorbehouden.</p>
            <Link href="/outreach-policy" className="hover:text-[#00d4ff] transition-colors">
              Outreachbeleid
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/company/ilai-automations/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-[#00d4ff] transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={18} />
            </a>
            <a
              href="https://www.instagram.com/ilai.automations/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-[#00d4ff] transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
