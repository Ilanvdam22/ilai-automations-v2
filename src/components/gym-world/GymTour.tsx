"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import Link from "next/link";
import Preloader from "@/components/ai-world/Preloader";
import type { Gym, GymFrame } from "./scene";
import { FACTS, HOLD, ROOM, STOPS, ZONES } from "./zones";

const W = ROOM.maxX - ROOM.minX;
const D = ROOM.maxZ - ROOM.minZ;
const LAST = STOPS.length - 1;
const pct = (x: number, z: number) => ({ left: `${((x - ROOM.minX) / W) * 100}%`, top: `${((z - ROOM.minZ) / D) * 100}%` });

/** Scrollpositie in stops (0 = ingang, 1 t/m 5 = zones, 6 = overzicht) */
function stopFromScroll(track: HTMLElement) {
  const r = track.getBoundingClientRect();
  const max = r.height - window.innerHeight;
  return max > 0 ? Math.min(1, Math.max(0, -r.top / max)) * LAST : 0;
}

/**
 * De sportschool als scroll-reis: scrollen brengt je langs de vijf zones,
 * bij elke zone staat de uitleg. Punten en plattegrond zijn echte knoppen
 * die naar die zone scrollen. Zonder WebGL blijft de reis werken, alleen
 * zonder 3D erachter.
 */
