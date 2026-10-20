import { site } from "@/lib/content";

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
  "@id": `${site.url}/#organization`,
  name: site.name,
  url: site.url,
  description: site.description,
  image: `${site.url}/opengraph-image`,
  logo: `${site.url}/opengraph-image`,
  email: site.email,
  telephone: site.phone,
  vatID: site.vat,
  foundingDate: site.founded,
  founder: { "@type": "Person", name: "Ilan van Dam" },
  address: {
    "@type": "PostalAddress",
    addressLocality: site.city,
    addressRegion: "Noord-Holland",
    addressCountry: "NL",
  },
  geo: { "@type": "GeoCoordinates", latitude: 52.9563, longitude: 4.7608 },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: site.email,
    telephone: site.phone,
    availableLanguage: ["nl"],
    areaServed: "NL",
  },
  areaServed: [
    { "@type": "City", name: site.city },
    { "@type": "Country", name: "Nederland" },
  ],
  knowsAbout: [
    "AI-automatisering",
    "WhatsApp-automatisering",
    "CRM-automatisering",
    "Leadopvolging",
    "E-mailoutreach",
  ],
  sameAs: [site.linkedin, site.instagram],
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  name: site.name,
  url: site.url,
  inLanguage: "nl-NL",
  publisher: { "@id": `${site.url}/#organization` },
};

/** Kruimelpad voor een subpagina, bijvoorbeeld [{ name: "Diensten", path: "/diensten" }]. */
export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: `${site.url}${item.path === "/" ? "" : item.path}`,
  })),
});

export const faqJsonLd = (list: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: list.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
});

export const serializeJsonLd = (data: object) => JSON.stringify(data).replace(/</g, "\\u003c");
