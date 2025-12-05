<template>
    <main class="page">
        <ContentRenderer v-if="policy" :value="policy" />
    </main>
</template>

<script lang="ts" setup>
const route = useRoute();

const policy = ref();

const { locale } = useLocale();

onMounted(async () => {

    const id = route.params.id as string;

    policy.value = await queryCollection("policies")
        .where("id", "=", `policies/policies/${locale.value}/${id}.md`)
        .first();

});
</script>
