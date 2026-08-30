// CI link gate: every internal href and asset reference must resolve to a file
// in dist. Exits non-zero on any broken link.
import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join } from "path";

const DIST = "dist";
function walk(d) { let o = []; for (const n of readdirSync(d)) { const p = join(d, n); if (statSync(p).isDirectory()) o = o.concat(walk(p)); else if (p.endsWith(".html")) o.push(p); } return o; }
const files = walk(DIST);

let broken = 0, checked = 0;
for (const f of files) {
  const html = readFileSync(f, "utf8");
  const hrefs = [...html.matchAll(/(?:href|src)="(\/[^"#]*)"/g)].map(m => m[1]);
  for (const h of hrefs) {
    checked++;
    let p;
    if (/\.(txt|xml|svg|png|jpg|css|js|woff2|json|webmanifest|ico)$/.test(h)) p = join(DIST, h);
    else p = h.endsWith("/") ? join(DIST, h, "index.html") : join(DIST, h + "/index.html");
    if (!existsSync(p)) { broken++; console.error(`BROKEN ${h}  (in ${f.replace(DIST, "")})`); }
  }
}
if (broken) { console.error(`\nlinks: ${broken} broken of ${checked}`); process.exit(1); }
console.log(`links: ${checked} internal references, 0 broken`);
