# SIGIL — Build & Test Report

**Site:** sigilsovereign.com · **Company:** SIGIL SARL, Buea, Cameroon
**Build:** static, bilingual (EN + FR) · **Date:** 2026-08-30

## Revision — hosting on Namecheap cPanel (30 Aug 2026)

The domain already points at a Namecheap shared-hosting account (cPanel /
LiteSpeed), so the deploy target is now that host — see `deploy/README.md` §4c.

- `public/.htaccess` (→ `dist/.htaccess`): HTTPS + `www`→apex redirects (HSTS-preload
  compliant), the security-header set, caching, MIME types, EN/FR 404 pages, the
  `/api/briefing` route. `public/api/briefing.php` replaces the Cloudflare Worker
  on this host (same contract, plus rate limiting and header hardening).
- CI (`.github/workflows/ci.yml`) was failing at startup (`secrets` in a step-level
  `if:`); rewritten with a Namecheap FTPS deploy, a live smoke test
  (`deploy/smoke.sh`), and Node 22 (html-validate 11 requires it). `.cpanel.yml`
  adds a manual cPanel Git alternative.
- Two site-wide CSP defects fixed in all three header configs: the inline
  `<head>` script hash was computed over trimmed text (browsers hash the exact
  text, so the theme/JS marker was blocked on every page), and `style-src` lacked
  `'unsafe-inline'` for the `style=""` attributes the pages rely on. The build now
  fails if the hash drifts.
- Contact form: the mailto fallback actually works when no endpoint answers, the
  mail subject rides in the `mailto:` URL, and the button/note copy says truthfully
  whether a submission is sent directly or composed in the visitor's mail client.
- Build output no longer depends on the build machine's timezone; a French 404
  page is built.

## Revision — name consistency

- The header wordmark now reads **SIGIL SARL** on every page, matching the footer
  (previously the header showed a bare "SIGIL"). All wordmarks are now identical.
- The full expansion **Sovereign Integrity Governance Infrastructure Labs** now
  appears in the footer of every page, alongside the home eyebrow and the company
  page, so the meaning of SIGIL is always one glance away.
- Verified: 0 bare "SIGIL" wordmarks remain; the expansion is byte-identical in all
  68 occurrences; RÉCOR is correctly accented in all 27 occurrences; "SIGIL SARL"
  is the entity name in all formal/legal/structured-data contexts.

## PGP key — installed and verified

The founder's public key (RSA-4096, created 2026-04-12, thuram@thuramnana.com)
is published at `/pgp.txt`. It was imported into an isolated keyring and its
fingerprint independently computed as **C1C4 A87F EB43 04DB 9E62 86A1 F013 6C58
BB19 5F0C**, matching the fingerprint published on `/trust/` and in
`security.txt`. The armor checksum validated. Nothing about the key is pending.

## What was built

A complete, production-ready static website — not a scaffold. 36 rendered pages
(18 English, 18 French mirror), plus all machine-readable and security files.

### Pages (each in EN and FR)

| Page | Path (EN) | Purpose |
|------|-----------|---------|
| Home | `/` | Thesis, two systems, one proof line |
| Systems index | `/systems/` | VIGIL + RÉCOR overview |
| VIGIL | `/systems/vigil/` | Governed cybersecurity & evidence platform |
| — Governance | `/systems/vigil/governance/` | The conjunctive authorization chain, RBAC, WARDEN |
| — Evidence | `/systems/vigil/evidence/` | The Oracle model: lead vs fact |
| — Sovereignty | `/systems/vigil/sovereignty/` | No backdoor, signed cert, revocation |
| RÉCOR | `/systems/recor/` | Sovereign beneficial-ownership registry |
| How we build | `/doctrine/` | Guarantees as a verifiable checklist |
| Record | `/record/` | Dated, documented interactions only |
| Trust | `/trust/` | Security posture, PGP, disclosure |
| Company | `/company/` | SIGIL SARL, founder, governance-as-method |
| Contact | `/contact/` | Channels + briefing form |
| Notes (index + 3) | `/notes/` | Engineering/doctrine notes (GEO engine) |
| Privacy | `/legal/privacy/` | No cookies/trackers |
| Legal notice | `/legal/mentions-legales/` | Publisher info |

