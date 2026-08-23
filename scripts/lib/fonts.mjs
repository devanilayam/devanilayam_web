/**
 * Font loading for satori.
 *
 * satori needs real font data (TTF/OTF/WOFF — not WOFF2) to lay text out, so
 * the brand faces are fetched from Google Fonts on first use and cached under
 * node_modules/.cache. Only the asset-generation scripts use this; nothing in
 * the app or the CI gates depends on it.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const CACHE_DIR = new URL("../../node_modules/.cache/devanilayam-fonts/", import.meta.url);

// Google Fonts picks the file format from the User-Agent. This one is old
// enough to be served `format("truetype")`, which satori can parse — a modern
// UA gets WOFF2, which it cannot. (Sending no UA at all also works, but the
// two runtimes disagree on the default, so pin it.)
const TRUETYPE_UA = "Mozilla/5.0 (Linux; U; Android 2.2)";

/**
 * @param {string} family Google Fonts family name, e.g. "Merriweather".
 * @param {number} weight Numeric weight, e.g. 400 or 700.
 * @returns {Promise<ArrayBuffer>} The raw font data.
 */
export const loadGoogleFont = async (family, weight) => {

   const cacheKey = `${family.replace(/\s+/g, "-").toLowerCase()}-${weight}.ttf`;

   const cached = new URL(cacheKey, CACHE_DIR);

   try {

      const buffer = await readFile(fileURLToPath(cached));

      // Slice to the view: a Buffer can share a larger pooled ArrayBuffer.
      return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

   } catch {

      // Not cached yet — fall through and fetch it.

   }

   const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}`;

   const css = await fetch(cssUrl, { headers: { "User-Agent": TRUETYPE_UA } }).then(response => {

      if (!response.ok) {

         throw new Error(`Could not load ${family} ${weight}: ${response.status} ${response.statusText}`);

      }

      return response.text();

   });

   const source = css.match(/src:\s*url\(([^)]+)\)\s*format\(['"]truetype['"]\)/);

   if (!source) {

      throw new Error(`Google Fonts did not return a TrueType file for ${family} ${weight}`);

   }

   const data = await fetch(source[1]).then(response => response.arrayBuffer());

   // 0x00010000 is the OpenType/TrueType signature; anything else means the
   // CSS endpoint changed its mind about the format.
   if (new DataView(data).getUint32(0) !== 0x00010000) {

      throw new Error(`Downloaded font for ${family} ${weight} is not a TrueType file`);

   }

   await mkdir(fileURLToPath(CACHE_DIR), { recursive: true });
   await writeFile(fileURLToPath(cached), Buffer.from(data));

   return data;

};

/**
 * The font set the generated marketing assets use.
 * @returns {Promise<Array<{ name: string, data: ArrayBuffer, weight: number, style: "normal" }>>}
 */
export const loadBrandFonts = async () => {

   const faces = [
      { name: "Merriweather", weight: 700 },
      { name: "Noto Sans", weight: 400 },
      { name: "Noto Sans", weight: 700 },
   ];

   return Promise.all(faces.map(async face => ({
      name: face.name,
      data: await loadGoogleFont(face.name, face.weight),
      weight: face.weight,
      style: "normal",
   })));

};
