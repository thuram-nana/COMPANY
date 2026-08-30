# SIGIL — Deployment Runbook

This is the operational guide to take `sigilsovereign.com` from this repository
to a live, secured, indexed site. It is written to be followed top to bottom.

Everything the site needs at runtime is static; the only server-side component is
the optional briefing-form Worker (§5). The site works without it.

---

## 0. What you are deploying

- A static site in `dist/` (36 pages, EN + FR, plus machine files).
- Security headers (`public/_headers`, mirrored in `deploy/Caddyfile`).
- A Cloudflare Worker for the briefing form (`worker/`), optional.
- CI that builds, tests, deploys, and pings indexers (`.github/workflows/ci.yml`).

Build locally at any time:

```bash
npm install
node scripts/gen-llms.mjs
node scripts/build.mjs
# output in dist/
```

---

## 1. Domain & DNS — Namecheap → Cloudflare (recommended)

Namecheap stays the **registrar** (you keep ownership); Cloudflare runs the
**DNS** so you get API-driven records, one-click DNSSEC, and a CDN/WAF in front.

1. Create a free Cloudflare account and **Add a site** → `sigilsovereign.com`.
2. Cloudflare shows two nameservers (e.g. `xxx.ns.cloudflare.com`).
3. In **Namecheap → Domain List → Manage → Nameservers**, choose **Custom DNS**
   and enter the two Cloudflare nameservers. Save. (Propagation: minutes to a
   few hours.)
4. In **Cloudflare → DNS**, enable **DNSSEC** (it gives you a DS record to add
   back in Namecheap under **Advanced DNS → DNSSEC**).
5. Add a **CAA** record so only your CA may issue certs, e.g.
   `sigilsovereign.com CAA 0 issue "letsencrypt.org"` (and your CA if different).

> Prefer to stay entirely on Namecheap? You can — enable DNSSEC in Namecheap and
> add records there. You then lose Cloudflare's CDN/WAF and API-driven records,
> and the CI "Deploy to Cloudflare Pages" step does not apply (use the Caddy
> origin path in §4 instead).

---

## 2. Mail — Zoho

Add these DNS records (in Cloudflare, or Namecheap if you kept DNS there). Values
come from your Zoho admin console; the policy records below are what to publish.

| Type | Host | Value | Purpose |
|------|------|-------|---------|
| MX | `@` | `mx.zoho.com` (pri 10), `mx2.zoho.com` (20), `mx3.zoho.com` (50) | Delivery |
| TXT | `@` | `v=spf1 include:zoho.com -all` | SPF, hard fail |
| TXT | `zmail._domainkey` | (the 2048-bit key Zoho generates) | DKIM |
| TXT | `_dmarc` | `v=DMARC1; p=reject; rua=mailto:dmarc@sigilsovereign.com; adkim=s; aspf=s` | DMARC, reject |
| TXT | `@` | (Zoho domain-verification token) | Zoho verify |

Then, for full marks on mail-security scanners:

- **MTA-STS:** publish `_mta-sts.sigilsovereign.com TXT "v=STSv1; id=..."` and host
  a policy file at `https://mta-sts.sigilsovereign.com/.well-known/mta-sts.txt`
  listing `mx.zoho.com` etc. with `mode: enforce`.
- **TLS-RPT:** `_smtp._tls.sigilsovereign.com TXT "v=TLSRPTv1; rua=mailto:tls@sigilsovereign.com"`.

Create the mailboxes/aliases the site uses: `info@`, `security@`, `press@`.

> DMARC note: start with `p=none` for a week if you want to watch the `rua`
> reports before enforcing, then move to `p=reject`. The site's own mail is
> transactional and low-volume, so `p=reject` from day one is fine.

---

## 3. Search Console & Bing — one-time verification (enables auto-indexing)

1. **Google Search Console** → add property `sigilsovereign.com` (Domain
   property) → verify by **DNS TXT** (add the token as a TXT on `@`).
