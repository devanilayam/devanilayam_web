import { describe, it } from "vitest";
import { fileURLToPath } from "node:url";
import { runSass } from "sass-true";

// sass-true compiles the .scss spec below and reports each `@include it(...)`
// as a Vitest test, so the SCSS functions are covered by the same `bun run
// test` gate as the TypeScript units.
runSass(
   {
      describe,
      it,
   },
   fileURLToPath(new URL("./functions.spec.scss", import.meta.url)),
   {
      loadPaths: [fileURLToPath(new URL("../../app/assets/scss", import.meta.url))],
   },
);
