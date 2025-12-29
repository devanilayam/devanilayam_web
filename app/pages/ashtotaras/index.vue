<template>
   <main class="page page-ashtotaras">
      <home-section :title="$t('ashtotarasList.title')" :subtitle="$t('ashtotarasList.subtitle')">

         <input id="mantra-search" v-model.trim="searchQuery" type="text"
            :placeholder="$t('ashtotarasList.searchPlaceholder')" class="page-ashtotaras__search-input">

         <template v-if="filteredDeities.length > 0">
            <div class="page-ashtotaras__lords-list">
               <LordCard v-for="lord in filteredDeities" :key="lord.lord_id" :lord="lord" :is-ashtotara="true" />
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
