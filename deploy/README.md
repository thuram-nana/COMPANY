# SIGIL — Deployment Runbook

This is the operational guide to take `sigilsovereign.com` from this repository
to a live, secured, indexed site. It is written to be followed top to bottom.

Everything the site needs at runtime is static; the only server-side component is
the optional briefing-form handler (§5). The site works without it.

**Where things stand (30 Aug 2026).** The domain is registered at Namecheap; its
DNS runs on the Namecheap shared-hosting nameservers
(`dns1/dns2.namecheaphosting.com`, server `server402-2.web-hosting.com`), which
also host mail. **The chosen web host is Vercel (§4d):** DNS stays where it is —
only the `@` A record and the `www` record point at Vercel, so cPanel mail keeps
working untouched. The Namecheap-cPanel (§4c), Cloudflare Pages (§4a) and Caddy
(§4b) paths remain fully documented if you ever move.

---

## 0. What you are deploying

- A static site in `dist/` (38 pages, EN + FR, plus machine files).
- Security headers, four ways — the host you deploy to reads exactly one:
  `vercel.json` (**Vercel — the chosen host**), `public/.htaccess`
  (Apache / LiteSpeed, i.e. Namecheap cPanel), `public/_headers` (Cloudflare
  Pages), `deploy/Caddyfile` (Caddy origin). Keep them in sync; the build fails
  if the CSP hash drifts in any of the four.
- The briefing-form handler, three ways: `api/briefing.js` (Vercel serverless
  function, SMTP), `public/api/briefing.php` (runs as-is on cPanel), or the
  Cloudflare Worker in `worker/`. Optional either way — without one the form
  falls back to the visitor's own mail client.
- CI that builds, tests, deploys, smoke-tests, and pings indexers
  (`.github/workflows/ci.yml`), and `.cpanel.yml` for cPanel's own Git deploy.

Build locally at any time (Node ≥ 22.22):

```bash
npm install
node scripts/gen-llms.mjs
node scripts/build.mjs
# output in dist/
```

---

## 1. Domain & DNS

### 1a. Stay on Namecheap DNS (current setup — nothing to change)

DNS is served by the hosting nameservers and edited in **cPanel → Zone Editor**.
The `A` record for `@` and `www` already points at the hosting server; the
parking page is just the placeholder `index.html` in `public_html`.

Two cautions specific to Namecheap hosting:

- **CAA.** AutoSSL on Namecheap does not use Let's Encrypt: the live certificate
  is issued by **SSL.com** (verified on 30 Aug 2026; older accounts may see
  Sectigo). If you add a CAA record, it must include the issuer that actually
  renews your certificate (check with
  `openssl s_client -connect sigilsovereign.com:443 </dev/null | openssl x509 -noout -issuer`)
  — a CAA that only lists `letsencrypt.org` silently breaks the next renewal.
  Easiest: do not add CAA until you control issuance yourself.
- **DNSSEC.** Not available on this setup: Namecheap does not support DNSSEC for
  domains pointed at its shared-hosting nameservers. It becomes possible only
  after §1b (Cloudflare signs the zone and you paste the DS record into
  Namecheap → Advanced DNS).

### 1b. Move DNS to Cloudflare (optional, later)

Namecheap stays the **registrar** (you keep ownership); Cloudflare runs the
**DNS** so you get API-driven records, one-click DNSSEC, and a CDN/WAF in front.

1. Create a free Cloudflare account and **Add a site** → `sigilsovereign.com`.
2. Cloudflare shows two nameservers (e.g. `xxx.ns.cloudflare.com`).
3. In **Namecheap → Domain List → Manage → Nameservers**, choose **Custom DNS**
   and enter the two Cloudflare nameservers. Save. (Propagation: minutes to a
   few hours.) Re-create the `A`/`MX`/`TXT` records from cPanel's Zone Editor in
   Cloudflare first, or mail and the site go dark during the switch.
4. In **Cloudflare → DNS**, enable **DNSSEC** (it gives you a DS record to add
   back in Namecheap under **Advanced DNS → DNSSEC**).
