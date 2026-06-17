"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import CTA from "@/components/sections/CTA";

const ContactSlide = dynamic(
  () => import("@/components/sections/ContactSlide"),
  { ssr: false }
);

// Grid:
// Row 0: [Hero] [Contact]
// Row 1: [Diensten]
// Row 2: [Over]
// Row 3: [CTA + Footer]
const ROW_COUNT = 4;
const rowLabels = ["Home", "Diensten", "Over ons", "Afsluiting"];
const rowCols = [2, 1, 1, 1];

const DEBOUNCE_MS = 800;
const SWIPE_THRESHOLD = 50;

export default function FullPageLayout() {
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const isAnimating = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Dispatch row-change event zodat Navbar kan reageren
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("fullpage-row-change", { detail: { row, col } })
    );
  }, [row, col]);

  // Luister naar externe navigatie-events (Navbar, Hero-knop)
  useEffect(() => {
    const handler = (e: Event) => {
      const { row: targetRow, col: targetCol = 0 } = (e as CustomEvent).detail;
      if (isAnimating.current) return;
      isAnimating.current = true;
      setTimeout(() => { isAnimating.current = false; }, DEBOUNCE_MS);
      setRow(targetRow);
      setCol(targetCol);
    };
    window.addEventListener("fullpage-navigate", handler);
    return () => window.removeEventListener("fullpage-navigate", handler);
  }, []);

  const navigate = useCallback((dRow: number, dCol: number) => {
    if (isAnimating.current) return;

    setRow((r) => {
      setCol((c) => {
        if (dCol !== 0 && dRow === 0) {
          const newCol = c + dCol;
          const maxCol = rowCols[r] - 1;
          if (newCol < 0 || newCol > maxCol) return c;
          isAnimating.current = true;
          setTimeout(() => { isAnimating.current = false; }, DEBOUNCE_MS);
          return newCol;
        }
        if (dRow !== 0 && dCol === 0) {
          const newRow = r + dRow;
          if (newRow < 0 || newRow >= ROW_COUNT) return c;
          isAnimating.current = true;
          setTimeout(() => { isAnimating.current = false; }, DEBOUNCE_MS);
          return 0;
        }
        return c;
      });

      const newRow = r + dRow;
      if (dRow !== 0 && newRow >= 0 && newRow < ROW_COUNT) return newRow;
      return r;
    });
  }, []);

  // Wheel
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      if (absX > absY) navigate(0, e.deltaX > 0 ? 1 : -1);
      else navigate(e.deltaY > 0 ? 1 : -1, 0);
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [navigate]);

  // Touch
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      touchStart.current = null;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > SWIPE_THRESHOLD) navigate(0, dx < 0 ? 1 : -1);
      } else {
        if (Math.abs(dy) > SWIPE_THRESHOLD) navigate(dy < 0 ? 1 : -1, 0);
      }
    };
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [navigate]);

  // Keyboard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") navigate(1, 0);
      else if (e.key === "ArrowUp") navigate(-1, 0);
      else if (e.key === "ArrowRight") navigate(0, 1);
      else if (e.key === "ArrowLeft") navigate(0, -1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [navigate]);

  const goToRow = (r: number) => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setTimeout(() => { isAnimating.current = false; }, DEBOUNCE_MS);
    setRow(r);
    setCol(0);
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#050508]">
      {/* Vertical slider */}
      <motion.div
        className="absolute inset-0"
        animate={{ y: `-${row * 100}vh` }}
        transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
        style={{ height: `${ROW_COUNT * 100}vh` }}
      >
        {/* Row 0: horizontale slider */}
        <div className="relative h-screen overflow-hidden">
          <motion.div
            className="absolute inset-0 flex"
            animate={{ x: `-${col * 100}vw` }}
            transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
            style={{ width: `${rowCols[0] * 100}vw` }}
          >
            <div className="w-screen h-screen flex-shrink-0">
              <Hero />
            </div>
            <div className="w-screen h-screen flex-shrink-0">
              <ContactSlide />
            </div>
          </motion.div>
        </div>

        {/* Row 1: Diensten */}
        <div className="h-screen">
          <Services />
        </div>

        {/* Row 2: Over */}
        <div className="h-screen">
          <About />
        </div>

        {/* Row 3: CTA + Footer */}
        <div className="h-screen">
          <CTA />
        </div>
      </motion.div>

      {/* Navigatie dots (rechts) */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {rowLabels.map((label, i) => (
          <button
            key={label}
            onClick={() => goToRow(i)}
            className="group relative flex items-center justify-end"
            aria-label={`Ga naar ${label}`}
          >
            <span className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-slate-300 bg-[#050508]/90 border border-white/10 px-2 py-1 rounded whitespace-nowrap">
              {label}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                row === i
                  ? "w-3 h-3 bg-[#00d4ff] shadow-[0_0_8px_rgba(0,212,255,0.8)]"
                  : "w-2 h-2 bg-slate-600 hover:bg-slate-400"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Horizontale dots (alleen op row 0) */}
      <AnimatePresence>
        {row === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-3 items-center"
          >
            {["Home", "Contact"].map((label, i) => (
              <button
                key={label}
                onClick={() => {
                  if (isAnimating.current) return;
                  isAnimating.current = true;
                  setTimeout(() => { isAnimating.current = false; }, DEBOUNCE_MS);
                  setCol(i);
                }}
                aria-label={label}
                className={`rounded-full transition-all duration-300 ${
                  col === i
                    ? "w-6 h-2 bg-[#00d4ff] shadow-[0_0_6px_rgba(0,212,255,0.7)]"
                    : "w-2 h-2 bg-slate-600 hover:bg-slate-400"
                }`}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
