<template>
   <HomeSection :title="$t('home.sections.socials.title')" :subtitle="$t('home.sections.socials.subtitle')">
      <nuxt-link v-for="social in HOME_PAGE_SOCIAL_LINKS" :key="social.icon" class="social-tile" :to="social.link"
         target="_blank" :aria-label="`Follow us on ${social.label}`">
         <icon :name="social.icon" :size="48" />
      </nuxt-link>
   </HomeSection>
</template>

<script setup lang="ts">
import { HOME_PAGE_SOCIAL_LINKS } from "~/configs";

</script>

<style lang="scss">
.social-tile {
   display: flex;
   align-items: center;
   justify-content: center;
   padding: px-to-rem(8);
   border-radius: 50%;
   background: #FFE8CC;

   @include web-screen {
      &:hover {
         transform: scale(1.1);
         transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }
   }
}
</style>
