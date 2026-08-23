# Open Graph render fonts

These are **not** the fonts the site serves to visitors. Those live one
directory up, in `public/fonts/`, as variable WOFF2.

## Why a second set exists

Open Graph cards are rendered by [Satori](https://github.com/vercel/satori),
which reads **WOFF, TTF and OTF but not WOFF2**, and cannot handle variable
fonts. The browser faces are both, so Satori cannot use them. These are static,
single-weight TTFs of the same families.

They are registered in `nuxt.config.ts` under `fonts.families` with distinct
names — `Merriweather OG`, `Noto Sans OG`, and so on — and `global: true`,
because nuxt-og-image v6 discovers fonts through the `@font-face` rules
`@nuxt/fonts` emits globally rather than through a config list of its own.

**No visitor downloads these.** An `@font-face` is inert until some rendered
text asks for that family, and nothing in the site's styles ever names an
"… OG" family — only `app/components/OgImage/Default.satori.vue` does.

## What is here

| File | Family in config | Weight |
| --- | --- | --- |
| `merriweather-700.ttf` | `Merriweather OG` | 700 |
| `noto-sans-400.ttf` | `Noto Sans OG` | 400 |
| `noto-sans-telugu-400.ttf` | `Noto Sans Telugu OG` | 400 |
| `noto-sans-devanagari-400.ttf` | `Noto Sans Devanagari OG` | 400 |

The Indic faces are here for the same reason they are in the browser set: sloka
and blog titles on `/te` and `/hi` are Telugu and Devanagari, and without a face
that has those glyphs the cards render as tofu boxes.

## Keeping them small

Google serves these unsubsetted, at roughly 1.5 MB for the four. They are
subsetted to the scripts actually used, which brings that to ~480 KB:

```bash
pip install fonttools brotli

LATIN="U+0020-007E,U+00A0-00FF,U+2010-2027,U+2030-205E,U+20B9,U+2122"

python3 -m fontTools.subset merriweather-700.ttf \
   --unicodes="$LATIN" --layout-features='*' \
   --output-file=merriweather-700.ttf --drop-tables+=DSIG

python3 -m fontTools.subset noto-sans-telugu-400.ttf \
   --unicodes="$LATIN,U+0C00-0C7F,U+0964-0965,U+200C-200D,U+25CC" \
   --layout-features='*' --output-file=noto-sans-telugu-400.ttf --drop-tables+=DSIG
```

`--layout-features='*'` is load-bearing for the Indic faces: dropping the
default GSUB/GPOS features breaks conjunct formation and mark positioning, and
the text renders as disconnected glyphs.

## Licence

All four families are released by Google under the
[SIL Open Font License 1.1](https://openfontlicense.org), which permits
redistribution and subsetting.
