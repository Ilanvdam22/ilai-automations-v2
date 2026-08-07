import { createElement, type ReactNode } from "react";

type HeadlineProps = {
  as?: "h1" | "h2" | "h3";
  size?: "xl" | "lg" | "md";
  className?: string;
  children: ReactNode;
};

const sizeClasses: Record<NonNullable<HeadlineProps["size"]>, string> = {
  xl: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
  lg: "text-3xl sm:text-4xl md:text-5xl",
  md: "text-2xl sm:text-3xl",
};

/**
 * Gedeelde kop-stijl: Space Grotesk, hoofdletters, strakke tracking.
 * Bemoeit zich niet met kleur — bestaande <span className="gradient-text">
 * of .glow-text binnenin blijven gewoon werken.
 */
export function Headline({
  as = "h2",
  size = "lg",
  className = "",
  children,
}: HeadlineProps) {
  return createElement(
    as,
    {
      className: `font-heading font-medium uppercase tracking-tight leading-[0.95] ${sizeClasses[size]} ${className}`,
    },
    children
  );
}

export default Headline;
