# Devanilayam — Technical SEO & AI-Discoverability Audit

Date: 2026-07-23 · Framework: Nuxt 4 (SSR) + `@nuxtjs/seo` + `@nuxtjs/i18n` + `@nuxt/content`

This document summarises the audit and the fixes applied in this branch. Every
change was verified against a production build (`nuxt build`) and the Nitro
server output (curling the rendered HTML).

---

## Critical Issues (fixed)

### 1. Site was client-side rendered (`ssr: false`) — crawlers saw an empty shell
`nuxt.config.ts` had `ssr: false`, so search engines and AI crawlers received a
near-empty HTML document. All page content (slokas, ashtotaras, blogs) was also
fetched inside `onMounted()`, i.e. **only** in the browser.

- **Fix:** `ssr: true` and every page now fetches with `useAsyncData()` so the
  content is present in the server-rendered HTML.
- **Verified:** `GET /en/slokas/hanuman/hanuman-chalisa` returns the full sloka
  text, `<title>`, canonical, OG tags and JSON-LD in the raw HTML — no JS needed.
- **Files:** `nuxt.config.ts`, all `app/pages/**`, `app/components/Lord/list.vue`.

### 2. Missing / broken pages returned soft-200s
Unknown slokas/blogs rendered an empty page with HTTP 200 (soft-404), which
Google penalises.

- **Fix:** pages `throw createError({ statusCode: 404, fatal: true })` when the
  content is missing; `app/error.vue` renders a proper `noindex` 404.
- **Verified:** `GET /en/slokas/nonexistent/xyz` → **HTTP 404** with a
  `noindex, follow` error page.

### 3. AI crawlers not explicitly welcomed + broken `robots.txt`
The generated `robots.txt` contained malformed `/undefined/` rules (caused by
the i18n locale objects losing their `code` through module cloning), and AI
crawlers were not explicitly allowed.

- **Fix:** i18n `locales` are now passed as plain serializable objects (clean
  per-locale rules); `public/_robots.txt` explicitly allows GPTBot,
  OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, anthropic-ai,
  PerplexityBot, Google-Extended, Applebot-Extended, Bingbot, cohere-ai,
  Meta-ExternalAgent, Amazonbot, etc.
- **Verified:** `robots.txt` has zero `/undefined/` entries and lists all AI bots.

---

## Major Issues (fixed)

| Issue | Fix | File |
|------|-----|------|
| Dynamic content pages absent from sitemap | Added a server sitemap source enumerating every sloka, per-deity list, ashtotara and blog across all locales | `server/api/__sitemap__/urls.ts`, `nuxt.config.ts` |
| `twitter:card` set to a description string | Set to `summary_large_image` globally + per page | `nuxt.config.ts`, all pages |
| No `og:image` | Added a branded 1200×630 `og-image.png` + global `og:image`/`twitter:image` | `public/og-image.png`, `nuxt.config.ts` |
| No JSON-LD structured data | Injected server-rendered JSON-LD: Organization, WebSite, Article, BlogPosting, BreadcrumbList, ItemList, CollectionPage, Person | `app/composables/useJsonLd.ts`, layout + pages |
| No hreflang / multilingual signals | `useLocaleHead()` in the layout injects `<html lang>`, `dir`, and hreflang alternates (en, te, hi + x-default) | `app/layouts/default.vue` |
| Internal links hit 302 redirects (`/slokas` → `/en/slokas`) | All internal links use `useLocalePath()` | header, footer, side menu, cards, pages |
| Blog cards were `<div @click>` (not crawlable) | Converted to real `<NuxtLink>` anchors | `app/pages/blogs/index.vue` |
| No canonical tags | `@nuxtjs/seo` now emits canonicals (site url configured) | `nuxt.config.ts` |
| No PWA manifest / theme-color | Added `site.webmanifest`, `theme-color`, apple/mobile meta | `public/site.webmanifest`, `nuxt.config.ts` |

---

## Minor Issues (fixed)

- List/home pages had no `useSeoMeta` → added unique titles + descriptions.
- Policy pages are now `noindex, follow` (legal boilerplate shouldn't rank).
- External social links now use `rel="noopener noreferrer"` + `aria-label`.
- Primary navigation wrapped in a `<nav aria-label="Primary">` landmark.
- Duplicated per-page Twitter handles removed (now global defaults).

---

## SEO improvements

- Canonical + hreflang + OG + Twitter + JSON-LD are all present in SSR HTML.
- `titleTemplate: "%s | Devanilayam"` gives consistent, unique titles.
- Sitemap is locale-split (`/__sitemap__/en-US.xml`, `te-IN.xml`, `hi-IN.xml`)
  with `lastmod`, `priority` and `changefreq`.

## AI-search improvements

- All AI/LLM crawlers explicitly allowed in `robots.txt`.
- Entity-rich JSON-LD (Organization + WebSite identity graph, Article/BlogPosting
  with `author`, `keywords`, `datePublished`, `about`, `inLanguage`).
- Semantic HTML: single `<h1>` per page, `<main>`, `<nav>`, `<header>`,
  `<footer>`, real anchors — clear hierarchy for LLM extraction.
- Fully rendered HTML means ChatGPT/Perplexity/Gemini/Claude can read content
  without executing JavaScript.

## Performance improvements

- `preconnect` + `dns-prefetch` for Google Fonts; fonts already use
  `display=swap`.
- SSR + `nitro.prerender.crawlLinks` pre-renders discoverable routes for fast TTFB.
- Static, cacheable OG image instead of runtime image generation.

## Accessibility improvements

- Proper landmarks and `aria-label`s on nav and social links.
- Single H1 per page; heading hierarchy preserved.
- Error page no longer leaks raw internal error messages.

## Code-quality improvements

- Removed duplicated `onMounted` data-fetching in favour of `useAsyncData`.
- Cleaned pre-existing ESLint errors; `npx eslint app/ server/ nuxt.config.ts`
  now passes with **0 errors**.

---

## Recommended follow-ups (not in this PR)

1. **Add a real service worker / offline support** — `package.json` mentions PWA
   but no `@vite-pwa/nuxt` module is installed. Add it for installability; ensure
   the SW `navigateFallback` never shadows crawler requests.
2. **Per-page OG images** — enable `nuxt-og-image` (satori) to render sloka-title
   images once build fonts are available in CI.
3. **`SearchAction` / sitelinks searchbox** — add a real `/search?q=` results
   route, then declare a `WebSite` `potentialAction`.
4. **Footer "About" links** (`href="#"`) — point them at real pages or remove.
5. **Security headers** — set `Strict-Transport-Security`, `X-Content-Type-Options`,
   `Referrer-Policy: strict-origin-when-cross-origin`, and a `Content-Security-Policy`
   via `routeRules` headers (none currently block indexing; add as hardening).
6. **Internal linking** — add "related slokas / same deity" links on sloka pages
   and cross-links between slokas and ashtotaras to reduce crawl depth.