5. Add a **CAA** record matching your certificate issuer (§1a caution applies).
6. Set SSL/TLS mode to **Full (strict)**. The `.htaccess` also honours
   `X-Forwarded-Proto`, so a proxied origin never redirect-loops.

---

## 2. Mail

Today `MX` points at Namecheap's hosting mail (`mx*-hosting.jellyfish.systems`),
so mailboxes live in cPanel. Two options:

### 2a. cPanel mailboxes (works today)

**cPanel → Email Accounts** → create `info@`, `security@`, `press@` (or one
mailbox plus forwarders). The zone already carries cPanel's SPF
(`v=spf1 +a +mx … include:spf.web-hosting.com ~all`), a DKIM key
(`default._domainkey`) and a `_dmarc` record with `p=none`. **cPanel → Email
Deliverability** shows SPF/DKIM status with one-click repair. In **Zone Editor**,
**edit the existing `_dmarc` TXT** (do not add a second one — two DMARC records
cancel each other out, RFC 7489 §6.6.3) to:

| Type | Host | Value |
|------|------|-------|
| TXT | `_dmarc` | `v=DMARC1; p=reject; rua=mailto:dmarc@sigilsovereign.com; adkim=s; aspf=s` |

### 2b. Zoho (the original plan)

Add or edit these records (in cPanel → Zone Editor, or Cloudflare if you moved
DNS). Values come from your Zoho admin console; the policy records below are
what to publish. **A zone must hold exactly one `v=spf1` TXT and one `_dmarc`
TXT** — replace the existing values, never add a second record.

| Type | Host | Value | Purpose |
|------|------|-------|---------|
| MX | `@` | `mx.zoho.com` (pri 10), `mx2.zoho.com` (20), `mx3.zoho.com` (50) | Delivery |
| TXT | `@` | `v=spf1 include:zoho.com -all` | SPF, hard fail |
| TXT | `zmail._domainkey` | (the 2048-bit key Zoho generates) | DKIM |
| TXT | `_dmarc` | `v=DMARC1; p=reject; rua=mailto:dmarc@sigilsovereign.com; adkim=s; aspf=s` | DMARC, reject |
| TXT | `@` | (Zoho domain-verification token) | Zoho verify |

**Required on cPanel when MX points off-server:** **cPanel → Email Routing →
Remote Mail Exchanger** for `sigilsovereign.com`. Otherwise the server treats the
domain as local and mail from the site (the PHP briefing handler, §5) never leaves.
The PHP handler sends from the hosting server with `Return-Path`
`website@sigilsovereign.com` and cPanel's DKIM signature, so keep
`+a include:spf.web-hosting.com` in the SPF record and keep the
`default._domainkey` DKIM record alongside Zoho's — or the briefing mails fail
DMARC at Zoho.

Then, for full marks on mail-security scanners:

- **MTA-STS:** publish `_mta-sts.sigilsovereign.com TXT "v=STSv1; id=..."` and host
  a policy file at `https://mta-sts.sigilsovereign.com/.well-known/mta-sts.txt`
  listing `mx.zoho.com` etc. with `mode: enforce`.
- **TLS-RPT:** `_smtp._tls.sigilsovereign.com TXT "v=TLSRPTv1; rua=mailto:tls@sigilsovereign.com"`.

> DMARC note: start with `p=none` for a week if you want to watch the `rua`
> reports before enforcing, then move to `p=reject`. The site's own mail is
> transactional and low-volume, so `p=reject` from day one is fine.

---

## 3. Search Console & Bing — one-time verification (enables auto-indexing)

1. **Google Search Console** → add property → choose **URL prefix** (NOT
   "Domain") → enter `https://sigilsovereign.com/` → verify with the **HTML
   file** method: download the `google<token>.html` file and commit it to
   `public/` (the build ships it forever; no DNS involved). The URL-prefix type
   matters: `scripts/gsc-submit.mjs` targets exactly this property string — a
   Domain property would 403 the API call.
