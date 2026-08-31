import { page } from "../lib/layout.js";
import { strings, routes } from "../data/strings.js";
import { h2 } from "../lib/ui.js";
import { orgNode, breadcrumb, graph } from "../lib/jsonld.js";
import facts from "../data/facts.json" with { type: "json" };

const copy = {
  en: {
    title: "Record",
    description: "A record of documented interactions involving SIGIL, each dated. Includes the RÉCOR demonstration to Open Ownership. Nothing is an endorsement unless stated.",
    lede: "We list only interactions that happened, with their dates and the form they took. A demonstration is a demonstration; a letter of appreciation is a letter of appreciation. Nothing here is an endorsement or a contract unless it says so.",
    dateH: "Date",
    fmt: (d) => d.length === 4 ? d : new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
  },
  fr: {
    title: "Références",
    description: "Un relevé des interactions documentées impliquant SIGIL, chacune datée. Inclut la démonstration de RÉCOR à Open Ownership. Rien ne constitue un soutien sauf mention.",
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
</section>`;

  return page({
    lang, current: "record", title: c.title, description: c.description,
    path: routes.record[lang], altPath: routes.record[alt], altLang: alt,
    ogType: "website", jsonld, body
  });
}
