<template>
   <main class="page">
      <ContentRenderer v-if="sloka" :value="sloka" class="sloka-area" />
   </main>
</template>

<script lang="ts" setup>
const { getSloka } = useSlokas();

const route = useRoute();

const sloka = ref();

onMounted(async () => {

   const lordId = route.params.lord as string;

   const slokaId = route.params.id as string;

   sloka.value = await getSloka(lordId, slokaId);

});
</script>

<style lang="scss">
.sloka-area {
   background: #FEF3C7;
   border-radius: px-to-rem(12);
   flex: 1;
   padding: px-to-rem(8) px-to-rem(16);
   max-height: fit-content;

   @include web-screen {
      margin: px-to-rem(32);
      padding: px-to-rem(32);
   }
}
</style>
