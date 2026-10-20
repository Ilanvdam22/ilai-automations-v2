"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Diensten", href: "/diensten" },
  { label: "Proces", href: "/proces" },
  { label: "Over", href: "/over" },
  { label: "FAQ", href: "/faq" },
];

/**
 * Klein menu: links de pagina's, in het midden de naam, rechts de knop.
 * `overlay` is voor de homepage (geen achtergrond, de 3D-wereld loopt eronder door);
 * met `solid` krijgt hij toch een achtergrond, zodra je voorbij de 3D-reis scrolt.
 */
export default function Navbar({ overlay = false, solid = false }: { overlay?: boolean; solid?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Menu dicht bij navigeren, en geen scrollen achter het open menu
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 ${overlay && !solid ? "" : "border-b border-white/10 bg-black"}`}
    >
      <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center px-6 text-sm sm:px-10">
        <nav aria-label="Hoofdmenu" className="justify-self-start">
          <ul className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={active ? "text-white underline underline-offset-[6px]" : "text-white/75 hover:text-white"}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            className="text-white md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobiel-menu"
          >
            {menuOpen ? "Sluiten" : "Menu"}
          </button>
        </nav>

        <Link href="/" className="font-heading font-semibold tracking-[-0.01em] text-white">
          ILAI Automations
        </Link>

        <Link href="/contact" className="justify-self-end bg-accent px-3.5 py-1.5 font-medium text-black hover:bg-white">
          Gesprek
        </Link>
      </div>

      {menuOpen && (
        <nav id="mobiel-menu" aria-label="Mobiel menu" className="fixed inset-x-0 bottom-0 top-16 z-50 bg-black px-6 pt-8 md:hidden">
          <ul className="flex flex-col">
            {[{ label: "Home", href: "/" }, ...navLinks, { label: "Contact", href: "/contact" }].map((link) => (
              <li key={link.href} className="border-b border-white/10">
                <Link href={link.href} className="block py-4 font-heading text-2xl font-semibold text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
