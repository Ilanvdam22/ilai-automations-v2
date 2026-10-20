"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type Lenis from "lenis";
import "lenis/dist/lenis.css";
import { faqs, services, site } from "@/lib/content";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FaqList from "@/components/site/FaqList";
import type { FrameInfo, World } from "./world";
import Preloader from "./Preloader";

// 0 start, 1 tot 5 de pilaren, 6 contact
const SECTION_COUNT = 7;
const PILLARS = services.length;
const LINE = 64; // lengte van het lijntje tussen de robot en de tekst

const leadSentence = (text: string) => text.split(". ")[0].replace(/\.$/, "") + ".";
const hyphenate = (text: string) =>
  text.replace(/bedrijfsautomatisering/gi, (w) => `${w.slice(0, 8)}\u00ad${w.slice(8)}`);

// Links: onderlijn die direct van kleur wisselt, geen overgang
const linkClass =
  "inline-flex items-center gap-3 border-b border-white/50 pb-1.5 text-[0.95rem] text-white hover:border-accent hover:text-accent";

const Arrow = () => (
  <svg aria-hidden viewBox="0 0 24 12" className="h-3 w-6">
    <path d="M0 6h22M17 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

export default function AIWorld() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const worldRef = useRef<World | null>(null);
  const calloutRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const journeyRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [worldReady, setWorldReady] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [pastJourney, setPastJourney] = useState(false);

  // De tekst van elke pilaar zit vast aan een onderdeel van de robot
  const handleFrame = useCallback((info: FrameInfo) => {
    const desktop = info.width >= 768;
    const bw = Math.min(416, info.width * 0.36);
    for (let i = 0; i < PILLARS; i++) {
      const el = calloutRefs.current[i];
      const line = lineRefs.current[i];
      const dot = dotRefs.current[i];
      if (!el) continue;
      const act = info.acts[i + 1] ?? 0;
      const o = Math.max(0, Math.min(1, (act - 0.4) / 0.6));
      el.style.opacity = String(o);
      el.style.visibility = o > 0.01 ? "visible" : "hidden";
      const p = info.anchors[i + 1];
      if (desktop && p) {
        const left = p.x > info.width * 0.5;
        // De tekst staat in de vrije ruimte naast de robot, het lijntje loopt naar het onderdeel
        const edge = left ? Math.min(p.x - LINE, info.width * 0.47) : Math.max(p.x + LINE, info.width * 0.53);
        const x = Math.max(24, Math.min(info.width - bw - 24, left ? edge - bw : edge));
        // Niet buiten beeld: de tekst is nu langer, dus schuif hem zo nodig omhoog
        const y = Math.max(76, Math.min(info.height - el.offsetHeight - 36, p.y - 12));
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        el.style.textAlign = "left";
        const x2 = left ? x + bw + 10 : x - 10;
        if (line && dot) {
          line.setAttribute("x1", String(p.x));
          line.setAttribute("y1", String(p.y));
          line.setAttribute("x2", String(x2));
          line.setAttribute("y2", String(p.y));
          line.style.opacity = String(o);
          dot.setAttribute("cx", String(p.x));
          dot.setAttribute("cy", String(p.y));
          dot.style.opacity = String(o);
        }
      } else {
        el.style.transform = "";
        el.style.textAlign = "";
        if (line && dot) {
          line.style.opacity = "0";
          dot.style.opacity = "0";
        }
      }
    }
  }, []);

  // 3D-wereld + scrollkoppeling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let world: World | null = null;
    let cancelled = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const adaptive = !new URLSearchParams(window.location.search).has("hq");

    // Voortgang alleen over de reis zelf; de FAQ en footer eronder tellen niet mee
    const onScroll = () => {
      const journey = journeyRef.current;
      const max = (journey ? journey.offsetHeight : document.documentElement.scrollHeight) - window.innerHeight;
      world?.setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
      // Voorbij de reis krijgt het menu een achtergrond, anders valt de tekst eronder
      setPastJourney(window.scrollY > max + 40);
    };

    const fail = (err: unknown) => {
      console.error("AI-wereld kon niet starten", err);
      setHasWebGL(false);
      setWorldReady(true);
    };

    import("./world")
      .then((m) => {
        if (cancelled) return;
        try {
          world = m.createWorld(canvas, {
            reducedMotion: reduced,
            stationCount: SECTION_COUNT,
            adaptive,
            onReady: () => setWorldReady(true),
            onFrame: handleFrame,
          });
          worldRef.current = world;
          onScroll();
        } catch (err) {
          fail(err);
        }
      })
      .catch(fail);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      cancelled = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      world?.dispose();
      worldRef.current = null;
    };
  }, [handleFrame]);

  // Na de intro: de camera vliegt uit het oog van de robot naar buiten
  useEffect(() => {
    if (introDone) worldRef.current?.reveal();
  }, [introDone]);

  // Scrollen op slot tijdens de intro, daarna vloeiend scrollen met Lenis
  useEffect(() => {
    const root = document.documentElement;
    if (!introDone) {
      root.style.overflow = "hidden";
      return;
    }
    root.style.overflow = "";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let lenis: Lenis | null = null;
    let cancelled = false;
    import("lenis").then(({ default: LenisCtor }) => {
      if (cancelled) return;
      lenis = new LenisCtor({ lerp: 0.085, wheelMultiplier: 0.9 });
      lenisRef.current = lenis;
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenisRef.current = null;
      root.style.overflow = "";
    };
  }, [introDone]);

  const goTo = useCallback((i: number) => {
    const top = i * window.innerHeight;
    if (lenisRef.current) lenisRef.current.scrollTo(top, { duration: 2.2 });
    else window.scrollTo({ top, behavior: "smooth" });
  }, []);

  return (
    <div className="relative overflow-x-clip bg-black text-white selection:bg-accent selection:text-black">
      <Preloader ready={worldReady} onDone={() => setIntroDone(true)} />

      {/* De 3D-wereld, vast op de achtergrond */}
      <div className="fixed inset-0 z-0 bg-black" aria-hidden>
        <canvas
          ref={canvasRef}
          className={`h-full w-full transition-opacity duration-[1500ms] ${hasWebGL && introDone ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      <Navbar overlay solid={pastJourney} />

      {/* De tekst van de pilaren, vastgemaakt aan de robot */}
      <svg aria-hidden className="pointer-events-none fixed inset-0 z-20 hidden h-full w-full md:block">
        {services.map((s, i) => (
          <g key={s.title}>
            <line
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              stroke="rgba(147,197,253,0.8)"
              strokeWidth="1"
              style={{ opacity: 0 }}
            />
            <circle
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              r="3.5"
              fill="#000"
              stroke="#93c5fd"
              strokeWidth="1.2"
              style={{ opacity: 0 }}
            />
          </g>
        ))}
      </svg>
      <div className="pointer-events-none fixed inset-0 z-20">
        {services.map((s, i) => (
          <div
            key={s.title}
            ref={(el) => {
              calloutRefs.current[i] = el;
            }}
            style={{ opacity: 0, visibility: "hidden" }}
            className="pointer-events-auto fixed left-0 top-0 w-[min(26rem,36vw)] will-change-transform max-md:!left-6 max-md:!right-6 max-md:!top-auto max-md:!bottom-12 max-md:!w-auto max-md:text-center [text-shadow:0_1px_16px_rgba(0,0,0,0.85)]"
          >
            <p className="font-mono text-[0.68rem] tracking-[0.25em] text-accent">
              {String(i + 1).padStart(2, "0")} / {String(PILLARS).padStart(2, "0")}
            </p>
            <h2 className="mt-3 font-heading text-[clamp(1.8rem,3vw,2.8rem)] font-bold leading-[0.98] tracking-[-0.04em] [text-wrap:balance]">
              {hyphenate(s.title)}
            </h2>
            <p className="mt-4 text-[0.88rem] leading-relaxed text-white/80">
              <span className="md:hidden">{leadSentence(s.story)}</span>
              <span className="hidden md:inline">{s.story}</span>
            </p>
            <ul className="mt-5 hidden space-y-2 md:block">
              {s.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-[0.8rem] leading-snug text-white/80">
                  <span aria-hidden className="mt-[0.4rem] h-1 w-1 shrink-0 bg-accent" />
                  {b}
                </li>
              ))}
            </ul>
            <p className="mt-5 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-white/65">{s.tools.join(" · ")}</p>
            <Link href={`/diensten#${s.slug}`} className="mt-5 inline-block text-sm text-white underline decoration-white/50 underline-offset-4 hover:text-accent hover:decoration-accent">
              Meer over {s.title.toLowerCase()}
            </Link>
          </div>
        ))}
      </div>

      <main className="relative z-10">
        <div ref={journeyRef}>
        {/* 0: Start */}
        <section className="relative flex h-[100svh] items-end px-6 pb-20 sm:px-10 md:items-center md:pb-0">
          <div className="mx-auto w-full max-w-6xl">
            <div className="md:w-[52%]">
              <h1 className="font-heading text-[clamp(2.6rem,6vw,5.6rem)] font-bold leading-[0.96] tracking-[-0.045em] [text-wrap:balance]">
                Jouw business verdient een team dat nooit stopt.
              </h1>
              <p className="mt-8 max-w-sm text-[0.95rem] leading-relaxed text-white/80">
                Ik bouw AI-workflows die 24/7 voor je werken. Scroll en kijk wat ze doen.
              </p>
              <div className="mt-8">
                <Link href="/contact" className={linkClass}>
                  Plan een gratis gesprek
                  <Arrow />
                </Link>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => goTo(1)}
            aria-label="Scroll naar beneden"
            className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
          >
            <span aria-hidden className="relative block h-12 w-px overflow-hidden bg-white/15">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_cubic-bezier(0.76,0,0.24,1)_infinite] bg-accent" />
            </span>
          </button>
        </section>

        {/* 1 tot 5: de pilaren. De tekst staat op de robot, hier is alleen ruimte om te scrollen. */}
        {services.map((s) => (
          <section key={s.title} aria-hidden className="h-[100svh]" />
        ))}
        {/* Extra scrollruimte voor de rustige vlucht door het oog (DIVE_LENGTH in world.ts) */}
        <section aria-hidden className="h-[120svh]" />

        {/* 6: Contact, na de vlucht door het oog */}
        <section className="relative flex h-[100svh] items-end px-6 pb-16 pt-32 sm:px-10 md:items-center md:pb-0">
          <div className="mx-auto w-full max-w-6xl">
            <div className="md:w-[46%]">
              <h2 className="font-heading text-[clamp(3rem,8vw,7.5rem)] font-bold leading-[0.92] tracking-[-0.05em]">Stap erin.</h2>
              <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-white/80">
                Vertel me waar je tijd in verdwijnt, dan zeg ik eerlijk wat ik ervan kan overnemen.
              </p>
              <p className="mt-4 text-[0.95rem] font-medium text-white">Je krijgt dezelfde dag antwoord.</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link href="/contact" className={linkClass}>
                  Plan een gratis gesprek
                  <Arrow />
                </Link>
                <a href={site.whatsapp} className="text-[0.95rem] text-white/80 underline decoration-white/40 underline-offset-4 hover:text-accent">
                  Of app me gewoon
                </a>
              </div>
            </div>
          </div>
        </section>
        </div>

        {/* Na de reis: 5 veelgestelde vragen op een effen achtergrond, daarna de footer */}
        <section aria-labelledby="home-faq" className="relative bg-black py-16 md:py-24">
          <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
            <h2 id="home-faq" className="font-heading text-[clamp(1.75rem,3.4vw,2.75rem)] font-bold leading-[1.02] tracking-[-0.035em]">
              Veelgestelde vragen
            </h2>
            <div className="mt-10 max-w-3xl">
              <FaqList items={faqs.slice(0, 5)} />
            </div>
            <p className="mt-8 flex flex-wrap gap-6 text-[0.95rem]">
              <Link href="/faq" className="text-white underline decoration-white/50 underline-offset-[6px] hover:text-accent">
                Alle vragen
              </Link>
              <Link href="/diensten" className="text-white underline decoration-white/50 underline-offset-[6px] hover:text-accent">
                Alle diensten
              </Link>
              <Link href="/proces" className="text-white underline decoration-white/50 underline-offset-[6px] hover:text-accent">
                Hoe het werkt
              </Link>
            </p>
          </div>
        </section>
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
