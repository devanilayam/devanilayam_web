import { defineConfig } from "vitest/config";
import { defineVitestProject } from "@nuxt/test-utils/config";

// Two projects share one config so `bun run test` covers both layers:
//  - "unit" → TS/Vue units inside the Nuxt runtime (happy-dom + auto-imports).
//  - "scss" → sass-true specs that assert on the SCSS functions and mixins.
export default defineConfig({
   test: {
      globals: true,
      coverage: {
         provider: "v8",
         reportsDirectory: "coverage",
         include: ["app/composables/**", "app/utils/**", "app/types/**"],
      },
      projects: [
         await defineVitestProject({
            test: {
               name: "unit",
               environment: "nuxt",
               include: ["tests/unit/**/*.spec.ts"],
               environmentOptions: {
                  nuxt: {
                     domEnvironment: "happy-dom",
                  },
               },
            },
         }),
         {
            test: {
               name: "scss",
               environment: "node",
               include: ["tests/scss/**/*.spec.ts"],
            },
         },
      ],
   },
});
