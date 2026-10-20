export type ServiceContent = {
  /** Anker op /diensten, ook gebruikt voor links vanaf de homepage. */
  slug: string;
  title: string;
  story: string;
  bullets: string[];
  tools: string[];
  image: string;
};

export const services: ServiceContent[] = [
  {
    slug: "agents",
    title: "E-mail agent & WhatsApp agent",
    story:
      "De communicatie werkt voor je in plaats van andersom. Je WhatsApp agent reageert direct op binnenkomende berichten en je e-mail agent sorteert je inbox en zet concept-antwoorden voor je klaar. Geen enkele proefles-aanvraag of vraag blijft meer liggen.",
    bullets: [
      "WhatsApp agent reageert automatisch op binnenkomende berichten",
      "E-mail agent categoriseert mail en zet concept-antwoorden klaar",
      "Geen proefles-aanvraag of vraag blijft nog liggen",
    ],
    tools: ["WhatsApp", "E-mail", "n8n"],
    image: "/images/pilaar-agent.jpg",
  },
  {
    slug: "crm-systeem",
    title: "CRM-systeem",
    story:
      "Klanten en deals komen vanzelf op de juiste plek, zonder handmatige invoer. Je ziet in één overzicht wie waar in het traject zit, en je formulieren, mail en WhatsApp zijn eraan gekoppeld.",
    bullets: [
      "Klanten automatisch in groepen",
      "Overzicht van wie waar in het traject zit",
      "Koppeling met formulieren, mail en WhatsApp",
    ],
    tools: ["GoHighLevel", "Make", "n8n"],
    image: "/images/pilaar-crm.jpg",
  },
  {
    slug: "crm-automatisering",
    title: "CRM-automatisering",
    story:
      "Opvolging en herinneringen lopen vanzelf. Een nieuwe afspraak wordt automatisch gemeld en bijgeschreven, klanten krijgen een herinnering en na de proefles volgt automatisch een bericht om te horen hoe ze het vonden.",
    bullets: [
      "Nieuwe afspraak wordt automatisch gemeld en bijgeschreven",
      "Herinneringen voor afspraken",
      "Follow-ups na de proefles, zoals het bericht \"Hoe vond je de les?\"",
    ],
    tools: ["GoHighLevel", "Make", "n8n"],
    image: "/images/pilaar-automatisering.jpg",
  },
  {
    slug: "outreach",
    title: "Outreach",
    story:
      "Er blijven continu nieuwe aanvragen binnenkomen. We zetten gepersonaliseerde e-mails en LinkedIn-berichten voor je op, met de volgorde en timing automatisch geregeld.",
    bullets: [
      "Gepersonaliseerde e-mails en LinkedIn-berichten",
      "Opgezet met Smartlead en Heyreach",
      "Volgorde en timing automatisch geregeld",
    ],
    tools: ["Smartlead", "Heyreach", "LinkedIn"],
    image: "/images/pilaar-outreach.jpg",
  },
  {
    slug: "compleet",
    title: "Complete bedrijfsautomatisering",
    story:
      "Alles hierboven, samen met de rest van je repetitieve taken, draait op de achtergrond. We brengen je handmatige werk in kaart, automatiseren het en sluiten al je systemen op elkaar aan. Zo maken we je bedrijf compleet AI-proof.",
    bullets: [
      "Herhalende handmatige taken in kaart gebracht en geautomatiseerd",
      "Alle systemen (mail, CRM, WhatsApp, outreach) op elkaar aangesloten",
      "Bedrijf compleet AI-proof",
    ],
    tools: ["n8n", "Make", "Claude"],
    image: "/images/pilaar-compleet.jpg",
  },
];

