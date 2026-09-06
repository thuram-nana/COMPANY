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
</section>` : ""}`;

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
