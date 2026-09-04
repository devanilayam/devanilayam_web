<template>
   <!--
      The native <dialog>, opened with showModal(), rather than a div and an
      overlay. It brings focus trapping, Esc-to-close, inertness of everything
      behind it and top-layer stacking with no script of our own — all four are
      things this dialog needs, and all four are easy to get subtly wrong by
      hand. `open` is never bound as an attribute: showModal() is what makes a
      dialog MODAL, and the attribute alone would render it inline and
      focusable-through.
   -->
   <dialog ref="dialogRef" class="my-dialog" @close="emit('close')" @click="onDialogClick">
      <div class="my-dialog__panel">
         <header class="my-dialog__header">
            <h2 class="my-dialog__title">
               <slot name="title" />
            </h2>
            <button type="button" class="my-dialog__close" :aria-label="props.closeLabel" @click="emit('close')">
               <icon name="x" :size="20" color="#854D0E" />
            </button>
         </header>

         <div class="my-dialog__body">
            <slot />
         </div>
      </div>
   </dialog>
</template>

<script setup lang="ts">
import type { MyDialogProps } from "./types";

const props = defineProps<MyDialogProps>();

const emit = defineEmits<{ close: [] }>();

const dialogRef = ref<HTMLDialogElement | null>(null);

/**
 * The backdrop is painted by the dialog element itself, so a click on it lands
 * on the dialog and a click on the content lands on the panel inside. Comparing
 * the target is enough to tell them apart — and the panel is the dialog's only
 * child with any padding of its own, so there is no dead strip that would close
 * the dialog when the reader meant to click near its edge.
 */
const onDialogClick = (event: MouseEvent): void => {

   if (event.target === dialogRef.value) {

      emit("close");

   }

};

watch(() => props.open, (open) => {

   const dialog = dialogRef.value;

   if (!dialog) {

      return;

   }

   if (open && !dialog.open) {

      dialog.showModal();

   } else if (!open && dialog.open) {

      dialog.close();

   }

});

// Nothing opens during SSR — the element is rendered closed and the watcher
// above only ever runs in the browser, so the markup hydrates cleanly.
onBeforeUnmount(() => {

   if (dialogRef.value?.open) {

      dialogRef.value.close();

   }

});
</script>