2. **Bing Webmaster Tools** → Sign in → Add site → **Import from Google Search
   Console** (one click, no DNS). Then find Bing's **AI Performance** report —
   the only free first-party metric of AI-answer citations (Copilot/Bing).
3. For the CI auto-submit step (§6), create a Google Cloud **service account**,
   enable the **Search Console API**, add the service-account email as a **full
   user** of the GSC property, and download its JSON key.

---

## 4. Hosting — choose one

### 4d. Vercel (the chosen host)

Static files plus one serverless function. `vercel.json` carries the headers,
caching, and trailing-slash canonicalisation; `api/briefing.js` serves
`POST /api/briefing`. CI deploys with the Vercel CLI after every green build on
`main` — production only ever gets what the tests passed.

**One-time setup (≈10 minutes):**

1. **Account + token.** Sign up at <https://vercel.com/signup> (you can log in
   with your GitHub account). **Plan:** Vercel's fair-use terms restrict the free
   Hobby plan to personal, non-commercial use; a company site belongs on **Pro**
   (US$20/user/month, trial available) — Hobby will work technically but risks
   the deployment being paused for policy reasons. Your call to make, knowingly.
   Then create a token at <https://vercel.com/account/settings/tokens> — name it
   `sigil-ci`, scope: your account, expiration as you like. Copy it.
2. **GitHub secret.** Add `VERCEL_TOKEN` at
   <https://github.com/thuram-nana/COMPANY/settings/secrets/actions/new>.
   That is the only secret this path needs — CI creates/links the Vercel project
   (`sigilsovereign`) by itself on the first run.
3. **First deploy.** Push to `main` or run the workflow by hand
   (<https://github.com/thuram-nana/COMPANY/actions/workflows/ci.yml> → *Run
   workflow*). The `deploy` job builds, deploys to production, and tries to
   attach the domains (harmless if that needs finishing in the dashboard).
4. **Domains.** In the Vercel dashboard → project `sigilsovereign` → **Settings →
   Domains**, make sure both `sigilsovereign.com` (primary) and
   `www.sigilsovereign.com` (redirect to the primary) are listed. Vercel shows
   the DNS records it wants — use exactly those values in step 5.
5. **DNS (cPanel → Zone Editor → Manage;** mail stays untouched**):**
   - Edit the `A` record for `sigilsovereign.com.` → change `162.213.253.110` to
     the IP Vercel's domain page shows (typically `76.76.21.21`).
   - Delete the `A` record for `www.sigilsovereign.com.` and add a `CNAME`
     `www` → exactly the value Vercel shows (a project-specific
     `….vercel-dns-0xx.com` name on newer projects).
   - Touch nothing else: `MX`, `mail`, `webmail`, TXT records all stay.
   Propagation is minutes (up to a few hours). Vercel then issues certificates
   for both names automatically.
6. **Verify.** Re-run the workflow (the Vercel smoke test arms itself once the
   domain resolves to Vercel), or locally:
   `bash deploy/smoke.sh https://sigilsovereign.com` — all `ok`.
7. **Briefing form (optional server-side sending).** The form works from day one
   via the visitor's mail client. To make it send server-side, give the function
   SMTP credentials in Vercel → project → **Settings → Environment Variables**
   (Production):

   | Variable | Value |
   |----------|-------|
   | `BRIEFING_SMTP_HOST` | `server402-2.web-hosting.com` (cPanel mail) or `smtp.zoho.com` |
   | `BRIEFING_SMTP_PORT` | `465` |
   | `BRIEFING_SMTP_USER` | `website@sigilsovereign.com` — create this mailbox first (§2a) |
   | `BRIEFING_SMTP_PASS` | that mailbox's password |
   | `BRIEFING_TO` | `info@sigilsovereign.com` |
   | `RECEIPT_SECRET` | any long random string (optional) |

   Redeploy (any push) and `curl -s https://sigilsovereign.com/api/briefing`
   must answer `405 {"ok":false,"error":"method_not_allowed"}`.

