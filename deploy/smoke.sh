#!/usr/bin/env bash
# Post-deploy smoke test — run by CI after the Namecheap upload, or by hand:
#   bash deploy/smoke.sh https://sigilsovereign.com
# Fails (exit 1) if the live site does not serve the build with the expected
# redirects, headers, 404 pages, machine files, and form endpoint.
set -uo pipefail
BASE="${1:-https://sigilsovereign.com}"
BASE="${BASE%/}"
HOST="${BASE#https://}"; HOST="${HOST#http://}"; HOST="${HOST%%/*}"
fail=0
ok()   { printf 'ok    %s\n' "$1"; }
bad()  { printf 'FAIL  %s\n      %s\n' "$1" "$2"; fail=1; }
code() { curl -s -o /dev/null -m 25 -w '%{http_code}' "$@"; }
hdr()  { curl -sSI -m 25 "$1" | tr -d '\r' | grep -i "^$2:" | head -1 | cut -d' ' -f2-; }

# Give the host a moment to settle after upload.
body=""
for _ in 1 2 3 4 5 6; do
  body="$(curl -fsS -m 25 "$BASE/" 2>/dev/null)" && break
  sleep 10
done
grep -q "SIGIL SARL" <<<"$body"        && ok "home page serves the SIGIL build" || bad "home page" "no 'SIGIL SARL' in response body"
grep -q "Namecheap Parking" <<<"$body" && bad "parking page" "Namecheap parking page still served"

for h in strict-transport-security content-security-policy x-content-type-options referrer-policy x-frame-options; do
  v="$(hdr "$BASE/" "$h")"
  [ -n "$v" ] && ok "header $h" || bad "header $h" "missing on $BASE/"
done

# The CSP must allowlist the hash of the inline <head> script exactly as served.
inline="$(printf '%s' "$body" | perl -0777 -ne 'print $1 if /<script>(.*?)<\/script>/s')"
if [ -n "$inline" ]; then
  want="sha256-$(printf '%s' "$inline" | openssl dgst -sha256 -binary | openssl base64 -A)"
  csp="$(hdr "$BASE/" content-security-policy)"
  grep -qF "'$want'" <<<"$csp" && ok "CSP allowlists the inline script ($want)" || bad "CSP hash" "served CSP lacks '$want' — the inline <head> script is blocked"
else
  bad "CSP hash" "could not find the inline <head> script in the home page"
fi

r="$(curl -s -o /dev/null -m 25 -w '%{http_code} %{redirect_url}' "https://www.$HOST/")"
[ "$r" = "301 $BASE/" ] && ok "https www → apex 301" || bad "https www → apex" "got: $r"
r="$(curl -s -o /dev/null -m 25 -w '%{http_code} %{redirect_url}' "http://$HOST/systems/vigil/")"
[ "$r" = "301 $BASE/systems/vigil/" ] && ok "http → https 301 (single hop, path kept)" || bad "http → https" "got: $r"
r="$(curl -s -o /dev/null -m 25 -w '%{http_code} %{redirect_url}' "http://www.$HOST/")"
[ "$r" = "301 https://www.$HOST/" ] && ok "http www → https www 301 (same host first, HSTS-preload rule)" || bad "http www → https www" "got: $r"

[ "$(code "$BASE/systems/vigil/")" = "200" ] && ok "nested route /systems/vigil/" || bad "nested route" "/systems/vigil/ not 200"
[ "$(code "$BASE/fr/")" = "200" ]            && ok "french mirror /fr/"          || bad "french mirror" "/fr/ not 200"
r="$(curl -s -o /dev/null -m 25 -w '%{http_code}' "$BASE/this-page-does-not-exist/")"
[ "$r" = "404" ] && ok "unknown route → 404" || bad "404 status" "got: $r"
curl -s -m 25 "$BASE/this-page-does-not-exist/" | grep -q "SIGIL SARL" && ok "404 page is the built 404.html" || bad "404 body" "custom 404 page not served"
curl -s -m 25 "$BASE/fr/page-inexistante/" | grep -q 'lang="fr"' && ok "French 404 page under /fr/" || bad "French 404" "/fr/* 404 is not the French page"

ct="$(hdr "$BASE/.well-known/security.txt" content-type)"
grep -qi "text/plain" <<<"$ct" && ok "security.txt is text/plain" || bad "security.txt" "content-type: $ct"
[ "$(code "$BASE/sitemap-index.xml")" = "200" ] && ok "sitemap index" || bad "sitemap index" "not 200"
[ "$(code "$BASE/feed.xml")" = "200" ]          && ok "atom feed"     || bad "atom feed" "not 200"
[ "$(code "$BASE/robots.txt")" = "200" ]        && ok "robots.txt"    || bad "robots.txt" "not 200"
[ "$(code "$BASE/styles/app.css")" = "200" ]    && ok "stylesheet"    || bad "stylesheet" "/styles/app.css not 200"
[ "$(code "$BASE/fonts/plex-sans-400.woff2")" = "200" ] && ok "fonts" || bad "fonts" "woff2 not 200"

# The PHP handler ships with every deploy: a GET must get the JSON 405, not a 404 page or raw source.
r="$(curl -s -m 25 -w '\n%{http_code}' "$BASE/api/briefing")"
rb="${r%$'\n'*}"; rc="${r##*$'\n'}"
if [ "$rc" = "405" ] && [ "$rb" = '{"ok":false,"error":"method_not_allowed"}' ]; then
  ok "briefing endpoint answers 405 JSON to GET (PHP handler live)"
else
  bad "briefing endpoint" "GET → $rc, body: ${rb:0:80} (expected 405 {\"ok\":false,\"error\":\"method_not_allowed\"})"
fi
r="$(code "$BASE/_headers")"; [ "$r" = "200" ] && bad "_headers exposed" "should be 403/404" || ok "_headers not served ($r)"
r="$(code "$BASE/.ftp-deploy-sync-state.json")"; [ "$r" = "200" ] && bad "deploy state exposed" "should be 403/404" || ok "deploy state file not served ($r)"
r="$(code "$BASE/api/briefing.config.php")"; [ "$r" = "200" ] && bad "config exposed" "should be 403/404" || ok "briefing.config.php not served ($r)"

exit $fail
