import { writeFileSync } from "fs";
// Icon + social-card art, generated from the SAME geometry as the page mark
// (src/assets/mark.js): coral astroid seal in a reticle of ink rules with
// T-terminals. The ratios below are lifted from mark.js so the favicon, the
// knowledge-panel logo and the hero mark are one logo, not three.
//
// Square icons use a SYMMETRIC four-arm reticle: the full logo's right arm runs
// 2.5x (it is the reading axis the wordmark sits on), which reads as lopsided
// in a square avatar with no wordmark beside it. The wide og-image keeps the
// true asymmetric mark, because there the wordmark is present.
//
// The committed raster set is rendered from the SVGs this script writes:
//   magick -density 512 -background none public/favicon.svg -resize 460x460 \
//     -gravity center -extent 512x512 PNG32:- | magick - -background "#F7F5F0" -flatten PNG24:public/logo.png
//   magick -density 512 -background none public/favicon.svg -resize 140x140 \
//     -gravity center -extent 180x180 -background "#F7F5F0" -flatten PNG24:public/apple-touch-icon.png
//   magick -density 512 -background none public/favicon.svg -define icon:auto-resize=48,32,16 public/favicon.ico
//   magick -density 512 -background none public/favicon.svg -resize 96x96 PNG32:public/icon-96.png
//   magick -density 1200 -background "#F7F5F0" public/og-image.svg -flatten PNG24:public/og-image.png
//   magick -density 1200 -background none public/favicon.svg -resize 820x820 \
//     -gravity center -extent 1000x1000 -background "#F7F5F0" -flatten PNG24:public/brand/logo-1000-padded.png
// logo.png (square, bone plate) is what Organization.logo in the JSON-LD points
// at — Google's requirement for the logo shown beside search results / panels.
const SEAL = "#F8605A", INK = "#303030";

function astroid(a) {
  let d = ""; const n = 96;
  for (let i = 0; i <= n; i++) {
    const t = i / n * Math.PI * 2;
    d += (i === 0 ? "M" : "L") + (a * Math.cos(t) ** 3).toFixed(2) + "," + (a * Math.sin(t) ** 3).toFixed(2) + " ";
  }
  return d + "Z";
}

// One arm: a rule from just outside the seal cusp out to L, capped with a
// perpendicular T-terminal. Drawn along +x; the caller rotates it.
function arm(L, seal) {
  const start = seal * 0.34, bar = seal * 0.42, sw = seal * 0.11;
  return `<line x1="${start.toFixed(2)}" y1="0" x2="${L.toFixed(2)}" y2="0" stroke="${INK}" stroke-width="${sw.toFixed(2)}" stroke-linecap="round"/>` +
    `<line x1="${L.toFixed(2)}" y1="${(-bar).toFixed(2)}" x2="${L.toFixed(2)}" y2="${bar.toFixed(2)}" stroke="${INK}" stroke-width="${sw.toFixed(2)}" stroke-linecap="round"/>`;
}

// ---- square icon: symmetric reticle, seal:arm ratio as in mark.js ----------
// Half-canvas 50, 4 units of padding; solve L so the arm + its stroke just fits.
const RATIO = 0.21 / 0.40;                 // seal half-diagonal / arm reach, from mark.js
const L = 46 / (1 + RATIO * 0.11 / 2);     // arm reach
const sealR = RATIO * L;                   // seal half-diagonal
const arms = [0, 90, 180, 270]
  .map((r) => `<g transform="rotate(${r})">${arm(L, sealR)}</g>`).join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 100 100" width="100" height="100">` +
  arms + `<path d="${astroid(sealR)}" fill="${SEAL}"/></svg>`;
writeFileSync(new URL("../../public/favicon.svg", import.meta.url), svg);

// ---- og-image 1200x630: the TRUE asymmetric mark + wordmark ---------------
const W = 1200, H = 630;
// Arm reach is 1.905x the seal half-diagonal (0.40/0.21, straight from mark.js);
// the right arm runs 2.5x that — the reading axis the wordmark sits on.
const ogSeal = 58, ogL = ogSeal * (0.40 / 0.21), ogLong = ogL * 2.5;
const ogArms =
  `<g>${arm(ogLong, ogSeal)}</g>` +
  `<g transform="rotate(180)">${arm(ogL, ogSeal)}</g>` +
  `<g transform="rotate(-90)">${arm(ogL, ogSeal)}</g>` +
  `<g transform="rotate(90)">${arm(ogL, ogSeal)}</g>`;
const og = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">` +
  `<rect width="${W}" height="${H}" fill="#F7F5F0"/>` +
  `<rect x="0" y="0" width="${W}" height="8" fill="${SEAL}"/>` +
  `<g transform="translate(255,300)">${ogArms}<path d="${astroid(ogSeal)}" fill="${SEAL}"/></g>` +
  // No letter-spacing attribute: rasterisers disagree about its units, and a
  // disagreement here silently clips the wordmark ("SIGIL SAR"). Kerning stays
  // the font's own. Always eyeball public/og-image.png after regenerating.
  `<text x="140" y="480" font-family="IBM Plex Mono, DejaVu Sans Mono, monospace" font-size="76" font-weight="500" fill="${INK}">SIGIL SARL</text>` +
  `<text x="144" y="536" font-family="IBM Plex Sans, DejaVu Sans, sans-serif" font-size="30" fill="#6B7280">Sovereign governance infrastructure · Buea, Cameroon</text>` +
  `</svg>`;
writeFileSync(new URL("../../public/og-image.svg", import.meta.url), og);
console.log("favicon.svg + og-image.svg written (T-terminal mark, geometry from mark.js)");
