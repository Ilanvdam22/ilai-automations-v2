"use client";
import Link from "next/link";
import { services, site } from "@/lib/content";

const link = "text-white/75 hover:text-white hover:underline underline-offset-4";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black text-sm text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 sm:px-10 md:grid-cols-4">
        <div>
          <p className="font-heading text-base font-semibold">ILAI Automations</p>
          <p className="mt-4 leading-relaxed text-white/75">
            AI-automatisering voor MKB-bedrijven in Nederland, met focus op sport en beweging. Gevestigd in {site.city}.
          </p>
        </div>

        <nav aria-label="Pagina's">
          <p className="font-mono text-xs tracking-[0.2em] text-white/65">PAGINA&apos;S</p>
          <ul className="mt-4 space-y-2">
            {[
              ["Home", "/"],
              ["Diensten", "/diensten"],
              ["Proces", "/proces"],
              ["Over", "/over"],
              ["FAQ", "/faq"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className={link}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Diensten">
          <p className="font-mono text-xs tracking-[0.2em] text-white/65">DIENSTEN</p>
          <ul className="mt-4 space-y-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/diensten#${s.slug}`} className={link}>
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-white/65">CONTACT</p>
          <ul className="mt-4 space-y-2">
            <li>
              <a href={`mailto:${site.email}`} className={link}>
                {site.email}
              </a>
            </li>
            <li>
              <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className={link}>
                {site.phoneDisplay} (WhatsApp)
              </a>
            </li>
            <li>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={link}>
                LinkedIn
              </a>
            </li>
            <li>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className={link}>
                Instagram
              </a>
            </li>
          </ul>
          <p className="mt-4 leading-relaxed text-white/75">We reageren dezelfde dag.</p>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-wrap gap-x-6 gap-y-2 border-t border-white/10 px-6 py-6 text-white/65 sm:px-10">
        <span>
          © {new Date().getFullYear()} {site.name} · BTW {site.vat}
        </span>
        <Link href="/privacy" className={link}>
          Privacy
        </Link>
        <Link href="/outreach-policy" className={link}>
          Outreachbeleid
        </Link>
        <button type="button" onClick={() => window.dispatchEvent(new Event("ilai:consent-open"))} className={link}>
          Cookie-instellingen
        </button>
      </div>
    </footer>
  );
}
