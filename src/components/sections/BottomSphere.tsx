"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const GenerativeArtScene = dynamic(
  () => import("@/components/ui/anomalous-matter-hero").then((m) => m.GenerativeArtScene),
  { ssr: false }
);

export default function BottomSphere() {
  return (
    <div className="relative w-full h-[520px] bg-[#050508] overflow-hidden">
      {/* Gradient bovenrand zodat het vloeiend aansluit op de content erboven */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#050508] to-transparent z-10 pointer-events-none" />
      <Suspense fallback={<div className="absolute inset-0 bg-[#050508]" />}>
        <GenerativeArtScene />
      </Suspense>
      {/* Gradient onderrand */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#050508] to-transparent z-10 pointer-events-none" />
    </div>
  );
}
