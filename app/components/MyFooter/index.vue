<template>
   <footer class="my-footer">
      <div class="my-footer__top">
         <div class="my-footer__column">
            <logo :height="24" />
            <p>{{ $t('footer.tagline') }}</p>
         </div>

         <!-- About -->
         <div class="my-footer__column">
            <div class="my-footer__heading">{{ $t('footer.sections.about.title') }}</div>
            <div class="my-footer__list">
               <a href="#" class="my-footer__link">{{ $t('footer.sections.about.links.mission') }}</a>
               <a href="#" class="my-footer__link">{{ $t('footer.sections.about.links.team') }}</a>
               <a href="#" class="my-footer__link">{{ $t('footer.sections.about.links.contribute') }}</a>
            </div>
         </div>

         <!-- Legal -->
         <div class="my-footer__column">
            <div class="my-footer__heading">{{ $t('footer.sections.legal.title') }}</div>
            <div class="my-footer__list">
               <a :href="`/${locale}/policies/privacy-policy`" class="my-footer__link">{{
                  $t('footer.sections.legal.links.privacy') }}</a>
               <a :href="`/${locale}/policies/terms-of-service`" class="my-footer__link">{{
                  $t('footer.sections.legal.links.terms') }}</a>
               <a href="#" class="my-footer__link">{{ $t('footer.sections.legal.links.contact') }}</a>
            </div>
         </div>

         <!-- Follow Us -->
         <div class="my-footer__column">
            <div class="my-footer__heading">{{ $t('footer.sections.follow.title') }}</div>
            <div class="my-footer__list">

               <nuxt-link v-for="social in HOME_PAGE_SOCIAL_LINKS.slice(0, 3)" :key="social.icon" :to="social.link"
                  target="_blank">
                  <icon :name="social.icon" :size="12" />
                  {{ social.label }}
               </nuxt-link>

            </div>
         </div>

      </div>
      <div class="my-footer__bottom">
         <p>{{ $t('footer.bottom.copyright', { year: currentYear }) }}</p>
         <p>
            {{ $t('footer.bottom.credits') }}
            <icon name="hearts" />
         </p>
      </div>
   </footer>
</template>

<script setup lang="ts">
import { HOME_PAGE_SOCIAL_LINKS } from "~/configs";

const { locale } = useLocale();

const currentYear = new Date().getFullYear();

</script>

<style lang="scss">
.my-footer {
   display: flex;
   padding: px-to-rem(12) px-to-rem(24) px-to-rem(64) px-to-rem(24);
   flex-direction: column;
   align-items: flex-start;
   flex-shrink: 0;
   align-self: stretch;

   border-top: 1px solid rgba(45, 42, 35, 0.12);
   background: #FAF8F3;

   &__top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      width: 100%;
      gap: px-to-rem(48);
      // flex-wrap: wrap;
   }

   &__column {
      display: flex;
      flex-direction: column;
      gap: px-to-rem(12);
      min-width: px-to-rem(150);
      font-size: px-to-rem(14);
      color: rgba(45, 42, 35, 0.7);
   }

   // Tablet styles
   @media (max-width: 1024px) {
      &__columns {
         gap: px-to-rem(32);
      }

      &__column {
         min-width: px-to-rem(140);
      }
   }

   @include mobile {
      padding: px-to-rem(12);

      &__top {
         gap: px-to-rem(32);
      }

      &__columns {
         gap: px-to-rem(24);
         justify-content: flex-start;
      }

      &__column {
         min-width: px-to-rem(130);
      }
   }

   &__heading {
      font-size: px-to-rem(16);
      font-weight: 600;
      color: #854D0E;
      margin: 0;
      line-height: 1.5;
   }

   &__list {
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: px-to-rem(8);
   }

   &__link {
      font-size: px-to-rem(14);
      color: rgba(45, 42, 35, 0.7);
      text-decoration: none;
      transition: color 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: px-to-rem(8);

      &:hover {
         color: #EB730C;
         cursor: pointer;
      }
   }

   &__icon {
      width: px-to-rem(16);
      height: px-to-rem(16);
      flex-shrink: 0;
   }

   &__bottom {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: px-to-rem(16);

      border-top: 1px solid rgba(45, 42, 35, 0.12);
      padding-top: px-to-rem(16);
      margin-top: px-to-rem(16);

      font-size: px-to-rem(16);

      p:last-child {
         font-size: px-to-rem(14);
         display: flex;
         align-items: center;
      }
   }

   @include mobile {
      padding: px-to-rem(12);

      &__top {
         flex-direction: column;
         gap: px-to-rem(32);
         align-items: flex-start;
      }

      &__columns {
         width: 100%;
         justify-content: flex-start;
         gap: px-to-rem(32);
         flex-direction: column;
      }

      &__column {
         min-width: auto;
         width: 100%;
         gap: px-to-rem(10);
      }

      &__heading {
         font-size: px-to-rem(15);
         margin-bottom: px-to-rem(4);
      }

      &__list {
         gap: px-to-rem(6);
      }

      &__link {
         font-size: px-to-rem(13);
         padding: px-to-rem(2) 0;
      }

      &__icon {
         width: px-to-rem(14);
         height: px-to-rem(14);
      }

      &__bottom {
         padding-top: px-to-rem(20);
         margin-top: px-to-rem(24);
         gap: px-to-rem(12);
         text-align: center;

         p {
            font-size: px-to-rem(13);
            line-height: 1.5;
         }

         p:last-child {
            font-size: px-to-rem(12);
         }
      }
   }
}
</style>
