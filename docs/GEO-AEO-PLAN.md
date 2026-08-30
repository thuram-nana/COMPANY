# SIGIL — GEO / AEO / SEO & Auto-Indexing Plan

**Site:** sigilsovereign.com · **Owner:** SIGIL SARL · **Date:** 30 August 2026
**Research basis:** current (mid-2026) first-party crawler logs, Google Search Central's published position on AI Overviews / AI Mode, IndexNow's 2026 participant list, and the 2026 AI-citation studies (SE Ranking, ALLMO, OrganiKPI, BrightEdge, LumenGEO).

---

## 0. The honest objective

**Goal as stated:** "when someone types SIGIL we should be the first to show in any browser or AI."

**What is true and what is not.** The bare word *sigil* is a common English noun (a magical seal) with a Wikipedia article, dictionary entries, a widely-used open-source ebook editor named *Sigil*, a D&D location, games, and other companies — each with years of authority and links. No on-site optimization can outrank that on day one for a generic dictionary word; that position is earned through **entity recognition and authority over time**, most of which lives off-site.

**What this plan engineers for — and can realistically achieve:**

| Target | Achievability | Horizon |
|---|---|---|
| **#1 for branded/entity queries** — "SIGIL SARL", "SIGIL Sovereign", "sigilsovereign", "Sovereign Integrity Governance Infrastructure Labs", "SIGIL Buea", "SIGIL Cameroon", "SIGIL governance infrastructure", "SIGIL VIGIL / RÉCOR / APEX" | High | Days–weeks after indexing |
| **Cited source in AI answers** when asked about *the company* (ChatGPT, Copilot, Perplexity, Claude, Gemini/AI Overviews) | High, if the off-site entity work in §6 is done | Weeks |
| **Disambiguation surfaced** for bare "sigil" (AI answers that mention "SIGIL SARL, a Cameroonian governance-infrastructure company" as a distinct sense) | Medium | Months |
| **#1 for bare "sigil" in web search** | Low without sustained authority | Long-term, off-site |

The single biggest lever for the last two rows is not code at all: a **Wikidata item** plus consistent entity citations (§6). Everything in code (§1–§5) makes the site maximally crawlable, understandable, citable, and self-indexing — the necessary foundation the off-site work stands on.

---

## 1. What the 2026 research actually says (and what it kills)

### 1.1 Who cites you — the crawler classes
AI crawlers now split into four jobs, and only two of them produce citations:

