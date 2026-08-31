import { page } from "../lib/layout.js";
import { strings, routes } from "../data/strings.js";
import { h2, statusChip, cta, heroMark, entityFaq, entityBlock, faqBlock } from "../lib/ui.js";
import { mark, seal } from "../assets/mark.js";
import { orgNode, systemNode, statusTerms, breadcrumb, faqNode, graph } from "../lib/jsonld.js";
import facts from "../data/facts.json" with { type: "json" };

const copy = {
  en: {
    title: "Sovereign governance infrastructure",
    description: "SIGIL SARL builds sovereign governance infrastructure from Buea, Cameroon: systems where the institution holds the keys, the data never leaves, and every consequential action is authorized, bounded, and proven. Three systems: VIGIL, RÉCOR, and APEX.",
    thesisPre: "SIGIL builds systems where the institution holds the keys, the data never leaves, and every consequential action is ",
    thesisEmph: "authorized, bounded, and proven.",
    systemsH: "Three systems",
    systemsLede: "SIGIL builds a small number of systems, deeply. Each is designed for a public institution, runs on the institution's own infrastructure, and is described here exactly as it stands today.",
    doctrineH: "How we build",
    doctrineLede: "One doctrine runs through all three systems: a technical capability is never an authorization, no finding is trusted until it is independently re-verified, and the institution can always read, export, and stop. These are properties you can check, not claims you have to take on trust.",
    doctrineLink: "Read the doctrine",
    recordH: "Record",
    recordLede: "We list only interactions that happened, with dates and the form they took. Nothing here is an endorsement unless it says so.",
    recordLink: "See the record",
    proof: "RÉCOR is built to the Beneficial Ownership Data Standard (BODS v0.4) and was fully demonstrated to Open Ownership on 1 July 2026, confirming its conformance."
  },
  fr: {
    title: "Infrastructure de gouvernance souveraine",
    description: "SIGIL SARL conçoit depuis Buea, au Cameroun, une infrastructure de gouvernance souveraine : des systèmes où l’institution détient les clés, où les données ne sortent jamais, et où chaque action conséquente est autorisée, bornée et prouvée. Trois systèmes : VIGIL, RÉCOR et APEX.",
    thesisPre: "SIGIL conçoit des systèmes où l’institution détient les clés, où les données ne sortent jamais, et où chaque action conséquente est ",
    thesisEmph: "autorisée, bornée et prouvée.",
    systemsH: "Trois systèmes",
    systemsLede: "SIGIL conçoit un petit nombre de systèmes, en profondeur. Chacun est destiné à une institution publique, s’exécute sur l’infrastructure de l’institution, et est décrit ici exactement tel qu’il est aujourd’hui.",
    doctrineH: "Notre méthode",
    doctrineLede: "Une même doctrine traverse les trois systèmes : une capacité technique n’est jamais une autorisation, aucun constat n’est retenu tant qu’il n’a pas été re-vérifié de façon indépendante, et l’institution peut toujours lire, exporter et arrêter. Ce sont des propriétés vérifiables, non des affirmations à croire sur parole.",
    doctrineLink: "Lire la doctrine",
    recordH: "Références",
    recordLede: "Nous ne listons que des interactions qui ont eu lieu, avec leurs dates et leur forme. Rien ici ne constitue un soutien institutionnel, sauf mention expresse.",
    recordLink: "Voir les références",
    proof: "RÉCOR est bâti selon le standard de données sur les bénéficiaires effectifs (BODS v0.4) et a fait l’objet d’une démonstration complète auprès d’Open Ownership le 1 juillet 2026, confirmant sa conformité."
  }
};

function systemCard(sys, lang) {
  const L = sys[lang];
  return `<a class="card system-card reveal" href="${routes[sys.slug][lang]}">
    <span class="name">${seal({ size: 20 })} ${sys.name}</span>
    ${statusChip(sys.status, lang)}
    <span class="tagline">${L.tagline}</span>
    <span class="more">${strings[lang].read_more} →</span>
  </a>`;
}

export function home(lang) {
  const c = copy[lang];
  const s = strings[lang];
  const alt = lang === "en" ? "fr" : "en";

  const jsonld = graph([
    orgNode(facts),
    statusTerms(facts),
    systemNode(facts, facts.systems[0], lang),
    systemNode(facts, facts.systems[1], lang),
    systemNode(facts, facts.systems[2], lang),
    faqNode(entityFaq(lang)),
    breadcrumb(facts, [{ name: "SIGIL", path: routes.home[lang] }])
  ]);

  const body = `
<section class="hero wrap">
  ${heroMark()}
  <p class="eyebrow">Sovereign Integrity Governance Infrastructure Labs</p>
  <h1>${c.title}</h1>
  <p class="thesis">${c.thesisPre}<b>${c.thesisEmph}</b></p>
  <p style="margin-top:2rem">${cta(lang)}</p>
</section>

${entityBlock(lang)}
${faqBlock(lang)}

<section class="section wrap rule-top">
  ${h2(c.systemsH)}
  <p class="lead" style="margin-top:1rem;margin-bottom:2.5rem">${c.systemsLede}</p>
  <div class="grid-3">
    ${systemCard(facts.systems[0], lang)}
    ${systemCard(facts.systems[1], lang)}
    ${systemCard(facts.systems[2], lang)}
  </div>
  <div class="callout reveal" style="margin-top:2.5rem">
    <strong>Verifiable</strong>
    <p>${c.proof}</p>
  </div>
</section>

<section class="section wrap rule-top">
  <div class="grid-2 lead-col">
    <div>
      ${h2(c.doctrineH)}
      <p style="margin-top:1rem">${c.doctrineLede}</p>
      <p style="margin-top:1.5rem"><a class="btn ghost" href="${routes.doctrine[lang]}">${c.doctrineLink} <span class="term" aria-hidden="true">→</span></a></p>
    </div>
    <div>
      ${h2(c.recordH)}
      <p style="margin-top:1rem">${c.recordLede}</p>
      <p style="margin-top:1.5rem"><a class="btn ghost" href="${routes.record[lang]}">${c.recordLink} <span class="term" aria-hidden="true">→</span></a></p>
    </div>
  </div>
</section>`;

  return page({
    lang,
    current: "home",
    title: c.title,
    description: c.description,
    path: routes.home[lang],
    altPath: routes.home[alt],
    altLang: alt,
    jsonld,
    body
  });
}
