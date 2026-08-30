# SIGIL briefing-form Worker

A small Cloudflare Worker that receives the contact page's briefing form,
validates it, emails it to `info@sigilsovereign.com`, and returns a receipt.

**The website does not need this Worker.** Without it, the form falls back to a
`mailto:` composer that opens the visitor's mail client. Deploying the Worker
upgrades that to a true server-side submission with an inline success message.

## Deploy

```bash
npm i -g wrangler
wrangler login

# secrets (never commit these)
wrangler secret put ZOHO_USER        # info@sigilsovereign.com
wrangler secret put ZOHO_PASS        # a Zoho application-specific password
wrangler secret put TO_ADDRESS       # info@sigilsovereign.com
wrangler secret put RECEIPT_SECRET   # any long random string
wrangler secret put TURNSTILE_SECRET # optional (only if you add a Turnstile widget)

wrangler deploy
```

`wrangler.toml` routes the Worker to `POST sigilsovereign.com/api/briefing`,
which is exactly the endpoint the contact form names in `data-endpoint`. Once
the Worker is live, `src/assets/briefing.js` automatically submits via `fetch`
instead of `mailto:`.

## How mail is sent

`briefing.js` relays through **MailChannels**, which is free to call from
Cloudflare Workers and requires no SMTP credentials in the Worker. If you would
rather send through Zoho SMTP directly (`smtp.zoho.com:465`), stand up a tiny
relay and point the `sendViaZoho()` fetch at it — the function is isolated and
commented for exactly this.

## Spam protection

- **Honeypot** — an invisible `website` field; if a bot fills it, the Worker
  silently accepts and drops. Works with no configuration.
- **Turnstile** (optional) — add Cloudflare's invisible Turnstile widget to the
  form and set `TURNSTILE_SECRET`; the Worker verifies the token.

## Response shape

```json
{ "ok": true, "id": "SIGIL-1a2b3c4d" }
```

The `id` is an HMAC receipt over the sender + timestamp, useful for correlating
a submission with the delivered email.
