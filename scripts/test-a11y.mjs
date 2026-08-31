// CI accessibility gate: run axe-core (WCAG 2.1 A/AA, structural rules) over
// every built page. Exits non-zero on any violation.
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { JSDOM, VirtualConsole } from "jsdom";

const DIST = "dist";
function walk(d) { let o = []; for (const n of readdirSync(d)) { const p = join(d, n); if (statSync(p).isDirectory()) o = o.concat(walk(p)); else if (p.endsWith(".html") && !/google[0-9a-f]+\.html$/.test(p)) o.push(p); } return o; }
const files = walk(DIST);
const axeSrc = readFileSync("./node_modules/axe-core/axe.min.js", "utf8");
const vc = new VirtualConsole();

let total = 0;
for (const f of files) {
  const dom = new JSDOM(readFileSync(f, "utf8"), { runScripts: "dangerously", pretendToBeVisual: true, virtualConsole: vc });
  const { window } = dom;
  const s = window.document.createElement("script"); s.textContent = axeSrc; window.document.head.appendChild(s);
  const r = await window.axe.run(window.document, {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
    // color-contrast needs real layout (checked separately in test-contrast.mjs);
    // region flags our decorative top-level nodes and is not a WCAG-failure here.
    rules: { "color-contrast": { enabled: false }, "region": { enabled: false } }
  });
  if (r.violations.length) {
    for (const v of r.violations) { console.error(`[${v.impact}] ${v.id} @ ${f.replace(DIST, "")} (${v.nodes.length})`); total++; }
  }
  window.close();
}
if (total) { console.error(`\naxe: ${total} violation(s)`); process.exit(1); }
console.log(`axe: clean across ${files.length} pages`);
