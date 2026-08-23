<template>
   <img
      class="local-image"
      :src="computedSrc"
      :alt="props.alt ?? 'Local Image'"
      :width="props.width"
      :height="props.height"
      :loading="props.priority ? 'eager' : 'lazy'"
      :fetchpriority="props.priority ? 'high' : 'auto'"
      decoding="async"
      @error="handleImageError">
</template>

<script lang="ts" setup>
import type { LocalImage } from "./types";

const props = withDefaults(defineProps<LocalImage>(), {
   folder: undefined,
   alt: undefined,
   width: undefined,
   height: undefined,
   priority: false,
});

// A plain path under /images rather than a bundler glob. The previous version
// used import.meta.glob(..., { eager: true }), which pulled every file under
// assets/images into the entry chunk's asset graph — so the home page emitted
// a prefetch link for all seven (~3 MB) no matter which ones it rendered.
//
// Deliberately a plain <img> and not <NuxtImg>: rendering NuxtImg here makes
// the prerender step die partway through, exiting 0 with only a fraction of
// the routes written. See the note in components/LocalImage/types.ts.
const computedSrc = computed(() => `/images/${props.folder ? `${props.folder}/` : ""}${props.file}`);

const handleImageError = (): void => {

   console.error(`LocalImage: could not load "${computedSrc.value}"`);

};

</script>
