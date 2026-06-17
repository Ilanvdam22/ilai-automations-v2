"use client";
import { useRef, useState, MouseEvent, ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
}

export default function TiltCard({
  children,
  className = "",
  maxTilt = 12,
  scale = 1.03,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({
    transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)",
    transition: "transform 0.15s ease-out",
  });
  const [sheen, setSheen] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / (rect.height / 2)) * -maxTilt;
    const ry = ((e.clientX - cx) / (rect.width / 2)) * maxTilt;
    const sx = ((e.clientX - rect.left) / rect.width) * 100;
    const sy = ((e.clientY - rect.top) / rect.height) * 100;
    setStyle({
      transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`,
      transition: "transform 0.08s ease-out",
    });
    setSheen({ x: sx, y: sy, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)",
      transition: "transform 0.5s ease-out",
    });
    setSheen((s) => ({ ...s, opacity: 0 }));
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...style, transformStyle: "preserve-3d", willChange: "transform" }}
      className={`relative ${className}`}
    >
      {/* Sheen overlay */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none z-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${sheen.x}% ${sheen.y}%, rgba(0,212,255,0.12), transparent 65%)`,
          opacity: sheen.opacity,
        }}
      />
      {children}
    </div>
  );
}
