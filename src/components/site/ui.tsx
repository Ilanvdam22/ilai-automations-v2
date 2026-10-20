import type { ReactNode } from "react";

/**
 * Gedeelde bouwstenen voor alle subpagina's. Vaste spacing (stappen van 8 px),
 * geen kaarten, geen verloop, geen animaties: tekst, lijnen en witruimte.
 */

export const container = "mx-auto w-full max-w-6xl px-6 sm:px-10";

export const h1 = "font-heading text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.98] tracking-[-0.04em] [text-wrap:balance]";
export const h2 = "font-heading text-[clamp(1.75rem,3.4vw,2.75rem)] font-bold leading-[1.02] tracking-[-0.035em] [text-wrap:balance]";
export const h3 = "font-heading text-xl font-semibold leading-snug tracking-[-0.02em]";
export const lead = "text-lg leading-relaxed text-white/80";
export const body = "leading-relaxed text-white/75";
export const label = "font-mono text-xs tracking-[0.2em] text-accent";

/** Primaire knop: vlak, scherpe hoeken, directe kleurwissel bij hover. */
export const button =
  "inline-flex items-center gap-3 bg-accent px-6 py-3 font-medium text-black hover:bg-white";

/** Tekstlink met onderlijn die bij hover van kleur wisselt, zonder overgang. */
export const textLink = "text-white underline decoration-white/40 underline-offset-[6px] hover:text-accent hover:decoration-accent";

export function Arrow() {
  return (
    <svg aria-hidden viewBox="0 0 24 12" className="h-3 w-6">
      <path d="M0 6h22M17 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function PageTitle({ title, intro }: { title: ReactNode; intro?: ReactNode }) {
  return (
    <header className={`${container} pb-16 pt-8 md:pb-24`}>
      <h1 className={`${h1} max-w-4xl`}>{title}</h1>
      {intro && <p className={`${lead} mt-8 max-w-2xl`}>{intro}</p>}
    </header>
  );
}

export function Section({ id, children, className = "" }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`scroll-mt-24 border-t border-white/10 py-16 md:py-24 ${className}`}>
      <div className={container}>{children}</div>
    </section>
  );
}
