<template>
   <main class="page">
      <section class="hero">
         <div class="hero__left">
            <h1 class="hero__title">{{ $t('home.hero.title') }}</h1>
            <p class="hero__subtitle">{{ $t('home.hero.subtitle') }}</p>
            <p class="hero__description">{{ $t('home.hero.description') }}</p>
            <div class="hero__actions">
               <nuxt-link class="my-button" :to="{ path: '/mantras' }">{{ $t('home.cta.exploreMantras') }}</nuxt-link>
               <nuxt-link class="my-button my-button--outlined" :to="WHATSAPP_CHANNEL_LINK" external target="_blank">
                  {{ $t('home.cta.joinWhatsappChannel') }}
               </nuxt-link>
            </div>
         </div>
         <div>
            <img src="~/assets/images/guruji.webp">
         </div>
      </section>

      <HomeSection :title="$t('home.sections.mantras.title')" :subtitle="$t('home.sections.mantras.subtitle')">
         <!-- <HomeCategoryCard id="example-category" title="Example Category" image="/images/sample-category.jpg" /> -->
         <HomeCategoryCard v-for="mantra in HOME_PAGE_MANTRAS" :id="mantra.id" :key="mantra.id" :title="mantra.name"
            :image="mantra.imgPath" />

         <template #footer>
            <nuxt-link class="my-button" to="/mantras">{{ $t('home.sections.mantras.viewAll') }}</nuxt-link>
         </template>
      </HomeSection>

      <HomeSection :title="$t('home.sections.features.title')" :subtitle="$t('home.sections.features.subtitle')"
         content-class="features-grid">
         <HomeFeatureCard v-for="feature in HOME_PAGE_FEATURES" :key="feature.icon" :icon="feature.icon"
            :title="$t(feature.titleKey)" :description="$t(feature.descriptionKey)" />
      </HomeSection>

      <MySocials />
   </main>
</template>

<script lang="ts" setup>
import { HOME_PAGE_FEATURES, HOME_PAGE_MANTRAS, WHATSAPP_CHANNEL_LINK } from "~/configs";

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
