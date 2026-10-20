import type { Metadata } from "next";
import { Schibsted_Grotesk, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import MotionProvider from "@/components/layout/MotionProvider";
import Consent from "@/components/site/Consent";
import "./globals.css";

// Koppen en lopende tekst in twee verschillende, niet-standaard groteske letters
const heading = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-heading",
});
const body = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

const title = "ILAI Automations | AI-automatisering voor MKB en sport";
const description =
  "Wij automatiseren je leads, opvolging, CRM en outreach met AI. Nooit meer een aanvraag missen, nooit meer handmatige follow-up. Voor MKB-bedrijven, met focus op sportscholen, PT'ers en fysiotherapeuten.";

// Het deelplaatje komt uit src/app/opengraph-image.tsx (Next pakt dat vanzelf op)
export const metadata: Metadata = {
  metadataBase: new URL("https://www.ilaiautomations.com"),
  title,
  description,
  keywords: [
    "AI automatisering",
    "MKB",
    "sportschool automatisering",
    "personal trainer",
    "fysiotherapie",
    "leadopvolging",
    "WhatsApp automatisering",
    "CRM automatisering",
    "GoHighLevel",
    "n8n",
  ],
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: "ILAI Automations",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className="dark">
      <body className={`${heading.variable} ${body.variable} ${mono.variable} font-sans`}>
        <MotionProvider>{children}</MotionProvider>
        <Consent />
      </body>
    </html>
  );
}
