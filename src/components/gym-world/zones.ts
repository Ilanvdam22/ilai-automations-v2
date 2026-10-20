/**
 * De vijf zones van de 3D-sportschool. Teksten komen uit context/diensten.md,
 * zonder verzonnen resultaten. Coördinaten in meters: x links/rechts, z voor/achter
 * (ingang op z = +6), y omhoog.
 */
export type Vec3 = readonly [number, number, number];

export type Zone = {
  id: string;
  /** Korte naam bij de marker */
  label: string;
  title: string;
  problem: string;
  solution: string;
  /** Anker op /diensten */
  href: string;
  /** Uitleg in stappen, klapt uit in de kaart bij "Bekijk hoe dit werkt" */
  steps: string[];
  /** Waar de marker in 3D staat */
  hotspot: Vec3;
  /** Plek op de plattegrond (x, z) als die afwijkt van de marker, zodat punten niet overlappen */
  mapAt?: readonly [number, number];
  /** Camerapositie en kijkpunt als je naar deze zone vliegt */
  view: { pos: Vec3; look: Vec3 };
};

export const ZONES: Zone[] = [
  {
    id: "receptie",
    label: "Receptie",
    title: "Lead-opvolging",
    problem: "Een aanvraag via je site of Instagram blijft liggen tot jij er tijd voor hebt.",
    solution: "Elke nieuwe aanvraag krijgt binnen 2 minuten automatisch antwoord en staat meteen in je overzicht.",
    href: "/diensten#agents",
    steps: [
      "Er komt een aanvraag binnen via je site, Instagram of een formulier.",
      "Binnen 2 minuten krijgt diegene automatisch een persoonlijk antwoord.",
      "De lead staat meteen in je overzicht, zodat er niets blijft liggen.",
    ],
    hotspot: [-3.9, 1.3, 3.32],
    view: { pos: [-1.6, 1.6, 5.3], look: [-4.3, 1.0, 3.1] },
  },
  {
    id: "telefoon",
    label: "Telefoon",
    title: "WhatsApp agent",
    problem: "Vragen en proefles-aanvragen via WhatsApp beantwoord je pas 's avonds.",
    solution: "De WhatsApp agent reageert automatisch, plant de proefles in en stuurt een herinnering.",
    href: "/diensten#agents",
    steps: [
      "Iemand appt je zaak met een vraag of wil een proefles.",
      "De WhatsApp agent beantwoordt de vraag en stelt een moment voor.",
      "De proefles staat in je agenda en er gaat vanzelf een herinnering uit.",
    ],
    hotspot: [-5.25, 1.45, 3.1],
    mapAt: [-6.4, 4.4],
    view: { pos: [-4.7, 1.55, 4.2], look: [-5.25, 1.22, 3.1] },
  },
  {
    id: "kantoor",
    label: "Kantoor",
    title: "CRM-systeem",
    problem: "Leden en leads staan verspreid over je mail, WhatsApp en losse lijstjes.",
    solution: "Iedereen komt vanzelf in de juiste groep en je ziet in één overzicht wie waar in het traject zit.",
    href: "/diensten#crm-systeem",
    steps: [
      "Je formulieren, mail en WhatsApp worden gekoppeld aan één CRM.",
      "Elke nieuwe lead of klant komt vanzelf in de juiste groep.",
      "Jij ziet in één overzicht wie waar in het traject zit.",
    ],
    hotspot: [-6.3, 1.6, -4.6],
    view: { pos: [-4.4, 1.6, -1.6], look: [-6.3, 1.1, -4.5] },
  },
  {
    id: "tablet",
    label: "Tablet",
    title: "E-mail agent en opvolging",
    problem: "Je inbox loopt vol en na een proefles hoor je vaak niets meer.",
    solution: "De e-mail agent sorteert je mail en zet antwoorden klaar. Na de proefles gaat er vanzelf een bericht uit: hoe vond je de les?",
    href: "/diensten#crm-automatisering",
    steps: [
      "De e-mail agent sorteert je inbox en zet antwoorden voor je klaar.",
      "Jij leest ze na en drukt op verzenden.",
      "Na een proefles gaat er vanzelf een bericht uit: hoe vond je de les?",
    ],
    hotspot: [4.8, 1.68, 4.0],
    view: { pos: [3.2, 1.6, 5.3], look: [4.8, 1.3, 4.0] },
  },
  {
    id: "vloer",
    label: "Trainingsvloer",
    title: "Meer tijd voor je leden",
    problem: "Administratie en opvolging kosten je uren die je liever op de vloer staat.",
    solution: "De andere vier punten draaien op de achtergrond. Jij hebt je tijd terug voor je leden.",
    href: "/diensten#compleet",
    steps: [
      "In een gratis gesprek brengen we in kaart waar jouw tijd in gaat zitten.",
      "Binnen 1 tot 3 weken staan je automatiseringen live.",
      "Alles draait op de achtergrond, jij staat op de vloer.",
    ],
    hotspot: [1.75, 1.7, -3.3],
    view: { pos: [0.4, 2.4, 2.6], look: [1.8, 0.8, -3.4] },
  },
];

/** Startpositie: net binnen, bij de ingang */
export const START_VIEW = { pos: [0, 1.7, 5.6] as Vec3, look: [0, 1.1, -2] as Vec3 };

/** Eindpunt: bovenaanzicht van de hele zaal, als een maquette */
export const END_VIEW = { pos: [1.5, 15, 13] as Vec3, look: [0, 0, -0.6] as Vec3 };

/** De route van de scroll-reis: ingang, de vijf zones, overzicht */
export const STOPS = [START_VIEW, ...ZONES.map((z) => z.view), END_VIEW];

/** Deel van elke stap waarin de camera stilstaat bij een stop (aan beide kanten) */
export const HOLD = 0.22;

/** Afmetingen van de zaal (voor de plattegrond en om binnen de muren te blijven) */
export const ROOM = { minX: -8, maxX: 8, minZ: -6, maxZ: 6, height: 4 } as const;

/** Echte cijfers voor het eindscherm (staan ook elders op de site) */
export const FACTS = [
  { value: "< 2 min", label: "Reactie op een nieuwe lead" },
  { value: "1 tot 3 weken", label: "Tot je automatisering live staat" },
  { value: "45 min", label: "Gratis kennismaking, zonder verplichtingen" },
] as const;
