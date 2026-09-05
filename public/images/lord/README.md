# Deity card images

One `<lord_id>.webp` per deity, served straight from `/images/lord/*`.

`app/components/Lord/card.vue` derives the filename from the frontmatter:

```ts
`/images/lord/${props.lord.lord_id.toLowerCase()}.webp`
```

Nothing enumerates these files, so adding a deity is only ever two steps: write
the content under `content/slokas/<lang>/<lord_id>/`, and drop a matching
`<lord_id>.webp` here. A missing file is a broken card, not a build error —
the deity list is built from the content collection, which never looks at disk.

## Conventions

- **WebP**, 900x900 (a few are 900x514; the card crops to fill either way).
- The card lays a bottom-up black gradient over the image and prints the deity
  name in white across the lower third, so keep that area dark and uncluttered.

## Placeholder

`krishna.webp` is a **placeholder** — a generated lotus mandala, not artwork of
the deity, unlike the other six. Replace it with real artwork when one is
available; no code change is needed, only the file.
