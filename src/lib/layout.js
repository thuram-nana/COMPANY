import { mark } from "../assets/mark.js";
import { strings, routes } from "../data/strings.js";

const ORIGIN = "https://sigilsovereign.com";

function navLinks(lang, current) {
  const s = strings[lang].nav;
  const items = [
    ["systems", routes.systems[lang]],
    ["doctrine", routes.doctrine[lang]],
    ["record", routes.record[lang]],
    ["trust", routes.trust[lang]],
    ["company", routes.company[lang]],
    ["notes", routes.notes[lang]],
    ["contact", routes.contact[lang]]
  ];
  return items.map(([key, href]) => {
    const cur = current === key ? ' aria-current="page"' : "";
    return `<a href="${href}"${cur}>${s[key]}</a>`;
  }).join("");
}

/**
 * page: {
 *   lang, current, title, description, path, altPath, altLang,
 *   head (extra <head> html), jsonld (string), body (string),
 *   ogType
 * }
 */
export function page(p) {
  const s = strings[p.lang];
  const canonical = ORIGIN + p.path;
  const altHref = ORIGIN + p.altPath;
  const xdefault = ORIGIN + (p.lang === "en" ? p.path : p.altPath);

  const brandMark = mark({ size: 40, cls: "brand-mk" });
  const heroTitle = "SIGIL SARL — " + p.title;

  const jsonldTag = p.jsonld ? `<script type="application/ld+json">${p.jsonld}</script>` : "";

  return `<!DOCTYPE html>
<html lang="${s.htmlLang}" dir="${s.dir}" data-alt-url="${altHref}" data-alt-lang="${p.altLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(p.title)} — SIGIL SARL</title>
<meta name="description" content="${escapeAttr(p.description)}">
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="${s.htmlLang}" href="${canonical}">
<link rel="alternate" hreflang="${p.altLang}" href="${altHref}">
<link rel="alternate" hreflang="x-default" href="${xdefault}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta name="theme-color" content="#F7F5F0" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#141414" media="(prefers-color-scheme: dark)">
<meta name="color-scheme" content="light dark">
<meta property="og:type" content="${p.ogType || "website"}">
<meta property="og:site_name" content="SIGIL SARL">
<meta property="og:locale" content="${p.lang === "fr" ? "fr_CM" : "en_US"}">
<meta property="og:locale:alternate" content="${p.altLang === "fr" ? "fr_CM" : "en_US"}">
<meta property="og:title" content="${escapeAttr(p.title)} — SIGIL SARL">
<meta property="og:description" content="${escapeAttr(p.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ORIGIN}/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeAttr(p.title)} — SIGIL SARL">
<meta name="twitter:description" content="${escapeAttr(p.description)}">
<meta name="twitter:image" content="${ORIGIN}/og-image.png">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/plex-sans-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/plex-mono-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/styles/app.css">
<script>
/* mark JS present (enables scroll-reveal hiding) and set stored theme before paint */
document.documentElement.classList.add("js");
try{var t=localStorage.getItem("sigil-theme");if(t)document.documentElement.setAttribute("data-theme",t);}catch(e){}
</script>
${p.head || ""}
${jsonldTag}
</head>
<body>
<a class="skip" href="#main">${s.skip}</a>
<div class="axis" aria-hidden="true"><i></i></div>
<div class="lang-banner" id="lang-banner" role="region" aria-label="Language">
  ${s.langBanner.text} <a href="${altHref}">${s.langBanner.view}</a>
  <button type="button" data-lang-dismiss>${s.langBanner.dismiss}</button>
</div>
<header class="site-header">
  <div class="wrap">
    <div class="bar glass">
      <a class="brand" href="${routes.home[p.lang]}" aria-label="SIGIL SARL — home">
        ${brandMark}<b>SIGIL SARL</b>
      </a>
      <nav class="nav" aria-label="Primary">
        ${navLinks(p.lang, p.current)}
        <span class="util">
          <a class="iconbtn" href="${altHref}" hreflang="${p.altLang}" lang="${p.altLang}">${s.langName}</a>
          <button class="iconbtn" type="button" data-theme-toggle aria-pressed="false">
            <span data-theme-label>${s.theme.dark}</span>
          </button>
        </span>
      </nav>
    </div>
  </div>
</header>
<main id="main">
${p.body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="cols">
      <div>
        <a class="brand" href="${routes.home[p.lang]}" aria-label="SIGIL SARL — home" style="margin-bottom:.6rem">${mark({ size: 36 })}<b>SIGIL SARL</b></a>
        <p class="mono muted" style="font-size:var(--step--1);margin-bottom:.8rem">Sovereign Integrity Governance Infrastructure Labs</p>
        <p class="muted" style="max-width:40ch">${s.footer.tagline}</p>
      </div>
      <div>
        <p class="eyebrow" style="margin-bottom:.6rem">${s.footer.systems}</p>
        <a href="${routes.vigil[p.lang]}">VIGIL</a>
        <a href="${routes.recor[p.lang]}">RÉCOR</a>
        <a href="${routes.apex[p.lang]}">APEX</a>
        <a href="${routes.doctrine[p.lang]}">${s.nav.doctrine}</a>
      </div>
      <div>
        <p class="eyebrow" style="margin-bottom:.6rem">${s.footer.resources}</p>
        <a href="${routes.trust[p.lang]}">${s.nav.trust}</a>
        <a href="${routes.record[p.lang]}">${s.nav.record}</a>
        <a href="${routes.notes[p.lang]}">${s.nav.notes}</a>
        <a href="/.well-known/security.txt">security.txt</a>
      </div>
    </div>
    <div class="legal">
      <span class="controlled">${s.footer.controlled}</span>
      <a href="${routes.privacy[p.lang]}" style="display:inline">${s.footer.privacy}</a>
      <a href="${routes.mentions[p.lang]}" style="display:inline">${s.footer.mentions}</a>
      <span>© ${new Date().getFullYear()} SIGIL SARL. ${s.footer.rights}</span>
    </div>
  </div>
</footer>
<script src="/app.js" defer></script>
</body>
</html>`;
}

export function phoneDisplay(p) { return String(p).replace(/ /g, '\u00a0'); }

export function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
export function escapeAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
export { ORIGIN };
