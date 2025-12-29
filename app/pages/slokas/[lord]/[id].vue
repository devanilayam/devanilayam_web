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
      <ContentRenderer v-if="sloka" :value="sloka" class="sloka-area" :style="{ fontSize: `${fontSize}px` }" />
   </main>
</template>

<script lang="ts" setup>
import { useStorage } from "@vueuse/core";

const { getSloka } = useSlokas();

const route = useRoute();

const sloka = ref();

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
   title: computed(() => (sloka.value?.title || "Sloka") + " | Devanilayam"),
   description: computed(() => sloka.value?.excerpt || "Discover devotional slokas and their meanings at Devanilayam."),
   ogTitle: computed(() => sloka.value?.title || "Sloka | Devanilayam"),
   ogDescription: computed(() => sloka.value?.excerpt || "Discover devotional slokas and their meanings at Devanilayam."),
   twitterTitle: computed(() => sloka.value?.title || "Sloka | Devanilayam"),
   twitterDescription: computed(() => sloka.value?.excerpt || "Discover devotional slokas and their meanings at Devanilayam."),
   twitterCard: computed(() => sloka.value?.excerpt || "Discover devotional slokas and their meanings at Devanilayam."),
   twitterSite: computed(() => "@devanilayam"),
   twitterCreator: computed(() => "@devanilayam"),

});

onMounted(async () => {

   const lordId = route.params.lord as string;

   const slokaId = route.params.id as string;

   sloka.value = await getSloka(lordId, slokaId);

});
</script>