**Notes.**
- The briefing function rate-limits per warm instance (5/IP per 10 min, 60/hour
  overall — same numbers as the PHP handler), but serverless instances don't
  share state, so this is best-effort. For hard enforcement add a Vercel WAF
  rate-limit rule on `POST /api/briefing` (Firewall tab; requires the Pro plan)
  or an external store.
- Page URLs canonicalise to a trailing slash via an explicit redirect that
  **excludes `/api/`** — Vercel's `trailingSlash: true` would 308-redirect
  `/api/briefing` before the function runs. Keep it that way.
- Vercel answers permanent redirects with **308** (equivalent to 301; the smoke
  test accepts both) and redirects `http://` to `https://` on the same host, so
  the HSTS-preload requirements hold here too.
- The 404 page is the built `404.html`; Vercel has no per-directory 404s, so
  `/fr/…` misses get the English page (correct 404 status either way).
- `vercel build` in CI strips the files that belong to other hosts
  (`_headers`, `.htaccess`, `api/briefing.php`) from the upload.
- **Alternative (no CI involvement):** import the repo in the Vercel dashboard
  (<https://vercel.com/new>, framework "Other" — `vercel.json` supplies the
  build). Vercel then deploys every push itself. Downsides: deploys are not
  gated on the test suite, and Vercel's shallow clone degrades the sitemap's
  per-page `lastmod` accuracy. Don't run both paths at once — pick the token
  path **or** the Git integration.
- If Namecheap hosting is ever cancelled, its nameservers go with it: move DNS
  to Cloudflare (§1b) or Namecheap BasicDNS first, re-creating the records.

### 4c. Namecheap shared hosting — cPanel / LiteSpeed (fallback, fully wired)

The site is plain files in `public_html`; `public/.htaccess` (built into
`dist/.htaccess`) supplies HTTPS + `www`→apex redirects, the security headers,
caching, MIME types, the 404 page, and the `/api/briefing` route. CI uploads
`dist/` over **FTPS** after every green build on `main`, then runs
`deploy/smoke.sh` against the live site.

**One-time setup (≈10 minutes):**

1. **FTP credentials.** Either use the main cPanel login, or (better) create a
   dedicated account: **cPanel → FTP Accounts → Add FTP Account**, directory
   `public_html`. Host **must be `server402-2.web-hosting.com`**, port **21**,
   explicit **FTPS**: the FTP server presents a certificate for
   `*.web-hosting.com`, so `ftp.sigilsovereign.com` (which also resolves) fails
   certificate verification — the workflow verifies it (`security: strict`).
2. **GitHub → repo → Settings → Secrets and variables → Actions:**

   | Kind | Name | Value |
   |------|------|-------|
   | Secret | `NAMECHEAP_FTP_HOST` | `server402-2.web-hosting.com` |
   | Secret | `NAMECHEAP_FTP_USER` | the FTP username (dedicated accounts look like `deploy@sigilsovereign.com`) |
   | Secret | `NAMECHEAP_FTP_PASSWORD` | its password |
   | Variable (optional) | `NAMECHEAP_FTP_DIR` | `public_html/` (default, for the main cPanel login) or `./` for a dedicated account rooted at `public_html` |

3. **Clean the parking page.** In **cPanel → File Manager → public_html**, delete
   `nc_assets/` and any placeholder `.htaccess` (the deploy overwrites
   `index.html` and ships its own `.htaccess`, but never deletes files it did
   not upload). Leave `cgi-bin/` alone.
   **From now on `public_html/.htaccess` belongs to the repository.** The FTPS
   deploy re-uploads it only when `public/.htaccess` changes in git (the action
   diffs against its own state file, not the server), so a block written there
   by a cPanel tool (PHP-version handler, "Force HTTPS Redirect", Hotlink
   Protection, Directory Privacy…) lingers for a while and then vanishes with an
   unrelated commit. Never enable those tools; put what you need in
   `public/.htaccess` instead.
