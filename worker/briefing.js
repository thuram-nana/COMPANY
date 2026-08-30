/**
 * SIGIL briefing-form Worker
 * ==========================
 * Receives the briefing form POST, validates it, emails it to the institutional
 * inbox via Zoho, and returns a small JSON receipt. The website works without
 * this Worker (the form falls back to a mailto: composer); deploying the Worker
 * upgrades that to a true server-side submission.
 *
 * Deploy: see /worker/README.md. Requires these secrets/vars (wrangler secret put):
 *   ZOHO_USER      - the Zoho mailbox that sends (e.g. info@sigilsovereign.com)
 *   ZOHO_PASS      - a Zoho application-specific password for that mailbox
 *   TO_ADDRESS     - where briefing requests are delivered (info@sigilsovereign.com)
 *   TURNSTILE_SECRET (optional) - Cloudflare Turnstile secret for spam control
 *   RECEIPT_SECRET - random string, used to sign the receipt id
 *
 * The Worker is bound to POST https://sigilsovereign.com/api/briefing
 * (the same-origin endpoint the form's data-endpoint attribute names).
 */

const ALLOW_ORIGIN = "https://sigilsovereign.com";

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return cors(new Response(null, { status: 204 }));
    if (request.method !== "POST") return cors(json({ ok: false, error: "method_not_allowed" }, 405));

    // Basic same-origin check.
    const origin = request.headers.get("Origin") || "";
    if (origin && origin !== ALLOW_ORIGIN) return cors(json({ ok: false, error: "bad_origin" }, 403));

    let data;
    const ct = request.headers.get("content-type") || "";
    try {
      if (ct.includes("application/json")) data = await request.json();
      else {
        const form = await request.formData();
        data = Object.fromEntries(form.entries());
      }
    } catch {
      return cors(json({ ok: false, error: "bad_request" }, 400));
    }

    const name = (data.name || "").toString().trim();
    const email = (data.email || "").toString().trim();
    const organization = (data.organization || "").toString().trim();
    const message = (data.message || "").toString().trim();

    // Validation.
    if (name.length < 2 || name.length > 200) return cors(json({ ok: false, error: "name" }, 422));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return cors(json({ ok: false, error: "email" }, 422));
    if (message.length < 10 || message.length > 5000) return cors(json({ ok: false, error: "message" }, 422));
    // Honeypot: a hidden field named "website" must stay empty.
    if ((data.website || "").toString().length > 0) return cors(json({ ok: true, id: "ok" })); // silently accept + drop

    // Optional Turnstile verification.
    if (env.TURNSTILE_SECRET) {
      const token = (data["cf-turnstile-response"] || "").toString();
      const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: `secret=${encodeURIComponent(env.TURNSTILE_SECRET)}&response=${encodeURIComponent(token)}`
      }).then(r => r.json()).catch(() => ({ success: false }));
      if (!verify.success) return cors(json({ ok: false, error: "captcha" }, 403));
    }

    const receiptId = await signReceipt(env.RECEIPT_SECRET || "unsigned", email + "|" + Date.now());

    const subject = `Briefing request — ${organization || name}`;
    const body =
      `New briefing request from sigilsovereign.com\n\n` +
      `Name:         ${name}\n` +
      `Organization: ${organization || "(not given)"}\n` +
      `Email:        ${email}\n` +
      `Receipt:      ${receiptId}\n\n` +
      `Message:\n${message}\n`;

    try {
      await sendViaZoho(env, { subject, body, replyTo: email });
    } catch (e) {
      return cors(json({ ok: false, error: "send_failed" }, 502));
    }

    return cors(json({ ok: true, id: receiptId }));
  }
};

/* Zoho delivery via their SMTP REST bridge. Zoho's SMTP is smtp.zoho.com:465;
   from a Worker we use the Zoho Mail API token OR an SMTP-over-HTTP relay. The
   simplest robust path on Workers is Zoho's transactional API; if you prefer raw
   SMTP, run this behind a tiny relay. This function uses fetch to Zoho's send API. */
async function sendViaZoho(env, { subject, body, replyTo }) {
  // Zoho Mail API: POST /api/accounts/{accountId}/messages  (requires OAuth).
  // For a small contact form, an application password + a relay such as
  // MailChannels (free from Cloudflare Workers) is the least-friction path:
  const payload = {
    personalizations: [{ to: [{ email: env.TO_ADDRESS }] }],
    from: { email: env.ZOHO_USER, name: "SIGIL website" },
    reply_to: { email: replyTo },
    subject,
    content: [{ type: "text/plain", value: body }]
  };
  const res = await fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok && res.status !== 202) {
    // Fallback: surface the error to the caller.
    throw new Error("relay_status_" + res.status);
  }
}

async function signReceipt(secret, data) {
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  const bytes = new Uint8Array(sig).slice(0, 8);
  return "SIGIL-" + [...bytes].map(b => b.toString(16).padStart(2, "0")).join("");
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } });
}
function cors(res) {
  res.headers.set("Access-Control-Allow-Origin", ALLOW_ORIGIN);
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "content-type");
  return res;
}
