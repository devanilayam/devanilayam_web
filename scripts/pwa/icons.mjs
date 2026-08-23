/**
 * Generates the PWA / home-screen icon set into `public/icons/`.
 *
 * Run with `bun run pwa:icons`. The output is committed so installs and the
 * `pwa:verify` gate do not depend on a rendering step at build time.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";
import { BRAND, buildEmblemSvg, readEmblemPaths } from "../lib/brand.mjs";

const OUTPUT_DIR = new URL("../../public/icons/", import.meta.url);

// `any` icons keep a light border; `maskable` icons pad to the 80% safe zone
// so Android's circle/squircle masks never clip the emblem.
const TARGETS = [
   { file: "icon-192.png", size: 192, padding: 0.12 },
   { file: "icon-512.png", size: 512, padding: 0.12 },
   { file: "icon-maskable-192.png", size: 192, padding: 0.22 },
   { file: "icon-maskable-512.png", size: 512, padding: 0.22 },
   { file: "apple-touch-icon.png", size: 180, padding: 0.14 },
];

const render = (svg, size) => new Resvg(svg, {
   fitTo: { mode: "width", value: size },
}).render().asPng();

const main = async () => {

   const paths = await readEmblemPaths();

   await mkdir(fileURLToPath(OUTPUT_DIR), { recursive: true });

   for (const target of TARGETS) {

      const svg = buildEmblemSvg({
         paths,
         size: target.size,
         padding: target.padding,
         background: BRAND.primary,
         foreground: BRAND.surface,
      });

      await writeFile(new URL(target.file, OUTPUT_DIR), render(svg, target.size));

      console.info(`✓ public/icons/${target.file} (${target.size}x${target.size})`);

   }

};

await main();