4. **PHP.** The account default (PHP 8.2 on Namecheap shared servers) is fine;
   `briefing.php` needs ≥ 7.4. If you change it, Namecheap's tool is **cPanel →
   Exclusive for Namecheap Customers → Select PHP Version** (some accounts also
   show MultiPHP Manager); afterwards open `public_html/.htaccess` in File
   Manager and, if a `# php -- BEGIN cPanel-generated handler` block appeared,
   move it into `public/.htaccess` (see step 3). Keep the `mbstring` extension
   on (correct character counting for accented text). PHP may create
   `public_html/api/error_log`; `.htaccess` refuses to serve it.
5. **Deploy.** Push to `main`, or **Actions → build-test-deploy → Run workflow**.
   The `deploy` job prints which targets are configured, uploads, and the smoke
   test verifies redirects, headers, the 404, machine files, and the endpoint.

**The CI FTPS deploy is the only routine writer of `public_html`.** It syncs
against `public_html/.ftp-deploy-sync-state.json`, not against the server: if
anything else ever writes there (the two alternatives below, or a File Manager
edit), delete that state file afterwards so the next CI run re-uploads
everything.

**Deploying by hand (no CI):** any FTPS client to `public_html`, or over SSH on
port **21098** — shell access is **off by default** on Namecheap shared hosting;
enable it first in **cPanel → Exclusive for Namecheap Customers → Manage Shell**
(SFTP on the same port works without it, `rsync` does not):

```bash
rsync -avz --delete \
  --exclude _headers --exclude sbom.json --exclude '.ftp-deploy-sync-state.json' \
  --exclude cgi-bin --exclude '.well-known/pki-validation' --exclude '.well-known/acme-challenge' \
  --exclude 'api/briefing.config.php' --exclude 'api/error_log' \
  -e 'ssh -p 21098' dist/ <cpanel-user>@server402-2.web-hosting.com:public_html/
bash deploy/smoke.sh https://sigilsovereign.com
```

#### cPanel Git deploy (alternative, no secrets in GitHub)

`dist/` is committed, so **cPanel → Git Version Control → Create** (clone
`https://github.com/thuram-nana/COMPANY.git` to a path *outside* `public_html`),
then **Update from Remote → Deploy HEAD Commit**. `.cpanel.yml` copies `dist/`
into `public_html` (and removes the FTP state file, see above). This is a manual
pull of whatever is committed; CI's FTPS deploy is the automatic, tested one.

**Compression:** LiteSpeed compresses server-wide; verify with a GET (LiteSpeed
omits `Content-Encoding` on HEAD, so `curl -I` always prints nothing):
`curl -s -o /dev/null -D - -H 'Accept-Encoding: br, gzip' https://sigilsovereign.com/ | grep -i content-encoding`.

**HSTS preload:** the header already carries `includeSubDomains; preload`, and
`.htaccess` redirects `http://www` to `https://www` before going to the apex
(hstspreload.org requires the same-host hop). Before submitting, confirm
`mail.`, `webmail.`, `cpanel.` and any other subdomain you use also answer over
valid HTTPS — preload is hard to undo.

### 4a. Cloudflare Pages

- CI has a **Deploy to Cloudflare Pages** step. In Cloudflare, create a Pages
  project named `sigilsovereign` (can be "Direct Upload").
- Add repo secrets `CLOUDFLARE_API_TOKEN` (Pages:Edit) and
  `CLOUDFLARE_ACCOUNT_ID`. Push to `main` → CI builds, tests, and deploys `dist/`.
- Pages serves `public/_headers` automatically (`.htaccess` is ignored there).
- **Important:** in Cloudflare, under **Bots / AI Scrapers and Crawlers**, leave
  "Block AI bots" **OFF** — otherwise the crawler allowances in `robots.txt`
  are silently overridden and the GEO/AEO work is defeated.

### 4b. SIGIL-controlled origin behind Cloudflare (the sovereignty posture)

- Put `dist/` on a small server you control (e.g. Hetzner/OVH), served by Caddy
  using `deploy/Caddyfile` (HTTP/3, Brotli, headers, immutable caching).
