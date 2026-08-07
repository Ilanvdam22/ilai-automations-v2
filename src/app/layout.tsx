import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "ILAI Automations | AI-automatisering voor B2B-bedrijven",
  description:
    "Wij automatiseren je leads, opvolging en outreach met AI. Nooit meer een aanvraag missen, nooit meer handmatige follow-up. Voor bedrijven die willen groeien zonder extra personeel.",
  keywords: ["AI automatisering", "B2B", "leadopvolging", "cold outreach", "WhatsApp automatisering", "GHL", "GoHighLevel", "leads", "n8n"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