export default function GymTour({ trackRef }: { trackRef: RefObject<HTMLDivElement> }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gymRef = useRef<Gym | null>(null);
  const hotspotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const camRef = useRef<SVGGElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<number | null>(null);
  const frameRef = useRef<GymFrame | null>(null);

  const [ready, setReady] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [fallback, setFallback] = useState(false);
  // Bij welke stop staat de camera stil (null = onderweg)
  const [at, setAt] = useState<number | null>(0);
  const [found, setFound] = useState(0);

  // De uitleg staat naast het bolletje van de zone, met een lijntje ertussen
  const placeCard = useCallback(() => {
    const card = cardRef.current;
    const line = lineRef.current;
    const root = rootRef.current;
    const f = frameRef.current;
    const i = zoneRef.current;
    if (!card || !line || !root) return;
    const h = f && i !== null ? f.hotspots[i] : null;
    if (!h || !h.visible) {
      // Punt niet in beeld: linksonder
      card.style.transform = `translate3d(16px, ${root.clientHeight - card.offsetHeight - 16}px, 0)`;
      card.style.visibility = "visible";
      line.style.visibility = "hidden";
      return;
    }
    const W = root.clientWidth;
    const H = root.clientHeight;
    const cw = card.offsetWidth;
    const ch = card.offsetHeight;
    const gap = 44;
    const top = 80;
    const clampY = (y: number) => Math.min(Math.max(y, top), H - ch - 16);
    let x: number;
    let y: number;
    let side: "right" | "left" | "below" | "above";
    if (h.x + gap + cw <= W - 16) {
      side = "right";
      x = h.x + gap;
      y = clampY(h.y - 28);
    } else if (h.x - gap - cw >= 16) {
      side = "left";
      x = h.x - gap - cw;
      y = clampY(h.y - 28);
    } else {
      // Smal scherm: onder of boven het bolletje
      x = Math.min(Math.max(h.x - cw / 2, 16), W - cw - 16);
      side = h.y + 28 + ch <= H - 16 ? "below" : "above";
      y = side === "below" ? h.y + 28 : Math.max(top, h.y - 28 - ch);
    }
    card.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    card.style.visibility = "visible";
    if (side === "right" || side === "left") {
      const x1 = side === "right" ? h.x + 10 : x + cw;
      const x2 = side === "right" ? x : h.x - 10;
      line.style.transform = `translate3d(${x1}px, ${h.y}px, 0)`;
      line.style.width = `${Math.max(0, x2 - x1)}px`;
      line.style.height = "1px";
    } else {
      const y1 = side === "below" ? h.y + 10 : y + ch;
      const y2 = side === "below" ? y : h.y - 10;
      line.style.transform = `translate3d(${h.x}px, ${y1}px, 0)`;
      line.style.width = "1px";
      line.style.height = `${Math.max(0, y2 - y1)}px`;
    }
    line.style.visibility = "visible";
  }, []);

  // Hotspots en de plattegrond volgen de camera, zonder React opnieuw te laten renderen
  const handleFrame = useCallback((f: GymFrame) => {
    frameRef.current = f;
    f.hotspots.forEach((h, i) => {
      const el = hotspotRefs.current[i];
      if (!el) return;
      el.style.transform = `translate3d(${h.x}px, ${h.y}px, 0)`;
      el.style.visibility = h.visible ? "visible" : "hidden";
    });
    if (camRef.current) {
      const deg = (f.cam.yaw * 180) / Math.PI;
      camRef.current.setAttribute("transform", `translate(${f.cam.x} ${f.cam.z}) rotate(${deg})`);
    }
    placeCard();
  }, [placeCard]);

  // Scroll stuurt de camera en bepaalt welke uitleg zichtbaar is
  useEffect(() => {
    const onScroll = () => {
      const track = trackRef.current;
      if (!track) return;
      const s = stopFromScroll(track);
      gymRef.current?.setStop(s);
      const r = Math.round(s);
      setAt(Math.abs(s - r) <= HOLD + 0.08 ? r : null);
      setFound((f) => Math.max(f, Math.min(ZONES.length, Math.floor(s + HOLD + 0.08))));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [trackRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let gym: Gym | null = null;
    let cancelled = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const toFallback = () => {
      setFallback(true);
      setReady(true);
    };

    import("./scene")
      .then(({ createGym }) => {
        if (cancelled) return;
        try {
          gym = createGym(canvas, {
            reducedMotion: reduced,
            onFrame: handleFrame,
            onReady: () => setReady(true),
            onSlow: () => {
              gym?.dispose();
              gym = null;
              gymRef.current = null;
              toFallback();
            },
          });
          gymRef.current = gym;
          if (trackRef.current) gym.setStop(stopFromScroll(trackRef.current));
        } catch {
          toFallback();
        }
      })
      .catch(toFallback);

    // Niet renderen als de reis uit beeld is
    const io = new IntersectionObserver(([entry]) => gymRef.current?.setActive(entry.isIntersecting), { threshold: 0.01 });
    if (rootRef.current) io.observe(rootRef.current);

    return () => {
      cancelled = true;
      io.disconnect();
      gym?.dispose();
      gymRef.current = null;
    };
  }, [handleFrame, trackRef]);

  // Naar een stop scrollen (vanaf een punt of de plattegrond)
  const goTo = useCallback(
    (stop: number) => {
      const track = trackRef.current;
      if (!track) return;
      const top = track.getBoundingClientRect().top + window.scrollY;
      const max = track.offsetHeight - window.innerHeight;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: top + (stop / LAST) * max, behavior: reduced ? "auto" : "smooth" });
    },
    [trackRef],
  );

  // Pas uitleg tonen als het laadscherm weg is
  const zoneIndex = introDone && at !== null && at >= 1 && at <= ZONES.length ? at - 1 : null;
  const zone = zoneIndex !== null ? ZONES[zoneIndex] : null;
  const atEnd = introDone && at === LAST;

  // Nieuwe zone: kaart meteen goed zetten, ook als de camera al stilstaat
  useLayoutEffect(() => {
    zoneRef.current = zoneIndex;
    placeCard();
  }, [zoneIndex, placeCard]);

  return (
    <div ref={rootRef} className="absolute inset-0">
      {!fallback && (
        <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0 h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
        />
      )}
      {!introDone && <Preloader contained minMs={500} ready={ready} onDone={() => setIntroDone(true)} />}

      {/* Hotspots boven het canvas: klikken scrollt naar die zone */}
      {!fallback && (
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
          {ZONES.map((z, i) => {
            const current = zoneIndex === i;
            const done = i < found;
            return (
              <button
                key={z.id}
                type="button"
                ref={(el) => {
                  hotspotRefs.current[i] = el;
                }}
                onClick={() => goTo(i + 1)}
                aria-label={`Ga naar ${z.label}: ${z.title}`}
                style={{ visibility: "hidden" }}
                className="pointer-events-auto absolute left-0 top-0 -ml-2 -mt-2 flex items-center gap-2 text-left"
              >
                <span aria-hidden className="relative block h-4 w-4">
                  {!done && <span className="gym-pulse absolute inset-0 rounded-full bg-accent" />}
                  <span className={`absolute inset-0 rounded-full border-2 border-accent ${done && !current ? "bg-black" : "bg-accent"}`} />
                </span>
                {/* Bij de huidige zone staat de uitleg al naast het bolletje */}
                {!current && (
                  <span className="bg-black px-2 py-1 text-xs font-medium text-white hover:bg-accent hover:text-black">
                    {String(i + 1).padStart(2, "0")} {z.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Voortgang */}
      <p className="absolute bottom-6 left-6 z-20 bg-black px-3 py-1.5 text-sm text-white sm:left-10 md:bottom-auto md:left-auto md:right-10 md:top-24">
        <span className="text-accent">{found}</span> van {ZONES.length} ontdekt
      </p>

      {/* Plattegrond rechtsonder */}
      {!fallback && (
        <nav
          aria-label="Plattegrond"
          className={`absolute bottom-6 right-6 z-20 h-[99px] w-[132px] border border-white/20 bg-black sm:right-10 md:h-[132px] md:w-[176px] ${zone || atEnd ? "max-md:hidden" : ""}`}
        >
          <svg viewBox={`${ROOM.minX} ${ROOM.minZ} ${W} ${D}`} className="absolute inset-0 h-full w-full" aria-hidden>
            <rect x={-2} y={-5.6} width={8.4} height={5.6} fill="rgba(255,255,255,0.06)" />
            <rect x={-8} y={-6} width={16} height={12} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={0.12} />
            <line x1={-2} y1={6} x2={2} y2={6} stroke="#93c5fd" strokeWidth={0.3} />
            <g ref={camRef}>
              <path d="M0 0 L-0.9 -2.2 L0.9 -2.2 Z" fill="rgba(147,197,253,0.35)" />
              <circle r={0.35} fill="#fff" />
            </g>
          </svg>
          {ZONES.map((z, i) => {
            const p = z.mapAt ? pct(z.mapAt[0], z.mapAt[1]) : pct(z.hotspot[0], z.hotspot[2]);
            const on = zoneIndex === i || i < found;
            return (
              <button
                key={z.id}
                type="button"
                onClick={() => goTo(i + 1)}
                aria-label={`Ga naar ${z.label}`}
                style={p}
                className={`absolute -ml-2.5 -mt-2.5 flex h-5 w-5 items-center justify-center rounded-full border border-accent text-[0.6rem] font-semibold ${on ? "bg-accent text-black" : "bg-black text-accent"} hover:bg-white hover:text-black`}
              >
                {i + 1}
              </button>
            );
          })}
        </nav>
      )}

      {/* Uitleg bij de zone waar je nu staat */}
      <div aria-hidden ref={lineRef} style={{ visibility: "hidden" }} className={`pointer-events-none absolute left-0 top-0 z-20 bg-accent ${zone ? "" : "hidden"}`} />
      <div aria-live="polite">
        {zone && zoneIndex !== null && (
          <section
            ref={cardRef}
            key={zone.id}
            aria-labelledby="gym-card-title"
            style={{ visibility: "hidden" }}
            className="absolute left-0 top-0 z-30 w-[20rem] max-w-[calc(100%-2rem)] border border-white/20 bg-black p-5"
          >
            <p className="font-mono text-xs tracking-[0.2em] text-accent">
              {String(zoneIndex + 1).padStart(2, "0")} / {String(ZONES.length).padStart(2, "0")} · {zone.label.toUpperCase()}
            </p>
            <h2 id="gym-card-title" className="mt-3 font-heading text-xl font-bold tracking-[-0.03em]">
              {zone.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              <span className="font-medium text-white">Nu: </span>
              {zone.problem}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              <span className="font-medium text-white">Met ILAI: </span>
              {zone.solution}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <Link href={zone.href} className="bg-accent px-4 py-2 text-sm font-medium text-black hover:bg-white">
                Bekijk hoe dit werkt
              </Link>
              <span className="text-sm text-white/65">Scroll verder</span>
            </div>
          </section>
        )}

        {/* Einde van de reis */}
        {atEnd && (
          <section
            aria-labelledby="gym-end-title"
            className="absolute inset-x-4 bottom-4 z-30 border border-white/20 bg-black p-6 sm:inset-x-auto sm:bottom-10 sm:left-10 sm:w-[40rem] sm:p-8"
          >
            <h2 id="gym-end-title" className="font-heading text-[clamp(1.9rem,4vw,3rem)] font-bold leading-[1] tracking-[-0.04em]">
              Zo regelt ILAI je sportschool.
            </h2>
            <dl className="mt-8 grid gap-6 border-t border-white/15 pt-6 sm:grid-cols-3">
              {FACTS.map((f) => (
                <div key={f.label} className="flex flex-col-reverse">
                  <dt className="mt-2 text-sm text-white/75">{f.label}</dt>
                  <dd className="font-heading text-2xl font-bold tracking-[-0.03em] text-accent">{f.value}</dd>
                </div>
              ))}
            </dl>
            <Link href="/contact" className="mt-8 inline-block bg-accent px-6 py-3 font-medium text-black hover:bg-white">
              Plan een gratis gesprek
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
