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

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify(body)
});
console.log(`IndexNow: submitted ${urls.length} URLs, status ${res.status}`);
