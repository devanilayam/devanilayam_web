<template>
   <HomeSection :title="sectionTitle" :subtitle="sectionSubtitle">
      <div class="list-of-lords__lords-list">
         <LordCard v-for="lord in slicedListOfLords" :key="lord.lord_id" :lord="lord" />
      </div>

      <template #footer>
         <nuxt-link class="my-button" :to="footerLink">
            {{ viewAllLabel }}
         </nuxt-link>
      </template>
   </HomeSection>
</template>

<script lang="ts" setup>
import type { LordListProps } from "./types";

const props = withDefaults(defineProps<LordListProps>(), {
   isAshtotara: false,
});

const { getListOfLords: getLordsOfSlokas } = useSlokas();

const { getListOfLords: getLordsOfAshtotaras } = useAshtotaras();

const route = useRoute();

const { t, locale } = useI18n();

// Fetch on the server so deity links are present in the crawlable HTML.
const { data: lords } = await useAsyncData(
   () => `lord-list-${props.isAshtotara ? "ashtotaras" : "slokas"}-${locale.value}`,
   () => (props.isAshtotara ? getLordsOfAshtotaras() : getLordsOfSlokas()),
   { default: () => [], watch: [locale, () => props.isAshtotara] }
);

const sectionTitle = computed(() =>
   props.isAshtotara
      ? t("home.sections.ashtotarasList.title")
      : t("home.sections.slokasList.title")
);

const sectionSubtitle = computed(() =>
   props.isAshtotara
      ? t("home.sections.ashtotarasList.subtitle")
      : t("home.sections.slokasList.subtitle")
);

const viewAllLabel = computed(() =>
   props.isAshtotara
      ? t("home.sections.ashtotarasList.viewAll")
      : t("home.sections.slokasList.viewAll")
);

const localePath = useLocalePath();

const footerLink = computed(() => localePath(props.isAshtotara ? "/ashtotaras" : "/slokas"));

const slicedListOfLords = computed(() => {

   const currentLordId = route.params.lord;

   // Filter out the current lord if on a lord-specific page, else leave as is
   const filtered = currentLordId
      ? lords.value.filter(lord => lord.lord_id !== currentLordId)
      : lords.value;

   return filtered.slice(0, 3);

});
</script>

<style lang="scss">
.list-of-lords {
   &__lords-list {
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;
      gap: px-to-rem(8);
   }
}
</style>
