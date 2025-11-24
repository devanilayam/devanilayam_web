<template>
   <div class="feature-card">
      <div class="feature-card__icon-wrapper">
         <Icon :name="props.icon" :size="32" color="#EB730C" />
      </div>
      <h2 class="feature-card__title">{{ props.title }}</h2>
      <p class="feature-card__description">
         {{ props.description }}
      </p>
   </div>
</template>

<script setup lang="ts">
import type { FeatureCardProps } from "./types";

defineOptions({ name: "FeatureCard" });

const props = defineProps<FeatureCardProps>();

</script>

<style lang="scss">
.feature-card {
   display: flex;
   flex-direction: column;
   align-items: center;
   gap: px-to-rem(12);
   text-align: center;

   width: px-to-rem(240);
   min-width: px-to-rem(240);

   &__icon-wrapper {
      padding: px-to-rem(12);
      background: rgba(235, 115, 12, 0.15);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
   }

   &__title {
      color: #854D0E;
      font-family: 'Merriweather', serif;
      font-size: 18px;
      line-height: 28px;
   }

   &__description {
      color: #6B6760;
      font-size: 14px;
      line-height: 20px;
   }
}
</style>
