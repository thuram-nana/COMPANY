// Category pages (hubs + doctrine pages): rendered from verified content
// packages in src/data/category/*.json. One renderer, five pages, EN+FR.
import { page } from "../lib/layout.js";
import { strings, routes } from "../data/strings.js";
import { h2, cta } from "../lib/ui.js";
import { seal } from "../assets/mark.js";
import { orgNode, faqNode, breadcrumb, graph } from "../lib/jsonld.js";
import facts from "../data/facts.json" with { type: "json" };
import regtechHub from "../data/category/regtech-hub.json" with { type: "json" };
import govtechHub from "../data/category/govtech-hub.json" with { type: "json" };
import sgiDoctrine from "../data/category/sgi-doctrine.json" with { type: "json" };
import governedCyber from "../data/category/governed-cyber.json" with { type: "json" };
import cyberBuea from "../data/category/cyber-buea.json" with { type: "json" };
import glossaryData from "../data/category/glossary.json" with { type: "json" };
import cyberOrgs from "../data/category/cyber-orgs.json" with { type: "json" };
import procurementHub from "../data/category/procurement-hub.json" with { type: "json" };
import siliconMountain from "../data/category/silicon-mountain.json" with { type: "json" };
import bodsPage from "../data/category/bods-page.json" with { type: "json" };
import r24Page from "../data/category/r24-page.json" with { type: "json" };
import cyberCameroon from "../data/category/cybersecurity-cameroon.json" with { type: "json" };

