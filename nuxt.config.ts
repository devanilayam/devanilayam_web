import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { Locale } from "./app/types/locale";
import { OG_IMAGE_BASE64 } from "./app/assets/og-image.base64";

// Materialise the branded Open Graph image into /public at config-load time so
// the binary asset is generated from a committed base64 string (keeps the repo
// free of a checked-in binary while guaranteeing /og-image.png exists at build).
const writeOgImage = (): void => {

   const ogImagePath = new URL("./public/og-image.png", import.meta.url);

   if (existsSync(ogImagePath)) {

      return;

   }

   mkdirSync(new URL("./public/", import.meta.url), { recursive: true });

   writeFileSync(ogImagePath, Buffer.from(OG_IMAGE_BASE64, "base64"));

};

writeOgImage();

// Pass plain, fully-serializable locale objects to @nuxtjs/i18n so downstream
// modules (sitemap, robots) reliably read `code`/`language` for hreflang and
// per-locale rule generation.
const languages = Locale.ALL.map(l => ({
   code: l.code,
   language: l.language,
   name: l.name,
   file: l.file,
   dir: "ltr" as const,
}));

// Overridable so a Vercel preview deployment emits canonicals, hreflang and
// sitemap URLs that point at itself rather than at production — otherwise
// every preview asks search engines to index the live site instead.
const SITE_URL = process.env.NUXT_SITE_URL || "https://devanilayam.com";

const SITE_NAME = "Devanilayam";

