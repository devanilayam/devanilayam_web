<!-- Start of Selection -->
<template>
   <div class="font-size-controller">
      <p class="font-size-controller__title">{{ $t('sloka-page.fontSize') }}</p>
      <button class="font-size-controller__btn" :disabled="fontSize <= minFontSize" aria-label="Decrease font size"
         @click="decreaseFontSize">
         <span class="font-size-controller__btn-icon">−</span>
      </button>
      <button class="font-size-controller__btn" :disabled="fontSize >= maxFontSize" aria-label="Increase font size"
         @click="increaseFontSize">
         <span class="font-size-controller__btn-icon">+</span>
      </button>
   </div>
</template>
<script lang="ts" setup>
import { useFontSize } from "~/composables/useFontSize";

const { fontSize, minFontSize, maxFontSize, increaseFontSize, decreaseFontSize } = useFontSize();
</script>

<style lang="scss">
.font-size-controller {
   display: flex;
   align-items: center;
   gap: px-to-rem(12);
   justify-content: flex-end;

   &__title {
      font-size: px-to-rem(20);
      font-weight: 500;
      min-width: px-to-rem(50);
      text-align: center;
      margin-right: auto;
   }

   &__btn {
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

      &-icon {
         font-size: px-to-rem(20);
         font-weight: 600;
         line-height: 1;
      }
   }
}
</style>
