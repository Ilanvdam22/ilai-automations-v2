"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Diensten", href: "/diensten" },
  { label: "Proces", href: "/proces" },
  { label: "Over ons", href: "/over" },
  { label: "FAQ", href: "/faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050508]/80 backdrop-blur-md border-b border-[#00d4ff]/20 shadow-[0_0_20px_rgba(0,212,255,0.05)]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-baseline gap-1.5">
          <span className="font-heading font-medium text-2xl text-[#00d4ff] uppercase tracking-wide glow-text">
            ILAI
          </span>
          <span className="font-mono text-[10px] text-slate-400 font-light tracking-widest uppercase">
            Automations
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-mono text-xs uppercase tracking-widest transition-colors duration-200 relative group ${
                  isActive ? "text-[#00d4ff]" : "text-slate-400 hover:text-white"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#00d4ff]"
                  />
                )}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="font-mono text-xs uppercase tracking-widest font-semibold bg-[#00d4ff] text-black px-5 py-2 rounded-full hover:bg-[#00d4ff]/90 transition-all duration-200 glow-blue"
          >
            Plan een gesprek
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-slate-400 hover:text-white transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Menu sluiten" : "Menu openen"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#050508]/95 backdrop-blur-md border-b border-[#00d4ff]/20 px-4 pb-6 pt-2"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`py-3 border-b border-white/5 font-mono text-xs uppercase tracking-widest transition-colors ${
                      isActive ? "text-[#00d4ff] font-semibold" : "text-slate-300 hover:text-white"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/contact"
                className="font-mono text-xs uppercase tracking-widest font-semibold bg-[#00d4ff] text-black px-5 py-3 rounded-full text-center hover:bg-[#00d4ff]/90 transition-all duration-200 mt-3"
                onClick={() => setMenuOpen(false)}
              >
                Plan een gesprek
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
