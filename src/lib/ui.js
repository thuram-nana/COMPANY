import { mark, seal } from "../assets/mark.js";
import { strings, routes, statusLabel } from "../data/strings.js";
import { escapeHtml } from "./layout.js";

export function h2(text) {
  return `<h2 class="h-seal">${seal({ size: 22 })}<span>${escapeHtml(text)}</span></h2>`;
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
