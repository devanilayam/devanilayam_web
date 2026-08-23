# Self-hosted webfonts

These files are served directly from `/fonts/*` and are wired up in
`nuxt.config.ts` under `fonts.families`, each with an explicit `src`.

## Why they are committed

Naming an explicit `src` means `@nuxt/fonts` performs **no provider lookup at
build time**. That matters more than it sounds:

- Builds work offline and reproducibly, including in CI.
- A network failure while resolving Google Fonts is only a *warning* — the
  build still succeeds, but silently emits no `@font-face` at all and ships the
  site in system fallback fonts. Committing the files removes that failure mode
  entirely.

## What is here

| File | Family | Axes | Subset |
| --- | --- | --- | --- |
| `merriweather-latin-variable.woff2` | Merriweather | `wght 300–900` | latin |
| `noto-sans-latin-variable.woff2` | Noto Sans | `wght 100–900` | latin |
| `noto-sans-telugu-variable.woff2` | Noto Sans Telugu | `wght 400–700` | telugu |
| `noto-sans-devanagari-variable.woff2` | Noto Sans Devanagari | `wght 400–700` | devanagari |

All four are variable fonts, so one file covers the whole weight range.

The two Indic faces cost the English pages nothing: a browser only downloads a
face when text actually renders in it, so `/en` never fetches Telugu or
Devanagari. They sit after `"Noto Sans"` in the font stacks in
`app/assets/scss/base/_global.scss` — a browser walks the stack per character,
so Latin resolves to Noto Sans and Telugu or Devanagari text falls through to
the face that has those glyphs. Without them, those scripts render in whatever
the device happens to have, which is often nothing at all (tofu boxes).

## Licence

All four families are released by Google under the
[SIL Open Font License 1.1](https://openfontlicense.org), which permits
redistribution — including bundling them in a website like this.

## Replacing or adding a font

1. Fetch the CSS from Google Fonts with a modern browser `User-Agent` so the
   `woff2` URLs are returned, then download the file for the subset you want.
   Google's CSS lists one `@font-face` per subset with a `unicode-range`; the
   script subset is the block you want, not the `latin` one.
2. Drop the file here with a `<family>-<subset>-variable.woff2` name.
3. Add it to `fonts.families` in `nuxt.config.ts` with a `src`, a `weight`
   range, and a `fallbacks` list. **`fallbacks` is load-bearing** — it makes
   the module emit metric-override faces (`size-adjust`, `ascent-override`, …)
   so the system font stands in at the same measurements and the text does not
   reflow when the webfont swaps in.
4. Add it to the font stacks in `app/assets/scss/base/_global.scss`.
5. Add it to the precache assertion list in `scripts/pwa/verify.sh`, so an
   offline visit is not left reflowing to a system font.
