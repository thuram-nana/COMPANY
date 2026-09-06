import { page } from "../lib/layout.js";
import { strings, routes } from "../data/strings.js";
import { h2 } from "../lib/ui.js";
import { orgNode, breadcrumb, graph } from "../lib/jsonld.js";
import facts from "../data/facts.json" with { type: "json" };

const refDocs = {"en": {"h": "Reference documents", "lede": "Dated, versioned technical documents published by SIGIL. Each lives at a permanent URL and is never edited in place — a superseding version gets a new dated URL.", "title": "RÉCOR BODS v0.4 export profile", "desc": "A self-declared profile documenting how RÉCOR's export maps to the Beneficial Ownership Data Standard v0.4 and to FATF Recommendations 24 and 25."}, "fr": {"h": "Documents de référence", "lede": "Documents techniques datés et versionnés publiés par SIGIL. Chacun vit à une URL permanente et n’est jamais modifié en place — une version qui le remplace reçoit une nouvelle URL datée.", "title": "Profil d’export BODS v0.4 de RÉCOR", "desc": "Profil auto-déclaré documentant la correspondance entre l’export de RÉCOR, le standard BODS v0.4 et les recommandations 24 et 25 du GAFI."}};

const copy = {
  en: {
    title: "Record",
    description: "Interactions involving SIGIL SARL, Buea, Cameroon, each dated. Includes the RÉCOR demonstration to Open Ownership. Nothing is an endorsement unless stated.",
    lede: "We list only interactions that happened, with their dates and the form they took. A demonstration is a demonstration; a letter of appreciation is a letter of appreciation. Nothing here is an endorsement or a contract unless it says so.",
    dateH: "Date",
    fmt: (d) => d.length === 4 ? d : new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
  },
  fr: {
    title: "Références",
    description: "Relevé daté des interactions de SIGIL SARL (Buea, Cameroun). Inclut la démonstration de RÉCOR à Open Ownership. Rien ne constitue un soutien sauf mention.",
    lede: "Nous ne listons que des interactions qui ont eu lieu, avec leurs dates et leur forme. Une démonstration est une démonstration ; une lettre d’appréciation est une lettre d’appréciation. Rien ici ne constitue un soutien ni un contrat, sauf mention expresse.",
    dateH: "Date",
    fmt: (d) => d.length === 4 ? d : new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
  }
};

export function record(lang) {
  const c = copy[lang];
  const alt = lang === "en" ? "fr" : "en";
  const jsonld = graph([
    orgNode(facts),
    breadcrumb(facts, [
      { name: "SIGIL", path: routes.home[lang] },
      { name: c.title, path: routes.record[lang] }
    ])
  ]);

  const items = facts.record.map((r) => {
    const L = r[lang];
    return `<li class="reveal">
      <span class="date">${c.fmt(r.date)}</span>
      <div>
        <div class="title">${L.title}</div>
        <div class="artifact">${L.artifact}</div>
        <p class="muted" style="margin-top:.4rem">${L.detail}</p>
      </div>
    </li>`;
  }).join("");

  const body = `
<section class="section wrap">
  <p class="eyebrow">${strings[lang].nav.record}</p>
  <h1>${c.title}</h1>
  <p class="lead" style="margin-top:1rem;max-width:62ch">${c.lede}</p>
  <ul class="record" style="margin-top:2.5rem">${items}</ul>
</section>

<section class="section wrap rule-top">
  ${h2(refDocs[lang].h, "reference-documents")}
  <p style="margin-top:1rem;max-width:62ch">${refDocs[lang].lede}</p>
  <div class="stack" style="margin-top:1.5rem">
    <a class="card reveal" href="${routes.bodsProfile[lang]}" style="display:block">
      <p class="mono" style="font-weight:600">${refDocs[lang].title} <span class="term" aria-hidden="true">→</span></p>
      <p class="muted" style="margin-top:.6rem">${refDocs[lang].desc}</p>
    </a>
  </div>
</section>`;

  return page({
    lang, current: "record", title: c.title, description: c.description,
    path: routes.record[lang], altPath: routes.record[alt], altLang: alt,
    ogType: "website", jsonld, body
  });
}
