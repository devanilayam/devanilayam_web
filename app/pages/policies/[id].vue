<template>
    <main class="page">
        <ContentRenderer v-if="policy" :value="policy" />
    </main>
</template>

<script lang="ts" setup>
const route = useRoute();

const { locale } = useLocale();

const id = computed(() => route.params.id as string);

// Fetch on the server so crawlers receive the fully-rendered policy in the HTML.
const { data: policy } = await useAsyncData(
    () => `policy-${locale.value}-${id.value}`,
    () => queryCollection("policies")
        .where("id", "=", `policies/policies/${locale.value}/${id.value}.md`)
        .first(),
    { watch: [locale] }
);

if (!policy.value) {

    throw createError({ statusCode: 404, statusMessage: "Policy not found", fatal: true });

}

const title = computed(() => policy.value?.title || "Policy");

useSeoMeta({
    title,
    description: computed(() => policy.value?.description || `${title.value} for Devanilayam.`),
    ogTitle: title,
    robots: "noindex, follow",
});
</script>
