import { mkdirSync, writeFileSync, copyFileSync, readFileSync, existsSync, readdirSync, rmSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { createHash } from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist");
const ORIGIN = "https://sigilsovereign.com";

const BUILD_DATE = process.env.BUILD_DATE || new Date().toISOString().slice(0, 10);
// Only content inputs move a page's lastmod — chrome/style churn must not
// re-date every URL (engines learn to distrust uniform lastmod).
const SHARED = ["src/data/facts.json"];
function gitDate(files) {
  // Most recent commit date across the given files; null if git/ history unavailable.
  try {
    const outp = execSync(`git log -1 --format=%cs -- ${files.map(f => JSON.stringify(f)).join(" ")}`, { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
    return outp || null;
  } catch { return null; }
}
function pageLastmod(sourceFiles) {
  const d = gitDate(sourceFiles.concat(SHARED));
  return d || BUILD_DATE;
}
const firstSeen = {};
function pageFirstPublished(src) {
  // First commit that added the page's source — the honest datePublished.
  if (!(src in firstSeen)) {
    try {
      const outp = execSync(`git log --diff-filter=A --format=%cs -- ${JSON.stringify(src)}`, { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"] }).toString().trim().split("\n").filter(Boolean);
      firstSeen[src] = outp[outp.length - 1] || null;
    } catch { firstSeen[src] = null; }
  }
  return firstSeen[src];
}

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
  const srcOf = {}; // routePath -> page source file

  // ---- pages -------------------------------------------------------------
  const { home } = await import("../src/pages/home.js");
  const { systemsIndex } = await import("../src/pages/systems.js");
  const { vigil, vigilGovernance, vigilEvidence, vigilSovereignty } = await import("../src/pages/vigil.js");
  const { recor } = await import("../src/pages/recor.js");
  const { apex } = await import("../src/pages/apex.js");
  const { doctrine } = await import("../src/pages/doctrine.js");
  const { record } = await import("../src/pages/record.js");
  const { trust } = await import("../src/pages/trust.js");
  const { company } = await import("../src/pages/company.js");
  const { contact } = await import("../src/pages/contact.js");
  const { notesIndex, notePages } = await import("../src/pages/notes.js");
  const { privacy, mentions } = await import("../src/pages/legal.js");
  const { sigil } = await import("../src/pages/sigil.js");
  const { bodsProfile } = await import("../src/pages/bods-profile.js");
  const { govtechCameroon, regtechCameroon, sovereignGovernanceInfrastructure, governedCybersecurity, cybersecurityBuea, cybersecurityOrganizations, procurementIntegrity, siliconMountainPage, glossary } = await import("../src/pages/category.js");
  const { routes } = await import("../src/data/strings.js");

  const langs = ["en", "fr"];
  for (const lang of langs) {
    built.push(out(routes.home[lang], home(lang))); srcOf[routes.home[lang]] = "src/pages/home.js";
    built.push(out(routes.systems[lang], systemsIndex(lang))); srcOf[routes.systems[lang]] = "src/pages/systems.js";
    built.push(out(routes.vigil[lang], vigil(lang))); srcOf[routes.vigil[lang]] = "src/pages/vigil.js";
    built.push(out(routes.vigilGov[lang], vigilGovernance(lang))); srcOf[routes.vigilGov[lang]] = "src/pages/vigil.js";
    built.push(out(routes.vigilEvid[lang], vigilEvidence(lang))); srcOf[routes.vigilEvid[lang]] = "src/pages/vigil.js";
    built.push(out(routes.vigilSov[lang], vigilSovereignty(lang))); srcOf[routes.vigilSov[lang]] = "src/pages/vigil.js";
    built.push(out(routes.recor[lang], recor(lang))); srcOf[routes.recor[lang]] = "src/pages/recor.js";
    built.push(out(routes.apex[lang], apex(lang))); srcOf[routes.apex[lang]] = "src/pages/apex.js";
    built.push(out(routes.doctrine[lang], doctrine(lang))); srcOf[routes.doctrine[lang]] = "src/pages/doctrine.js";
    built.push(out(routes.record[lang], record(lang))); srcOf[routes.record[lang]] = "src/pages/record.js";
    built.push(out(routes.trust[lang], trust(lang))); srcOf[routes.trust[lang]] = "src/pages/trust.js";
    built.push(out(routes.company[lang], company(lang))); srcOf[routes.company[lang]] = "src/pages/company.js";
    built.push(out(routes.contact[lang], contact(lang))); srcOf[routes.contact[lang]] = "src/pages/contact.js";
    built.push(out(routes.notes[lang], notesIndex(lang))); srcOf[routes.notes[lang]] = "src/pages/notes.js";
    built.push(out(routes.privacy[lang], privacy(lang))); srcOf[routes.privacy[lang]] = "src/pages/legal.js";
    built.push(out(routes.mentions[lang], mentions(lang))); srcOf[routes.mentions[lang]] = "src/pages/legal.js";
    built.push(out(routes.sigil[lang], sigil(lang))); srcOf[routes.sigil[lang]] = "src/pages/sigil.js";
    built.push(out(routes.bodsProfile[lang], bodsProfile(lang))); srcOf[routes.bodsProfile[lang]] = "src/pages/bods-profile.js";
    built.push(out(routes.govtechHub[lang], govtechCameroon(lang))); srcOf[routes.govtechHub[lang]] = "src/data/category/govtech-hub.json";
    built.push(out(routes.regtechHub[lang], regtechCameroon(lang))); srcOf[routes.regtechHub[lang]] = "src/data/category/regtech-hub.json";
    built.push(out(routes.sgi[lang], sovereignGovernanceInfrastructure(lang))); srcOf[routes.sgi[lang]] = "src/data/category/sgi-doctrine.json";
    built.push(out(routes.governedCyber[lang], governedCybersecurity(lang))); srcOf[routes.governedCyber[lang]] = "src/data/category/governed-cyber.json";
    built.push(out(routes.cyberBuea[lang], cybersecurityBuea(lang))); srcOf[routes.cyberBuea[lang]] = "src/data/category/cyber-buea.json";
    built.push(out(routes.cyberOrgs[lang], cybersecurityOrganizations(lang))); srcOf[routes.cyberOrgs[lang]] = "src/data/category/cyber-orgs.json";
    built.push(out(routes.procurementHub[lang], procurementIntegrity(lang))); srcOf[routes.procurementHub[lang]] = "src/data/category/procurement-hub.json";
    built.push(out(routes.siliconMountain[lang], siliconMountainPage(lang))); srcOf[routes.siliconMountain[lang]] = "src/data/category/silicon-mountain.json";
    built.push(out(routes.glossary[lang], glossary(lang))); srcOf[routes.glossary[lang]] = "src/data/category/glossary.json";
    for (const np of notePages(lang)) { built.push(out(np.path, np.html)); srcOf[np.path] = "src/pages/notes.js"; }
  }

  // ---- static assets -----------------------------------------------------
  copyDir(join(ROOT, "src", "styles"), "styles");
  copyDir(join(ROOT, "public"), ".");
  // IndexNow key verification file: shipped automatically whenever the CI
  // secret is present — rotation is just changing the secret (runbook §6).
  if (process.env.INDEXNOW_KEY && /^[A-Za-z0-9-]{8,128}$/.test(process.env.INDEXNOW_KEY)) {
    writeFileSync(join(DIST, process.env.INDEXNOW_KEY + ".txt"), process.env.INDEXNOW_KEY);
  }
  // app.js sits at root
  copyFileSync(join(ROOT, "src", "assets", "app.js"), join(DIST, "app.js"));
  copyFileSync(join(ROOT, "src", "assets", "briefing.js"), join(DIST, "briefing.js"));

  // ---- per-page dates: thread the git dates into the rendered pages -------
  // (WebPage datePublished/dateModified + the visible footer date; the shell
  //  stamps sitePublished/BUILD_DATE, which we replace with per-route truth.)
  const SITE_PUB = (await import("../src/data/facts.json", { with: { type: "json" } })).default.org.sitePublished;
  for (const p of built) {
    const routePath = p.endsWith("index.html") ? p.slice(0, -"index.html".length) : p;
    const src = srcOf[routePath];
    if (!src) continue;
    const file = join(DIST, p);
    let html = readFileSync(file, "utf8");
    const pub = pageFirstPublished(src) || SITE_PUB;
    const mod = pageLastmod([src]);
    html = html.replaceAll(`"datePublished":"${SITE_PUB}"`, `"datePublished":"${pub}"`);
    html = html.replaceAll(`"dateModified":"${BUILD_DATE}"`, `"dateModified":"${mod}"`);
    html = html.replaceAll(`<time datetime="${BUILD_DATE}">`, `<time datetime="${mod}">`);
    html = html.replaceAll(`Last updated ${BUILD_DATE}`, `Last updated ${mod}`);
    html = html.replaceAll(`Mis à jour le ${BUILD_DATE}`, `Mis à jour le ${mod}`);
    writeFileSync(file, html);
  }

  // ---- minify the delivered CSS/JS (sources stay readable) ---------------
  const esbuild = await import("esbuild");
  for (const [f, loader] of [["styles/app.css", "css"], ["app.js", "js"], ["briefing.js", "js"]]) {
    const full = join(DIST, f);
    const min = await esbuild.transform(readFileSync(full, "utf8"), { loader, minify: true });
    writeFileSync(full, min.code);
  }

  // ---- sitemap (per-URL lastmod from git history; accurate freshness) ----
  const urlEntries = built.map((p) => {
    const routePath = p.endsWith("index.html") ? p.slice(0, -"index.html".length) : p;
    const loc = ORIGIN + routePath;
    const lm = pageLastmod([srcOf[routePath] || "src/pages/home.js"]);
    return `  <url><loc>${loc}</loc><lastmod>${lm}</lastmod></url>`;
  });
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join("\n")}
</urlset>`;
  writeFileSync(join(DIST, "sitemap.xml"), sitemap);
  const newest = urlEntries.map(e => (e.match(/<lastmod>([^<]+)</) || [])[1]).filter(Boolean).sort().pop() || BUILD_DATE;
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${ORIGIN}/sitemap.xml</loc><lastmod>${newest}</lastmod></sitemap>
</sitemapindex>`;
  writeFileSync(join(DIST, "sitemap-index.xml"), sitemapIndex);

  // ---- Atom feed of notes (discovery signal for Google, aggregators, and AI) ----
  const { notes } = await import("../src/pages/notes.js");
  const feedEntries = [...notes].sort((a, b) => (a.date < b.date ? 1 : -1)).map((n) => {
    const L = n.en; const url = ORIGIN + routes.notes.en + n.slug.en + "/";
    const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `  <entry>
    <title>${esc(L.title)}</title>
    <link rel="alternate" href="${url}"/>
    <id>${url}</id>
    <updated>${n.date}T00:00:00Z</updated>
    <published>${n.date}T00:00:00Z</published>
    <author><name>Junior Thuram Nana</name><uri>https://thuramnana.com/</uri></author>
    <summary>${esc(L.abstract)}</summary>
  </entry>`;
  });
  const feed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>SIGIL SARL — notes</title>
  <subtitle>Engineering and doctrine notes from Sovereign Integrity Governance Infrastructure Labs.</subtitle>
  <link href="${ORIGIN}/feed.xml" rel="self"/>
  <link href="${ORIGIN}/" rel="alternate"/>
  <link href="https://pubsubhubbub.appspot.com/" rel="hub"/>
  <id>${ORIGIN}/</id>
  <updated>${newest}T00:00:00Z</updated>
${feedEntries.join("\n")}
</feed>`;
  writeFileSync(join(DIST, "feed.xml"), feed);

  // ---- 404 pages (static hosts serve /404.html; /fr/404.html scopes French routes) ----
  const { notFound } = await import("../src/pages/notfound.js");
  writeFileSync(join(DIST, "404.html"), notFound("en"));
  mkdirSync(join(DIST, "fr"), { recursive: true });
  writeFileSync(join(DIST, "fr", "404.html"), notFound("fr"));

  // ---- CSP hash guard ----
  // The one inline <head> script must be allowlisted, byte-for-byte (browsers
  // hash the exact child text, newlines included), in all three header configs.
  const inline = (readFileSync(join(DIST, "index.html"), "utf8").match(/<script>([\s\S]*?)<\/script>/) || [])[1];
  if (!inline) throw new Error("CSP guard: inline <head> script not found in dist/index.html");
  const cspHash = "sha256-" + createHash("sha256").update(inline).digest("base64");
  for (const f of ["public/.htaccess", "public/_headers", "deploy/Caddyfile", "vercel.json"]) {
    if (!readFileSync(join(ROOT, f), "utf8").includes(`'${cspHash}'`)) {
      throw new Error(`CSP guard: ${f} does not allowlist '${cspHash}' for the inline <head> script — update it (deploy/README.md §7)`);
    }
  }

  console.log(`Built ${built.length} pages -> ${DIST}`);
}

run().catch((e) => { console.error(e); process.exit(1); });
