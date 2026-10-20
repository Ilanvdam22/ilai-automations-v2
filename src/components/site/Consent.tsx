"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";

/**
 * Cookiemelding met Google Analytics. Analytics laadt pas na "Akkoord"; bij
 * "Weigeren" of zonder keuze wordt er niets van Google ingeladen. De keuze
 * staat in localStorage en is te wijzigen via "Cookie-instellingen" in de footer
 * (die stuurt het event `ilai:consent-open`).
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-WMVEEKS2GK";
const KEY = "ilai-consent";
type Choice = "granted" | "denied" | null;

function readChoice(): Choice {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export default function Consent() {
  const [choice, setChoice] = useState<Choice>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const c = readChoice();
    setChoice(c);
    setOpen(c === null);
    const reopen = () => setOpen(true);
    window.addEventListener("ilai:consent-open", reopen);
    return () => window.removeEventListener("ilai:consent-open", reopen);
  }, []);

  const decide = (c: Exclude<Choice, null>) => {
    try {
      window.localStorage.setItem(KEY, c);
    } catch {
      /* geen opslag beschikbaar: keuze geldt alleen voor dit bezoek */
    }
    // Weigeren na eerder akkoord: Analytics direct uitzetten voor de rest van het bezoek
    if (c === "denied" && typeof window !== "undefined") {
      (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = true;
    }
    setChoice(c);
    setOpen(false);
  };

  return (
    <>
      {choice === "granted" && GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
          </Script>
        </>
      )}

      {open && (
        <div
          role="dialog"
          aria-label="Cookie-instellingen"
          className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/20 bg-black px-6 py-5 text-white sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-w-sm sm:border"
        >
          <p className="text-sm leading-relaxed text-white/80">
            We gebruiken Google Analytics om te zien hoe de site gebruikt wordt. Alleen als je akkoord geeft.{" "}
            <Link href="/privacy" className="text-white underline underline-offset-4 hover:text-accent">
              Privacy
            </Link>
          </p>
          <div className="mt-4 flex gap-3">
            <button type="button" onClick={() => decide("granted")} className="bg-accent px-4 py-2 text-sm font-medium text-black hover:bg-white">
              Akkoord
            </button>
            <button type="button" onClick={() => decide("denied")} className="border border-white/30 px-4 py-2 text-sm text-white hover:border-white">
              Weigeren
            </button>
          </div>
        </div>
      )}
    </>
  );
}
