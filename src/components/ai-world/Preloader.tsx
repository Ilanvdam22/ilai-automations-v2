"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MIN_MS = 1100;
const MAX_MS = 3800;

/**
 * Intro: telt op terwijl de 3D-wereld laadt en schuift daarna omhoog weg.
 * Telt nooit voorbij 88 tot de wereld echt klaar is (of de maximale wachttijd om is).
 */
export default function Preloader({
  ready,
  onDone,
  contained = false,
  minMs = MIN_MS,
}: {
  ready: boolean;
  onDone: () => void;
  /** Binnen een sectie in plaats van over het hele scherm */
  contained?: boolean;
  minMs?: number;
}) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(true);
  const readyRef = useRef(ready);
  readyRef.current = ready;
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const start = performance.now();
    let value = 0;
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const canFinish = (readyRef.current && elapsed > minMs) || elapsed > MAX_MS;
      const target = canFinish ? 100 : 88;
      value += (target - value) * (canFinish ? 0.14 : 0.035);
      const shown = canFinish && target - value < 0.6 ? 100 : Math.floor(value);
      setCount(shown);
      if (shown === 100) {
        setTimeout(() => setVisible(false), 220);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [minMs]);

  return (
    <AnimatePresence onExitComplete={() => doneRef.current()}>
      {visible && (
        <motion.div
          key="preloader"
          className={`${contained ? "absolute z-30" : "fixed z-[100]"} inset-0 flex flex-col justify-between bg-[#050507] px-6 py-7 text-white sm:px-10`}
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          role="status"
          aria-live="polite"
        >
          <div className="font-heading text-base font-medium tracking-[0.3em]">ILAI</div>

          <div className="flex flex-col items-center">
            <span className="font-mono text-[clamp(4rem,14vw,10rem)] font-light leading-none tabular-nums tracking-tight">
              {String(count).padStart(3, "0")}
            </span>
            <div className="mt-8 h-px w-56 overflow-hidden bg-white/10 sm:w-80">
              <div className="h-full bg-accent transition-[width] duration-100" style={{ width: `${count}%` }} />
            </div>
          </div>

          <div aria-hidden className="h-4" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
