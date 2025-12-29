<template>
   <main class="page page-sloka-preview">
      <div class="font-size-controls">
         <p class="font-size-display">{{ $t('sloka-page.fontSize') }}</p>
         <button class="font-size-btn" :disabled="fontSize <= minFontSize" aria-label="Decrease font size"
            @click="decreaseFontSize">
            <span class="font-size-icon">−</span>
         </button>
         <button class="font-size-btn" :disabled="fontSize >= maxFontSize" aria-label="Increase font size"
            @click="increaseFontSize">
            <span class="font-size-icon">+</span>
         </button>
      </div>
      <ContentRenderer v-if="ashtotara" :value="ashtotara" class="sloka-area" :style="{ fontSize: `${fontSize}px` }" />

      <LordList :is-ashtotara="true" />
   </main>
</template>

<script lang="ts" setup>
import { useStorage } from "@vueuse/core";
import { useAshtotaras } from "~/composables/useAshtotaras";

const { getAshtotara } = useAshtotaras();

const route = useRoute();

const ashtotara = ref();

// Font size controller with localStorage persistence
const minFontSize = 12;

const maxFontSize = 24;

const defaultFontSize = 16;

const fontSize = useStorage("sloka-font-size", defaultFontSize);

const increaseFontSize = () => {

   if (fontSize.value < maxFontSize) {

      fontSize.value += 2;

   }

};

const decreaseFontSize = () => {

   if (fontSize.value > minFontSize) {

      fontSize.value -= 2;

   }

};

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
