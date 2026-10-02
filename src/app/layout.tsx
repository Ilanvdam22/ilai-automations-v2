import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import MotionProvider from "@/components/layout/MotionProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const title = "ILAI Automations | AI-automatisering voor MKB en sport";
const description =
  "Wij automatiseren je leads, opvolging, CRM en outreach met AI. Nooit meer een aanvraag missen, nooit meer handmatige follow-up. Voor MKB-bedrijven, met focus op sportscholen, PT'ers en fysiotherapeuten.";

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
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: "ILAI Automations",
    title,
    description,
    images: [{ url: "/images/hero-stad.jpg", width: 2560, height: 1440, alt: "ILAI Automations" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/hero-stad.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans`}
      >
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
