<template>
    <div :class="['logo', { 'logo--vertical': props.orientation === 'vertical' }]">
        <logo-emblem v-if="props.variant === 'default' || props.variant === 'emblem'" v-bind="emblemBindings" />
        <logo-wordmark v-if="props.variant === 'default' || props.variant === 'wordmark'" v-bind="wordmarkBindings" />
    </div>
</template>

<script lang="ts" setup>
import type { LogoProps } from './types';

const props = withDefaults(defineProps<LogoProps>(), {
    orientation: 'horizontal',
    variant: 'default',
    height: 48,
    color: "#EB730C",
});

const emblemBindings = computed(() => ({
    height: props.orientation === 'vertical' ? ((props.height - 4) * 4) / 5 : props.height,
    fill: props.color,
}));

const wordmarkBindings = computed(() => ({
    height: props.orientation === 'vertical' ? (props.height - 4) / 5 : props.height,
    fill: props.color,
}));

</script>

<style lang="scss">
.logo {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    max-width: fit-content !important;

    &--vertical {
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
}
</style>
