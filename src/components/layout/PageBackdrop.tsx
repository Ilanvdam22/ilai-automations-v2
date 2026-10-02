import Image from "next/image";

// Sfeerbeeld bovenaan een pagina dat naar onderen vloeiend overgaat in de achtergrond.
export default function PageBackdrop({ src, offset = "top-0" }: { src: string; offset?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-x-0 ${offset} h-[860px] overflow-hidden`}>
      <Image
        src={src}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-80 select-none"
      />
      {/* Donkerder achter de koptekst, zodat die goed leesbaar blijft */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_30%,rgba(5,5,8,0.55),transparent_75%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/70 via-[#050508]/10 to-[#050508]" />
    </div>
  );
}
