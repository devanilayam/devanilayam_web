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

const SITE_URL = "https://devanilayam.com";

const SITE_NAME = "Devanilayam";

const SITE_DESCRIPTION
   = "Devanilayam is an ad-free devotional platform to read, learn and practice Hindu slokas, ashtotaras and stotras in multiple scripts (English, Telugu, Hindi) with meanings and audio.";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
   compatibilityDate: "2025-07-15",
   modules: ["@nuxt/eslint", "nuxt-link-checker", "@nuxtjs/sitemap", "@nuxtjs/i18n", "@nuxt/content", "@nuxtjs/seo"],

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
      prerender: {
         crawlLinks: true,
         routes: ["/", "/sitemap.xml", "/robots.txt"],
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
            { rel: "apple-touch-icon", href: "/favicon.ico" },
            { rel: "manifest", href: "/site.webmanifest" },
            { rel: "preconnect", href: "https://fonts.googleapis.com" },
            { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
            { rel: "dns-prefetch", href: "https://fonts.gstatic.com" },
            { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&display=swap" },
            { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap" },
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
