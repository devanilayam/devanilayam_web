<template>
   <HomeSection :title="$t('home.sections.slokasList.title')" :subtitle="$t('home.sections.slokasList.subtitle')">
      <div class="list-of-lords__lords-list">
         <HomeCategoryCard v-for="lord in slicedListOfLords" :key="lord.lord_id" :lord="lord" />
      </div>

      <template #footer>
         <nuxt-link class="my-button" :to="`/slokas`">
            {{ $t('home.sections.slokasList.viewAll') }}
         </nuxt-link>
      </template>
   </HomeSection>
</template>

<script lang="ts" setup>
const { listOfLords, getListOfLords } = useSlokas();

const route = useRoute();

const slicedListOfLords = computed(() => {

   const currentLordId = route.params.lord;

   // Filter out the current lord if on a lord-specific page, else leave as is
   const filtered = currentLordId
      ? listOfLords.value.filter(lord => lord.lord_id !== currentLordId)
      : listOfLords.value;

   return filtered.slice(0, 3);

});

onMounted(async () => {

   await getListOfLords();

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
