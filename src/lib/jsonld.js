// Structured-data graph. One Organization node (#org) is referenced by every
// page; systems are SoftwareApplication nodes; the status vocabulary is a
// DefinedTermSet so answer engines read "pre-deployment" consistently.

export function orgNode(f) {
  return {
    "@type": "Organization",
    "@id": f.org.url + "/#org",
    name: f.org.legalName,
    legalName: f.org.legalName,
    alternateName: [
      f.org.shortName,
      f.org.fullName,
      "SIGIL Labs",
      "SIGIL Sovereign",
      "sigilsovereign"
    ],
    description: f.org.definition,
    disambiguatingDescription: f.org.disambiguation,
    url: f.org.url,
    logo: { "@type": "ImageObject", url: f.org.url + "/logo.png", width: 512, height: 512 },
    image: f.org.url + "/og-image.png",
    email: f.org.email,
    telephone: f.org.phone,
    foundingDate: f.org.foundedYear,
    foundingLocation: { "@type": "Place", name: "Buea, Cameroon", address: { "@type": "PostalAddress", addressLocality: "Buea", addressCountry: "CM" } },
    areaServed: { "@type": "Country", name: "Cameroon" },
    ...(f.org.rccm ? { identifier: { "@type": "PropertyValue", propertyID: "RCCM", name: "Registre du Commerce et du Crédit Mobilier", value: f.org.rccm } } : {}),
    ...(Array.isArray(f.org.sameAs) && f.org.sameAs.length ? { sameAs: f.org.sameAs } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Buea",
      addressCountry: "CM"
    },
    founder: {
      "@type": "Person",
      "@id": f.org.founderId,
      name: f.org.founderName,
      jobTitle: f.org.founderRole,
      url: "https://thuramnana.com/",
      worksFor: { "@id": f.org.url + "/#org" }
    },
    contactPoint: [
      { "@type": "ContactPoint", contactType: "institutional", email: f.org.email, telephone: f.org.phone, availableLanguage: ["English", "French"] }
    ],
    knowsAbout: [
      "sovereign governance infrastructure",
      "GovTech (government technology)",
      "RegTech (regulatory technology)",
      "digital sovereignty",
      "beneficial ownership registries",
      "FATF Recommendation 24",
      "FATF Recommendation 25",
      "Beneficial Ownership Data Standard (BODS)",
      "public procurement integrity",
      "anti-corruption intelligence",
      "United Nations Convention Against Corruption (UNCAC)",
      "Open Contracting Data Standard (OCDS)",
      "governed cybersecurity",
      "cryptographic proof of finding",
      "sovereign digital infrastructure for public institutions"
    ]
  };
}

export function systemNode(f, sys, lang) {
  const L = sys[lang];
  return {
    "@type": "SoftwareApplication",
    "@id": f.org.url + "/systems/" + sys.slug + "/#app",
    name: sys.name,
    applicationCategory: sys.category,
    operatingSystem: "Linux",
    description: L.answer,
    provider: { "@id": f.org.url + "/#org" },
    inLanguage: lang,
    featureList: L.standards,
    additionalProperty: [
      { "@type": "PropertyValue", name: "status", value: sys.status },
      { "@type": "PropertyValue", name: "source code", value: sys.code_visibility === "private" ? "kept strictly private" : "available" }
    ]
  };
}

export function websiteNode(f, lang) {
  return {
    "@type": "WebSite",
    "@id": f.org.url + "/#website",
    url: f.org.url,
    name: f.org.legalName,
    inLanguage: lang,
    publisher: { "@id": f.org.url + "/#org" }
  };
}

export function webPageNode(f, p) {
  return {
    "@type": "WebPage",
    "@id": f.org.url + p.path + "#webpage",
    url: f.org.url + p.path,
    name: p.title,
    description: p.description,
    inLanguage: p.lang,
    isPartOf: { "@id": f.org.url + "/#website" },
    about: { "@id": f.org.url + "/#org" },
    primaryImageOfPage: { "@type": "ImageObject", url: f.org.url + "/og-image.png", width: 1200, height: 630 },
    datePublished: p.datePublished || f.org.sitePublished,
    dateModified: p.dateModified
  };
}

export function breadcrumb(f, trail) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: f.org.url + t.path
    }))
  };
}

export function statusTerms(f) {
  const set = f.org.url + "/#status-vocabulary";
  const terms = [
    ["Design", "Requirements and architecture defined; not yet built."],
    ["Build", "Under active construction."],
    ["Pre-deployment", "Built and internally verified; not yet deployed with an institution."],
    ["Pilot", "Running with an institution under a bounded, agreed pilot."],
    ["Production", "Operating as a live institutional deployment."]
  ];
  return {
    "@type": "DefinedTermSet",
    "@id": set,
    name: "SIGIL system status vocabulary",
    hasDefinedTerm: terms.map(([n, d]) => ({
      "@type": "DefinedTerm", name: n, description: d, inDefinedTermSet: set
    }))
  };
}

export function faqNode(items) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: q.q,
      acceptedAnswer: { "@type": "Answer", text: q.a }
    }))
  };
}

export function articleNode(f, note, lang) {
  return {
    "@type": "TechArticle",
    "@id": f.org.url + note.path + "#article",
    headline: note.title,
    description: note.abstract,
    inLanguage: lang,
    datePublished: note.date,
    dateModified: note.modified || note.date,
    author: { "@type": "Person", "@id": f.org.founderId, name: f.org.founderName, url: "https://thuramnana.com/" },
    publisher: { "@id": f.org.url + "/#org" },
    isPartOf: { "@id": f.org.url + "/#website" },
    mainEntityOfPage: f.org.url + note.path
  };
}

// Wrap a set of nodes as a single @graph document.
export function graph(nodes) {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes.filter(Boolean) });
}
