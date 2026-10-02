"use client";
import { MotionConfig } from "framer-motion";

// Respecteert "verminder beweging" in de systeeminstellingen van de bezoeker.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
