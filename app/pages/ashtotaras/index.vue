<template>
   <main class="page page-ashtotaras">
      <home-section :title="$t('ashtotarasList.title')" :subtitle="$t('ashtotarasList.subtitle')">

         <input id="mantra-search" v-model.trim="searchQuery" type="text"
            :placeholder="$t('ashtotarasList.searchPlaceholder')" class="page-ashtotaras__search-input">

         <template v-if="filteredDeities.length > 0">
            <div class="page-ashtotaras__lords-list">
               <HomeCategoryCard v-for="lord in filteredDeities" :key="lord.lord_id" :lord="lord" />
            </div>
         </template>

         <template v-else>
            <div class="not-found">
               <p>{{ $t('ashtotarasList.noResults') }}</p>
            </div>
         </template>
      </home-section>

      <div class="page-ashtotaras__stay-tuned-text">
         <p>{{ $t('ashtotarasList.stayTuned') }}</p>
         <nuxt-link class="my-button my-button--outlined" :to="WHATSAPP_CHANNEL_LINK" external target="_blank">
            {{ $t('home.cta.joinWhatsappChannel') }}
         </nuxt-link>
      </div>

      <my-socials />
   </main>
</template>

<script setup lang="ts">
import { useAshtotaras } from "~/composables/useAshtotaras";
import { WHATSAPP_CHANNEL_LINK } from "~/configs";

const searchQuery = ref("");

// Use Ashtotaras composable instead of slokas
const { listOfLords, getListOfLords } = useAshtotaras();

const filteredDeities = computed(() => {

   const query = searchQuery.value.toLowerCase();

   if (!query) {

      return listOfLords.value;

   }

   return listOfLords.value.filter(
      (lord) =>
         lord.name.toLowerCase().includes(query) || lord.lord_id.toLowerCase().includes(query)
   );

});

onMounted(async () => {

   await getListOfLords();

});

</script>

<style lang="scss">
.page-ashtotaras {

   &__navigation {
      width: 100%;
      display: flex;
      align-items: center;

      .my-button {
         margin-right: auto;
      }
   }

   &__lords-list {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(px-to-rem(240), 1fr));
      gap: px-to-rem(8);

      @include mobile {
         grid-template-columns: repeat(auto-fill, minmax(px-to-rem(150), 1fr));
      }

      @include small-mobile {
         grid-template-columns: repeat(auto-fill, minmax(px-to-rem(140), 1fr));
      }
   }

   &__stay-tuned-text {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: px-to-rem(16);
   }

   &__search-input {
      width: 100%;
      padding: px-to-rem(12) px-to-rem(16);
      border: 1px solid var(--border-color, rgba($color: #EB730C, $alpha: 0.6));
      border-radius: px-to-rem(8);
      color: rgba($color: #EB730C, $alpha: 0.6);
      font: inherit;

      &::placeholder {
         color: rgba($color: #EB730C, $alpha: 0.6);
      }

      &:focus {
         border-color: rgba($color: #EB730C, $alpha: 1);
         outline: none;
      }
   }

   .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      p {
         font-size: px-to-rem(24);
         font-weight: 600;
         font-style: italic;
      }
   }
}
</style>