export const processSteps = [
  {
    title: "Kennismakingsgesprek",
    description:
      "We plannen een gratis gesprek om jouw situatie te begrijpen. Waar lopen leads vast? Welke opvolging kost jou de meeste tijd? Na dit gesprek weten we precies wat we gaan automatiseren.",
  },
  {
    title: "Automatisering op maat bouwen",
    description:
      "Wij bouwen de flows volledig op jouw wensen: DM-assistent, intake-opvolging, onboarding. Jij hoeft niks te doen. Wij houden je op de hoogte van de voortgang.",
  },
  {
    title: "Review-call",
    description:
      "We lopen samen door de gebouwde automatisering. Werkt alles zoals jij het wilt? Je ziet precies wat er gebeurt en waar je eventueel nog iets anders wilt.",
  },
  {
    title: "Laatste aanpassingen",
    description:
      "Op basis van jouw feedback passen we de flows aan totdat alles precies goed is. We stoppen pas als jij tevreden bent.",
  },
  {
    title: "Live zetten & genieten",
    description:
      "Alles wordt geactiveerd en getest. Vanaf nu werkt jouw bedrijf ook als jij er niet bij bent. Leads worden opgevolgd, afspraken ingeboekt, nieuwe klanten verwelkomd.",
  },
];

export const faqs = [
  {
    question: "Wat kost een automatisering?",
    answer:
      "De prijs hangt af van de scope en complexiteit. Na het kennismakingsgesprek ontvang je een transparante prijsopgave. Geen verborgen kosten, geen verrassingen achteraf.",
  },
  {
    question: "Hoe lang duurt het om alles op te zetten?",
    answer:
      "De eerste automatiseringen staan meestal binnen 1 tot 3 weken live. In de eerste maand bouwen we het complete systeem, daarna verbeteren we het doorlopend. We houden je tijdens het hele proces op de hoogte.",
  },
  {
    question: "Heb ik technische kennis nodig om dit te gebruiken?",
    answer:
      "Nee. Wij regelen alles technisch van A tot Z. Jij hoeft alleen te vertellen wat je wilt bereiken, wij zorgen dat het werkt.",
  },
  {
    question: "Werkt dit ook voor kleine bedrijven?",
    answer:
      "Absoluut. Onze focus ligt op sportscholen, personal trainers en fysiotherapeuten, maar we werken voor elk MKB-bedrijf. Juist voor solo-ondernemers en kleine teams is automatisering het meest waardevol. Het geeft jou je tijd terug.",
  },
  {
    question: "Wat als de automatisering niet doet wat ik wil?",
    answer:
      "We blijven aanpassen totdat het werkt zoals jij het wilt. De review-call en aanpassingsfase zijn standaard inbegrepen. Wij stoppen pas als jij tevreden bent.",
  },
  {
    question: "Welke tools gebruiken jullie en moet ik die zelf aanschaffen?",
    answer:
      "We werken met GoHighLevel, n8n en Make. We adviseren je welke tools je nodig hebt, helpen bij het aanmaken van accounts en regelen alle technische koppelingen.",
  },
  {
    question: "Zijn mijn klantgegevens veilig? (AVG/GDPR)",
    answer:
      "Ja. We werken uitsluitend met AVG-conforme tools en verwerken geen klantdata buiten de EU zonder expliciete toestemming. Privacy staat bij ons voorop.",
  },
  {
    question: "Kan ik de automatisering later uitbreiden?",
    answer:
      "Ja. We bouwen modulair, zodat je eenvoudig nieuwe flows kunt toevoegen naarmate je bedrijf groeit. Je begint klein en schaalt op wanneer jij dat wilt.",
  },
  {
    question: "Hoe lang loopt een traject?",
    answer:
      "Een traject loopt zes maanden. In de eerste maand bouwen we alles, daarna verbeteren we het doorlopend. Aan het einde evalueren we samen of je verlengt. Er is geen automatische verlenging.",
  },
];

export const site = {
  name: "ILAI Automations",
  url: "https://www.ilaiautomations.com",
  email: "info@ilaiautomations.nl",
  phone: "+31686377856",
  phoneDisplay: "+31 6 86377856",
  whatsapp: "https://wa.me/31686377856",
  linkedin: "https://www.linkedin.com/company/ilai-automations/",
  instagram: "https://www.instagram.com/ilai.automations/",
  city: "Den Helder",
  vat: "NL005465836B32",
  founded: "2026-04",
  tagline: "AI-automatisering voor MKB en sport",
  description:
    "Wij automatiseren je leads, opvolging, CRM en outreach met AI. Nooit meer een aanvraag missen, nooit meer handmatige follow-up. Voor MKB-bedrijven, met focus op sportscholen, PT'ers en fysiotherapeuten.",
};