2. **Bing Webmaster Tools** → add the site → verify by DNS TXT as well (or import
   from GSC).
3. For the CI auto-submit step (§6), create a Google Cloud **service account**,
   enable the **Search Console API**, add the service-account email as a **full
   user** of the GSC property, and download its JSON key.

---

## 4. Hosting — choose one

### 4a. Cloudflare Pages (fastest path)

- CI already has a **Deploy to Cloudflare Pages** step. In Cloudflare, create a
  Pages project named `sigilsovereign` (can be "Direct Upload").
- Add repo secrets `CLOUDFLARE_API_TOKEN` (Pages:Edit) and
  `CLOUDFLARE_ACCOUNT_ID`. Push to `main` → CI builds, tests, and deploys `dist/`.
- Pages serves `public/_headers` automatically.
- **Important:** in Cloudflare, under **Bots / AI Scrapers and Crawlers**, leave
  "Block AI bots" **OFF** — otherwise the crawler allowances in `robots.txt`
  are silently overridden and the GEO/AEO work is defeated.

### 4b. SIGIL-controlled origin behind Cloudflare (recommended for the sovereignty story)

- Put `dist/` on a small server you control (e.g. Hetzner/OVH), served by Caddy
  using `deploy/Caddyfile` (HTTP/3, Brotli, headers, immutable caching).
- In Cloudflare DNS, add an `A`/`AAAA` record for `@` (and `www`) to the origin,
  **proxied** (orange cloud). Restrict the origin firewall to Cloudflare IP
  ranges so the origin is only reachable through Cloudflare.
- Deploy by rsync from CI (replace the Pages step) or by a pull on the origin.

Either way: submit the domain to the **HSTS preload list** (hstspreload.org)
once HTTPS is confirmed and the HSTS header (already set) is live.

---

## 5. Briefing form Worker (optional)

The contact form works today as a `mailto:` composer. To make it a true
server-side submission:

```bash
cd worker
npm i -g wrangler         # if not installed
wrangler secret put ZOHO_USER        # info@sigilsovereign.com
wrangler secret put ZOHO_PASS        # a Zoho app-specific password
wrangler secret put TO_ADDRESS       # info@sigilsovereign.com
wrangler secret put RECEIPT_SECRET   # any long random string
wrangler secret put TURNSTILE_SECRET # optional, if you enable Turnstile
wrangler deploy
```

`wrangler.toml` binds the Worker to `POST sigilsovereign.com/api/briefing` — the
same-origin endpoint the form's `data-endpoint` names, so the front-end upgrades
automatically once the Worker is live. The Worker relays through MailChannels
(free from Workers); if you prefer raw Zoho SMTP, run a tiny relay and point the
Worker at it (see comments in `worker/briefing.js`).

Add a Turnstile widget to the form if you want visible spam protection; the
Worker already verifies the token when `TURNSTILE_SECRET` is set. The invisible
honeypot works without any of this.

---

## 6. CI secrets (GitHub → Settings → Secrets and variables → Actions)

| Secret | For | Required? |
|--------|-----|-----------|
| `CLOUDFLARE_API_TOKEN` | Pages deploy | if using Pages |
| `CLOUDFLARE_ACCOUNT_ID` | Pages deploy | if using Pages |
| `INDEXNOW_KEY` | IndexNow ping | recommended |
| `GSC_SERVICE_ACCOUNT_JSON` | GSC sitemap submit | recommended |

For **IndexNow**, pick a key (a random 32-hex string), set it as `INDEXNOW_KEY`,
and add a matching file at the site root: `dist/<key>.txt` containing just the
key. The simplest way is to drop the file in `public/` so the build copies it:

```bash
echo "YOUR_KEY" > public/YOUR_KEY.txt
```

---

## 7. Updating the CSP hash

The site ships **one** inline script (the pre-paint theme/JS marker in
`src/lib/layout.js`). Its SHA-256 is allowlisted in the CSP. If you edit that
inline script, regenerate the hash:

