<!-- eslint-disable vue/no-multiple-template-root -->
<template>
   <speed-insights />
   <MyHeader />
   <SideMenu />
   <NuxtPage />
   <MyFooter />
</template>

<script setup lang="ts">
import { SpeedInsights } from "@vercel/speed-insights/nuxt";
</script>

<style lang="scss">
#__nuxt {
   height: 100%;
   display: flex;
   flex-direction: column;

   main {
      flex: 1;
   }
}
</style>
