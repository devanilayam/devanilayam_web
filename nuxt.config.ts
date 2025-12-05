import { Locale } from "./app/types/locale";

const languages: Locale[] = Locale.ALL;

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
   compatibilityDate: "2025-07-15",
   modules: ["@nuxt/eslint", "@nuxtjs/i18n", "@nuxt/content"],
   ssr: false,
   devtools: { enabled: false },

   i18n: {
      defaultLocale: "en",
      detectBrowserLanguage: {
         fallbackLocale: "en",
         useCookie: true,
         cookieKey: "i18n_redirected",
         redirectOn: "root",
      },
      strategy: "prefix_and_default",
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
         title: "Devanilayam",
         htmlAttrs: {
            lang: "en",
         },
         meta: [
            {
               name: "author",
               content: "Mouli Bheemaneti"
            },
            {
               name: "description",
               content: "Devanilayam is a platform for learning and practicing devotional slokas."
            },
            {
               name: "viewport",
               content: "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no",
            },
         ],
         link: [
            { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
            { rel: "icon", href: "/favicon-dark.ico", type: "image/x-icon", media: "(prefers-color-scheme: dark)" },
            { rel: "preconnect", href: "https://fonts.googleapis.com" },
            { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
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
