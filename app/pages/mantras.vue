<template>
   <main class="page page-mantras">
      <home-section :title="$t('mantras.title')"
         :subtitle="$t('mantras.subtitle')">

         <input id="mantra-search" v-model.trim="searchQuery" type="text" :placeholder="$t('mantras.searchPlaceholder')"
            class="page-mantras__search-input">

         <template v-if="filteredMantras.length > 0">
            <HomeCategoryCard v-for="mantra in filteredMantras" :id="mantra.id" :key="mantra.id" :title="mantra.name"
               :image="mantra.imgPath" />
         </template>

         <div v-else class="not-found">
            <icon name="search-lg" :size="48" color="#EB730C" />
            <p>{{ $t('mantras.noResults') }}</p>
         </div>
      </home-section>

      <div class="page-mantras__stay-tuned-text">
         <p>{{ $t('mantras.stayTuned') }}</p>
         <nuxt-link class="my-button my-button--outlined" :to="WHATSAPP_CHANNEL_LINK" external target="_blank">
            {{ $t('home.cta.joinWhatsappChannel') }}
         </nuxt-link>
      </div>

      <my-socials />
   </main>
</template>

<script setup lang="ts">
import { HOME_PAGE_MANTRAS, WHATSAPP_CHANNEL_LINK } from "~/configs";

const searchQuery = ref("");

const filteredMantras = computed(() => {

   const query = searchQuery.value.toLowerCase();

   if (!query) {

      return HOME_PAGE_MANTRAS;

   }

   return HOME_PAGE_MANTRAS.filter((mantra) => mantra.name.toLowerCase().includes(query));

});
</script>

<style lang="scss">
.page-mantras {

   &__navigation {
      width: 100%;
      display: flex;
      align-items: center;

      .my-button {
         margin-right: auto;
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
      font-style: italic;
   }
}
</style>
