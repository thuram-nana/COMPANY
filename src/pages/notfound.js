import { page } from "../lib/layout.js";
import { routes } from "../data/strings.js";
import { cta } from "../lib/ui.js";

export function notFound(lang) {
  const alt = lang === "en" ? "fr" : "en";
  const t = lang === "fr"
    ? { title: "Page introuvable", p: "Cette page n’existe pas ou a été déplacée. Les systèmes, la méthode et le contact restent accessibles depuis la navigation.", home: "Retour à l’accueil" }
    : { title: "Page not found", p: "This page does not exist or has moved. The systems, the doctrine, and contact remain reachable from the navigation.", home: "Back to the home page" };
  const body = `
<section class="section wrap">
  <p class="eyebrow">404</p>
  <h1>${t.title}</h1>
  <p class="lead" style="margin-top:1rem;max-width:60ch">${t.p}</p>
  <p style="margin-top:2rem"><a class="btn" href="${routes.home[lang]}">${t.home} →</a></p>
</section>`;
  // A 404 must not be indexed and must not claim a canonical; robots noindex is set via body meta-free approach:
  return page({
    lang, current: "", title: t.title, description: t.p,
    path: "/404.html", altPath: "/404.html", altLang: alt, ogType: "website", body
  }).replace('<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">', '<meta name="robots" content="noindex, follow">');
}
