"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

// Alleen in de browser, en pas als de browser even rust heeft
const GymTour = dynamic(() => import("./GymTour"), { ssr: false });

/**
 * De homepage-reis: een lange scrollbaan met de sportschool vast in beeld.
 * Kop en knop staan er meteen (ook zonder JavaScript), de 3D laadt daarna.
 */
export default function GymSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const hasIdle = typeof window.requestIdleCallback === "function";
    const start = () => setLoad(true);
    const idle = hasIdle ? window.requestIdleCallback(start, { timeout: 1500 }) : window.setTimeout(start, 300);
    return () => {
      if (hasIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, []);

  // De kop verdwijnt zodra je de zaal in scrollt
  useEffect(() => {
    const onScroll = () => {
      const hero = heroRef.current;
      if (!hero) return;
      const o = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.45));
      hero.style.opacity = String(o);
      hero.style.visibility = o === 0 ? "hidden" : "visible";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={trackRef} aria-labelledby="hero-title" className="relative h-[760svh]">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#07080b]">
        {/* Poster tot de 3D-scène er is: een rustige vloerlijn als skelet */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 border-t border-white/5 bg-[#0b0c10]" />
        {load && <GymTour trackRef={trackRef} />}

        {/* Kop, uitleg, knop en scrollhint: alleen aan het begin van de reis */}
        <div ref={heroRef} className="pointer-events-none absolute inset-0 z-20">
          <div className="absolute left-4 right-4 top-20 bg-black p-6 sm:left-10 sm:right-auto sm:top-24 sm:w-[34rem] sm:p-8">
            <h1 id="hero-title" className="font-heading text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[0.98] tracking-[-0.045em]">
              Loop door een sportschool die zichzelf regelt.
            </h1>
            <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-white/80">
              Scroll naar binnen en zie bij elk punt wat ILAI voor jouw zaak automatiseert.
            </p>
            <Link href="/contact" className="pointer-events-auto mt-6 inline-block bg-accent px-5 py-2.5 font-medium text-black hover:bg-white">
              Plan een gratis gesprek
            </Link>
          </div>
          <div aria-hidden className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 bg-black px-4 py-3 max-md:hidden">
            <span className="font-mono text-xs tracking-[0.2em] text-white/75">SCROLL</span>
            <span className="relative block h-12 w-px overflow-hidden bg-white/20">
              <span className="absolute inset-x-0 top-0 h-1/2 bg-accent motion-safe:animate-[scrollcue_1.8s_cubic-bezier(0.76,0,0.24,1)_infinite]" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
