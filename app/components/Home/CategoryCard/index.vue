<template>
   <NuxtLink :to="`/lords/${props.lord.lord_id}`" class="category-card"
      :style="{ backgroundImage: `url(${computedImgUrl})` }">
      <div class="category-card__overlay">
         <p class="category-card__title">{{ props.lord.name }}</p>
      </div>
   </NuxtLink>
</template>

<script setup lang="ts">
import type { CategoryCardProps } from "./types";

defineOptions({ name: "CategoryCard" });

const props = defineProps<CategoryCardProps>();

const images = import.meta.glob("@/assets/images/**", { eager: true, import: "default" });

const computedImgUrl = computed(() => images[`/assets/images/lord/${props.lord.lord_id.toLowerCase()}.webp`]);

</script>

<style lang="scss">
.category-card {
   position: relative;
   display: inline-flex;
   border-radius: px-to-rem(20);
   overflow: hidden;
   min-width: px-to-rem(240);
   min-height: px-to-rem(300);

   background-position: center;
   background-repeat: no-repeat;
   background-size: cover;

   &__overlay {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.80) 0%, rgba(0, 0, 0, 0.40) 50%, rgba(0, 0, 0, 0.20) 100%);
   }

   &__title {
      margin-bottom: px-to-rem(24);
      color: #FFF;
      font-family: 'Merriweather', serif;
      font-size: px-to-rem(24);
      line-height: px-to-rem(32);
      text-align: center;
   }

   @include mobile {
      min-width: px-to-rem(150);
      min-height: px-to-rem(200);

      &__title {
         font-size: px-to-rem(16);
         line-height: px-to-rem(20);
      }
   }
}
</style>
