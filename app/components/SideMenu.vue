<template>
   <Teleport to="body">
      <Transition name="side-menu">
         <aside v-if="isOpen" class="side-menu" @click.self="close">
            <div class="side-menu__content">
               <button class="side-menu__close" aria-label="Close menu" @click="close">
                  <icon name="x" color="#854D0E" />
               </button>
               <nuxt-link to="/" class="side-menu__link" @click="close">{{ $t('header.links.about') }}</nuxt-link>
               <nuxt-link :to="`/slokas`" class="side-menu__link" @click="close">
                  {{ $t('header.links.slokas') }}
               </nuxt-link>
               <nuxt-link :to="`/ashtotaras`" class="side-menu__link" @click="close">
                  {{ $t('header.links.ashtotaras') }}
               </nuxt-link>
               <nuxt-link :to="`/blogs`" class="side-menu__link" @click="close">
                  {{ $t('header.links.blogs') }}
               </nuxt-link>
            </div>
         </aside>
      </Transition>
   </Teleport>
</template>

<script setup lang="ts">
import { useSideMenu } from "~/composables/useSideMenu";

const { isOpen, close } = useSideMenu();
</script>

<style lang="scss">
.side-menu {
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   z-index: 100;
   background-color: rgba(0, 0, 0, 0.5);
   backdrop-filter: blur(4px);
   display: flex;
   align-items: flex-start;
   justify-content: flex-end;
   padding: 0;

   &__content {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: px-to-rem(320);
      height: 100%;
      background: rgba(250, 248, 243, 0.98);
      backdrop-filter: blur(6px);
      padding: px-to-rem(12);
      box-shadow: -2px 0 px-to-rem(8) rgba(0, 0, 0, 0.1);
      overflow-y: auto;
   }

   &__close {
      align-self: flex-end;
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: px-to-rem(8);
      transition: background-color 0.2s ease;
      font-size: px-to-rem(24);
      margin-bottom: px-to-rem(12);

      &:hover {
         background-color: rgba(235, 115, 12, 0.1);
      }

      .icon {
         font-size: px-to-rem(24);
      }
   }

   &__link {
      font-size: px-to-rem(14);
      font-weight: 600;
      color: #854D0E;
      text-decoration: none;
      width: 100%;
      padding: px-to-rem(12) px-to-rem(16);
      border-radius: px-to-rem(8);
      transition: all 0.2s ease;

      &:hover {
         color: #EB730C;
         background-color: rgba(235, 115, 12, 0.1);
         cursor: pointer;
      }

      &.router-link-active,
      &.router-link-exact-active {
         color: #EB730C;
         background-color: rgba(235, 115, 12, 0.1);
      }
   }
}

// Transition animations
.side-menu-enter-active,
.side-menu-leave-active {
   transition: opacity 0.3s ease;
}

.side-menu-enter-active .side-menu__content,
.side-menu-leave-active .side-menu__content {
   transition: transform 0.3s ease;
}

.side-menu-enter-from,
.side-menu-leave-to {
   opacity: 0;
}

.side-menu-enter-from .side-menu__content,
.side-menu-leave-to .side-menu__content {
   transform: translateX(100%);
}
</style>
