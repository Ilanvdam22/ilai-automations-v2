"use client";
import { motion } from "framer-motion";

const orbs = [
  { size: 600, x: "15%", y: "20%", color: "rgba(0,212,255,0.06)", duration: 18, delay: 0 },
  { size: 400, x: "70%", y: "60%", color: "rgba(124,58,237,0.08)", duration: 22, delay: 3 },
  { size: 300, x: "40%", y: "80%", color: "rgba(0,212,255,0.04)", duration: 15, delay: 6 },
  { size: 500, x: "85%", y: "10%", color: "rgba(124,58,237,0.05)", duration: 25, delay: 1 },
];

export default function FloatingOrbs() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            transform: "translate(-50%, -50%)",
            filter: "blur(40px)",
          }}
          animate={{
            y: [0, -40, 20, -20, 0],
            x: [0, 20, -10, 15, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
