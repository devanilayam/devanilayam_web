<!-- eslint-disable vue/no-multiple-template-root -->
<template>
   <speed-insights />
   <MyHeader />
   <SideMenu />
   <NuxtPage />
   <MyFooter />
</template>

<script setup lang="ts">
import { SpeedInsights } from "@vercel/speed-insights/nuxt";

// Inject <html lang>, hreflang alternates and og:locale for every route so
// search engines correctly index the multilingual (en/te/hi) versions.
const head = useLocaleHead({ dir: true, lang: true, seo: true });

useHead(() => ({
   htmlAttrs: {
      lang: head.value.htmlAttrs?.lang,
      dir: head.value.htmlAttrs?.dir,
   },
   link: head.value.link,
   meta: head.value.meta,
}));

// Site-wide identity: Organization + WebSite, present in the SSR HTML of every
// page so search engines and AI assistants understand the entity behind it.
useJsonLd(() => [
   organizationNode(),
   {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Devanilayam",
      description: "Ad-free devotional platform for Hindu slokas, ashtotaras and stotras with meanings in English, Telugu and Hindi.",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: ["en", "te", "hi"],
   },
]);
</script>

<style lang="scss">
#__nuxt {
   height: 100%;
   display: flex;
   flex-direction: column;

   main {
      flex: 1;
   }
}
</style>
