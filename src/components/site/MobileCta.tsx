import Link from "next/link";

/** Vaste knop onderaan op mobiel, zodat een gesprek plannen altijd één tik is. */
export default function MobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/15 bg-black p-3 md:hidden">
      <Link href="/contact" className="flex w-full items-center justify-center bg-accent py-3 font-medium text-black active:bg-white">
        Plan een gratis gesprek
      </Link>
    </div>
  );
}
