type IndexLabelProps = {
  current: number;
  total: number;
  className?: string;
  color?: string;
};

/**
 * Kleine "01 / 06"-nummering, gebruikt als structurerend detail in secties/lijsten.
 * Kleur via inline style (niet via een Tailwind text-color class) zodat een
 * afwijkende kleur via `color` nooit botst met een class-volgorde-conflict.
 */
export function IndexLabel({ current, total, className = "", color = "#64748b" }: IndexLabelProps) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <span className={`font-mono text-xs tracking-widest whitespace-nowrap ${className}`} style={{ color }}>
      {pad(current)} / {pad(total)}
    </span>
  );
}

export default IndexLabel;