### Machine & security files

`robots.txt` (search + AI crawlers allowed), `/.well-known/security.txt`
(RFC 9116), `pgp.txt`, `llms.txt`, `llms-full.txt`, `sitemap.xml`,
`sitemap-index.xml`, `favicon.svg`, `og-image.png`, `_headers` (CSP + HSTS +
full header set with a real inline-script hash).

### Infrastructure (as committed, documented code)

- Cloudflare Worker for the briefing form (`worker/`) + a working `mailto:`
  fallback so contact functions with no server.
- CI pipeline (`.github/workflows/ci.yml`): build, HTML validation, axe, contrast,
  link check, Lighthouse, SBOM, provenance, deploy, IndexNow, GSC submit.
- `deploy/Caddyfile`, `deploy/lighthouserc.json`, and a full **deploy runbook**
  (`deploy/README.md`): Namecheap→Cloudflare DNS, Zoho mail records, hosting,
  Worker, indexing, go-live checklist.

---

## Verification — all passing

| Check | Tool | Result |
|-------|------|--------|
| HTML validity | html-validate (recommended + WCAG rules) | **clean, 36/36 pages** |
| Accessibility | axe-core, WCAG 2.1 A/AA (structural) | **0 violations, 36/36** |
| Colour contrast | computed ratios, both themes | **all pairs pass AA** (light + dark) |
| Internal links | custom checker | **902 references, 0 broken** |
| Structured data | JSON.parse of every block | **36/36 JSON-LD blocks parse** |
| hreflang reciprocity | custom checker | **all EN/FR pairs point back** |
| Font coverage (FR) | fontTools cmap check | **full French diacritic coverage** |

### Performance budget — all met

| Asset | Size | Budget |
|-------|------|--------|
| HTML (home) | 25.6 KB | ≤ 60 KB |
| CSS | 18.4 KB | ≤ 40 KB |
| JS (app) | 5.5 KB | ≤ 90 KB, **0 third-party** |
| Fonts (4 × IBM Plex, subset) | 69.9 KB | ≤ 120 KB |
| Total site | ~903 KB | — |

---

## Design

Identity derived from the registration mark: **seal (astroid) · rule · terminal
· axis**. Coral `#F8605A` seal, ink `#303030` rules, bone ground. Light default
(a registrar, not a red team) with a dark mode (system-preference + persistent
toggle). Motion has a job: the mark draws itself once per session, section seals
stamp on entry, the long arm becomes the reading-progress axis, terminals slide
on hover. Glass is used sparingly (≤3 blurred surfaces) and degrades to solid on
low-end devices and under `prefers-reduced-transparency`. All motion honours
`prefers-reduced-motion`.

---

## Content accuracy & constraints (verified in the build)

- **Two systems only** — VIGIL and RÉCOR. VIGIL leads with governance and
  evidence; the offensive engine is behind the gate, never the headline.
- **All VIGIL and RÉCOR source code stated as strictly private** throughout; no
  licence value invented.
- **VIGIL calibrated to reality** — described exactly as it stands; the
  two-edition model is presented as planned, not shipped.
- **RÉCOR anchored** to the Open Ownership demonstration of 1 July 2026 (BODS
  v0.4 conformance), labelled as a demonstration, not an endorsement.
- **Company location: "Buea, Cameroon" only** — no street address, no RCCM.
- **No company GitHub or LinkedIn.**
- **No mention of any regulatory submission** anywhere.
- **Founder:** Junior Thuram Nana, Founder & Managing Director; other staff
  private, so the company page presents governance-as-method, not a roster.
- **Privacy:** no cookies, no third-party scripts, no client-side analytics —
  and the privacy page says exactly that, truthfully.

---

## What needs your input before go-live

1. **PGP** — done: key installed at `/pgp.txt` and fingerprint-verified. Optionally sign `security.txt` at deploy.
2. **Briefing Worker** (optional) — deploy per `worker/README.md` to upgrade the
   form from `mailto:` to server-side; set Zoho + receipt secrets.
3. **DNS + mail + hosting** — follow `deploy/README.md`.
4. **IndexNow key file** — drop `public/<key>.txt` and set the CI secret.

Everything else is done.
