import type { Metadata } from "next";
import Script from "next/script";
import Page from "@/components/site/Page";
import { body, container, h1, textLink } from "@/components/site/ui";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact & Booking | ILAI Automations",
  description: "Plan een gratis strategiegesprek met ILAI Automations.",
};

export default function ContactPage() {
  return (
    <Page crumbs={[{ name: "Contact", path: "/contact" }]} cta={false}>
      <div className={`${container} grid gap-16 pb-24 pt-8 lg:grid-cols-[22rem_1fr]`}>
        <div>
          <h1 className={h1}>Plan een gesprek</h1>
          <p className={`${body} mt-8 text-lg`}>
            Kies een moment dat je uitkomt. We bespreken in 45 minuten wat automatisering voor jouw business kan doen.
          </p>
          <p className="mt-6 font-medium text-white">We reageren dezelfde dag op je bericht.</p>


          <ul className="mt-10 space-y-3 border-t border-white/10 pt-8">
            <li>
              <a href={`mailto:${site.email}`} className={textLink}>
                {site.email}
              </a>
            </li>
            <li>
              <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className={textLink}>
                {site.phoneDisplay} (WhatsApp)
              </a>
            </li>
            <li>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={textLink}>
                LinkedIn
              </a>
            </li>
            <li>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className={textLink}>
                @ilai.automations
              </a>
            </li>
          </ul>

          <p className={`${body} mt-10 border-t border-white/10 pt-8`}>Geen verplichtingen. Geen verkoopgesprek. Puur strategisch.</p>
        </div>

        {/* Agenda van GoHighLevel. Na het boeken stuurt GoHighLevel door naar /bedankt (instellen in de widget). */}
        <div className="w-full">
          <iframe
            title="Plan een gesprek met ILAI Automations"
            src="https://api.leadconnectorhq.com/widget/booking/OWYzthi7EWvVPaMHvHn0"
            style={{
              width: "100%",
              minHeight: "700px",
              border: "none",
              overflow: "hidden",
              filter: "invert(1) hue-rotate(180deg) brightness(0.88) contrast(0.95)",
            }}
            scrolling="no"
            id="OWYzthi7EWvVPaMHvHn0_1780761456567"
          />
        </div>
      </div>
      <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="lazyOnload" />
    </Page>
  );
}