- **Agent** (live fetch when a person asks): `ChatGPT-User`, `Perplexity-User`, `Claude-User`, `Meta-ExternalFetcher`. Highest intent. In a June-2026 first-party log, `ChatGPT-User` alone was 42% of all AI-bot hits and re-fetched a reference page on 13 of 14 days.
- **Retrieval** (builds the answer index): `OAI-SearchBot`, `PerplexityBot`, `Claude-SearchBot`, `DuckAssistBot`.
- **Search** (classic index that also feeds AI): `Googlebot`, `bingbot` (Bing's index feeds Copilot and parts of ChatGPT search).
- **Training** (bulk corpus): `GPTBot`, `ClaudeBot`, `CCBot`, `Bytespider`, `Meta-ExternalAgent`, `Amazonbot`. These produce no citations — but being in training corpora is how future models *know* SIGIL SARL exists, which serves the brand goal.

**Decision:** allow every class explicitly. The common failure is a 2023-era "block all AI" rule that removes a site from AI answers. Crawlers ship quarterly, so the allow-list is reviewed quarterly (§7).

### 1.2 `llms.txt` — keep it, but it is not a lever
Google's documentation (June 2026) states Search ignores `llms.txt`; no major AI company commits to acting on it; an ML study found it adds noise to citation prediction, and an analysis of 94,000+ cited URLs found no uplift. It *is* consumed by IDE agents (Claude Code, Cursor, Copilot) and MCP tools, and Google added it to Lighthouse's agentic-browsing audits. **Decision:** keep it as cheap agent scaffolding; do not treat it as visibility work.

### 1.3 Google AI Overviews / AI Mode — no shortcut exists
Google's position is explicit: no special AI schema, no separate AI index. A page must be **indexed, snippet-eligible, and reachable by Googlebot**, then it is judged by core Search systems plus query fan-out. Structured data helps only when it matches visible content. Encouragingly, **47% of AI Overview citations come from pages ranking below #5** and domain-authority correlation has fallen (r≈0.18) — structure and extractability beat raw authority, which favours a new, well-built site.

### 1.4 What measurably drives AI citation (2026 studies)
1. Factual claims written as **short, independently parseable declarative sentences**.
2. **H2/H3 headings that define self-contained spans** (a heading + its paragraph answers one question completely).
3. **Visible published/updated dates, visible bylines, and Article schema** — anonymous content is cited ~40% less.
4. **Consistent entity descriptions** across authoritative places (Wikidata, directories, the founder's own site).
5. **Multi-modal pages** (text + image + structured data) select at materially higher rates.
6. **Positional bias:** the key facts must sit in the top ~35% of the page.
7. **Earned authority:** Tier-1 coverage and links — off-site.

### 1.5 Auto-indexing — the real 2026 map
- **Google does not support IndexNow** (confirmed July 2026). Its automated paths are an accurate XML sitemap plus the Search Console API; the Google Indexing API is limited to job postings and livestreams and does not apply. Google says `<lastmod>` must be *accurate* or it learns to ignore it — a single build-date stamped on every URL every deploy is an anti-pattern.
- **IndexNow** (universal endpoint `api.indexnow.org`) notifies Bing, Yandex, Naver, Seznam and Yep at once — and Bing's index feeds **ChatGPT search, Copilot and DuckDuckGo**, so IndexNow is directly relevant to AI citation, not just Bing.
- **Feeds + WebSub** give Google and aggregators an instant push signal for new notes.

---

## 2. Crawl access — ENFORCED IN CODE
- `robots.txt` explicitly allows the full 2026 token set: Googlebot, Googlebot-Image, Google-Extended, bingbot, Applebot, Applebot-Extended, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, anthropic-ai, PerplexityBot, Perplexity-User, DuckDuckBot, DuckAssistBot, Meta-ExternalAgent, Meta-ExternalFetcher, Bytespider, Amazonbot, CCBot, YandexBot, Yeti (Naver), SeznamBot, cohere-ai, YouBot, MistralAI-User, plus `*`.
- Cloudflare **Content Signals** line declares `search=yes, ai-input=yes, ai-train=yes` so the edge never infers a block.
- `Sitemap:` directive → sitemap index.
- **Operator config (runbook):** Cloudflare "Block AI bots" OFF, Pay-Per-Crawl OFF, no managed challenge for verified crawlers. robots.txt is an honor system; the CDN edge is where accidental blocks happen.

## 3. Snippet eligibility & page-level signals — ENFORCED IN CODE
- Every page: `<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">` — the explicit full-snippet permission Google requires for AI-feature eligibility.
- Canonical, reciprocal hreflang (en / fr / x-default), single H1, unique title + description, Open Graph + Twitter card, `lang`/`dir`, theme-color — all present and validated.
- A visible **"Last updated"** date on every page, mirrored in schema.
- `<link rel="alternate" type="application/atom+xml">` on every page → the notes feed.

## 4. Entity foundation — ENFORCED IN CODE (structured data)
The `Organization` node (`#org`, referenced by every page) is hardened so machines resolve *SIGIL SARL* as one distinct entity:
- `name`, `legalName`, and **`alternateName`** covering every form people type: SIGIL · SIGIL SARL · Sovereign Integrity Governance Infrastructure Labs · SIGIL Labs · sigilsovereign · SIGIL Sovereign.
- **`description`** — the canonical one-sentence definition (identical to the visible "What is SIGIL?" answer).
- **`disambiguatingDescription`** — states plainly it is not the Sigil ebook editor or the common noun. This is a schema.org property built for exactly this collision.
- `foundingDate`, `foundingLocation` (Buea, Cameroon), `areaServed`, `address`, `contactPoint`, `founder` (Person linked by `@id` to the founder's established entity at thuramnana.com).
- `knowsAbout` expanded to the full topic field: sovereign governance infrastructure · beneficial-ownership registries · FATF R.24/R.25 · BODS · public-procurement integrity · UNCAC · OCDS · governed cybersecurity · cryptographic proof of finding.
- `image` / `logo` → the OG image (multi-modal signal).
- `sameAs` — **deliberately empty until real profiles exist.** Nothing is fabricated. The plan's §6 fills it (Wikidata first).
- A `WebPage` node per page with `datePublished`, `dateModified`, `inLanguage`, `isPartOf` → `WebSite`, `about` → `#org`, `primaryImageOfPage`.
- Existing: `WebSite`, `SoftwareApplication` per system (status + private-source as PropertyValue), `DefinedTermSet` status vocabulary, `BreadcrumbList`, `FAQPage` on system pages, `TechArticle` with author on notes.

## 5. Answer-engine content structure — ENFORCED IN CODE
- **"What is SIGIL?" block** near the top of the home and company pages: one declarative definition sentence, then three atomic facts (what it builds, where, who founded it) and one visible disambiguation sentence — matching the schema word-for-word so visible content and structured data agree (Google's stated requirement).
- **Entity FAQ** (`FAQPage`) on home and company: *What is SIGIL? Where is SIGIL based? What does SIGIL build? Who founded SIGIL? Is SIGIL the ebook editor?* — direct, self-contained answers; the last one is the disambiguation question people and engines actually ask.
- Every system page already opens with a direct-answer paragraph and carries FAQ schema; headings are question-shaped and self-contained.
- Honest, specific, quotable facts are preferred over adjectives (e.g., "43 patterns across 8 categories", "nine-stage verification pipeline", "BODS v0.4 conformance confirmed to Open Ownership on 1 July 2026").

## 6. Auto-indexing & freshness — ENFORCED IN CODE / CI (zero manual work after one-time verification)
- **Sitemap `<lastmod>` per URL from git history** (last commit touching that page's source or the shared data), falling back to build date — accurate freshness, so Google trusts it.
- **IndexNow on every deploy** (already in CI) → Bing/Yandex/Naver/Seznam → ChatGPT search / Copilot / DuckDuckGo.
- **Search Console sitemap submission on every deploy** (already in CI) → Google.
- **Atom feed** (`/feed.xml`) of the notes + **WebSub hub ping on every deploy** → instant push discovery for Google and feed consumers.
- `404.html` for correct not-found handling on static hosts.
- **One-time human steps that unlock the automation:** verify the domain in Google Search Console and Bing Webmaster Tools (DNS TXT, once), set the CI secrets (`CLOUDFLARE_*`, `INDEXNOW_KEY` + key file, `GSC_SERVICE_ACCOUNT_JSON`). After that, every push indexes itself.

## 7. Off-site entity work — THE LEVERS FOR "SIGIL" ITSELF (founder actions, cannot be automated)
In priority order. Each one, once done, gets added to `Organization.sameAs` — never before.
1. **Wikidata item for SIGIL SARL** — instance of *business*; country Cameroon; headquarters Buea; inception 2023; founder → (create/link the founder item); official website. This is the single strongest Knowledge-Graph and AI-disambiguation signal available to a new entity.
2. **Google Business Profile** (Buea) — a local entity and Knowledge Panel seed.
3. **Founder's site → company:** on thuramnana.com add `worksFor`/`founder` structured data pointing at `https://sigilsovereign.com/#org` and a visible link. The founder entity already exists; this transfers recognition to the company.
4. **Authoritative directories with an identical NAP** (name/address/phone) — optional and at the founder's discretion, since no company GitHub/LinkedIn is to be published.
5. **Earned mentions:** Open Ownership (the BODS demonstration) and UNDP are real interactions — where appropriate, request a public mention or link. One credible institutional link outweighs any on-page tactic.
6. **Publishing cadence:** reference-grade notes get re-fetched by agent crawlers almost daily. Two to four substantive notes a quarter compounds.

## 8. Measurement & maintenance (automated where possible)
- Search Console + Bing Webmaster: impressions/clicks/index coverage by query, automatically after verification; the first thing to watch is the branded-query set in §0.
- Server/CDN logs: presence of `OAI-SearchBot`, `PerplexityBot`, `Claude-SearchBot`, `ChatGPT-User` confirms the site is in the citation pool (see runbook).
- **Quarterly:** refresh the crawler allow-list in `robots.txt` (new bots ship on a quarterly cadence); re-check Cloudflare bot settings; review `dateModified` accuracy.

## 9. What is deliberately NOT done
- No fabricated `sameAs`, reviews, ratings, awards, or "as seen in" — false structured data is a manual-action risk and, on this site, a credibility risk.
- No keyword stuffing, doorway pages, or scaled AI-generated filler — Google warns explicitly against scaled content built to manipulate AI answers.
- No claims of deployment, endorsement, or national status the record does not support (all three systems remain honestly marked pre-deployment).