```bash
node scripts/build.mjs
node - <<'EOF'
import { readFileSync } from "fs"; import crypto from "crypto";
const html = readFileSync("dist/index.html","utf8");
const m = html.match(/<script>\n([\s\S]*?)\n<\/script>/);
const h = crypto.createHash("sha256").update(m[1]).digest("base64");
console.log("sha256-" + h);
EOF
```

Put the new value in `public/_headers` and `deploy/Caddyfile` (the `script-src`
directive). The current hash is in `deploy_csp_hash.txt`.

---

## 8. Go-live checklist

- [ ] Nameservers moved; DNSSEC enabled; CAA set.
- [ ] Zoho MX/SPF/DKIM/DMARC(+MTA-STS/TLS-RPT) live; test at internet.nl and
      dmarcian; `info@`, `security@`, `press@` receive mail.
- [ ] Site deployed; `https://sigilsovereign.com` serves; `www` redirects.
- [ ] Cloudflare "Block AI bots" is **OFF**.
- [ ] Headers score **A+** at securityheaders.com and Mozilla Observatory.
- [ ] HSTS preload submitted.
- [ ] GSC + Bing verified; sitemap submitted; IndexNow key file live.
- [ ] Replace the PGP key: put the real armored public key in `public/pgp.txt`
      and sign `/.well-known/security.txt`; confirm the fingerprint on `/trust/`.
- [ ] Set the `Expires` date in `security.txt` to ≤1 year out.
- [ ] (Optional) Worker deployed; submit a test briefing and confirm receipt.
- [ ] Re-run `node scripts/build.mjs && npx html-validate "dist/**/*.html"` and
      the three `scripts/test-*.mjs` gates — all green.

---

## 9. What is intentionally not here

- No analytics, no cookies, no third-party scripts (the privacy page says so).
- No GitHub or LinkedIn for the company (by instruction).
- No RCCM on the site (by instruction); company location is "Buea, Cameroon".
- VIGIL and RÉCOR source code is stated as strictly private throughout.
- No mention of any regulatory submission.

---

## 10. GEO / AEO — operator steps that code cannot do

The full plan is in `docs/GEO-AEO-PLAN.md`. Everything on-site is enforced in
code and CI. These are the steps only the founder can take, in priority order.

**Cloudflare (one-time, critical):** Under Security → Bots, set "Block AI bots" /
"AI Scrapers and Crawlers" to **OFF** and Pay-Per-Crawl to **OFF**. Do not apply a
managed challenge to verified crawlers. `robots.txt` is an honor system; an edge
block silently removes the site from every AI answer engine.

**Verification (one-time, unlocks auto-indexing):** verify the domain in Google
Search Console and Bing Webmaster Tools (DNS TXT). Then every push submits the
sitemap to Google, pings IndexNow (Bing/Yandex/Naver/Seznam → ChatGPT search,
Copilot, DuckDuckGo), and publishes the feed via WebSub — no further manual work.

**Entity (the real lever for the word "SIGIL"):**
1. Create a **Wikidata item** for SIGIL SARL — instance of *business*; country
   Cameroon; headquarters Buea; inception 2026; founder; official website. Then
   add its URL to `Organization.sameAs` in `src/lib/jsonld.js`.
2. Create a **Google Business Profile** for SIGIL SARL (Buea).
3. On **thuramnana.com**, add `worksFor` / `founder` structured data pointing to
   `https://sigilsovereign.com/#org` and a visible link to the company.
4. Where appropriate, ask Open Ownership and UNDP for a public mention or link —
   the interactions are real; one institutional link outweighs any on-page tactic.
5. Publish two to four reference-grade notes a quarter; agent crawlers re-fetch
   reference pages almost daily.

**Quarterly:** refresh the crawler allow-list in `public/robots.txt` (new AI bots
ship quarterly), re-check the Cloudflare bot settings, and confirm sitemap
`<lastmod>` values are real (they come from git history in CI).
