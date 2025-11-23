<template>
   <div ref="triggerRef" class="my-dropdown" @click="handleTriggerClick">
      <slot name="trigger" />
   </div>

   <Teleport to="body">
      <Transition name="dropdown">
         <div v-if="isOpen" ref="dropdownRef"
            :class="['my-dropdown__content', `my-dropdown__content--${props.placement}`]" :style="dropdownStyle"
            @click.stop>
            <slot name="content" />
         </div>
      </Transition>

      <div v-if="isOpen" class="my-dropdown__overlay" @click="close" />
   </Teleport>
</template>

<script setup lang="ts">
import type { MyDropdownProps } from "./types";

defineOptions({ name: "MyDropdown" });

const props = withDefaults(defineProps<MyDropdownProps>(), {
   placement: "bottom-start",
});

const isOpen = ref(false);

const triggerRef = ref<HTMLElement | null>(null);

const dropdownRef = ref<HTMLElement | null>(null);

const dropdownStyle = ref<{ top?: string; left?: string; right?: string; bottom?: string }>({});

const updatePosition = (): void => {

   if (!triggerRef.value || !dropdownRef.value || !isOpen.value) {

      return;

   }

   const triggerRect = triggerRef.value.getBoundingClientRect();

   const dropdownRect = dropdownRef.value.getBoundingClientRect();

   const viewportWidth = window.innerWidth;

   const viewportHeight = window.innerHeight;

   const scrollY = window.scrollY;

   const scrollX = window.scrollX;

   let top = 0;

   let left = 0;

   // Calculate position based on placement
   switch (props.placement) {

      case "top-start":
         top = triggerRect.top + scrollY - dropdownRect.height;
         left = triggerRect.left + scrollX;
         break;

      case "top-end":
         top = triggerRect.top + scrollY - dropdownRect.height;
         left = triggerRect.left + scrollX + triggerRect.width - dropdownRect.width;
         break;

      case "bottom-start":
         top = triggerRect.bottom + scrollY;
         left = triggerRect.left + scrollX;
         break;

      case "bottom-end":
         top = triggerRect.bottom + scrollY;
         left = triggerRect.left + scrollX + triggerRect.width - dropdownRect.width;
         break;

      case "left-start":
         top = triggerRect.top + scrollY;
         left = triggerRect.left + scrollX - dropdownRect.width;
         break;

      case "left-end":
         top = triggerRect.top + scrollY + triggerRect.height - dropdownRect.height;
         left = triggerRect.left + scrollX - dropdownRect.width;
         break;

      case "right-start":
         top = triggerRect.top + scrollY;
         left = triggerRect.right + scrollX;
         break;

      case "right-end":
         top = triggerRect.top + scrollY + triggerRect.height - dropdownRect.height;
         left = triggerRect.right + scrollX;
         break;

      default:
         top = triggerRect.bottom + scrollY;
         left = triggerRect.left + scrollX;
         break;

   }

   // Adjust if dropdown goes off-screen
   const offsetPx = 8;

   if (left + dropdownRect.width > viewportWidth + scrollX) {

      left = viewportWidth + scrollX - dropdownRect.width - offsetPx;

   }

   if (left < scrollX) {

      left = scrollX + offsetPx;

   }

   if (top + dropdownRect.height > viewportHeight + scrollY) {

      top = viewportHeight + scrollY - dropdownRect.height - offsetPx;

   }

   if (top < scrollY) {

      top = scrollY + offsetPx;

   }

   dropdownStyle.value = {
      top: `${top}px`,
      left: `${left}px`,
   };

};

const handleTriggerClick = (): void => {

   isOpen.value = !isOpen.value;

};

const close = (): void => {

   isOpen.value = false;

};

const handleClickOutside = (event: MouseEvent): void => {

   if (
      isOpen.value &&
      triggerRef.value &&
      dropdownRef.value &&
      !triggerRef.value.contains(event.target as Node) &&
      !dropdownRef.value.contains(event.target as Node)
   ) {

      close();

   }

};

const handleEscape = (event: KeyboardEvent): void => {

   if (event.key === "Escape" && isOpen.value) {

      close();

   }

};

const handleScroll = (): void => {

   if (isOpen.value) {

      updatePosition();

   }

};

watch(isOpen, (newValue) => {

   if (newValue) {

      nextTick(() => {

         updatePosition();

      });

   }

});

onMounted(() => {

   document.addEventListener("click", handleClickOutside);
   document.addEventListener("keydown", handleEscape);
   window.addEventListener("scroll", handleScroll, true);
   window.addEventListener("resize", updatePosition);

});

onUnmounted(() => {

   document.removeEventListener("click", handleClickOutside);
   document.removeEventListener("keydown", handleEscape);
   window.removeEventListener("scroll", handleScroll, true);
   window.removeEventListener("resize", updatePosition);

});

watch(
   () => props.placement,
   () => {

      if (isOpen.value) {

         nextTick(() => {

            updatePosition();

         });

      }

   }
);

defineExpose({
   close,
});
</script>

<style lang="scss">
.my-dropdown {
   position: relative;
   display: inline-block;

   &__content {
      position: absolute;
      z-index: 1000;
      background: #FAF8F3;
      border: 1px solid rgba(45, 42, 35, 0.09);
      border-radius: px-to-rem(10);
      box-shadow: 0 px-to-rem(4) px-to-rem(12) rgba(0, 0, 0, 0.15);
      padding: px-to-rem(8);
      min-width: px-to-rem(120);
      max-width: px-to-rem(320);
      max-height: px-to-rem(400);
      overflow-y: auto;
      margin-top: px-to-rem(4);

      &--top-start,
      &--top-end {
         margin-top: 0;
         margin-bottom: px-to-rem(4);
      }

      &--left-start,
      &--left-end,
      &--right-start,
      &--right-end {
         margin-top: 0;
      }
   }

   &__overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 999;
      background: transparent;
   }
}

.dropdown-enter-active,
.dropdown-leave-active {
   transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from {
   opacity: 0;
   transform: translateY(px-to-rem(-4)) scale(0.95);
}

.dropdown-leave-to {
   opacity: 0;
   transform: translateY(px-to-rem(-4)) scale(0.95);
}
</style>
