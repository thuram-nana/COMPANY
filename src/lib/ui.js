import facts from "../data/facts.json" with { type: "json" };
import { mark, seal } from "../assets/mark.js";
import { strings, routes, statusLabel } from "../data/strings.js";
import { escapeHtml } from "./layout.js";

export function h2(text, id) {
  return `<h2 class="h-seal"${id ? ` id="${id}"` : ""}>${seal({ size: 22 })}<span>${escapeHtml(text)}</span></h2>`;
}

export function eyebrow(text) {
  return `<p class="eyebrow">${escapeHtml(text)}</p>`;
}

export function statusChip(status, lang) {
  const cls = status === "pre-deployment" ? " status-pre" : "";
  return `<span class="chip${cls}">${escapeHtml(strings[lang].status_label)}: ${escapeHtml(statusLabel(status, lang))}</span>`;
}

export function cta(lang, href) {
  const s = strings[lang];
  return `<a class="btn" href="${href || routes.contact[lang]}">${s.briefing} <span class="term" aria-hidden="true">→</span></a>`;
}

export function callout(title, body) {
  return `<div class="callout"><strong>${escapeHtml(title)}</strong><p>${body}</p></div>`;
}

// Six-row sovereignty guarantees table; rows differ per system but the shape
// is identical across systems and languages.
export function guaranteeTable(headings, rows) {
  const head = `<thead><tr><th>${escapeHtml(headings[0])}</th><th>${escapeHtml(headings[1])}</th></tr></thead>`;
  const body = rows.map(([k, v]) => `<tr><td>${escapeHtml(k)}</td><td>${v}</td></tr>`).join("");
  return `<div class="table-wrap"><table>${head}<tbody>${body}</tbody></table></div>`;
}

export function heroMark() {
  return mark({ size: 520, animated: true, title: "SIGIL", cls: "mk-hero" });
}

export function tagRow(items) {
  return `<div class="pill-row">${items.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>`;
}


// ---- Entity answer block + FAQ (shared by home + company; text mirrors Organization schema) ----
export function entityFaq(lang) {
  const o = facts.org;
  return lang === "fr" ? [
    { q: "Qu’est-ce que SIGIL ?", a: o.definitionFr },
    { q: "Où SIGIL est-elle basée ?", a: "SIGIL SARL est basée à Buea, au Cameroun." },
    { q: "Que construit SIGIL ?", a: "SIGIL conçoit trois systèmes pour les institutions publiques : VIGIL, une plateforme de cybersécurité gouvernée et de preuve ; RÉCOR, un registre souverain des bénéficiaires effectifs ; et APEX, une plateforme de renseignement anti-corruption pour la commande publique. Les trois sont en pré-déploiement et leur code source est gardé strictement privé." },
    { q: "Qui a fondé SIGIL ?", a: "SIGIL SARL a été fondée en 2023 par Junior Thuram Nana, qui en est le fondateur et directeur général." },
    { q: "SIGIL est-elle l’éditeur d’ebooks Sigil ?", a: o.disambiguationFr }
  ] : [
    { q: "What is SIGIL?", a: o.definition },
    { q: "Where is SIGIL based?", a: "SIGIL SARL is based in Buea, Cameroon." },
    { q: "What does SIGIL build?", a: "SIGIL builds three systems for public institutions: VIGIL, a governed cybersecurity and evidence platform; RÉCOR, a sovereign beneficial-ownership registry; and APEX, an anti-corruption intelligence platform for public procurement. All three are pre-deployment and their source code is kept strictly private." },
    { q: "Who founded SIGIL?", a: "SIGIL SARL was founded in 2023 by Junior Thuram Nana, its Founder and Managing Director." },
    { q: "Is SIGIL the Sigil ebook editor?", a: o.disambiguation }
  ];
}

// Visible FAQ — the same five Q&As the FAQPage schema declares, so structured
// data always matches page content (Google spam policy) and the disambiguation
// answer sits readable on the highest-authority URLs.
export function faqBlock(lang) {
  const t = lang === "fr" ? "Questions fréquentes" : "Frequently asked";
  const items = entityFaq(lang).map(({ q, a }) =>
    `<details class="faq-item"><summary>${escapeHtml(q)}</summary><p>${a}</p></details>`).join("");
  return `<section class="section wrap rule-top" id="faq">
  ${h2(t)}
  <div class="faq" style="margin-top:1rem;max-width:64ch">${items}</div>
</section>`;
}

export function entityBlock(lang) {
  const o = facts.org;
  const t = lang === "fr"
    ? { h: "Qu’est-ce que SIGIL ?", facts: ["Fondée en 2023, basée à Buea, au Cameroun.", "Trois systèmes : VIGIL, RÉCOR et APEX — tous en pré-déploiement.", "Fondateur et directeur général : Junior Thuram Nana."], dis: o.disambiguationFr, def: o.definitionFr }
    : { h: "What is SIGIL?", facts: ["Founded in 2023, based in Buea, Cameroon.", "Three systems: VIGIL, RÉCOR, and APEX — all pre-deployment.", "Founder and Managing Director: Junior Thuram Nana."], dis: o.disambiguation, def: o.definition };
  return `<section class="section wrap rule-top" id="what-is-sigil">
  ${h2(t.h)}
  <p style="margin-top:1rem;max-width:64ch">${t.def}</p>
  <ul style="margin-top:1rem;max-width:64ch">${t.facts.map(x => `<li>${x}</li>`).join("")}</ul>
  <p class="muted" style="margin-top:1rem;max-width:64ch">${t.dis}</p>
</section>`;
}
