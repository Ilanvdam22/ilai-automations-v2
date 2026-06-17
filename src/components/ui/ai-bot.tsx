"use client";
import { motion } from "framer-motion";

export default function AIBot({ size = 320 }: { size?: number }) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const r = s * 0.36;

  return (
    <motion.div
      className="relative select-none"
      style={{ width: s, height: s }}
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Background glow */}
      <div
        className="absolute rounded-full"
        style={{
          inset: "10%",
          background: "radial-gradient(circle, rgba(0,212,255,0.12) 0%, rgba(124,58,237,0.06) 50%, transparent 70%)",
          filter: "blur(24px)",
        }}
      />

      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer rotating orbit ring */}
        <motion.circle
          cx={cx} cy={cy} r={r + s * 0.1}
          stroke="rgba(0,212,255,0.12)"
          strokeWidth="1"
          strokeDasharray="6 10"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Inner orbit ring */}
        <motion.circle
          cx={cx} cy={cy} r={r + s * 0.05}
          stroke="rgba(124,58,237,0.15)"
          strokeWidth="1"
          strokeDasharray="4 14"
          animate={{ rotate: -360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Main head circle */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="rgba(5,5,8,0.95)"
          stroke="rgba(0,212,255,0.5)"
          strokeWidth="1.5"
        />

        {/* Outer glow ring */}
        <circle
          cx={cx} cy={cy} r={r}
          stroke="#00d4ff"
          strokeWidth="0.5"
          opacity="0.3"
          filter="url(#glowFilter)"
        />

        {/* Circuit lines inside head */}
        <g stroke="rgba(0,212,255,0.18)" strokeWidth="1">
          <line x1={cx - r * 0.6} y1={cy - r * 0.1} x2={cx - r * 0.15} y2={cy - r * 0.1} />
          <line x1={cx - r * 0.15} y1={cy - r * 0.1} x2={cx - r * 0.15} y2={cy + r * 0.2} />
          <line x1={cx + r * 0.6} y1={cy - r * 0.1} x2={cx + r * 0.15} y2={cy - r * 0.1} />
          <line x1={cx + r * 0.15} y1={cy - r * 0.1} x2={cx + r * 0.15} y2={cy + r * 0.2} />
          <line x1={cx - r * 0.4} y1={cy + r * 0.4} x2={cx + r * 0.4} y2={cy + r * 0.4} />
        </g>
        <g fill="rgba(0,212,255,0.25)">
          <circle cx={cx - r * 0.15} cy={cy + r * 0.2} r={2.5} />
          <circle cx={cx + r * 0.15} cy={cy + r * 0.2} r={2.5} />
          <circle cx={cx - r * 0.4} cy={cy + r * 0.4} r={2} />
          <circle cx={cx + r * 0.4} cy={cy + r * 0.4} r={2} />
        </g>

        {/* Eyes */}
        {/* Left eye */}
        <motion.rect
          x={cx - r * 0.45} y={cy - r * 0.18}
          width={r * 0.28} height={r * 0.18}
          rx={r * 0.05}
          fill="#00d4ff"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          filter="url(#eyeGlow)"
        />
        {/* Right eye */}
        <motion.rect
          x={cx + r * 0.17} y={cy - r * 0.18}
          width={r * 0.28} height={r * 0.18}
          rx={r * 0.05}
          fill="#00d4ff"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          filter="url(#eyeGlow)"
        />

        {/* Mouth bar */}
        <rect
          x={cx - r * 0.3} y={cy + r * 0.2}
          width={r * 0.6} height={r * 0.08}
          rx={r * 0.04}
          fill="rgba(0,212,255,0.25)"
        />
        <motion.rect
          x={cx - r * 0.3} y={cy + r * 0.2}
          width={r * 0.3} height={r * 0.08}
          rx={r * 0.04}
          fill="rgba(0,212,255,0.7)"
          animate={{ width: [r * 0.1, r * 0.55, r * 0.25, r * 0.6, r * 0.1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Antenna */}
        <line
          x1={cx} y1={cy - r}
          x2={cx} y2={cy - r - s * 0.1}
          stroke="rgba(0,212,255,0.5)"
          strokeWidth="1.5"
        />
        <motion.circle
          cx={cx} cy={cy - r - s * 0.12}
          r={s * 0.025}
          fill="#00d4ff"
          animate={{ opacity: [1, 0.1, 1], scale: [1, 1.4, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: `${cx}px ${cy - r - s * 0.12}px` }}
          filter="url(#eyeGlow)"
        />

        {/* Ear connectors */}
        <rect x={cx - r - s * 0.06} y={cy - r * 0.15} width={s * 0.06} height={r * 0.3} rx={s * 0.015} fill="rgba(0,212,255,0.15)" stroke="rgba(0,212,255,0.3)" strokeWidth="1" />
        <rect x={cx + r} y={cy - r * 0.15} width={s * 0.06} height={r * 0.3} rx={s * 0.015} fill="rgba(0,212,255,0.15)" stroke="rgba(0,212,255,0.3)" strokeWidth="1" />

        {/* Orbiting dots */}
        {[0, 120, 240].map((deg, i) => (
          <motion.circle
            key={i}
            cx={cx} cy={cy - r - s * 0.1}
            r={s * 0.018}
            fill={i === 0 ? "#00d4ff" : i === 1 ? "#7c3aed" : "rgba(0,212,255,0.5)"}
            animate={{ rotate: 360 }}
            transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
            initial={{ rotate: deg }}
          />
        ))}

        {/* Filters */}
        <defs>
          <filter id="eyeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </motion.div>
  );
}
