/**
 * SIGIL briefing-form endpoint — Vercel serverless function (the chosen host).
 *
 * Served at POST /api/briefing on Vercel: the same contract as the cPanel PHP
 * handler (public/api/briefing.php) and the Cloudflare Worker (worker/briefing.js):
 *   POST (JSON or form-encoded) {name, organization, email, message, website}
 *   → 200 {ok:true, id:"SIGIL-…"}  |  4xx/5xx {ok:false, error:"…"}
 *
 * Mail leaves over SMTP (implicit TLS, e.g. Namecheap's mail server or Zoho),
 * with a dependency-free client below. Configure these environment variables in
 * Vercel (Project → Settings → Environment Variables), or the function answers
 * 502 and the front-end falls back to the visitor's own mail client — the form
 * keeps working either way:
 *   BRIEFING_SMTP_HOST   e.g. server402-2.web-hosting.com  (or smtp.zoho.com)
 *   BRIEFING_SMTP_PORT   465 (implicit TLS; the only mode supported here)
 *   BRIEFING_SMTP_USER   the sending mailbox, e.g. website@sigilsovereign.com
 *   BRIEFING_SMTP_PASS   its password (create the mailbox in cPanel / Zoho first)
 *   BRIEFING_TO          where requests are delivered, e.g. info@sigilsovereign.com
 *   RECEIPT_SECRET       optional; signs the receipt id
 */
import { createHmac } from "node:crypto";
import tls from "node:tls";

const ALLOW_ORIGIN = "https://sigilsovereign.com";
const MAX_BODY_BYTES = 65536;

