<!-- eslint-disable vue/no-multiple-template-root -->
<template>
   <MyHeader />
   <SideMenu />
   <NuxtPage />
   <MyFooter />
</template>

<script setup lang="ts">
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

// Site-wide fallback Open Graph card. Pages that call defineOgImageComponent()
// with their own title override this; everything else still gets a branded card
// rather than sharing one static image.
defineOgImageComponent("Default", {
   title: "Devanilayam",
   description: "Slokas, ashtotaras and stotras — ad-free, with meanings and audio.",
});

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
      // Declares the site's own search endpoint, which is what lets Google
      // show a sitelinks search box for the brand. The URL template must be a
      // real, crawlable GET route — see app/pages/search.vue.
      potentialAction: {
         "@type": "SearchAction",
         target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/en/search?q={search_term_string}`,
         },
         "query-input": "required name=search_term_string",
      },
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
