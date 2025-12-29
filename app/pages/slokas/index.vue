<template>
   <main class="page page-slokas">
      <home-section :title="$t('slokasList.title')" :subtitle="$t('slokasList.subtitle')">

         <input id="mantra-search" v-model.trim="searchQuery" type="text"
            :placeholder="$t('slokasList.searchPlaceholder')" class="page-slokas__search-input">

         <template v-if="filteredDeities.length > 0">
            <div class="page-slokas__lords-list">
               <LordCard v-for="lord in filteredDeities" :key="lord.lord_id" :lord="lord" />
            </div>
         </template>

         <template v-else>
            <div class="not-found">
               <p>{{ $t('slokasList.noResults') }}</p>
            </div>
         </template>
      </home-section>

      <div class="page-slokas__stay-tuned-text">
         <p>{{ $t('slokasList.stayTuned') }}</p>
         <nuxt-link class="my-button my-button--outlined" :to="WHATSAPP_CHANNEL_LINK" external target="_blank">
            {{ $t('home.cta.joinWhatsappChannel') }}
         </nuxt-link>
      </div>

      <my-socials />
   </main>
</template>

<script setup lang="ts">
import { WHATSAPP_CHANNEL_LINK } from "~/configs";

const searchQuery = ref("");

const { listOfLords, getListOfLords } = useSlokas();

const filteredDeities = computed(() => {

   const query = searchQuery.value.toLowerCase();

   if (!query) {

      return listOfLords.value;

   }

   return listOfLords.value.filter(
      (lord) => lord.name.toLowerCase().includes(query) || lord.lord_id.toLowerCase().includes(query)
   );

});

onMounted(async () => {

   await getListOfLords();

});

</script>
