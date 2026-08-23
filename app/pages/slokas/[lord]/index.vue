<template>
   <main class="page">

      <h1>{{ listOfSlokas[0]?.lord }} {{ $t('slokas') }}</h1>

      <nuxt-link v-for="sloka in listOfSlokas" :key="sloka.sloka_id"
         :to="localePath(`/slokas/${lordId}/${sloka.sloka_id}`)">
         <ContentRenderer v-if="sloka" class="sloka-preview" :value="sloka" :excerpt="true" />
      </nuxt-link>

      <LordList />
   </main>
</template>

<script lang="ts" setup>
const { t } = useI18n();

const { getListOfSlokasByLordId } = useSlokas();

const localePath = useLocalePath();

const route = useRoute();

const { locale } = useLocale();

const lordId = computed(() => route.params.lord as string);

// Fetch on the server so the list of slokas is crawlable in the HTML.
const { data: listOfSlokas } = await useAsyncData(
   () => `slokas-list-${locale.value}-${lordId.value}`,
   () => getListOfSlokasByLordId(lordId.value),
   { default: () => [], watch: [locale] }
);

const lordName = computed(() => listOfSlokas.value?.[0]?.lord || lordId.value);

const title = computed(() => `${lordName.value} Slokas`);

useSeoMeta({
   title,
   description: computed(() => `Explore devotional slokas dedicated to ${lordName.value} with meanings and multiple scripts at Devanilayam.`),
   ogTitle: title,
   ogType: "website",
});

defineOgImageComponent("Default", {
   eyebrow: t("header.links.slokas"),
   title: title.value,
});

// Breadcrumb + ItemList help search + AI crawlers map the collection and its
// individual slokas.
useJsonLd(() => [
   {
      "@type": "BreadcrumbList",
      itemListElement: [
         { "@type": "ListItem", position: 1, name: "Slokas", item: `${SITE_URL}${localePath("/slokas")}` },
         { "@type": "ListItem", position: 2, name: lordName.value, item: `${SITE_URL}${localePath(`/slokas/${lordId.value}`)}` },
      ],
   },
   {
      "@type": "ItemList",
      name: title.value,
      itemListElement: (listOfSlokas.value || []).map((s, i) => ({
         "@type": "ListItem",
         position: i + 1,
         name: s.title,
         url: `${SITE_URL}${localePath(`/slokas/${lordId.value}/${s.sloka_id}`)}`,
      })),
   },
]);
</script>

<style lang="scss">
.sloka-preview {
   background-color: #FEF3C7;
   border-radius: px-to-rem(8);
   padding: px-to-rem(12) px-to-rem(16);
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);

   h1 {
      font-size: px-to-rem(24);
   }

   @include web-screen {
      h1 {
         font-size: px-to-rem(20);
      }

      &:hover {
         transform: scale(1.01);
         transition: transform 0.2s ease;
         box-shadow: 0 2px 8px rgba(0, 0, 0, 0.16);
      }
   }
}
</style>
