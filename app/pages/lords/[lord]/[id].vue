<template>
   <main class="page">
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
});

onMounted(async () => {

   const lordId = route.params.lord as string;

   const slokaId = route.params.id as string;

   sloka.value = await getSloka(lordId, slokaId);

});
</script>

<style lang="scss">
.font-size-display {
   font-size: px-to-rem(20);
   font-weight: 500;
   min-width: px-to-rem(50);
   text-align: center;
   margin-right: auto;
}

.font-size-controls {
   display: flex;
   align-items: center;
   gap: px-to-rem(12);
   justify-content: flex-end;
}

.font-size-btn {
   display: flex;
   align-items: center;
   justify-content: center;
   width: px-to-rem(36);
   height: px-to-rem(36);
   border-radius: px-to-rem(8);
   background: #EB730C;
   color: #FAF8F3;
   cursor: pointer;
   transition: background 0.15s, opacity 0.15s;
   border: none;

   &:hover:not(:disabled) {
      background: #d25f07;
   }

   &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
   }

   .font-size-icon {
      font-size: px-to-rem(20);
      font-weight: 600;
      line-height: 1;
   }
}

.sloka-area {
   background: #FEF3C7;
   border-radius: px-to-rem(12);
   flex: 1;
   padding: px-to-rem(8) px-to-rem(16) px-to-rem(20) px-to-rem(16);
   max-height: fit-content;
   transition: font-size 0.2s ease;

   @include web-screen {
      // margin: px-to-rem(32);
      padding: px-to-rem(32);
   }
}
</style>
