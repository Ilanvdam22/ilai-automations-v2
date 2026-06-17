"use client";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const MatterOrbLight = dynamic(() => import("@/components/ui/matter-orb-light"), { ssr: false });

export default function SubpageSphere() {
  const pathname = usePathname();
  // Alleen zichtbaar op subpagina's, niet op de homepage
  if (pathname === "/") return null;

  return (
    <div
      className="fixed bottom-0 right-0 pointer-events-none hidden lg:block"
      style={{ zIndex: 1, transform: "translateY(25%)", opacity: 0.55 }}
    >
      <Suspense fallback={null}>
        <MatterOrbLight />
      </Suspense>
    </div>
  );
}
