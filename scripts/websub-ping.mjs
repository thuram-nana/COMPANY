// Notify the WebSub hub that the notes feed changed, so Google (Feedfetcher)
// and other subscribers are pushed the update instantly instead of polling.
// Runs in CI post-deploy. No secrets needed.
const HUB = "https://pubsubhubbub.appspot.com/";
const FEED = "https://sigilsovereign.com/feed.xml";
const res = await fetch(HUB, {
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  body: `hub.mode=publish&hub.url=${encodeURIComponent(FEED)}`
});
console.log(`WebSub publish ping: HTTP ${res.status} (204 = accepted)`);
