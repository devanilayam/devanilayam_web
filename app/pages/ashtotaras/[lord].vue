<template>
   <main class="page page-sloka-preview">
      <font-size-controller />

      <ContentRenderer v-if="ashtotara" :value="ashtotara" class="sloka-area" />

      <LordList :is-ashtotara="true" />
   </main>
</template>

<script lang="ts" setup>
import { useAshtotaras } from "~/composables/useAshtotaras";

const { getAshtotara } = useAshtotaras();

const route = useRoute();

const { locale } = useLocale();

const lordId = computed(() => route.params.lord as string);

// There is no ashtotara id param, directly use lordId.
// Fetch on the server so crawlers receive the fully-rendered content.
const { data: ashtotara } = await useAsyncData(
   () => `ashtotara-${locale.value}-${lordId.value}`,
   () => getAshtotara(lordId.value),
   { watch: [locale] }
);

if (!ashtotara.value) {

   throw createError({ statusCode: 404, statusMessage: "Ashtotara not found", fatal: true });

}

const fallbackDescription = "Discover ashtotaras and devotional names at Devanilayam.";

const title = computed(() => ashtotara.value?.title || "Ashtotara");

const description = computed(() => ashtotara.value?.description || ashtotara.value?.excerpt || fallbackDescription);

useSeoMeta({
   title,
   description,
   ogTitle: title,
   ogDescription: description,
   ogType: "article",
   twitterTitle: title,
   twitterDescription: description,
   twitterCard: "summary_large_image",
});

useJsonLd(() => ({
   "@type": "Article",
   headline: title.value,
   description: description.value,
   inLanguage: locale.value,
   about: { "@type": "Thing", name: ashtotara.value?.lord },
   keywords: ashtotara.value?.tags,
   datePublished: ashtotara.value?.date,
   image: `${SITE_URL}/og-image.png`,
   isPartOf: { "@id": `${SITE_URL}/#website` },
   publisher: { "@id": `${SITE_URL}/#organization` },
}));
</script>