const SITE_DESCRIPTION
   = "Devanilayam is an ad-free devotional platform to read, learn and practice Hindu slokas, ashtotaras and stotras in multiple scripts (English, Telugu, Hindi) with meanings and audio.";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
   compatibilityDate: "2025-07-15",
   modules: [
      "@nuxt/eslint",
      "@nuxt/fonts",
      "@nuxt/image",
      "@nuxt/test-utils/module",
      "nuxt-link-checker",
      "@nuxtjs/sitemap",
      "@nuxtjs/i18n",
      "@nuxt/content",
      "@nuxtjs/seo",
      "@vite-pwa/nuxt",
   ],

   // Vercel-only telemetry. The flag is read by app/plugins/vercel.client.ts,
   // which is the only place the SDKs are loaded, so local and self-hosted
   // builds never ship them.
   runtimeConfig: {
      public: {
         isVercel: Boolean(process.env.VERCEL),
      },
   },

   // Server-Side Rendering is required so search engines and AI crawlers
   // (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bing, Applebot, ...)
   // receive fully-rendered HTML without executing JavaScript.
   ssr: true,

   devtools: { enabled: true },

   // SEO

   site: {
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      defaultLocale: "en",
   },

   // Root identity for @nuxtjs/seo's schema.org graph. The per-page nodes in
   // app/composables/useJsonLd.ts reference this organisation by @id.
   schemaOrg: {
      identity: {
         type: "Organization",
         name: SITE_NAME,
         url: SITE_URL,
         logo: `${SITE_URL}/icons/icon-512.png`,
         description: SITE_DESCRIPTION,
      },
   },

   robots: {
      // Block low-value SEO scraper bots, but keep search + AI crawlers allowed.
      blockNonSeoBots: true,
      // Explicitly do NOT block AI bots — we want to be discoverable by them.
      blockAiBots: false,
      sitemap: "/sitemap.xml",
   },

   sitemap: {
      autoLastmod: true,
      // Enumerate content-driven pages (slokas, ashtotaras, blogs) so they
      // are all discoverable in the XML sitemap.
      sources: ["/api/__sitemap__/urls"],
      xslColumns: [
         { label: "URL", width: "50%" },
         { label: "Last Modified", select: "sitemap:lastmod", width: "25%" },
         { label: "Priority", select: "sitemap:priority", width: "12.5%" },
         { label: "Change Frequency", select: "sitemap:changefreq", width: "12.5%" },
      ],
   },

   // Self-hosted webfonts. Each family names an explicit `src`, so there is
   // no provider lookup at build time: builds work offline and reproducibly,
   // and a network blip can never silently ship the site in fallback fonts.
   //
   // `fallbacks` is the load-bearing part — it makes the module emit
   // metric-override faces (size-adjust, ascent-override, ...) so the system
   // font stands in at the same measurements as the webfont. Without them the
   // text reflows the moment the webfont swaps in, which is exactly the layout
   // shift a CLS budget fails over.
   //
   // The two Indic faces are declared but cost the English pages nothing: a
   // browser only downloads a face when text actually renders in it, so /en
   // never fetches Telugu or Devanagari. Without them, those scripts fall back
   // to whatever the device happens to have — often nothing, i.e. tofu boxes.
   //
   // Files live in public/fonts — see the README there before changing them.
   fonts: {
      families: [
         {
            name: "Merriweather",
            src: "/fonts/merriweather-latin-variable.woff2",
            weight: "300 900",
            fallbacks: ["Georgia", "Times New Roman", "serif"],
         },
         {
            name: "Noto Sans",
            src: "/fonts/noto-sans-latin-variable.woff2",
            weight: "100 900",
            fallbacks: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
         },
         {
            name: "Noto Sans Telugu",
            src: "/fonts/noto-sans-telugu-variable.woff2",
            weight: "400 700",
            fallbacks: ["Gautami", "Nirmala UI", "sans-serif"],
         },
         {
            name: "Noto Sans Devanagari",
            src: "/fonts/noto-sans-devanagari-variable.woff2",
            weight: "400 700",
            fallbacks: ["Mangal", "Nirmala UI", "sans-serif"],
         },
      ],
   },

   image: {
      quality: 80,
      format: ["webp", "avif", "jpeg"],
      screens: {
         xs: 320,
         sm: 640,
         md: 768,
         lg: 1024,
         xl: 1280,
         xxl: 1536,
      },
   },

   // Installability + offline. The icon set under public/icons is generated
   // from the site's own logo component by `bun run pwa:icons`, and
   // `bun run pwa:verify` gates the built output in CI.
   pwa: {
      registerType: "autoUpdate",
      manifestFilename: "site.webmanifest",
      manifest: {
         name: SITE_NAME,
         short_name: SITE_NAME,
         description: SITE_DESCRIPTION,
         start_url: "/",
         scope: "/",
         display: "standalone",
         orientation: "portrait-primary",
         background_color: "#FAF8F3",
         theme_color: "#EB730C",
         lang: "en",
         dir: "ltr",
         categories: ["education", "lifestyle", "books"],
         icons: [
            { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
            { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
            { src: "/icons/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
            { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
         ],
      },
      workbox: {
         // Shell only. Deliberately no blanket `png`: the manifest icons are
         // read by the OS at install time and never by the page, so sweeping
         // them in would add ~50 KB to every install for nothing.
         globPatterns: ["**/*.{js,css,html,svg,ico,woff2}"],

         // Backstop for a URL that was never prerendered — serve the default
         // locale rather than the browser's offline error. Precached routes
         // still win, because precache routes are registered first.
         //
         // It must NOT be "/": that route is the meta-refresh stub, so serving
         // it for a /en navigation would refresh to /en, match this route
         // again, and loop forever.
         navigateFallback: "/en",

         // ...but these are not app routes, and answering them with a page's
         // HTML would be worse than letting them fail.
         navigateFallbackDenylist: [
            /^\/_/,
            /^\/__/,
            /^\/\.well-known\//,
            /^\/(robots\.txt|sitemap.*\.xml|site\.webmanifest)$/,
         ],

         cleanupOutdatedCaches: true,
      },
      client: {
         installPrompt: true,
      },
      devOptions: {
         enabled: false,
         type: "module",
      },
   },

   // Auto-generated OG images require satori/resvg at build time; we ship a
   // static branded OG image instead (see app.head below), so keep this off.
   ogImage: { enabled: false },

   linkChecker: {
      report: {
         // pick and choose which reports you want to generate
         html: true,
         markdown: true,
         json: true,
         publish: true,
      }
   },

   // End of SEO

   // Pre-render discoverable pages to static HTML for the fastest possible
   // crawl (best-effort — build won't fail if a route errors).
   nitro: {
      // `/` is only a redirect stub under the i18n `prefix` strategy, and
      // crawlLinks follows anchors rather than meta-refresh — so seeding the
      // crawl with "/" alone reaches exactly one route and prerenders nothing
      // else. Each locale root has to be named explicitly; from there the
      // crawler reaches every sloka, ashtotara and blog through real links.
      //
      // This is also what makes the site installable: the service worker can
      // only precache HTML that exists as a file at build time.
      prerender: {
         crawlLinks: true,
         routes: ["/", "/en", "/te", "/hi", "/sitemap.xml", "/robots.txt"],
         failOnError: false,
      },
   },

   routeRules: {
      // Static, content-driven sections are safe to fully pre-render.
      "/": { prerender: true },
   },

   i18n: {
      baseUrl: SITE_URL,
      defaultLocale: "en",
      detectBrowserLanguage: {
         fallbackLocale: "en",
         useCookie: true,
         cookieKey: "i18n_redirected",
         redirectOn: "all",
      },
      strategy: "prefix",
      // strategy: "prefix_and_default",
      langDir: "../app/locales",
      locales: languages,
   },

   imports: {
      // auto-imports all files here
      dirs: [
         "@utils/design",
         "@utils",
      ],
   },

   components: {
      dirs: [
         {
            path: "~/components",
            pattern: "**/*.vue", // Only consider .vue files as components
         },
      ],
   },

   app: {
      head: {
         title: SITE_NAME,
         titleTemplate: "%s %separator %siteName",
         htmlAttrs: {
            lang: "en",
         },
         meta: [
            { name: "author", content: "Mouli Bheemaneti" },
            { name: "description", content: SITE_DESCRIPTION },
            {
               name: "viewport",
               content: "width=device-width, initial-scale=1.0, minimum-scale=1.0",
            },
            // PWA / mobile
            { name: "theme-color", content: "#EB730C" },
            { name: "mobile-web-app-capable", content: "yes" },
            { name: "apple-mobile-web-app-capable", content: "yes" },
            { name: "apple-mobile-web-app-status-bar-style", content: "default" },
            { name: "apple-mobile-web-app-title", content: SITE_NAME },
            { name: "application-name", content: SITE_NAME },
            // Social defaults (overridden per-page via useSeoMeta)
            { property: "og:site_name", content: SITE_NAME },
            { property: "og:type", content: "website" },
            { property: "og:image", content: `${SITE_URL}/og-image.png` },
            { name: "twitter:card", content: "summary_large_image" },
            { name: "twitter:site", content: "@devanilayam" },
            { name: "twitter:creator", content: "@devanilayam" },
            { name: "twitter:image", content: `${SITE_URL}/og-image.png` },
         ],
         link: [
            { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
            { rel: "icon", href: "/favicon-dark.ico", type: "image/x-icon", media: "(prefers-color-scheme: dark)" },
            { rel: "apple-touch-icon", sizes: "180x180", href: "/icons/apple-touch-icon.png" },
            // The manifest itself is generated by @vite-pwa/nuxt (see `pwa`
            // below); the link is declared here so it is present in the SSR
            // HTML rather than added by client-side script.
            { rel: "manifest", href: "/site.webmanifest" },
         ],
      },
   },

   css: [
      "@/assets/scss/main.scss",
      "@/assets/generated/fonts/icons.css",
   ],

   vite: {
      css: {
         preprocessorOptions: {
            scss: {
               additionalData: `
                @use "sass:map";
                @use "sass:math";
                @use "sass:meta";

                @use "@/assets/scss/tokens" as *;
                @use "@/assets/scss/abstracts" as *;
             `,
            },
         },
      },
   },
});
