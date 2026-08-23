/**
 * Reads an HTML document on stdin and validates every JSON-LD block in it.
 *
 * Google silently discards structured data that does not parse, so a malformed
 * block is worse than none — it fails silently in production. Empty blocks are
 * ignored: modules legitimately render a placeholder <script> and fill it in
 * only on routes that have structured data.
 *
 * Exits 0 when every non-empty block parses, 1 otherwise, and prints the number
 * of blocks it accepted.
 */
const html = await Bun.stdin.text();

const blocks = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)]
   .map(([, body]) => body.trim())
   .filter(body => body.length > 0);

let failed = 0;

for (const [index, body] of blocks.entries()) {

   try {

      JSON.parse(body);

   } catch (error) {

      console.error(`    block ${index + 1}: ${error.message}`);
      failed += 1;

   }

}

console.log(blocks.length);

process.exit(failed === 0 && blocks.length > 0 ? 0 : 1);
