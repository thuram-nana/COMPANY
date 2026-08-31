// Notify the WebSub hub that the notes feed changed, so Google (Feedfetcher)
// and other subscribers are pushed the update instantly instead of polling.
// Runs in CI post-deploy. No secrets needed.
import { readFileSync } from "fs";
const HUB = "https://pubsubhubbub.appspot.com/";
const FEED = "https://sigilsovereign.com/feed.xml";
try {
  const prev = readFileSync(process.env.PREV_FEED || "/nonexistent", "utf8");
  if (prev && prev === readFileSync("dist/feed.xml", "utf8")) {
    console.log("WebSub: feed unchanged; skipping ping");
    process.exit(0);
  }
} catch { /* no snapshot: ping */ }
const res = await fetch(HUB, {
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  body: `hub.mode=publish&hub.url=${encodeURIComponent(FEED)}`
});
console.log(`WebSub publish ping: HTTP ${res.status} (204 = accepted)`);
