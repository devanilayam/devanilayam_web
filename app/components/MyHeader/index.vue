<template>
   <header class="my-header">
      <logo />

      <div class="nav-links">
         <nuxt-link to="/">{{ $t('header.links.about') }}</nuxt-link>
         <nuxt-link to="/mantras">{{ $t('header.links.mantras') }}</nuxt-link>
         <my-dropdown ref="languageDropdownRef" placement="bottom-end">
            <template #trigger>
               <p>
                  <icon name="globe-01" color="#854D0E" />
                  {{ locale }}
               </p>
            </template>
            <template #content>
               <div class="my-header__language-options">
                  <button v-for="localeItem in Locale.ALL" :key="localeItem.code" :class="['my-header__language-option', {
                     'is-active': localeItem.code === locale
                  }]" @click="selectLanguage(localeItem.code)">
                     {{ localeItem.nameInLocale }}
                  </button>
               </div>
            </template>
         </my-dropdown>
      </div>

      <div class="nav-links--mobile">
         <my-dropdown ref="mobileLanguageDropdownRef" placement="bottom-end">
            <template #trigger>
               <p class="my-header__language-trigger">
                  <icon name="globe-01" color="#854D0E" />
                  {{ locale }}
               </p>
            </template>
            <template #content>
               <div class="my-header__language-options">
                  <button v-for="localeItem in Locale.ALL" :key="localeItem.code" :class="['my-header__language-option', {
                     'is-active': localeItem.code === locale
                  }]" @click="selectLanguage(localeItem.code)">
                     {{ localeItem.nameInLocale }}
                  </button>
               </div>
            </template>
         </my-dropdown>
         <icon name="menu-04" class="nav-links--mobile__menu-icon" color="#854D0E" @click="toggleMenu" />
      </div>

   </header>
</template>

<script setup lang="ts">
import { useSideMenu } from "~/composables/useSideMenu";
import { Locale } from "~/types/locale";

const { toggle } = useSideMenu();

const { locale, setLocale } = useLocale();

const languageDropdownRef = ref<{ close: () => void } | null>(null);

const mobileLanguageDropdownRef = ref<{ close: () => void } | null>(null);

const toggleMenu = (): void => {

   toggle();

};

const selectLanguage = (lang: string): void => {

   setLocale(lang as "en" | "te");

   languageDropdownRef.value?.close();

   mobileLanguageDropdownRef.value?.close();

};

</script>

<style lang="scss">
.my-header {
   display: flex;
   align-items: center;
   gap: px-to-rem(12);

   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   margin: auto;
   z-index: 50;
   width: 100%;

   backdrop-filter: blur(6px);
   padding: px-to-rem(12) px-to-rem(24) px-to-rem(12) px-to-rem(24);

   border-bottom: 1px solid rgba(45, 42, 35, 0.09);
   background: rgba(250, 248, 243, 0.80);

   .logo {
      margin-right: auto;
   }

   .nav-links {
      font-size: px-to-rem(14);

      display: flex;
      align-items: center;
      gap: px-to-rem(24);
      font-weight: 600;
      color: #854D0E;

      p {
         display: flex;
         align-items: center;
         gap: px-to-rem(4);

         .icon {
            font-size: px-to-rem(20);
         }
      }

      p:hover,
      p:hover .icon,
      a:hover {
         cursor: pointer;
         color: #EB730C;
         transition: color 0.2s ease;
      }

      .my-dropdown {
         p {
            display: flex;
            align-items: center;
            gap: px-to-rem(4);

            .icon {
               font-size: px-to-rem(20);
            }
         }

         p:hover,
         p:hover .icon {
            cursor: pointer;
            color: #EB730C;
            transition: color 0.2s ease;
         }
      }

      &--mobile {
         display: none;

         &__menu-icon {
            cursor: pointer;
            transition: color 0.2s ease;

            &:hover {
               color: #EB730C;
            }
         }

         .my-dropdown {
            .my-header__language-trigger {
               display: flex;
               flex-direction: row;
               align-items: center;
               gap: px-to-rem(4);
               cursor: pointer;
               transition: color 0.2s ease;

               &,
               .icon {
                  color: #854D0E;
               }

               .icon {
                  font-size: px-to-rem(20);
               }

               &:hover,
               &:hover .icon {
                  color: #EB730C;
               }
            }
         }
      }
   }

   &__language-options {
      display: flex;
      flex-direction: column;
      gap: px-to-rem(4);
   }

   &__language-option {
      display: flex;
      align-items: center;
      gap: px-to-rem(8);
      padding: px-to-rem(8) px-to-rem(12);
      background: transparent;
      border: none;
      font-size: px-to-rem(14);
      font-weight: 600;
      color: #854D0E;
      cursor: pointer;
      border-radius: px-to-rem(6);
      transition: background 0.2s ease, color 0.2s ease;

      .icon {
         font-size: px-to-rem(16);
      }

      &:hover,
      &.is-active {
         background: rgba(235, 115, 12, 0.1);
         color: #EB730C;

         .icon {
            color: #EB730C;
         }
      }
   }

   @include mobile {
      padding: px-to-rem(12);

      .logo svg {
         height: px-to-rem(24);
      }

      .nav-links {
         display: none;

         &--mobile {
            display: flex;
            align-items: center;
            gap: px-to-rem(8);
         }
      }

      .icon {
         display: block;
      }
   }
}
</style>
