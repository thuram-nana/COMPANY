// Ping IndexNow with the site's URLs so Bing/Copilot/ChatGPT-search/Yandex pick
// up changes within hours. Runs in CI post-deploy. Requires INDEXNOW_KEY env and
// a matching key file at https://sigilsovereign.com/<key>.txt (see deploy/README.md).
import { readFileSync } from "fs";

const KEY = process.env.INDEXNOW_KEY;
if (!KEY) { console.log("INDEXNOW_KEY not set; skipping"); process.exit(0); }

const HOST = "sigilsovereign.com";
const sitemap = readFileSync("dist/sitemap.xml", "utf8");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);

const body = {
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList: urls
};

// Pre-flight: the live key file must serve the key EXACTLY before we submit —
// submitting first poisons IndexNow's key-validation cache with a failure that
// then 403s every later ping for up to ~48h (rotation of the key clears it).
const keyUrl = `https://${HOST}/${KEY}.txt`;
const served = await fetch(keyUrl).then(r => (r.ok ? r.text() : null)).catch(() => null);
if (served === null || served.trim() !== KEY) {
  console.log(`IndexNow: SKIPPED — ${keyUrl} does not serve the key (got: ${served === null ? "error/404" : JSON.stringify(served.slice(0, 40))}). Fix the key file before pinging.`);
  process.exit(0);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify(body)
});
const text = await res.text().catch(() => "");
console.log(`IndexNow: submitted ${urls.length} URLs, status ${res.status}${text ? " — " + text.slice(0, 200) : ""}`);
if (res.status === 403) {
  console.log("IndexNow: 403 usually means a previously-cached key failure — rotate INDEXNOW_KEY (new secret; the build ships the new file automatically) and redeploy.");
}
