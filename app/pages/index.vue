<template>
   <main class="page">
      <section class="hero">
         <div class="hero__left">
            <h1 class="hero__title">{{ $t('home.hero.title') }}</h1>
            <p class="hero__subtitle">{{ $t('home.hero.subtitle') }}</p>
            <p class="hero__description">{{ $t('home.hero.description') }}</p>
            <div class="hero__actions">
               <nuxt-link class="my-button" :to="{ path: `/lords` }">
                  {{ $t('home.cta.exploreSlokas') }}
               </nuxt-link>
               <nuxt-link class="my-button my-button--outlined" :to="WHATSAPP_CHANNEL_LINK" external target="_blank">
                  {{ $t('home.cta.joinWhatsappChannel') }}
               </nuxt-link>
            </div>
         </div>
         <div>
            <LocalImage file="guruji.webp" alt="Guruji Illustration in Devanilayam website" width="400px"
               height="400px" />
         </div>
      </section>

      <ListOfLords />

      <HomeSection :title="$t('home.sections.features.title')" :subtitle="$t('home.sections.features.subtitle')"
         content-class="features-grid">
         <HomeFeatureCard v-for="feature in HOME_PAGE_FEATURES" :key="feature.icon" :icon="feature.icon"
            :title="$t(feature.titleKey)" :description="$t(feature.descriptionKey)" />
      </HomeSection>

      <MySocials />
   </main>
</template>

<script lang="ts" setup>
import { HOME_PAGE_FEATURES, WHATSAPP_CHANNEL_LINK } from "~/configs";

</script>

<style lang="scss">
.hero {
   margin-top: px-to-rem(36);
   padding: px-to-rem(12) px-to-rem(24);
   display: flex;
   align-items: center;
   gap: px-to-rem(24);
   color: #6B6760;
   font-family: "Noto Sans";

   &__left {
      display: flex;
      flex-direction: column;
      gap: px-to-rem(16);
      min-width: 60%;
   }

   &__title {
      color: #EB730C;
      font-family: Merriweather;
      font-size: px-to-rem(48);
      line-height: px-to-rem(48);
   }

   &__subtitle {
      font-size: px-to-rem(20);
      line-height: px-to-rem(28);
   }

   &__description {
      font-size: px-to-rem(16);
      line-height: px-to-rem(26);
   }

   &__actions {
      display: flex;
      gap: px-to-rem(16);
   }

   @include mobile {
      flex-direction: column-reverse;
      margin-top: px-to-rem(4);

      &__left {
         justify-content: center;
         align-items: center;
      }

      &__title {
         font-size: px-to-rem(28);
         line-height: px-to-rem(32);
      }

      &__subtitle {
         font-size: px-to-rem(15);
         line-height: px-to-rem(20);
      }

      &__description {
         font-size: px-to-rem(13);
         line-height: px-to-rem(18);
      }

      &__actions {
         flex-direction: column;
      }
   }
}
</style>