// Abuse limits, mirroring the PHP handler: 5 per IP / 10 min, 60 global / hour.
// In-memory per warm instance — a first line of defence, not a guarantee (each
// serverless instance counts separately); see deploy/README.md §4d for the
// platform-level option.
const RATE_PER_IP = 5;
const RATE_IP_WINDOW_S = 600;
const RATE_GLOBAL = 60;
const RATE_GLOBAL_WINDOW_S = 3600;
const rateState = { ip: new Map(), all: [] };
function rateLimited(ip) {
  const now = Date.now();
  for (const [k, arr] of rateState.ip) {
    const live = arr.filter((t) => t > now - RATE_IP_WINDOW_S * 1000);
    if (live.length) rateState.ip.set(k, live); else rateState.ip.delete(k);
  }
  rateState.all = rateState.all.filter((t) => t > now - RATE_GLOBAL_WINDOW_S * 1000);
  const mine = rateState.ip.get(ip) || [];
  if (mine.length >= RATE_PER_IP || rateState.all.length >= RATE_GLOBAL) return true;
  mine.push(now);
  rateState.ip.set(ip, mine);
  rateState.all.push(now);
  return false;
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") { res.statusCode = 204; res.end(); return; }
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return json(res, 405, { ok: false, error: "method_not_allowed" });
  }
  const origin = String(req.headers.origin || "");
  if (origin !== "" && origin !== ALLOW_ORIGIN) {
    return json(res, 403, { ok: false, error: "bad_origin" });
  }

  // ---- parse body (Vercel's helper fills req.body; fall back to the stream) ----
  // The lazy req.body getter throws on malformed JSON (documented) — catch it.
  let data;
  try { data = req.body; } catch { return json(res, 400, { ok: false, error: "bad_request" }); }
  if (data === undefined) {
    // No helper: read the stream ourselves (bounded, with its own timeout).
    const raw = await readBody(req);
    if (raw === null) return json(res, 400, { ok: false, error: "bad_request" });
    try { data = JSON.parse(raw); } catch { return json(res, 400, { ok: false, error: "bad_request" }); }
  }
  if (typeof data === "string") {
    try { data = JSON.parse(data); } catch { return json(res, 400, { ok: false, error: "bad_request" }); }
  }
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    return json(res, 400, { ok: false, error: "bad_request" });
  }

  const field = (k) => {
    const v = data[k];
    return typeof v === "string" ? v.replace(/\0/g, "").trim() : "";
  };
  const name = field("name");
  const email = field("email");
  const organization = field("organization");
  const message = field("message");
  const website = field("website"); // honeypot

  // ---- validation (same rules as the Worker / PHP handler) --------------------
  const cp = (s) => [...s].length; // code points, like the PHP handler
  if (cp(name) < 2 || cp(name) > 200) return json(res, 422, { ok: false, error: "name" });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254
      || /[^\x21-\x7E]|[<>"(),;:\\\[\]]/.test(email)) {
    return json(res, 422, { ok: false, error: "email" });
  }
  if (cp(message) < 10 || cp(message) > 5000) return json(res, 422, { ok: false, error: "message" });
  if (cp(organization) > 200) return json(res, 422, { ok: false, error: "organization" });
  // Honeypot: silently accept and drop.
  if (website !== "") return json(res, 200, { ok: true, id: "ok" });

  // ---- rate limit (after validation, like the PHP handler: 422s cost nothing;
  // best-effort per warm instance — see runbook §4d note) ----------------------
  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    res.setHeader("Retry-After", String(RATE_IP_WINDOW_S));
    return json(res, 429, { ok: false, error: "rate_limited" });
  }

  const oneLine = (s) => s.replace(/[\r\n]+/g, " ").trim();
  const cleanName = oneLine(name);
  const cleanOrg = oneLine(organization);

  const secret = process.env.RECEIPT_SECRET || "unsigned";
  const receipt = "SIGIL-" +
    createHmac("sha256", secret).update(email + "|" + Date.now()).digest("hex").slice(0, 16);

  const env = process.env;
  if (!env.BRIEFING_SMTP_HOST || !env.BRIEFING_SMTP_USER || !env.BRIEFING_SMTP_PASS) {
    // Not configured yet: the front-end falls back to the mailto: composer.
    return json(res, 502, { ok: false, error: "send_failed" });
  }
  const from = env.BRIEFING_SMTP_USER;
  const to = env.BRIEFING_TO || "info@sigilsovereign.com";

  const subject = "Briefing request — " + (cleanOrg !== "" ? cleanOrg : cleanName);
  const body =
    "New briefing request from sigilsovereign.com\n\n" +
    `Name:         ${cleanName}\n` +
    `Organization: ${cleanOrg !== "" ? cleanOrg : "(not given)"}\n` +
    `Email:        ${email}\n` +
    `Receipt:      ${receipt}\n` +
    `Received:     ${new Date().toISOString().replace(/\.\d{3}Z$/, "Z")}\n\n` +
    "Message:\n" + message + "\n";

  const mime =
    `From: SIGIL website <${from}>\r\n` +
    `To: <${to}>\r\n` +
    `Reply-To: <${email}>\r\n` +
    `Subject: ${encodeHeader(subject)}\r\n` +
    `Date: ${new Date().toUTCString()}\r\n` +
    `Message-ID: <${receipt.toLowerCase()}.${Date.now()}@sigilsovereign.com>\r\n` +
    "MIME-Version: 1.0\r\n" +
    "Content-Type: text/plain; charset=UTF-8\r\n" +
    "Content-Transfer-Encoding: base64\r\n" +
    "X-Mailer: sigilsovereign-briefing\r\n" +
    "\r\n" +
    chunk76(Buffer.from(body, "utf8").toString("base64"));

  try {
    await smtpSend({
      host: env.BRIEFING_SMTP_HOST,
      port: Number(env.BRIEFING_SMTP_PORT || 465),
      user: env.BRIEFING_SMTP_USER,
      pass: env.BRIEFING_SMTP_PASS,
      from, to, mime,
      // test hook only — never set in production
      rejectUnauthorized: env.BRIEFING_SMTP_INSECURE_SKIP_VERIFY === "1" ? false : true,
    });
  } catch (e) {
    console.error("briefing: smtp failed:", e && e.message);
    return json(res, 502, { ok: false, error: "send_failed" });
  }
  return json(res, 200, { ok: true, id: receipt });
}

function json(res, status, obj) {
  res.statusCode = status;
  res.end(JSON.stringify(obj));
}

