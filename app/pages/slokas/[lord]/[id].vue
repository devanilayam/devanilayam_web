<template>
   <main class="page page-sloka-preview">
      <font-size-controller />
      <ContentRenderer v-if="sloka" :value="sloka" class="sloka-area" />
   </main>
</template>

<script lang="ts" setup>
const { t } = useI18n();

const { getSloka } = useSlokas();

const route = useRoute();

const { locale } = useLocale();

const lordId = computed(() => route.params.lord as string);

const slokaId = computed(() => route.params.id as string);

// Fetch on the server so crawlers receive the fully-rendered sloka in the HTML.
const { data: sloka } = await useAsyncData(
   () => `sloka-${locale.value}-${lordId.value}-${slokaId.value}`,
   () => getSloka(lordId.value, slokaId.value),
   { watch: [locale] }
);

if (!sloka.value) {

   throw createError({ statusCode: 404, statusMessage: "Sloka not found", fatal: true });

}

const fallbackDescription = "Discover devotional slokas and their meanings at Devanilayam.";

const title = computed(() => sloka.value?.title || "Sloka");

const description = computed(() => sloka.value?.description || sloka.value?.excerpt || fallbackDescription);

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

defineOgImageComponent("Default", {
   eyebrow: t("header.links.slokas"),
   title: title.value,
   description: description.value,
});

// Structured data helps Google + AI assistants understand the devotional text.
useJsonLd(() => ({
   "@type": "Article",
   headline: title.value,
   description: description.value,
   inLanguage: locale.value,
   about: { "@type": "Thing", name: sloka.value?.lord },
   keywords: sloka.value?.tags,
   datePublished: sloka.value?.date,
   // nuxt-og-image renders a per-page card and advertises it via og:image;
   // its URL is content-hashed and not derivable here, so the schema image
   // is the stable site mark rather than a URL that could go stale.
   image: `${SITE_URL}/icons/icon-512.png`,
   isPartOf: { "@id": `${SITE_URL}/#website` },
   publisher: { "@id": `${SITE_URL}/#organization` },
}));
</script>
