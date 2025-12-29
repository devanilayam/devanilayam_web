<template>
   <main class="page page-sloka-preview">
      <font-size-controller />
      <ContentRenderer v-if="sloka" :value="sloka" class="sloka-area" />
   </main>
</template>

<script lang="ts" setup>

const { getSloka } = useSlokas();

const route = useRoute();

const sloka = ref();

useSeoMeta({
   title: computed(() => (sloka.value?.title || "Sloka") + " | Devanilayam"),
   description: computed(() => sloka.value?.excerpt || "Discover devotional slokas and their meanings at Devanilayam."),
   ogTitle: computed(() => sloka.value?.title || "Sloka | Devanilayam"),
   ogDescription: computed(() => sloka.value?.excerpt || "Discover devotional slokas and their meanings at Devanilayam."),
   twitterTitle: computed(() => sloka.value?.title || "Sloka | Devanilayam"),
   twitterDescription: computed(() => sloka.value?.excerpt || "Discover devotional slokas and their meanings at Devanilayam."),
   twitterCard: computed(() => sloka.value?.excerpt || "Discover devotional slokas and their meanings at Devanilayam."),
   twitterSite: computed(() => "@devanilayam"),
   twitterCreator: computed(() => "@devanilayam"),

});

onMounted(async () => {

   const lordId = route.params.lord as string;

   const slokaId = route.params.id as string;

   sloka.value = await getSloka(lordId, slokaId);

});
</script>
