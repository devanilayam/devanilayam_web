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
