# sigilsovereign.com

The company website for **SIGIL SARL** — Sovereign Integrity Governance
Infrastructure Labs, Buea, Cameroon. Static, bilingual (EN + FR), fast, and
built to be found and cited by search and answer engines.

Two systems are presented: **VIGIL** (governed cybersecurity and evidence
platform) and **RÉCOR** (sovereign beneficial-ownership registry). All product
source code is private; this repository is the marketing site only.

---

## Quick start

Requires Node **≥ 22.22** (html-validate 11).

```bash
npm install
node scripts/gen-llms.mjs      # regenerate llms.txt / llms-full.txt from facts
node scripts/build.mjs         # build the static site into dist/
```

Serve `dist/` with any static server to preview:

```bash
cd dist && python3 -m http.server 8080
```

## Test (the same gates CI runs)

```bash
npx html-validate "dist/**/*.html"   # HTML validity
node scripts/test-a11y.mjs           # axe-core WCAG 2.1 A/AA (structural)
node scripts/test-contrast.mjs       # WCAG AA contrast, both themes
node scripts/test-links.mjs          # no broken internal links
```

All four are wired into `.github/workflows/ci.yml` along with Lighthouse CI,
an SBOM, and build-provenance attestation.

## Deploy

The site is hosted on **Vercel**; DNS and mail stay on Namecheap. CI builds and
tests on every push to `main`, then deploys to Vercel production with the CLI
and smoke-tests the live site. `vercel.json` carries the headers, caching and
canonicalisation for that host; `api/briefing.js` is the contact-form endpoint
there (SMTP). The Namecheap-cPanel path (`public/.htaccess` +
`public/api/briefing.php` + FTPS deploy) and the Cloudflare/Caddy paths stay
fully wired as fallbacks.

See **`deploy/README.md`** — the full runbook (§4d Vercel setup, DNS records,
mail, CI secrets, the alternative hosts, the briefing handler, indexing, and a
go-live checklist).

---

## How it is built

No heavyweight framework — a small, dependency-light Node build renders plain,
fast HTML. This keeps the output auditable and the build reproducible offline.

```
src/
  data/
    facts.json        Single source of truth: entity, systems, record.
    strings.js        UI chrome strings (EN/FR) + localized route map.
  assets/
    mark.js           The SIGIL registration mark, as vector (astroid + arms).
    diagrams.js       Inline-SVG diagrams (auth gate, lead→fact, RÉCOR pipeline).
    app.js            Progressive enhancement: theme, language banner, motion.
    briefing.js       Contact-form upgrade (mailto → POST /api/briefing: serverless
                      function on Vercel, PHP on cPanel, Worker on Cloudflare;
                      falls back to mailto).
    favicon.mjs       Generates favicon.svg + og-image.(svg|png).
  styles/
    app.css           The whole design system: tokens, themes, glass, motion, a11y.
  lib/
    layout.js         The HTML document shell (head, header, footer, SEO/OG).
    ui.js             Shared page fragments (hero, headings, tables, CTAs).
    jsonld.js         Structured-data @graph builders.
  pages/
    *.js              One module per page; each returns EN and FR HTML.
public/               Static files copied verbatim (robots, security.txt, fonts,
                      .htaccess for cPanel/LiteSpeed, api/briefing.php).
scripts/
  build.mjs           Renders all pages, copies assets, writes sitemaps.
  gen-llms.mjs        Builds llms.txt / llms-full.txt from facts.json.
  test-*.mjs          CI gates.
  indexnow.mjs        Post-deploy IndexNow ping.
  gsc-submit.mjs      Post-deploy Search Console sitemap submit.
  websub-ping.mjs     Post-deploy WebSub hub ping for the notes feed.
api/                  Vercel serverless function for the briefing form (Vercel hosting).
worker/               Cloudflare Worker for the briefing form (Cloudflare hosting only).
deploy/               Deploy runbook, smoke test, Caddyfile, Lighthouse config.
.cpanel.yml           cPanel "Git Version Control" deploy tasks (manual alternative).
vercel.json           Vercel hosting configuration (headers, caching, build).
```

### Editing content

- **Facts** (name, contact, system taglines/answers, the record) live in
  `src/data/facts.json`. Change them there and everything — pages, JSON-LD,
  `llms.txt`, both languages — updates on the next build.
- **Page copy** lives in the matching `src/pages/*.js` module, with an `en` and
  a `fr` block side by side so the two languages stay structurally identical.
- **UI labels** (nav, footer, buttons) live in `src/data/strings.js`.
- **Design tokens** (colour, type, spacing) live at the top of
  `src/styles/app.css`. Contrast is enforced by `scripts/test-contrast.mjs`, so
  if you change a text colour, run that gate.

### Design language

The site's identity comes from the registration mark: **seal (astroid) · rule ·
terminal · axis**. Coral `#F8605A` seal, ink `#303030` rules, bone ground; a
light default (a registrar, not a red team) with a dark mode. Motion has a job —
the mark draws itself once, section seals stamp on entry, the long arm becomes
the reading-progress axis. Glass is used sparingly and degrades to solid on
low-end devices and under `prefers-reduced-transparency`.

### Accessibility & performance

WCAG 2.1 AA (keyboard-complete, visible focus, reduced-motion honoured, AA
contrast in both themes). Budgets, all met: HTML ≤60KB, CSS ≤40KB, JS ≤90KB with
zero third-party requests, fonts ≤120KB across four self-hosted IBM Plex subsets
(Latin + full French diacritics).
