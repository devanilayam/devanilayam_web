# Contributing to Devanilayam

Thanks for helping. This document covers what you need to work on the site:
how to run it, what the gates check, and how commits and releases work.

## Requirements

- [Bun](https://bun.sh) 1.2 or newer (package manager *and* runtime)
- Node.js 22+ (used by the built server and the Lighthouse scripts)

## Getting started

```bash
bun install     # installs dependencies and the git hooks
bun run dev     # http://localhost:3000
```

`bun install` runs `nuxt prepare` and then `commitguard install`, which writes
the `pre-commit` and `commit-msg` hooks defined in `commitguard.yaml`. If you
ever need to remove them: `bunx commitguard uninstall`.

## The gates

Everything CI checks can be run locally, and the pre-commit hook already runs
the first three:

| Command | What it checks |
| --- | --- |
| `bun run lint` | ESLint over TS, JS and Vue |
| `bun run lint:style` | Stylelint over SCSS and `<style>` blocks |
| `bun run typecheck` | `vue-tsc --noEmit` |
| `bun run test` | Vitest — TS/Vue units and sass-true SCSS specs |
| `bun run build` | The production build |
| `bun run pwa:verify` | Manifest, icons, service worker, offline fallback |
| `bun run seo:verify` | robots, sitemap, per-route meta/OG/hreflang/JSON-LD, OG image, soft-404s |

`--fix` variants exist for both linters: `bun run lint:fix`,
`bun run lint:style:fix`.

Lighthouse is deliberately *not* in CI — it needs Chrome and three runs per
URL, which is too slow and too noisy to gate every push. Run it by hand when
you touch layout, fonts or images:

```bash
bun run seo:lighthouse         # desktop
bun run seo:lighthouse:mobile  # throttled mobile
```

Accessibility is an error at 0.9; performance, SEO and best-practices are
warnings. Both SEO scripts are documented in
[scripts/seo/README.md](scripts/seo/README.md).

## Code style

The repository is opinionated and the linters are the source of truth:

- Three-space indentation, double quotes, semicolons, trailing commas
- Padded blocks — a blank line after `{` and before `}` in functions
- SCSS is written with the modern module system (`@use`), never `@import`
- Class names are kebab-case BEM; SCSS variables, mixins and functions are
  kebab-case
- Design tokens live in `app/assets/scss/tokens`, and anything mirrored in
  TypeScript lives in `app/utils/design`

## Fonts

Webfonts are self-hosted in `public/fonts` and declared with an explicit `src`,
so builds never reach the network to resolve them. Read
[public/fonts/README.md](public/fonts/README.md) before adding or replacing
one — in particular, the `fallbacks` list is what stops text reflowing when the
webfont swaps in, and Indic faces are what stop Telugu and Devanagari content
rendering as tofu boxes.

## Content and languages

The site ships in English, Telugu and Hindi. When you add or change anything
user-facing:

- Put strings in `app/locales/*.json`, never inline in a component
- Verify devotional content in every script it ships in — a transliteration
  error is a correctness bug, not a typo
- Keep titles, descriptions and structured data intact; the SEO gate checks
  they exist, but only a human can check they are *right*

## Tests

- TypeScript and Vue units: `tests/unit/**/*.spec.ts`, running in the Nuxt
  environment so auto-imports and composables work
- SCSS: `tests/scss/**/*.spec.ts` pairs with a `.spec.scss` file and runs
  through sass-true, so functions and mixins are covered by the same command

## Commits

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org)
and are validated by the `commit-msg` hook. The type decides the next release:

| Type | Release |
| --- | --- |
| `feat` | minor |
| `fix`, `perf`, `refactor`, `build` | patch |
| `feat!` or a `BREAKING CHANGE:` footer | major |
| `chore`, `ci`, `test`, `style`, `docs` | none |

Examples:

```
feat(slokas): add audio playback for Telugu recitations
fix(i18n): keep the selected script when switching locale
chore(deps): bump nuxt to 4.5.1
```

## Branches and releases

Branching is described in [BRANCHING.md](BRANCHING.md). Releases are automatic:
merging to `main` runs semantic-release, which derives the version from the
commit history, updates `CHANGELOG.md` and `package.json`, tags the commit and
publishes a GitHub release. Never bump the version by hand.

## Generated assets

Some assets are generated rather than drawn, so they cannot drift from the
brand. Re-run the generator instead of editing the output:

```bash
bun run pwa:icons        # public/icons/* — committed
bun run play:assets      # .play/* — Play Store icon and feature graphic
bun run play:screenshots # .play/screenshots/* — Play Store screenshots
```

## Reporting problems

Bugs, features and chores each have an issue template. Security issues go
through [SECURITY.md](SECURITY.md) — please do not open a public issue for them.
