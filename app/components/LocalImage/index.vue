<template>
    <img class="local-image" :src="`${computedUrl}`" :alt="props.alt ?? 'Local Image'" loading="lazy"
        @error="handleImageError">
</template>

<script lang="ts" setup>
import type { LocalImage } from "./types";

const images = import.meta.glob("@/assets/images/**", { eager: true, import: "default" });

const props = withDefaults(defineProps<LocalImage>(), {});

const computedUrl = computed(() => images[`/assets/images/${props.folder ? `${props.folder}/` : ""}${props.file}`]);

const handleImageError = (): void => {

    console.error("Illustration: Invalid illustration props");

};

</script>

<style lang="scss"></style>
