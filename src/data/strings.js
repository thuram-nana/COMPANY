// UI chrome strings by language. Page body copy lives in the page modules;
// this is the shared frame (nav, footer, controls, recurring labels).

export const strings = {
  en: {
    htmlLang: "en",
    dir: "ltr",
    skip: "Skip to content",
    nav: {
      systems: "Systems",
      doctrine: "How we build",
      record: "Record",
      trust: "Trust",
      company: "Company",
      notes: "Notes",
      contact: "Contact"
    },
    theme: { dark: "Dark", light: "Light" },
    langName: "Français",
    langBanner: { text: "This page is available in French.", view: "Voir en français", dismiss: "Stay in English" },
    briefing: "Request a briefing",
    footer: {
      tagline: "Sovereign governance infrastructure. The institution holds the keys; the data stays under the institution’s control; every consequential action is authorized, bounded, and proven.",
      systems: "Systems",
      company: "Company",
      resources: "Resources",
      security: "Security",
      privacy: "Privacy",
      mentions: "Legal notice",
      rights: "All rights reserved.",
      controlled: "Sovereign infrastructure · Buea, Cameroon",
      whichSigil: "Which Sigil?",
      govtechHub: "GovTech in Cameroon",
      regtechHub: "RegTech in Cameroon",
      glossary: "Glossary"
    },
    on_this: "On this page",
    status_label: "Status",
    read_more: "Read"
  },
  fr: {
    htmlLang: "fr",
    dir: "ltr",
    skip: "Aller au contenu",
    nav: {
      systems: "Systèmes",
      doctrine: "Notre méthode",
      record: "Références",
      trust: "Confiance",
      company: "Entreprise",
      notes: "Notes",
      contact: "Contact"
    },
    theme: { dark: "Sombre", light: "Clair" },
    langName: "English",
    langBanner: { text: "Cette page est disponible en anglais.", view: "View in English", dismiss: "Rester en français" },
    briefing: "Demander une présentation",
    footer: {
      tagline: "Infrastructure de gouvernance souveraine. L’institution détient les clés ; les données restent sous le contrôle de l’institution ; chaque action conséquente est autorisée, bornée et prouvée.",
      systems: "Systèmes",
      company: "Entreprise",
      resources: "Ressources",
      security: "Sécurité",
      privacy: "Confidentialité",
      mentions: "Mentions légales",
      rights: "Tous droits réservés.",
      controlled: "Infrastructure souveraine · Buea, Cameroun",
      whichSigil: "Quel Sigil ?",
      govtechHub: "GovTech au Cameroun",
      regtechHub: "RegTech au Cameroun",
      glossary: "Glossaire"
    },
    on_this: "Sur cette page",
    status_label: "Statut",
    read_more: "Lire"
  }
};

// Localised path map: same page, both language trees.
export const routes = {
  home: { en: "/", fr: "/fr/" },
  systems: { en: "/systems/", fr: "/fr/systemes/" },
  vigil: { en: "/systems/vigil/", fr: "/fr/systemes/vigil/" },
  vigilGov: { en: "/systems/vigil/governance/", fr: "/fr/systemes/vigil/gouvernance/" },
  vigilEvid: { en: "/systems/vigil/evidence/", fr: "/fr/systemes/vigil/preuve/" },
  vigilSov: { en: "/systems/vigil/sovereignty/", fr: "/fr/systemes/vigil/souverainete/" },
  recor: { en: "/systems/recor/", fr: "/fr/systemes/recor/" },
  apex: { en: "/systems/apex/", fr: "/fr/systemes/apex/" },
  doctrine: { en: "/doctrine/", fr: "/fr/methode/" },
  record: { en: "/record/", fr: "/fr/references/" },
  trust: { en: "/trust/", fr: "/fr/confiance/" },
  company: { en: "/company/", fr: "/fr/entreprise/" },
  notes: { en: "/notes/", fr: "/fr/notes/" },
  contact: { en: "/contact/", fr: "/fr/contact/" },
  privacy: { en: "/legal/privacy/", fr: "/fr/legal/confidentialite/" },
  mentions: { en: "/legal/mentions-legales/", fr: "/fr/legal/mentions-legales/" },
  sigil: { en: "/sigil/", fr: "/fr/sigil/" },
  bodsProfile: { en: "/record/2026-09-06-bods-v04-export-profile/", fr: "/fr/references/2026-09-06-profil-export-bods-v04/" },
  govtechHub: { en: "/govtech-cameroon/", fr: "/fr/govtech-cameroun/" },
  regtechHub: { en: "/regtech-cameroon/", fr: "/fr/regtech-cameroun/" },
  sgi: { en: "/sovereign-governance-infrastructure/", fr: "/fr/infrastructure-de-gouvernance-souveraine/" },
  governedCyber: { en: "/governed-cybersecurity/", fr: "/fr/cybersecurite-gouvernee/" },
  cyberBuea: { en: "/cybersecurity-buea/", fr: "/fr/cybersecurite-buea/" },
  glossary: { en: "/glossary/", fr: "/fr/glossaire/" },
  cyberOrgs: { en: "/cybersecurity-for-organizations-cameroon/", fr: "/fr/cybersecurite-entreprises-cameroun/" },
  procurementHub: { en: "/procurement-integrity-cameroon/", fr: "/fr/integrite-marches-publics-cameroun/" },
  siliconMountain: { en: "/silicon-mountain/", fr: "/fr/silicon-mountain/" }
};

export function statusLabel(status, lang) {
  const map = {
    en: { "pre-deployment": "Pre-deployment", "design": "Design", "build": "Build", "pilot": "Pilot", "production": "Production" },
    fr: { "pre-deployment": "Pré-déploiement", "design": "Conception", "build": "Construction", "pilot": "Pilote", "production": "Production" }
  };
  return (map[lang] && map[lang][status]) || status;
}
