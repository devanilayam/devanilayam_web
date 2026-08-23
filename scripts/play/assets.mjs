/**
 * Generates the Google Play Store listing graphics into `.play/`.
 *
 * Play requires an exact 512x512 opaque app icon and a 1024x500 feature
 * graphic. Both are rendered here from the site's own logo and palette —
 * satori lays the feature graphic out from JSX-shaped objects, resvg
 * rasterises the result — so the store listing can never drift from the brand.
 *
 * Run with `bun run play:assets`.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { BRAND, buildEmblemSvg, readEmblemPaths } from "../lib/brand.mjs";
import { loadBrandFonts } from "../lib/fonts.mjs";

const OUTPUT_DIR = new URL("../../.play/", import.meta.url);

const ICON_SIZE = 512;

const FEATURE_WIDTH = 1024;

const FEATURE_HEIGHT = 500;

const rasterise = (svg, width) => new Resvg(svg, {
   fitTo: { mode: "width", value: width },
   // Play rejects icons with transparency, so always paint the background.
   background: BRAND.primary,
}).render().asPng();

/** The 512x512 store icon: emblem on brand orange, full bleed, no rounding. */
const buildIcon = paths => buildEmblemSvg({
   paths,
   size: ICON_SIZE,
   padding: 0.14,
   background: BRAND.primary,
   foreground: BRAND.surface,
});

/** The 1024x500 feature graphic: emblem lock-up beside the name and promise. */
const buildFeatureGraphic = paths => ({
   type: "div",
   props: {
      style: {
         width: FEATURE_WIDTH,
         height: FEATURE_HEIGHT,
         display: "flex",
         alignItems: "center",
         gap: 56,
         padding: "0 80px",
         backgroundColor: BRAND.primary,
      },
      children: [
         {
            type: "img",
            props: {
               width: 260,
               height: 260,
               src: `data:image/svg+xml;base64,${Buffer.from(buildEmblemSvg({
                  paths,
                  size: 260,
                  padding: 0,
                  background: "none",
                  foreground: BRAND.surface,
               })).toString("base64")}`,
            },
         },
         {
            type: "div",
            props: {
               style: {
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                  // 1024 - (2 x 80 padding) - 260 emblem - 56 gap. Explicit so
                  // the tagline wraps instead of running off the canvas.
                  width: FEATURE_WIDTH - 160 - 260 - 56,
               },
               children: [
                  {
                     type: "div",
                     props: {
                        style: {
                           fontFamily: "Merriweather",
                           fontSize: 88,
                           fontWeight: 700,
                           color: BRAND.surface,
                        },
                        children: BRAND.name,
                     },
                  },
                  {
                     type: "div",
                     props: {
                        style: {
                           fontFamily: "Noto Sans",
                           fontSize: 30,
                           color: BRAND.surface,
                           opacity: 0.92,
                           lineHeight: 1.35,
                        },
                        children: "Slokas, ashtotaras and stotras — ad-free, with meanings and audio.",
                     },
                  },
               ],
            },
         },
      ],
   },
});

const main = async () => {

   const [paths, fonts] = await Promise.all([readEmblemPaths(), loadBrandFonts()]);

   await mkdir(fileURLToPath(OUTPUT_DIR), { recursive: true });

   await writeFile(
      new URL("icon-512.png", OUTPUT_DIR),
      rasterise(buildIcon(paths), ICON_SIZE),
   );

   console.info(`✓ .play/icon-512.png (${ICON_SIZE}x${ICON_SIZE})`);

   const featureSvg = await satori(buildFeatureGraphic(paths), {
      width: FEATURE_WIDTH,
      height: FEATURE_HEIGHT,
      fonts,
   });

   await writeFile(
      new URL("feature-graphic-1024x500.png", OUTPUT_DIR),
      rasterise(featureSvg, FEATURE_WIDTH),
   );

   console.info(`✓ .play/feature-graphic-1024x500.png (${FEATURE_WIDTH}x${FEATURE_HEIGHT})`);

};

await main();
