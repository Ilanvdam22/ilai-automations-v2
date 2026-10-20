import { faqs, privacySections, processSteps, services, site } from "@/lib/content";

const list = (items: string[]) => items.map((i) => `- ${i}`).join("\n");

const contactBlock = `- E-mail: ${site.email}
- WhatsApp: ${site.phoneDisplay} (${site.whatsapp})
- Plan een gesprek: ${site.url}/contact
- LinkedIn: ${site.linkedin}
- Instagram: ${site.instagram}`;

const pages: Record<string, string> = {
  "/": `# ${site.name}: ${site.tagline}

${site.description}

Jouw business verdient een team dat nooit stopt. Wij bouwen een AI-workflow die 24/7 voor jou werkt.

## Waarom ${site.name}

- **24/7 automatische opvolging.** Je AI-assistent beantwoordt Instagram-DM's en WhatsApp-berichten dag en nacht. Geen lead gaat meer verloren.
- **Geen no-shows meer.** Slimme reminders en gepersonaliseerde opvolgsequenties halveren je no-show rate, volledig automatisch.
- **Van lead tot klant.** Koude leads worden automatisch opgewarmd en door de funnel begeleid totdat ze betalend klant zijn.

## Diensten

${services.map((s) => `- **${s.title}**: ${s.story.split(". ")[0].replace(/\.$/, "")}.`).join("\n")}

Meer over alle diensten: [${site.url}/diensten](${site.url}/diensten)

## Aan de slag

Plan een gratis kennismaking van 45 minuten via [${site.url}/contact](${site.url}/contact).

## Pagina's

- [Diensten](${site.url}/diensten)
- [Proces](${site.url}/proces)
- [Over ons](${site.url}/over)
- [FAQ](${site.url}/faq)
- [Contact](${site.url}/contact)
- [Privacyverklaring](${site.url}/privacy)
- [llms.txt](${site.url}/llms.txt)
`,

  "/diensten": `# Diensten

Alles wat je nodig hebt om automatisch te groeien. Van eerste DM tot vaste klant. Wij bouwen de systemen die het voor jou regelen, volledig op de achtergrond.

${services
  .map(
    (s) => `## ${s.title}

${s.story}

${list(s.bullets)}

Tools: ${s.tools.join(", ")}`
  )
  .join("\n\n")}

## Voor wie

Onze focus ligt op sportscholen, personal trainers, fysiotherapeuten, yoga- en dansstudio's en coaches. Elk MKB-bedrijf dat leads en opvolging niet meer handmatig wil doen, kan bij ons terecht.

Plan een gesprek: [${site.url}/contact](${site.url}/contact)
`,

  "/proces": `# Ons proces

Van kennismakingsgesprek tot live automatisering in 5 stappen.

${processSteps.map((s, i) => `${i + 1}. **${s.title}.** ${s.description}`).join("\n")}

## Onze garantie

- Gratis kennismakingsgesprek, zonder verplichtingen
- We stoppen pas als jij 100% tevreden bent
- Geen technische kennis vereist van jouw kant
- Transparante prijsopgave, geen verborgen kosten

Plan een gesprek: [${site.url}/contact](${site.url}/contact)
`,

  "/over": `# Over ${site.name}

${site.name} bouwt op maat gemaakte automatiseringen voor MKB-bedrijven, met een startfocus op de bewegings- en sportsector. Het bedrijf is opgericht in april 2026 door Ilan van Dam en gevestigd in ${site.city}. Ilan doet alles zelf: gesprek, bouw, oplevering en nazorg.

## Onze missie

Elke ondernemer verdient meer tijd voor zijn bedrijf, niet voor zijn inbox. Ondernemers die hun bedrijf laten groeien, moeten niet vastzitten aan administratie en opvolging. Wij nemen dat over, met AI die nooit slaapt, nooit vergeet en altijd op tijd reageert.

## In cijfers

- Minder dan 2 minuten reactietijd op een nieuwe lead
- 24/7 actief, ook in het weekend
- 5 stappen van gesprek tot live automatisering

## Hoe we werken

- 24/7 beschikbaar, ook in het weekend
- Gebouwd op bewezen tools: GoHighLevel, n8n, Make
- Geen technische kennis vereist van jouw kant

## Bedrijfsgegevens

- Handelsnaam: ${site.name}
- Vestigingsplaats: ${site.city}
- BTW-nummer: ${site.vat}

${contactBlock}
`,

  "/faq": `# Veelgestelde vragen

${faqs.map((f) => `## ${f.question}\n\n${f.answer}`).join("\n\n")}

Staat je vraag er niet bij? Stuur een bericht via WhatsApp (${site.whatsapp}) of e-mail (${site.email}). We reageren dezelfde dag.
`,

  "/contact": `# Contact en booking

Plan een gratis strategiegesprek van 45 minuten. We bespreken wat automatisering voor jouw business kan doen. Geen verplichtingen, geen verkoopgesprek, puur strategisch.

Het boekingsformulier staat op [${site.url}/contact](${site.url}/contact).

## Direct contact

${contactBlock}

## Bedrijfsgegevens

- ${site.name}, ${site.city}, Nederland
- BTW-nummer: ${site.vat}
`,

  "/privacy": `# Privacyverklaring

${privacySections.map((s) => `## ${s.title}\n\n${s.paragraphs.join("\n\n")}`).join("\n\n")}
`,

  "/outreach-policy": `# E-mail- en outreachbeleid

${site.name} is een eenmanszaak in ${site.city} (BTW-nummer ${site.vat}). Dit beleid beschrijft hoe wij zakelijke e-mailoutreach doen, hoe je je afmeldt en hoe we gegevens verwerken.

- Wij gebruiken uitsluitend zakelijke contactgegevens, uitsluitend voor zakelijke outreach.
- Je kunt je altijd afmelden of laten verwijderen via ${site.email}. We verwijderen je dan uit onze verzendlijst.
- Wij verkopen of delen deze gegevens niet met derden.

Het volledige beleid staat op [${site.url}/outreach-policy](${site.url}/outreach-policy). Zie ook de [privacyverklaring](${site.url}/privacy).
`,
};

export function normalizePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

export function getMarkdown(pathname: string): string | null {
  return pages[normalizePath(pathname)] ?? null;
}

export function notFoundMarkdown(pathname: string): string {
  return `# 404: pagina niet gevonden

De pagina \`${pathname}\` bestaat niet op ${site.url}. Controleer het adres, of gebruik een van deze overzichten om te vinden wat je zoekt:

- [Sitemap](${site.url}/sitemap.xml)
- [llms.txt](${site.url}/llms.txt) met een samenvatting van de site en wanneer je ${site.name} inschakelt
- [Diensten](${site.url}/diensten)
- [Contact](${site.url}/contact)
`;
}

export const markdownPaths = Object.keys(pages);
