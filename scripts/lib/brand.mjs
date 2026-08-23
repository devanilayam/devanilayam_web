/**
 * Shared brand primitives for the generated assets (PWA icons, Play Store
 * graphics, screenshots).
 *
 * The emblem is not duplicated here: it is read straight out of the Vue
 * component that renders it on the site, so a change to the logo flows into
 * every generated asset the next time the scripts run.
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

export const BRAND = {
   name: "Devanilayam",
   shortName: "Devanilayam",
   description:
      "Ad-free devotional platform to read, learn and practice Hindu slokas, ashtotaras and stotras in multiple scripts with meanings and audio.",
   primary: "#EB730C",
   surface: "#FAF8F3",
   ink: "#6B6760",
   siteUrl: "https://devanilayam.com",
};

const EMBLEM_COMPONENT = new URL("../../app/components/Logo/emblem.vue", import.meta.url);

/**
 * Pulls the raw <path> markup out of `Logo/emblem.vue`.
 * @returns {Promise<string>} The emblem paths, without the wrapping <svg>.
 */
export const readEmblemPaths = async () => {

   const source = await readFile(fileURLToPath(EMBLEM_COMPONENT), "utf8");

   const svg = source.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);

   if (!svg) {

      throw new Error("Could not find an <svg> block in Logo/emblem.vue");

   }

   return svg[1].trim();

};

/**
 * Builds a square SVG of the emblem on a solid background.
 *
 * @param {object} options
 * @param {string} options.paths      Emblem paths from `readEmblemPaths()`.
 * @param {number} options.size       Output edge length in pixels.
 * @param {string} [options.background] Background fill (`"none"` for transparent).
 * @param {string} [options.foreground] Emblem fill.
 * @param {number} [options.padding]  Fraction of the edge kept clear around the
 *                                    emblem — 0.1 for regular icons, ~0.2 for
 *                                    maskable ones so the safe zone survives
 *                                    aggressive Android masks.
 * @param {number} [options.radius]   Corner radius in pixels.
 * @returns {string} SVG markup.
 */
export const buildEmblemSvg = ({
   paths,
   size,
   background = BRAND.primary,
   foreground = BRAND.surface,
   padding = 0.1,
   radius = 0,
}) => {

   const inset = size * padding;

   const inner = size - (inset * 2);

   // The emblem authors its paths on a 360x360 canvas.
   const scale = inner / 360;

   const backdrop = background === "none"
      ? ""
      : `<rect width="${size}" height="${size}" rx="${radius}" fill="${background}"/>`;

   return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`
      + backdrop
      + `<g transform="translate(${inset} ${inset}) scale(${scale})" fill="${foreground}">${paths}</g>`
      + "</svg>";

};
