<template>
   <button :class="['my-button', {
      'my-button--outlined': props.variant === 'outlined',
      'my-button--plain': props.variant === 'plain'
   }]">
      <slot>
         Button Text
      </slot>
   </button>
</template>

<script lang="ts" setup>
import type { MyButtonProps } from "./types";

const props = withDefaults(defineProps<MyButtonProps>(), {
   variant: "default",
});

</script>

<style lang="scss">
.my-button {
   display: flex;
   height: px-to-rem(40);
   padding: 0 px-to-rem(24);
   justify-content: center;
   align-items: center;
   gap: px-to-rem(8);
   border-radius: px-to-rem(10);
   background: #EB730C;
   color: #FAF8F3;
   text-align: center;
   font-family: "Noto Sans";
   font-size: px-to-rem(14);
   font-style: normal;
   font-weight: 500;
   line-height: px-to-rem(20);

   .icon {
      color: white;
   }

   @include web-screen {

      &:hover {
         cursor: pointer;
         background: #d25f07;
         transition: background 0.15s, color 0.15s;
      }
   }

   &--outlined {
      border: 1.5px solid #EB730C;
      color: #EB730C;
      background: transparent;
      transition: background 0.15s, color 0.15s;

      .icon {
         color: #EB730C;
      }

      &:hover {
         background: #FBE8D0;
      }
   }

   &--plain {
      border: none;
      background: transparent;
      color: #EB730C;
      box-shadow: none;

      .icon {
         color: #EB730C;
      }

      &:hover {
         background: #FBE8D0;
         color: #EB730C;
      }
   }
}
</style>
