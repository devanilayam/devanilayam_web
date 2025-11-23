<!-- eslint-disable vue/no-multiple-template-root -->
<template>
   <MyHeader />
   <SideMenu />
   <NuxtPage />
   <MyFooter />
</template>

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
