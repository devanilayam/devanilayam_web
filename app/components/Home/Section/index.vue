<template>
   <section class="page-index-section">
      <h1 class="page-index-section__heading">{{ props.title }}</h1>
      <p class="page-index-section__subtitle">
         {{ props.subtitle }}
      </p>

      <div :class="['page-index-section__content', props.contentClass]">
         <slot />
      </div>

      <div v-if="hasFooterSlot" class="page-index-section__footer">
         <slot name="footer" />
      </div>
   </section>
</template>

<script setup lang="ts">
import type { HomeSectionProps } from "./types";

defineOptions({ name: "HomeSection" });

const props = withDefaults(defineProps<HomeSectionProps>(), {
   contentClass: "",
});

const slots = useSlots();

const hasFooterSlot = computed(() => !!slots.footer);

</script>

<style lang="scss">
.page-index-section {
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   gap: px-to-rem(12);

   padding: px-to-rem(12) px-to-rem(24);

   &__heading {
      color: #854D0E;
      text-align: center;
      font-family: 'Merriweather', serif;
      font-size: px-to-rem(36);
      line-height: px-to-rem(40);
      font-weight: 600;

      @include mobile {
         font-size: px-to-rem(20);
         line-height: px-to-rem(24);
         font-weight: 700;
      }
   }

   &__subtitle {
      color: #6B6760;
      text-align: center;
      font-size: px-to-rem(16);
      line-height: px-to-rem(24);

      @include mobile {
         font-size: px-to-rem(14);
         line-height: px-to-rem(16);
      }
   }

   &__content {
      width: 100%;
      margin-top: px-to-rem(32);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: px-to-rem(48);

      @include mobile {
         gap: px-to-rem(24);
      }
   }

   &__footer {
      margin-top: px-to-rem(12);
   }
}
</style>
