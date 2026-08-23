# Devanilayam

An ad-free devotional platform to read, learn and practice Hindu slokas,
ashtotaras and stotras in multiple scripts — English, Telugu and Hindi — with
meanings and audio.

Live at **[devanilayam.com](https://devanilayam.com)**.

## Stack

- [Nuxt 4](https://nuxt.com) + Vue 3, server-side rendered
- [Bun](https://bun.sh) as package manager and runtime
- SCSS with a token-driven design system
- Self-hosted webfonts (`public/fonts`) — no runtime or build-time requests to
  Google, and Telugu/Devanagari faces so Indic content is not left to system
  fallbacks
- `@nuxt/content` for the devotional corpus, `@nuxtjs/i18n` for the three
  scripts, `@nuxtjs/seo` for metadata and structured data
- `@vite-pwa/nuxt` for installability and offline support
- Deployed on Vercel

## Setup

```bash
bun install   # dependencies, Nuxt types, and the git hooks
bun run dev   # http://localhost:3000
```

## Scripts

### Development

| Command | Description |
| --- | --- |
| `bun run dev` | Development server |
| `bun run build` | Production build into `.output` |
| `bun run preview` | Serve the production build |
| `bun run generate` | Fully static build |
| `bun run build:icons` | Regenerate the icon font from the SVG set |

### Quality gates

| Command | Description |
| --- | --- |
| `bun run lint` / `lint:fix` | ESLint over TS, JS and Vue |
| `bun run lint:style` / `lint:style:fix` | Stylelint over SCSS and `<style>` blocks |
| `bun run typecheck` | `vue-tsc --noEmit` |
| `bun run test` / `test:watch` | Vitest — Vue/TS units and sass-true SCSS specs |
| `bun run pwa:verify` | Manifest, icons, service worker and offline fallback |
| `bun run seo:verify` | robots, sitemap, per-route meta/OG/hreflang/JSON-LD, OG image, soft-404s |
| `bun run seo:lighthouse` / `seo:lighthouse:mobile` | Lighthouse CI against the running SSR server |

The first four run on every commit through the `pre-commit` hook, and all of
them except Lighthouse run in CI.

`seo:verify` takes `ROUTES=`, `PORT=`, `BUILD=1` and `BASE_URL=` (to check a
deployed preview instead of a local build) — see
[scripts/seo/README.md](scripts/seo/README.md). Its exit code is the number of
failed checks.

### Generated assets

| Command | Output |
| --- | --- |
| `bun run pwa:icons` | `public/icons/` — home-screen and maskable icons (committed) |
| `bun run play:assets` | `.play/` — Play Store icon and feature graphic |
| `bun run play:screenshots` | `.play/screenshots/` — Play Store screenshots |
| `bun run android:version` | Syncs `android/twa-manifest.json` with `package.json` |

Every generated asset is drawn from the site's own logo component and palette,
so the store listing and the home-screen icon can never drift from the brand.

## Automation

| Workflow | Trigger | Does |
| --- | --- | --- |
| **CI** | push to `main`, all PRs | lint → typecheck → tests → build, then the PWA and SEO gates |
| **Release** | push to `main` | semantic-release: version, `CHANGELOG.md`, git tag, GitHub release |
| **Android (TWA)** | manual | Bubblewrap build of the signed `.aab` / `.apk` |

Versions are never set by hand: semantic-release derives them from the
conventional commit history, which the `commit-msg` hook enforces.

## Documentation

- [CONTRIBUTING.md](CONTRIBUTING.md) — how to work on the site
- [BRANCHING.md](BRANCHING.md) — branch naming, PRs and how releases are cut
- [SECURITY.md](SECURITY.md) — reporting a vulnerability
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) — community expectations
