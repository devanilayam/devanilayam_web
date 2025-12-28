<template>
   <main class="page">

      <h1>{{ listOfSlokas[0]?.lord }} {{ $t('slokas') }}</h1>

      <nuxt-link v-for="sloka in listOfSlokas" :key="sloka.sloka_id"
         :to="`/slokas/${$route.params.lord as string}/${sloka.sloka_id}`">
         <ContentRenderer v-if="sloka" class="sloka-preview" :value="sloka" :excerpt="true" />
      </nuxt-link>

      <ListOfLords />
   </main>
</template>

<script lang="ts" setup>
import type { Sloka } from "~/composables/useSlokas";

const { getListOfSlokasByLordId } = useSlokas();

const route = useRoute();

const listOfSlokas = ref<Sloka[]>([]);

onMounted(async () => {

   const lord_id = route.params.lord as string;

   listOfSlokas.value = await getListOfSlokasByLordId(lord_id);

});

</script>

<style lang="scss">
.sloka-preview {
   background-color: #FEF3C7;
   border-radius: px-to-rem(8);
   padding: px-to-rem(12) px-to-rem(16);
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);

   h1 {
      font-size: px-to-rem(24);
   }

   @include web-screen {
      h1 {
         font-size: px-to-rem(20);
      }

      &:hover {
         transform: scale(1.01);
         transition: transform 0.2s ease;
         box-shadow: 0 2px 8px rgba(0, 0, 0, 0.16);
      }
   }
}
</style>
