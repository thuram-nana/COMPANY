import { mkdirSync, writeFileSync, copyFileSync, readFileSync, existsSync, readdirSync, rmSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist");
const ORIGIN = "https://sigilsovereign.com";

function out(routePath, html) {
  // "/systems/vigil/" -> dist/systems/vigil/index.html ; "/" -> dist/index.html
  let p = routePath;
  if (p.endsWith("/")) p += "index.html";
  const full = join(DIST, p);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html);
  return p;
}

function copyDir(src, destRel) {
  const dest = join(DIST, destRel);
  mkdirSync(dest, { recursive: true });
  for (const name of readdirSync(src, { withFileTypes: true })) {
    const s = join(src, name.name);
    if (name.isDirectory()) copyDir(s, join(destRel, name.name));
    else copyFileSync(s, join(dest, name.name));
  }
}

async function run() {
  if (existsSync(DIST)) rmSync(DIST, { recursive: true });
  mkdirSync(DIST, { recursive: true });

  const built = [];

  // ---- pages -------------------------------------------------------------
  const { home } = await import("../src/pages/home.js");
  const { systemsIndex } = await import("../src/pages/systems.js");
  const { vigil, vigilGovernance, vigilEvidence, vigilSovereignty } = await import("../src/pages/vigil.js");
  const { recor } = await import("../src/pages/recor.js");
  const { doctrine } = await import("../src/pages/doctrine.js");
  const { record } = await import("../src/pages/record.js");
  const { trust } = await import("../src/pages/trust.js");
  const { company } = await import("../src/pages/company.js");
  const { contact } = await import("../src/pages/contact.js");
  const { notesIndex, notePages } = await import("../src/pages/notes.js");
  const { privacy, mentions } = await import("../src/pages/legal.js");
  const { routes } = await import("../src/data/strings.js");

  const langs = ["en", "fr"];
  for (const lang of langs) {
    built.push(out(routes.home[lang], home(lang)));
    built.push(out(routes.systems[lang], systemsIndex(lang)));
    built.push(out(routes.vigil[lang], vigil(lang)));
    built.push(out(routes.vigilGov[lang], vigilGovernance(lang)));
    built.push(out(routes.vigilEvid[lang], vigilEvidence(lang)));
    built.push(out(routes.vigilSov[lang], vigilSovereignty(lang)));
    built.push(out(routes.recor[lang], recor(lang)));
    built.push(out(routes.doctrine[lang], doctrine(lang)));
    built.push(out(routes.record[lang], record(lang)));
    built.push(out(routes.trust[lang], trust(lang)));
    built.push(out(routes.company[lang], company(lang)));
    built.push(out(routes.contact[lang], contact(lang)));
    built.push(out(routes.notes[lang], notesIndex(lang)));
    built.push(out(routes.privacy[lang], privacy(lang)));
    built.push(out(routes.mentions[lang], mentions(lang)));
    for (const np of notePages(lang)) built.push(out(np.path, np.html));
  }

  // ---- static assets -----------------------------------------------------
  copyDir(join(ROOT, "src", "styles"), "styles");
  copyDir(join(ROOT, "public"), ".");
  // app.js sits at root
  copyFileSync(join(ROOT, "src", "assets", "app.js"), join(DIST, "app.js"));
  copyFileSync(join(ROOT, "src", "assets", "briefing.js"), join(DIST, "briefing.js"));

  // ---- sitemap (per-language, lastmod from build or git) -----------------
  const lastmod = process.env.BUILD_DATE || new Date().toISOString().slice(0, 10);
  const urls = built.filter((p) => p.endsWith("index.html")).map((p) => {
    const loc = ORIGIN + "/" + p.replace(/index\.html$/, "").replace(/^\//, "");
    return `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`;
  });
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
  writeFileSync(join(DIST, "sitemap.xml"), sitemap);
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${ORIGIN}/sitemap.xml</loc><lastmod>${lastmod}</lastmod></sitemap>
</sitemapindex>`;
  writeFileSync(join(DIST, "sitemap-index.xml"), sitemapIndex);

  console.log(`Built ${built.length} pages -> ${DIST}`);
}

run().catch((e) => { console.error(e); process.exit(1); });
