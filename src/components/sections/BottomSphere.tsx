"use client";
import Image from "next/image";
import OrbitingCirclesGlobe from "@/components/ui/orbiting-circles-02";

export default function BottomSphere() {
  return (
    <div className="relative w-full h-[520px] bg-[#050508] overflow-hidden flex items-center justify-center">
      <Image
        src="/images/haven.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-75 pointer-events-none select-none"
      />
      {/* Gradient bovenrand zodat het vloeiend aansluit op de content erboven */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#050508] to-transparent z-10 pointer-events-none" />
      <OrbitingCirclesGlobe />
      {/* Gradient onderrand */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#050508] to-transparent z-10 pointer-events-none" />
    </div>
  );
}