const stripA = (t) => String(t).replace(/<a [^>]*>/g, "").replace(/<\/a>/g, "");
const anchorId = (t) => String(t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

function renderTable(t) {
  const head = `<thead><tr>${t.head.map((h) => `<th scope="col">${h}</th>`).join("")}</tr></thead>`;
  const body = t.rows.map((r) => `<tr>${r.map((c, i) => i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`).join("")}</tr>`).join("");
  return `<div class="table-wrap" style="margin-top:1.5rem"><table>${head}<tbody>${body}</tbody></table></div>`;
}

function renderSection(x) {
  return `
<section class="section wrap rule-top">
  ${h2(x.h, anchorId(x.h))}
  ${(x.paras || []).map((p2) => `<p style="margin-top:1rem;max-width:62ch">${p2}</p>`).join("")}
  ${x.table ? renderTable(x.table) : ""}
  ${x.list ? `<ul style="margin-top:1rem;max-width:62ch">${x.list.map((li) => `<li>${li}</li>`).join("")}</ul>` : ""}
</section>`;
}

// Hub-and-spoke discovery: each page names its related pages; labels are short and localized.
const LABELS = {
  govtechHub: { en: "GovTech in Cameroon", fr: "La GovTech au Cameroun" },
  regtechHub: { en: "RegTech in Cameroon", fr: "La RegTech au Cameroun" },
  sgi: { en: "Sovereign governance infrastructure", fr: "Infrastructure de gouvernance souveraine" },
  governedCyber: { en: "Governed cybersecurity", fr: "La cybersécurité gouvernée" },
  cyberBuea: { en: "Cybersecurity in Buea", fr: "La cybersécurité à Buea" },
  glossary: { en: "Glossary", fr: "Glossaire" },
  cyberOrgs: { en: "Choosing a cybersecurity partner in Cameroon", fr: "Cybersécurité des entreprises au Cameroun" },
  procurementHub: { en: "Procurement integrity in Cameroon", fr: "L’intégrité des marchés publics au Cameroun" },
  siliconMountain: { en: "Silicon Mountain", fr: "Silicon Mountain" },
  bodsStandard: { en: "The BODS standard", fr: "La norme BODS" },
  fatfR24: { en: "FATF Recommendation 24", fr: "Recommandation 24 du GAFI" },
  cyberCameroon: { en: "Cybersecurity in Cameroon", fr: "La cybersécurité au Cameroun" }
};
const RELATED = {
  govtechHub: ["regtechHub", "procurementHub", "sgi", "glossary"],
  regtechHub: ["govtechHub", "bodsStandard", "fatfR24", "glossary"],
  sgi: ["governedCyber", "govtechHub", "glossary"],
  governedCyber: ["sgi", "cyberBuea", "cyberOrgs"],
  cyberBuea: ["siliconMountain", "cyberOrgs", "cyberCameroon"],
  glossary: ["govtechHub", "regtechHub", "procurementHub"],
  cyberOrgs: ["cyberCameroon", "cyberBuea", "governedCyber"],
  procurementHub: ["govtechHub", "glossary", "sgi"],
  siliconMountain: ["cyberBuea", "govtechHub", "regtechHub"],
  bodsStandard: ["fatfR24", "regtechHub", "glossary"],
  fatfR24: ["bodsStandard", "regtechHub", "glossary"],
  cyberCameroon: ["cyberOrgs", "cyberBuea", "governedCyber"]
};

function relatedBlock(routeKey, lang) {
  const rel = RELATED[routeKey] || [];
  if (!rel.length) return "";
  const t = lang === "fr" ? "À lire ensuite" : "Related reading";
  return `
<section class="section wrap rule-top">
  ${h2(t, "related")}
  <div class="pill-row" style="margin-top:1rem">
    ${rel.map((rk) => `<a class="tag" href="${routes[rk][lang]}" style="text-decoration:none">${LABELS[rk][lang]}</a>`).join("")}
  </div>
</section>`;
}

function categoryPage(pkg, routeKey) {
  return (lang) => {
    const c = pkg[lang];
    const alt = lang === "en" ? "fr" : "en";
    const jsonld = graph([
      orgNode(facts),
      faqNode((c.faqs || []).map((f) => ({ q: f.q, a: stripA(f.a) }))),
      breadcrumb(facts, [
        { name: "SIGIL", path: routes.home[lang] },
        { name: c.title, path: routes[routeKey][lang] }
      ])
    ]);

    const faqTitle = lang === "fr" ? "Questions fréquentes" : "Frequently asked";
    const body = `
<section class="section wrap">
  <p class="eyebrow">${seal({ size: 20 })} SIGIL SARL — ${lang === "fr" ? "Buea, Cameroun" : "Buea, Cameroon"}</p>
  <h1>${c.title}</h1>
</section>
${(c.sections || []).map(renderSection).join("")}
${(c.faqs && c.faqs.length) ? `
<section class="section wrap rule-top">
  ${h2(faqTitle, "faq")}
  <div class="stack" style="margin-top:1.5rem">
    ${c.faqs.map((f) => `<details class="card"><summary class="mono" style="cursor:pointer;font-weight:600">${f.q}</summary><p style="margin-top:.8rem">${f.a}</p></details>`).join("")}
  </div>
  <p style="margin-top:2.5rem">${cta(lang)}</p>
</section>` : ""}
${relatedBlock(routeKey, lang)}`;

    return page({
      lang, current: "", title: c.title, description: c.description,
      path: routes[routeKey][lang], altPath: routes[routeKey][alt], altLang: alt,
      ogType: "article", jsonld, body
    });
  };
}

export const govtechCameroon = categoryPage(govtechHub, "govtechHub");
export const regtechCameroon = categoryPage(regtechHub, "regtechHub");
export const sovereignGovernanceInfrastructure = categoryPage(sgiDoctrine, "sgi");
export const governedCybersecurity = categoryPage(governedCyber, "governedCyber");
export const cybersecurityBuea = categoryPage(cyberBuea, "cyberBuea");
export const cybersecurityOrganizations = categoryPage(cyberOrgs, "cyberOrgs");
export const procurementIntegrity = categoryPage(procurementHub, "procurementHub");
export const siliconMountainPage = categoryPage(siliconMountain, "siliconMountain");
export const bodsStandard = categoryPage(bodsPage, "bodsStandard");
export const fatfRecommendation24 = categoryPage(r24Page, "fatfR24");
export const cybersecurityCameroon = categoryPage(cyberCameroon, "cyberCameroon");

// Glossary: definitional entries with DefinedTermSet structured data — the AEO substrate.
export function glossary(lang) {
  const c = glossaryData[lang];
  const alt = lang === "en" ? "fr" : "en";
  const setId = facts.org.url + routes.glossary.en + "#terms";
  const termSet = {
    "@type": "DefinedTermSet",
    "@id": setId,
    name: c.title,
    inLanguage: lang,
    hasDefinedTerm: c.terms.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: stripA(t.def).replace(/<[^>]+>/g, "").trim(),
      inDefinedTermSet: setId
    }))
  };
  const jsonld = graph([
    orgNode(facts),
    termSet,
    breadcrumb(facts, [
      { name: "SIGIL", path: routes.home[lang] },
      { name: c.title, path: routes.glossary[lang] }
    ])
  ]);

  const entries = c.terms.map((t) => `
<section class="section wrap rule-top" style="padding-top:2rem;padding-bottom:2rem">
  ${h2(t.term, anchorId(t.term))}
  <div style="margin-top:.8rem;max-width:62ch">${t.def}</div>
</section>`).join("");

  const body = `
<section class="section wrap">
  <p class="eyebrow">${seal({ size: 20 })} SIGIL SARL — ${lang === "fr" ? "Buea, Cameroun" : "Buea, Cameroon"}</p>
  <h1>${c.title}</h1>
  <p class="lead" style="margin-top:1.5rem;max-width:62ch">${c.intro}</p>
</section>
${entries}
${relatedBlock("glossary", lang)}`;

  return page({
    lang, current: "", title: c.title, description: c.description,
    path: routes.glossary[lang], altPath: routes.glossary[alt], altLang: alt,
    ogType: "website", jsonld, body
  });
}
