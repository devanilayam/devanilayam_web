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

const ashtotara = ref();

useSeoMeta({
   title: computed(() => (ashtotara.value?.title || "Ashtotara") + " | Devanilayam"),
   description: computed(() => ashtotara.value?.excerpt || "Discover ashtotaras and devotional names at Devanilayam."),
   ogTitle: computed(() => ashtotara.value?.title || "Ashtotara | Devanilayam"),
   ogDescription: computed(() => ashtotara.value?.excerpt || "Discover ashtotaras and devotional names at Devanilayam."),
   twitterTitle: computed(() => ashtotara.value?.title || "Ashtotara | Devanilayam"),
   twitterDescription: computed(() => ashtotara.value?.excerpt || "Discover ashtotaras and devotional names at Devanilayam."),
   twitterCard: computed(() => ashtotara.value?.excerpt || "Discover ashtotaras and devotional names at Devanilayam."),
   twitterSite: computed(() => "@devanilayam"),
   twitterCreator: computed(() => "@devanilayam"),
});

onMounted(async () => {

   const lordId = route.params.lord as string;

   // There is no ashtotara id param, directly use lordId
   ashtotara.value = await getAshtotara(lordId);

});
</script>
