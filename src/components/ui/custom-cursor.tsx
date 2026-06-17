"use client";
import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number>(0);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };
    const onEnter = () => setHovering(true);
    const onLeave = () => setHovering(false);

    window.addEventListener("mousemove", onMove);

    const addListeners = () => {
      document.querySelectorAll("a, button, [role='button']").forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };

    // Use MutationObserver to catch dynamically added elements
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    addListeners();

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const animate = () => {
      ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.12);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x - 18}px, ${ringPos.current.y - 18}px) scale(${hovering ? 1.8 : 1})`;
      }
      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      observer.disconnect();
      cancelAnimationFrame(rafId.current);
    };
  }, [hovering, visible]);

  if (!visible) return null;

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#00d4ff] pointer-events-none z-[99999]"
        style={{
          boxShadow: "0 0 8px rgba(0,212,255,0.8)",
          transition: "width 0.2s, height 0.2s",
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 rounded-full pointer-events-none z-[99998]"
        style={{
          border: `1px solid rgba(0,212,255,${hovering ? 0.8 : 0.35})`,
          transition: "transform 0.05s linear, border-color 0.3s, scale 0.3s",
          boxShadow: hovering ? "0 0 12px rgba(0,212,255,0.2)" : "none",
        }}
      />
    </>
  );
}
