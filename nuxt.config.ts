import { Locale } from "./app/types/locale";

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
      // /search is noindex (a result listing is thin and infinite in
      // cardinality), so it has no business in the sitemap either.
      exclude: ["/search", "/*/search"],
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

         // Render-time faces for the Open Graph cards, under distinct names.
         //
         // Satori reads neither WOFF2 nor variable fonts, so it cannot use the
         // four faces above; nuxt-og-image v6 discovers fonts through the
         // @font-face rules @nuxt/fonts emits globally, which is why these are
         // `global` and the browser faces are not.
         //
         // Declaring them costs a visitor nothing: an @font-face is inert
         // until some rendered text asks for that family, and nothing in the
         // site's styles ever names an "… OG" family — only
         // components/OgImage/Default.satori.vue does.
         //
         // The files are static, subsetted TTFs; see public/fonts/og/README.md.
         {
            name: "Merriweather OG",
            src: "/fonts/og/merriweather-700.ttf",
            weight: "700",
            global: true,
         },
         {
            name: "Noto Sans OG",
            src: "/fonts/og/noto-sans-400.ttf",
            weight: "400",
            global: true,
         },
         {
            name: "Noto Sans Telugu OG",
            src: "/fonts/og/noto-sans-telugu-400.ttf",
            weight: "400",
            global: true,
         },
         {
            name: "Noto Sans Devanagari OG",
            src: "/fonts/og/noto-sans-devanagari-400.ttf",
            weight: "400",
            global: true,
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

   // Per-page Open Graph cards, rendered by Satori at build/request time.
   //
   // The renderer is Satori rather than Chromium because it is the only one
   // that runs on a serverless/edge target, and the deps it needs (`satori`,
   // `@resvg/resvg-js`) are already installed for the Play Store generators.
   //
   // Fonts are named by `path`, pointing at the same self-hosted files the
   // site uses — nuxt-og-image otherwise fetches them from Google at render
   // time, which would reintroduce exactly the build-time network dependency
   // that public/fonts exists to remove. The Indic faces are listed because
   // sloka and blog titles on /te and /hi are Telugu and Devanagari: without
   // them those cards render as tofu boxes.
   ogImage: {
      defaults: {
         width: 1200,
         height: 630,
         component: "Default",
      },
   },

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
         // /search reads ?q= at request time; a prerendered file would pin it
         // to the empty query and shadow every real search.
         ignore: ["/search", "/en/search", "/te/search", "/hi/search"],
         failOnError: false,
      },
   },

   // Security headers, applied to every response.
   //
   // None of these affect indexing — they are hardening. The CSP is
   // deliberately not maximally strict: Nuxt inlines the hydration payload as
   // a <script>, and the theme/font handling emits inline styles, so
   // 'unsafe-inline' is required until the app is switched to nonces. What it
   // does buy is a closed default-src, no plugins, no framing, and a locked
   // base-uri and form-action — the vectors that actually matter for a static
   // content site with no forms and no user accounts.
   //
   // `connect-src` and `script-src` allow Vercel's analytics endpoints because
   // app/plugins/vercel.client.ts loads them on the deployed site; off Vercel
   // the plugin never runs and nothing requests them.
   routeRules: {
      // Static, content-driven sections are safe to fully pre-render.
      "/": { prerender: true },

      // Search results depend on ?q=, which a prerendered file cannot carry:
      // Nitro would serve the static HTML and silently ignore the query. This
      // route has to be rendered per request.
      "/search": { prerender: false },
      "/*/search": { prerender: false },

      "/**": {
         headers: {
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
            "X-Content-Type-Options": "nosniff",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "X-Frame-Options": "DENY",
            "Cross-Origin-Opener-Policy": "same-origin",
            "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
            "Content-Security-Policy": [
               "default-src 'self'",
               "base-uri 'self'",
               "form-action 'self'",
               "frame-ancestors 'none'",
               "object-src 'none'",
               "img-src 'self' data: blob: https:",
               "font-src 'self' data:",
               "style-src 'self' 'unsafe-inline'",
               "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
               "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
               "manifest-src 'self'",
               "worker-src 'self'",
               "upgrade-insecure-requests",
            ].join("; "),
         },
      },
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
            // og:image / twitter:image are NOT set here. nuxt-og-image renders a
            // per-page card and emits both tags itself; a static one declared
            // at this level wins over the generated tag and every page would
            // share the same image. The site-wide fallback card is set by
            // defineOgImage() in layouts/default.vue instead.
            { name: "twitter:card", content: "summary_large_image" },
            { name: "twitter:site", content: "@devanilayam" },
            { name: "twitter:creator", content: "@devanilayam" },
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
