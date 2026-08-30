// CI contrast gate: verify every text/background pair used by the design meets
// WCAG AA in both light and dark themes. Token values mirror src/styles/app.css.
function lin(c) { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }
function L(h) { h = h.replace("#", ""); const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); }
function ratio(a, b) { const la = L(a), lb = L(b), hi = Math.max(la, lb), lo = Math.min(la, lb); return (hi + 0.05) / (lo + 0.05); }

const checks = [
  // [name, fg, bg, minRatio]
  // LIGHT (bg bone #F7F5F0 / surface #FFFFFF)
  ["light body ink/bone", "#303030", "#F7F5F0", 4.5],
  ["light body ink/paper", "#303030", "#FFFFFF", 4.5],
  ["light slate/bone", "#616872", "#F7F5F0", 4.5],
  ["light slate/paper", "#616872", "#FFFFFF", 4.5],
  ["light accent-ink/paper", "#C43E39", "#FFFFFF", 4.5],
  ["light accent-ink/bone", "#C43E39", "#F7F5F0", 4.5],
  ["light btn bone/ink", "#F7F5F0", "#303030", 4.5],
  ["light focus/bone (UI)", "#D33F39", "#F7F5F0", 3.0],
  // DARK (bg ink-900 #141414 / surface #1c1c1f)
  ["dark body bone/ink900", "#F7F5F0", "#141414", 4.5],
  ["dark body bone/surface", "#F7F5F0", "#1c1c1f", 4.5],
  ["dark soft/ink900", "#9aa1ab", "#141414", 4.5],
  ["dark soft/surface", "#9aa1ab", "#1c1c1f", 4.5],
  ["dark accent-ink/ink900", "#ff8a84", "#141414", 4.5],
  ["dark accent-ink/surface", "#ff8a84", "#1c1c1f", 4.5],
  ["dark btn ink900/bone", "#141414", "#F7F5F0", 4.5],
  ["dark focus/ink900 (UI)", "#F8605A", "#141414", 3.0]
];

let fail = 0;
for (const [name, fg, bg, req] of checks) {
  const r = ratio(fg, bg);
  const ok = r >= req;
  if (!ok) { console.error(`FAIL ${r.toFixed(2)} (need ${req})  ${name}`); fail++; }
  else console.log(`ok   ${r.toFixed(2)} (need ${req})  ${name}`);
}
if (fail) { console.error(`\ncontrast: ${fail} failing pair(s)`); process.exit(1); }
console.log("contrast: all pairs pass WCAG AA in both themes");
