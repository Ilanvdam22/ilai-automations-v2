import type { ReactNode } from "react";

type CornerBracketsProps = {
  children: ReactNode;
  active?: boolean;
  color?: string;
  className?: string;
};

const cornerBase = "absolute w-3 h-3 border-current transition-opacity duration-300";

/**
 * "Viewfinder"-hoekaccenten rond een element (CTA-knop, uitgelicht lijst-item).
 * Puur presentationeel: geen eigen scroll-logica. De aanroeper bepaalt via
 * `active` of de brackets zichtbaar zijn (bijv. op basis van IntersectionObserver-state).
 */
export function CornerBrackets({
  children,
  active = true,
  color = "#00d4ff",
  className = "",
}: CornerBracketsProps) {
  return (
    <div className={`relative inline-block ${className}`} style={{ color }}>
      <span
        className={`${cornerBase} -top-2 -left-2 border-t border-l ${active ? "opacity-100" : "opacity-0"}`}
      />
      <span
        className={`${cornerBase} -top-2 -right-2 border-t border-r ${active ? "opacity-100" : "opacity-0"}`}
      />
      <span
        className={`${cornerBase} -bottom-2 -left-2 border-b border-l ${active ? "opacity-100" : "opacity-0"}`}
      />
      <span
        className={`${cornerBase} -bottom-2 -right-2 border-b border-r ${active ? "opacity-100" : "opacity-0"}`}
      />
      {children}
    </div>
  );
}

export default CornerBrackets;