function readBody(req) {
  return new Promise((resolve) => {
    let size = 0; const chunks = [];
    const timer = setTimeout(() => resolve(null), 5000); // never hang an invocation
    const finish = (v) => { clearTimeout(timer); resolve(v); };
    req.on("data", (c) => { size += c.length; if (size > MAX_BODY_BYTES) { finish(null); req.destroy(); } else chunks.push(c); });
    req.on("end", () => finish(Buffer.concat(chunks).toString("utf8")));
    req.on("error", () => finish(null));
  });
}

/** RFC 2047: sequence of encoded-words ≤75 chars (≤39 input bytes, cut on code points, so even the first line with the header name stays ≤78 chars). */
function encodeHeader(s) {
  if (!/[^\x20-\x7E]/.test(s)) return s;
  const words = []; let chunk = "";
  for (const ch of s) {
    if (chunk !== "" && Buffer.byteLength(chunk + ch, "utf8") > 39) {
      words.push(`=?UTF-8?B?${Buffer.from(chunk, "utf8").toString("base64")}?=`);
      chunk = "";
    }
    chunk += ch;
  }
  if (chunk !== "") words.push(`=?UTF-8?B?${Buffer.from(chunk, "utf8").toString("base64")}?=`);
  // Fold with FWS (CRLF + space): every physical header line stays short
  // (RFC 5322 §2.2.3); decoders ignore whitespace between encoded-words
  // (RFC 2047 §6.2), so the decoded subject is unchanged.
  return words.join("\r\n ");
}

function chunk76(b64) {
  return (b64.match(/.{1,76}/g) || []).join("\r\n") + "\r\n";
}

/** Minimal SMTP submission client, implicit TLS (port 465), AUTH LOGIN. */
function smtpSend({ host, port, user, pass, from, to, mime, rejectUnauthorized }) {
  return new Promise((resolve, reject) => {
    const sock = tls.connect({ host, port, servername: host, rejectUnauthorized });
    let buf = ""; let step = 0; let done = false;
    let timer;
    const fail = (msg) => { if (!done) { done = true; clearTimeout(timer); try { sock.destroy(); } catch {} reject(new Error(msg)); } };
    timer = setTimeout(() => fail("smtp timeout"), 20000);
    const b64 = (s) => Buffer.from(s, "utf8").toString("base64");
    // Dot-stuffing per RFC 5321 §4.5.2, then the end-of-data marker.
    const payload = mime.replace(/\r?\n/g, "\r\n").replace(/(^|\r\n)\./g, "$1..") + "\r\n.\r\n";
    // The 250 after the DATA payload means the message is ACCEPTED — resolve
    // there and only send QUIT best-effort (many MTAs close without a 221).
    const steps = [
      { expect: 220, send: () => `EHLO briefing.sigilsovereign.com\r\n` },
      { expect: 250, send: () => `AUTH LOGIN\r\n` },
      { expect: 334, send: () => b64(user) + "\r\n" },
      { expect: 334, send: () => b64(pass) + "\r\n" },
      { expect: 235, send: () => `MAIL FROM:<${from}>\r\n` },
      { expect: 250, send: () => `RCPT TO:<${to}>\r\n` },
      { expect: 250, send: () => `DATA\r\n` },
      { expect: 354, send: () => payload },
      { expect: 250, send: null, accept: true },
    ];
    sock.on("error", (e) => fail("smtp connect: " + e.message));
    sock.on("close", () => fail("smtp connection closed"));
    sock.on("data", (d) => {
      buf += d.toString("utf8");
      // consume complete reply lines; multi-line replies use "NNN-", final line "NNN "
      for (;;) {
        const nl = buf.indexOf("\r\n");
        if (nl === -1) return;
        const line = buf.slice(0, nl); buf = buf.slice(nl + 2);
        if (/^\d{3}-/.test(line)) continue; // more lines of the same reply follow
        const code = Number(line.slice(0, 3));
        const s = steps[step];
        if (!s) return;
        if (code !== s.expect) return fail(`smtp step ${step}: expected ${s.expect}, got "${line.slice(0, 80)}"`);
        step += 1;
        if (s.accept) {
          done = true; clearTimeout(timer);
          try { sock.write("QUIT\r\n"); sock.end(); } catch {}
          resolve(); return;
        }
        if (s.send) sock.write(s.send());
      }
    });
  });
}
