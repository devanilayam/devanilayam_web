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

const { listOfLords: lordsOfSlokas, getListOfLords: getLordsOfSlokas } = useSlokas();

const { listOfLords: lordsOfAshtotaras, getListOfLords: getLordsOfAshtotaras } = useAshtotaras();

const route = useRoute();

const { t } = useI18n();

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

const footerLink = computed(() => props.isAshtotara ? "/ashtotaras" : "/slokas");

const slicedListOfLords = computed(() => {

   const currentLordId = route.params.lord;

   const lords = props.isAshtotara ? lordsOfAshtotaras : lordsOfSlokas;

   // Filter out the current lord if on a lord-specific page, else leave as is
   const filtered = currentLordId
      ? lords.value.filter(lord => lord.lord_id !== currentLordId)
      : lords.value;

   return filtered.slice(0, 3);

});

onMounted(async () => {

   if (props.isAshtotara) {

      await getLordsOfAshtotaras();

   } else {

      await getLordsOfSlokas();

   }

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