export const privacySections: { title: string; paragraphs: string[] }[] = [
  {
    title: "Wie we zijn",
    paragraphs: [
      "ILAI Automations is een eenmanszaak gevestigd in Den Helder (BTW-nummer NL005465836B32), opgericht door Ilan van Dam. Wij zijn verantwoordelijk voor de verwerking van persoonsgegevens zoals beschreven in deze privacyverklaring. Voor vragen kun je terecht op info@ilaiautomations.nl.",
    ],
  },
  {
    title: "Welke gegevens we verwerken",
    paragraphs: [
      "Als je contact met ons opneemt of een gesprek inplant, verwerken we je naam, e-mailadres, telefoonnummer, bedrijfsnaam en wat je ons zelf vertelt over je vraag. Voor zakelijke outreach gebruiken we zakelijke contactgegevens zoals naam, bedrijfsnaam, functie en zakelijk e-mailadres. Als we een automatisering voor je bouwen, verwerken we in jouw opdracht de gegevens van jouw klanten en leads. In dat geval zijn wij verwerker en ben jij verantwoordelijk, en leggen we dat vast in een verwerkersovereenkomst.",
    ],
  },
  {
    title: "Waarvoor we ze gebruiken",
    paragraphs: [
      "We gebruiken je gegevens om je vraag te beantwoorden, een gesprek in te plannen, een voorstel te maken, een opdracht uit te voeren en te factureren, en om je zakelijk te benaderen over onze diensten. De grondslagen zijn de uitvoering van een overeenkomst, een wettelijke verplichting (zoals de administratie) en ons gerechtvaardigd belang bij zakelijke acquisitie. Je kunt je altijd afmelden voor outreach. Zie ons outreachbeleid.",
    ],
  },
  {
    title: "Met wie we gegevens delen",
    paragraphs: [
      "Wij verkopen je gegevens niet. We gebruiken zorgvuldig gekozen tools om ons werk te doen, zoals GoHighLevel (agenda en CRM), n8n en Make (automatisering), Google Workspace (e-mail en documenten) en mailsoftware voor outreach. Met deze partijen sluiten we waar nodig verwerkersovereenkomsten. We verwerken geen klantdata buiten de EU zonder passende waarborgen of expliciete toestemming.",
    ],
  },
  {
    title: "Hoe lang we gegevens bewaren",
    paragraphs: [
      "We bewaren gegevens niet langer dan nodig is voor het doel waarvoor we ze verzamelden. Contactverzoeken bewaren we maximaal twaalf maanden, tenzij er een opdracht uit voortkomt. Facturen en administratie bewaren we zeven jaar, zoals de fiscale wetgeving vraagt. Gegevens uit outreach verwijderen we op verzoek of zodra ze niet meer actueel zijn.",
    ],
  },
  {
    title: "Cookies",
    paragraphs: [
      "We gebruiken geen advertentiecookies. Alleen als je daar in de cookiemelding toestemming voor geeft, gebruiken we Google Analytics om te zien hoe bezoekers de site gebruiken (welke pagina's, hoe lang, vanaf welk apparaat). Zonder toestemming laden we Analytics niet. Je kunt je keuze altijd wijzigen via 'Cookie-instellingen' onderaan elke pagina. Het boekingsformulier op de contactpagina wordt geleverd door GoHighLevel en kan functionele cookies plaatsen die nodig zijn om een afspraak in te plannen.",
    ],
  },
  {
    title: "Jouw rechten",
    paragraphs: [
      "Je hebt het recht om je gegevens in te zien, te laten corrigeren, te laten verwijderen, de verwerking te beperken, bezwaar te maken en je gegevens mee te nemen. Mail ons op info@ilaiautomations.nl en we reageren binnen vier weken. Kom je er niet uit met ons, dan kun je een klacht indienen bij de Autoriteit Persoonsgegevens.",
    ],
  },
];
