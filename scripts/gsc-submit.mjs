// Submit the sitemap to Google Search Console using a service account, so Google
// re-crawls on deploy without any manual step. Runs in CI post-deploy.
//
// Setup (once): create a Google Cloud service account, enable the Search Console
// API, add the service account email as a full user of the sigilsovereign.com
// property in Search Console, and store its JSON key as the GSC_SERVICE_ACCOUNT_JSON
// secret. Property must be verified (DNS TXT — see deploy/README.md).
//
// This uses only the built-in fetch + a JWT we sign with the service account key.
import crypto from "crypto";

const raw = process.env.GSC_SERVICE_ACCOUNT_JSON;
if (!raw) { console.log("GSC_SERVICE_ACCOUNT_JSON not set; skipping"); process.exit(0); }
const sa = JSON.parse(raw);

const SITE = "https://sigilsovereign.com/";
const SITEMAP = "https://sigilsovereign.com/sitemap-index.xml";

function b64url(buf) { return Buffer.from(buf).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_"); }

async function accessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(JSON.stringify({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/webmasters",
    aud: "https://oauth2.googleapis.com/token",
    iat: now, exp: now + 3600
  }));
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(`${header}.${claim}`);
  const sig = b64url(signer.sign(sa.private_key));
  const assertion = `${header}.${claim}.${sig}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: `grant_type=${encodeURIComponent("urn:ietf:params:oauth:grant-type:jwt-bearer")}&assertion=${assertion}`
  }).then(r => r.json());
  if (!res.access_token) throw new Error("token error: " + JSON.stringify(res));
  return res.access_token;
}

const token = await accessToken();
const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/sitemaps/${encodeURIComponent(SITEMAP)}`;
const res = await fetch(url, { method: "PUT", headers: { authorization: `Bearer ${token}` } });
console.log(`GSC sitemap submit: status ${res.status}`);
