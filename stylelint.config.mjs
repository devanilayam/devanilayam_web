/**
 * Stylelint flat config.
 *
 * `standard-scss` supplies the SCSS correctness rules; `@stylistic` restores
 * the formatting rules Stylelint dropped in v15 so SCSS follows the same
 * 3-space / double-quote conventions the ESLint config enforces for TS + Vue.
 */
export default {
   extends: ["stylelint-config-standard-scss"],

   plugins: ["@stylistic/stylelint-plugin"],

   // `.vue` needs the HTML parser so <style lang="scss"> blocks are linted.
   overrides: [
      {
         files: ["**/*.vue"],
         customSyntax: "postcss-html",
      },
      {
         // Open Graph card templates are rendered by Satori, not a browser.
         // Satori resolves only the fonts registered in nuxt.config and has no
         // notion of the generic families (`sans-serif`, `serif`, ...), so
         // requiring one here would be cargo-culted browser advice.
         files: ["**/*.satori.vue"],
         rules: {
            "font-family-no-missing-generic-family-keyword": null,
         },
      },
   ],

   ignoreFiles: [
      "**/node_modules/**",
      ".nuxt/**",
      ".output/**",
      "app/assets/generated/**",
      "public/**",
   ],

   rules: {
      // Formatting — mirrors .editorconfig / eslint stylistic.
      "@stylistic/indentation": 3,
      "@stylistic/string-quotes": "double",
      "@stylistic/max-line-length": 180,
      "@stylistic/no-missing-end-of-source-newline": true,
      "@stylistic/declaration-block-trailing-semicolon": "always",
      "@stylistic/block-opening-brace-space-before": "always",
      "@stylistic/color-hex-case": "upper",

      // Naming — kebab-case everywhere, and design tokens live in SCSS vars.
      "selector-class-pattern": [
         "^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$",
         { message: "Expected class selector to be kebab-case (BEM)" },
      ],
      "scss/dollar-variable-pattern": "^[a-z][a-z0-9]*(-[a-z0-9]+)*$",
      "scss/at-mixin-pattern": "^[a-z][a-z0-9]*(-[a-z0-9]+)*$",
      "scss/at-function-pattern": "^[a-z][a-z0-9]*(-[a-z0-9]+)*$",

      // The codebase uses the modern module system, not @import.
      "scss/load-no-partial-leading-underscore": true,
      "scss/at-use-no-unnamespaced": null,

      // Nuxt/Vue-specific escapes.
      "selector-pseudo-class-no-unknown": [
         true,
         { ignorePseudoClasses: ["deep", "global", "slotted"] },
      ],
      "custom-property-pattern": null,
      "no-descending-specificity": null,
      "declaration-empty-line-before": null,

      // Notation preferences that would churn the existing palette and
      // shadows without changing a single rendered pixel.
      "color-hex-length": null,
      "color-function-notation": null,
      "color-function-alias-notation": null,
      "alpha-value-notation": "number",
      "scss/dollar-variable-empty-line-before": null,
      "shorthand-property-no-redundant-values": null,

      // `-webkit-appearance` / `-moz-appearance` are still load-bearing on
      // Safari and Firefox, and `optimizeSpeed` is written as authored.
      "property-no-vendor-prefix": null,
      "value-keyword-case": null,

      // #__nuxt is Nuxt's own mount point, not ours to rename.
      "selector-id-pattern": null,
   },
};
