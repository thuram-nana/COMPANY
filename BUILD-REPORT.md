# SIGIL — Build & Test Report

**Site:** sigilsovereign.com · **Company:** SIGIL SARL, Buea, Cameroon
**Build:** static, bilingual (EN + FR) · **Date:** 2026-08-30

## Revision — name consistency (this update)

- The header wordmark now reads **SIGIL SARL** on every page, matching the footer
  (previously the header showed a bare "SIGIL"). All wordmarks are now identical.
- The full expansion **Sovereign Integrity Governance Infrastructure Labs** now
  appears in the footer of every page, alongside the home eyebrow and the company
  page, so the meaning of SIGIL is always one glance away.
- Verified: 0 bare "SIGIL" wordmarks remain; the expansion is byte-identical in all
  68 occurrences; RÉCOR is correctly accented in all 27 occurrences; "SIGIL SARL"
  is the entity name in all formal/legal/structured-data contexts.

## PGP key — action still required

The published fingerprint is **C1C4 A87F EB43 04DB 9E62 86A1 F013 6C58 BB19 5F0C**
(on /trust/ and in security.txt). A fingerprint is a one-way hash of the public
key; the armored key itself cannot be derived from it, so `public/pgp.txt` still
carries the KEY-PENDING marker. To finish, export your public key and drop it in:

    gpg --armor --export C1C4A87FEB4304DB9E6286A1F0136C58BB195F0C > public/pgp.txt
    node scripts/build.mjs   # then redeploy

The fingerprint the site advertises will then match the key you publish.

---

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

1. **PGP public key** — currently a `KEY-PENDING` marker with the correct
   fingerprint and plumbing. Paste the armored key into `public/pgp.txt` and sign
   `security.txt`. (One-line swap.)
2. **Briefing Worker** (optional) — deploy per `worker/README.md` to upgrade the
   form from `mailto:` to server-side; set Zoho + receipt secrets.
3. **DNS + mail + hosting** — follow `deploy/README.md`.
4. **IndexNow key file** — drop `public/<key>.txt` and set the CI secret.

Everything else is done.
