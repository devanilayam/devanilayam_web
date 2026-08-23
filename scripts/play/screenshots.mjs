/**
 * Generates the Google Play Store screenshots into `.play/screenshots/`.
 *
 * These are the listing's marketing frames rather than raw device captures:
 * each slide is composed with satori and rasterised with resvg, so they stay
 * on-brand, translate cleanly, and never leak whatever happened to be on
 * screen. Play wants at least two phone screenshots between 320px and 3840px
 * on the short edge, with a 16:9-ish aspect.
 *
 * Run with `bun run play:screenshots`.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { BRAND, buildEmblemSvg, readEmblemPaths } from "../lib/brand.mjs";
import { loadBrandFonts } from "../lib/fonts.mjs";

const OUTPUT_DIR = new URL("../../.play/screenshots/", import.meta.url);

const WIDTH = 1080;

const HEIGHT = 1920;

const SLIDES = [
   {
      file: "01-slokas.png",
      eyebrow: "Slokas",
      headline: "Sacred verses, exactly as they are chanted",
      body: "Read every sloka in English, Telugu or Hindi script with the meaning alongside.",
      inverted: true,
   },
   {
      file: "02-ashtotaras.png",
      eyebrow: "Ashtotaras",
      headline: "108 names, one uninterrupted flow",
      body: "Follow along at your own pace — no ads, no pop-ups, nothing between you and the practice.",
      inverted: false,
   },
   {
      file: "03-offline.png",
      eyebrow: "Anywhere",
      headline: "Works offline, once you have opened it",
      body: "Installed from the browser or the Play Store, Devanilayam keeps working without a signal.",
      inverted: false,
   },
];

/** A satori text node. `children` is the string to render. */
const text = (style, children) => ({ type: "div", props: { style, children } });

const buildCopy = (slide, heading, body) => ({
   type: "div",
   props: {
      style: {
         display: "flex",
         flexDirection: "column",
         gap: 40,
      },
      children: [
         text({
            fontFamily: "Noto Sans",
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: heading,
            opacity: 0.75,
         }, slide.eyebrow),
         text({
            fontFamily: "Merriweather",
            fontSize: 96,
            fontWeight: 700,
            lineHeight: 1.15,
            color: heading,
         }, slide.headline),
         text({
            fontFamily: "Noto Sans",
            fontSize: 44,
            lineHeight: 1.5,
            color: body,
         }, slide.body),
      ],
   },
});

const buildLockup = (heading, emblemDataUri) => ({
   type: "div",
   props: {
      style: {
         display: "flex",
         alignItems: "center",
         gap: 32,
      },
      children: [
         {
            type: "img",
            props: { width: 128, height: 128, src: emblemDataUri(heading) },
         },
         text({
            fontFamily: "Merriweather",
            fontSize: 56,
            fontWeight: 700,
            color: heading,
         }, BRAND.name),
      ],
   },
});

const buildSlide = (slide, emblemDataUri) => {

   // Alternating inverted slides give the listing some rhythm without
   // introducing a second palette.
   const background = slide.inverted ? BRAND.primary : BRAND.surface;

   const heading = slide.inverted ? BRAND.surface : BRAND.primary;

   const body = slide.inverted ? BRAND.surface : BRAND.ink;

   return {
      type: "div",
      props: {
         style: {
            width: WIDTH,
            height: HEIGHT,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "120px 96px",
            backgroundColor: background,
         },
         children: [
            buildCopy(slide, heading, body),
            buildLockup(heading, emblemDataUri),
         ],
      },
   };

};

const main = async () => {

   const [paths, fonts] = await Promise.all([readEmblemPaths(), loadBrandFonts()]);

   const emblemDataUri = foreground => `data:image/svg+xml;base64,${Buffer.from(buildEmblemSvg({
      paths,
      size: 128,
      padding: 0,
      background: "none",
      foreground,
   })).toString("base64")}`;

   await mkdir(fileURLToPath(OUTPUT_DIR), { recursive: true });

   for (const slide of SLIDES) {

      const svg = await satori(buildSlide(slide, emblemDataUri), { width: WIDTH, height: HEIGHT, fonts });

      const png = new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } }).render().asPng();

      await writeFile(new URL(slide.file, OUTPUT_DIR), png);

      console.info(`✓ .play/screenshots/${slide.file} (${WIDTH}x${HEIGHT})`);

   }

};

await main();