- In Cloudflare DNS, add an `A`/`AAAA` record for `@` (and `www`) to the origin,
  **proxied** (orange cloud). Restrict the origin firewall to Cloudflare IP
  ranges so the origin is only reachable through Cloudflare.
- Deploy by rsync from CI (replace the FTPS step) or by a pull on the origin.

Either way: submit the domain to the **HSTS preload list** (hstspreload.org)
once HTTPS is confirmed and the HSTS header (already set) is live.

---

## 5. Briefing form handler (optional)

The contact form works with no server at all: JavaScript posts to
`/api/briefing`; if that fails, the next press of **Send** uses the form's
native `mailto:` action and opens the visitor's mail client. Deploying a handler
upgrades that to a true server-side submission with an inline receipt.

**On Vercel — the chosen host — the handler is `api/briefing.js`; its SMTP
variables are in §4d step 7.** The sections below cover the other hosts.

### 5a. On Namecheap / cPanel — `public/api/briefing.php`

Nothing to install: the file ships with `dist/`, `.htaccess` routes
`/api/briefing` to it, and it sends with PHP `mail()` through the server's MTA.
Validation, honeypot and the `SIGIL-…` receipt id follow the same rules as the
Worker, plus a 200-character cap on the organization field (mirrored by the
form), header-safe email characters only, and a rate limit the Worker left to
Cloudflare (5 submissions per IP per 10 minutes, 60 per hour overall → `429`,
after which the form falls back to the visitor's mail client).

- Delivery goes to `info@sigilsovereign.com` from `website@sigilsovereign.com`,
  with the envelope sender (`Return-Path`) set to the same address so SPF/DMARC
  align and cPanel's DKIM signs for the domain. If the mailbox is in cPanel
  (§2a) that is local delivery and just works. If MX is external (§2b) set
  **Email Routing → Remote Mail Exchanger** first.
- To change addresses or sign receipts, create `public_html/api/briefing.config.php`
  **on the server** (never commit it; the deploy leaves it alone and `.htaccess`
  refuses to serve it):

  ```php
  <?php return [
    'to'             => 'info@sigilsovereign.com',
    'from'           => 'website@sigilsovereign.com',
    'receipt_secret' => 'a long random string',
  ];
  ```
- Test: submit the form on `/contact/`; the inline message shows the receipt id,
  and the email carries the same id. `curl -s https://sigilsovereign.com/api/briefing`
  must answer `405 {"ok":false,"error":"method_not_allowed"}`.

### 5b. On Cloudflare — the Worker in `worker/`

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
automatically once the Worker is live. **The Worker's mail transport is stale and
untested:** it posts to the MailChannels API without credentials, but the free
MailChannels-for-Workers integration was retired on 30 June 2024 and
unauthenticated calls are rejected. Before using this path, give
`sendViaZoho()` in `worker/briefing.js` a real transport (a paid MailChannels
API key, Cloudflare's own email sending, or an SMTP relay). On Namecheap, the
PHP handler (§5a) is the supported path.

Add a Turnstile widget to the form if you want visible spam protection; the
Worker already verifies the token when `TURNSTILE_SECRET` is set. The invisible
honeypot works without any of this.

---

## 6. CI secrets (GitHub → Settings → Secrets and variables → Actions)

| Secret | For | Required? |
|--------|-----|-----------|
| `VERCEL_TOKEN` | Vercel deploy (§4d) | **yes — the chosen host** |
| `NAMECHEAP_FTP_HOST` / `_USER` / `_PASSWORD` | Namecheap FTPS deploy (§4c) | only if using cPanel hosting |
| `NAMECHEAP_FTP_DIR` (a *variable*) | upload directory, default `public_html/` | optional |
| `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` | Pages deploy (§4a) | if using Pages |
| `INDEXNOW_KEY` | IndexNow ping | recommended |
| `GSC_SERVICE_ACCOUNT_JSON` | GSC sitemap submit | recommended |

The workflow reads presence of these secrets into job-level `env` flags and
skips unconfigured steps (the `secrets` context cannot be used in a step-level
`if:` — that is what made every early run fail before any job started).

**IndexNow is fully automated:** the `INDEXNOW_KEY` secret is set, and the
build writes `dist/<key>.txt` automatically whenever it is present — every
deploy pings Bing/Yandex/Naver/Seznam (which feed Copilot, DuckDuckGo and
ChatGPT-adjacent retrieval). Rotation = change the one secret; engines
re-verify on their own. No manual key file, ever.

---

## 7. Updating the CSP hash

The site ships **one** inline script (the pre-paint theme/JS marker in
`src/lib/layout.js`). Its SHA-256 is allowlisted in the CSP. If you edit that
inline script, regenerate the hash:

```bash
node scripts/build.mjs
node - <<'EOS'
import { readFileSync } from "fs"; import crypto from "crypto";
const html = readFileSync("dist/index.html","utf8");
const m = html.match(/<script>([\s\S]*?)<\/script>/);   // exact text, newlines included
const h = crypto.createHash("sha256").update(m[1]).digest("base64");
console.log("sha256-" + h);
EOS
```

Put the new value in `vercel.json`, `public/.htaccess`, `public/_headers`, and
`deploy/Caddyfile` (the `script-src` directive). `scripts/build.mjs` recomputes
the hash on every build and **fails if any of the four files does not allowlist
it**;
`deploy/smoke.sh` re-checks it against the live site. Browsers hash the exact
child text of the `<script>` element — the newlines after `<script>` and before
`</script>` included — which is why the recipe above must not trim.

The policy also carries `style-src-attr 'unsafe-inline'`: the pages use
`style=""` attributes (form fields, spacing, the mark's `--mk-i` indices), and a
CSP without it silently strips all of them. `<style>` elements and stylesheets
stay restricted to `'self'`.

---

## 8. Go-live checklist

- [ ] DNS: decided §1a or §1b; DNSSEC on (only possible after §1b); CAA only if
      it names the real issuer.
- [ ] Mail: `info@`, `security@`, `press@` receive mail; SPF/DKIM/DMARC pass at
      internet.nl / dmarcian; Remote Mail Exchanger set if MX is external.
- [ ] Vercel: `VERCEL_TOKEN` set; domains attached; DNS `@`/`www` moved (§4d);
      CI `deploy` job green; `bash deploy/smoke.sh https://sigilsovereign.com`
      all `ok`. (If on cPanel instead: FTP secrets set, `nc_assets/` removed,
      no cPanel tool writes to `public_html/.htaccess`.)
- [ ] `https://sigilsovereign.com` serves; `www` and `http://` redirect in one hop.
- [ ] Headers score **A+** at securityheaders.com and Mozilla Observatory.
- [ ] Briefing form: a test submission arrives with a `SIGIL-…` receipt.
- [ ] HSTS preload submitted (after the subdomain check in §4c).
- [ ] GSC + Bing verified; sitemap submitted; IndexNow key file live.
- [ ] Replace the PGP key: put the real armored public key in `public/pgp.txt`
      and sign `/.well-known/security.txt`; confirm the fingerprint on `/trust/`.
- [ ] Set the `Expires` date in `security.txt` to ≤1 year out.
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

**Edge blocking (one-time, critical):** on Vercel, edge blocking is opt-in — in
the project's **Firewall** tab, leave **Attack Challenge Mode OFF** in normal
operation (it challenges every visitor, crawlers included), do not enable
managed bot-protection / "block AI bots" rules, and make sure no custom WAF rule
challenges verified crawlers. (On Namecheap hosting there is no bot-blocking
layer. If you ever put Cloudflare in front: Security → Bots → "Block AI bots"
**OFF**, Pay-Per-Crawl **OFF**, no managed challenge for verified crawlers.)
`robots.txt` is an honor system; an edge block silently removes the site from
every AI answer engine.

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
ship quarterly), re-check any edge bot settings, and confirm sitemap
`<lastmod>` values are real (they come from git history in CI).
