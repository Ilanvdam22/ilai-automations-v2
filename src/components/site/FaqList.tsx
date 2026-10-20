/** Uitklapbare vragen met gewone <details>: werkt zonder JavaScript en zonder animatie. */
export default function FaqList({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className="border-t border-white/10">
      {items.map((f) => (
        <details key={f.question} className="group border-b border-white/10">
          <summary className="flex cursor-pointer items-start justify-between gap-6 py-5 font-heading text-lg font-semibold tracking-[-0.01em] text-white hover:text-accent">
            <span>{f.question}</span>
            <span aria-hidden className="faq-sign shrink-0 font-mono text-xl leading-6 text-accent" />
          </summary>
          <p className="max-w-2xl pb-6 leading-relaxed text-white/80">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
