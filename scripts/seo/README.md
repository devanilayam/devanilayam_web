# SEO verification scripts

Local checks for the Nuxt SEO setup. Both scripts build the production output
(if missing), boot the SSR server, run their checks, and tear the server down.

## `verify.sh` — SEO smoke test

Asserts every SEO surface renders in the server HTML, with a pass/fail summary:

- `robots.txt` is dynamic, indexable, references the sitemap, and has no
  malformed `/undefined/` locale rules
- AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, OAI-SearchBot)
  are explicitly addressed — this site is meant to be readable by assistants,
  not just search engines
- the sitemap index is served, fans out per locale, and has entries for all three
- for each checked route: `<title>`, meta description, canonical, `og:*`,
  `twitter:card`, `<html lang>`, the full hreflang cluster including
  `x-default`, Schema.org JSON-LD that actually parses, an `<h1>`, presence in
  the sitemap, enough server-rendered text to prove SSR ran, and a rendered
  OG PNG
- missing content returns a hard `404` (not a soft-200) and its error page is
  `noindex`, and policy pages are `noindex`
- each route's OG card is **unique to that route** — if every page reports the
  same image URL, per-page generation has silently fallen back to one static
  file, which is how this used to be broken
- the security headers are present, and the CSP forbids framing and plugins and
  pins `base-uri`
- the `WebSite` schema declares a `SearchAction`, and the endpoint it names
  actually answers: `/search?q=` returns server-rendered results, is `noindex`,
  is kept out of the sitemap, and returns nothing for an empty query (a
  prerendered `/search` would serve the same page for every query)
- no `href="#"` placeholder links survive in the nav or footer

```bash
scripts/seo/verify.sh                 # build if needed, boot, check
BUILD=1 scripts/seo/verify.sh         # force a fresh build first
PORT=4000 scripts/seo/verify.sh       # different local port
ROUTES="/en /te" scripts/seo/verify.sh                        # check specific routes
BASE_URL=https://<preview>.vercel.app scripts/seo/verify.sh   # check a remote deploy
```

Exit code = number of failed checks (`0` = all green). Also runnable as
`bun run seo:verify`.

### How routes are chosen

The route list is **derived from the sitemap at runtime**, not hardcoded. The
server already enumerates every sloka, ashtotara and blog across all locales
for the sitemap (`server/api/__sitemap__/urls.ts`), so that is the single
source of truth; a hand-kept list here would drift the moment content is added.

The default run checks each locale root plus one representative of every page
type, which keeps the run fast while still asserting each template's metadata.
Raise `SAMPLE_PER_SECTION` to widen the sample, or set `ROUTES` explicitly.

### Why the `Accept` header matters

Every document fetch sends a browser-like `Accept: text/html,…`. Nitro
content-negotiates, so without it error routes answer with JSON instead of the
rendered error page — and a check that omits it tests something no crawler ever
sees.

## `lighthouse.sh` — Lighthouse CI (SSR-aware)

The `lighthouserc*.json` files hold only assertions, so `lhci autorun` on its
own cannot locate a static dir for this SSR app. This script points Lighthouse
at the running server instead.

```bash
scripts/seo/lighthouse.sh                          # desktop config, /en
scripts/seo/lighthouse.sh lighthouserc.mobile.json # throttled mobile
URLS="/en /te /en/slokas" scripts/seo/lighthouse.sh
```

Accessibility is an **error** gate at 0.9; performance, SEO and best-practices
are warnings, so a noisy local run never blocks work.

URLs are locale-prefixed on purpose: `/` is only a redirect stub under the i18n
`prefix` strategy, and auditing a meta-refresh page measures nothing.

Also runnable as `bun run seo:lighthouse`.

## Notes

- Requires `curl`, `bun` and `node`. `lighthouse.sh` also needs Chrome.
- Lighthouse is intentionally **not** in CI: it needs Chrome and several runs
  per URL, which is too slow and noisy to gate every push.
- For live social-card previews (WhatsApp/X/LinkedIn) a public URL is still
  required — deploy a Vercel preview and pass it via `BASE_URL=`.
