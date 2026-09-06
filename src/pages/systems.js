import { page } from "../lib/layout.js";
import { strings, routes } from "../data/strings.js";
import { h2, statusChip } from "../lib/ui.js";
import { seal } from "../assets/mark.js";
import { orgNode, systemNode, statusTerms, breadcrumb, graph } from "../lib/jsonld.js";
import facts from "../data/facts.json" with { type: "json" };

const copy = {
  en: {
    title: "Systems",
    description: "From Buea, Cameroon, SIGIL SARL builds VIGIL (governed cybersecurity and evidence), RÉCOR (beneficial-ownership registry), and APEX (procurement integrity).",
    lede: "SIGIL builds a small number of systems, deeply. Each is designed for a public institution, runs on the institution's own infrastructure, and is described here exactly as it stands today — including its status."
  },
  fr: {
    title: "Systèmes",
    description: "SIGIL SARL (Buea, Cameroun) conçoit VIGIL (cybersécurité gouvernée et preuve), RÉCOR (bénéficiaires effectifs) et APEX (intégrité de la commande publique).",
    lede: "SIGIL conçoit un petit nombre de systèmes, en profondeur. Chacun est destiné à une institution publique, s’exécute sur l’infrastructure de l’institution, et est décrit ici exactement tel qu’il est aujourd’hui — y compris son statut."
  }
};

function bigCard(sys, lang) {
  const L = sys[lang];
  return `<a class="card system-card reveal" href="${routes[sys.slug][lang]}">
    <span class="name">${seal({ size: 24 })} ${sys.name}</span>
    ${statusChip(sys.status, lang)}
    <span class="tagline">${L.tagline}</span>
    <p class="muted" style="margin-top:.5rem">${L.answer}</p>
    <span class="more">${strings[lang].read_more} →</span>
  </a>`;
}

export function systemsIndex(lang) {
  const c = copy[lang];
  const alt = lang === "en" ? "fr" : "en";
  const jsonld = graph([
    orgNode(facts),
    statusTerms(facts),
    systemNode(facts, facts.systems[0], lang),
    systemNode(facts, facts.systems[1], lang),
    systemNode(facts, facts.systems[2], lang),
    breadcrumb(facts, [
      { name: "SIGIL", path: routes.home[lang] },
      { name: c.title, path: routes.systems[lang] }
    ])
  ]);
  const body = `
<section class="section wrap">
  <p class="eyebrow">${strings[lang].nav.systems}</p>
  <h1>${c.title}</h1>
  <p class="lead" style="margin-top:1rem;max-width:60ch">${c.lede}</p>
  <div class="grid-2" style="margin-top:3rem">
    ${bigCard(facts.systems[0], lang)}
    ${bigCard(facts.systems[1], lang)}
    ${bigCard(facts.systems[2], lang)}
  </div>
</section>`;
  return page({
    lang, current: "systems", title: c.title, description: c.description,
    path: routes.systems[lang], altPath: routes.systems[alt], altLang: alt, jsonld, body
  });
}
