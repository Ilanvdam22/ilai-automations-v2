import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ILAI Automations | AI-automatisering voor de bewegingssector",
  description:
    "Wij automatiseren je leads, intake en opvolging met AI. Nooit meer een aanvraag missen. Voor sportscholen, personal trainers, fysiotherapeuten, yogastudio's en meer.",
  keywords: ["AI automatisering", "bewegingssector", "personal trainer", "fysiotherapeut", "sportschool", "GHL", "GoHighLevel", "leads", "n8n"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className="dark">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
