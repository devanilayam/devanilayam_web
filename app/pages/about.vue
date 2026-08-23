<template>
   <main class="page page-about">
      <section class="about">
         <h1 class="about__heading">{{ $t('about.pageTitle') }}</h1>
         <p class="about__lede">{{ $t('about.description') }}</p>

         <section class="about__section">
            <h2>{{ $t('about.mission.title') }}</h2>
            <p>{{ $t('about.mission.body') }}</p>
         </section>

         <section class="about__section">
            <h2>{{ $t('about.whatsHere.title') }}</h2>
            <ul class="about__list">
               <li>
                  <nuxt-link :to="localePath('/slokas')">{{ $t('header.links.slokas') }}</nuxt-link>
                  — {{ $t('about.whatsHere.slokas') }}
               </li>
               <li>
                  <nuxt-link :to="localePath('/ashtotaras')">{{ $t('header.links.ashtotaras') }}</nuxt-link>
                  — {{ $t('about.whatsHere.ashtotaras') }}
               </li>
               <li>
                  <nuxt-link :to="localePath('/blogs')">{{ $t('header.links.blogs') }}</nuxt-link>
                  — {{ $t('about.whatsHere.blogs') }}
               </li>
            </ul>
         </section>

         <section class="about__section">
            <h2>{{ $t('about.languages.title') }}</h2>
            <p>{{ $t('about.languages.body') }}</p>
         </section>

         <section class="about__section">
            <h2>{{ $t('about.free.title') }}</h2>
            <p>{{ $t('about.free.body') }}</p>
         </section>

         <section id="contribute" class="about__section">
            <h2>{{ $t('about.contribute.title') }}</h2>
            <p>{{ $t('about.contribute.body') }}</p>
            <a class="about__cta" :href="REPOSITORY_URL" target="_blank" rel="noopener noreferrer">
               {{ $t('about.contribute.cta') }}
            </a>
         </section>

         <section id="contact" class="about__section">
            <h2>{{ $t('about.contact.title') }}</h2>
            <p>{{ $t('about.contact.body') }}</p>
            <a class="about__cta" :href="`${REPOSITORY_URL}/issues/new/choose`" target="_blank" rel="noopener noreferrer">
               {{ $t('about.contact.cta') }}
            </a>
         </section>

         <section class="about__section">
            <h2>{{ $t('about.maintainers.title') }}</h2>
            <p>{{ $t('about.maintainers.body') }}</p>
         </section>
      </section>
   </main>
</template>

<script setup lang="ts">
const { t } = useI18n();

const localePath = useLocalePath();

useSeoMeta({
   title: () => t("about.pageTitle"),
   description: () => t("about.description"),
   ogTitle: () => t("about.pageTitle"),
   ogDescription: () => t("about.description"),
   ogType: "website",
});

defineOgImageComponent("Default", {
   eyebrow: t("header.links.about"),
   title: t("about.pageTitle"),
   description: t("about.description"),
});

// AboutPage tells search engines and assistants which page carries the
// publisher's identity — one of the signals behind an entity panel.
useJsonLd(() => ({
   "@type": "AboutPage",
   name: t("about.pageTitle"),
   description: t("about.description"),
   about: { "@id": `${SITE_URL}/#organization` },
}));
</script>

<style lang="scss">
.page-about {
   padding-block: px-to-rem(32);
}

.about {
   max-width: px-to-rem(760);

   &__heading {
      color: #EB730C;
      font-family: Merriweather, "Noto Sans Telugu", "Noto Sans Devanagari", serif;
      font-size: px-to-rem(36);
      line-height: 1.15;
      margin-bottom: px-to-rem(16);
   }

   &__lede {
      font-size: px-to-rem(20);
      color: #6B6760;
      margin-bottom: px-to-rem(32);
   }

   &__section {
      margin-bottom: px-to-rem(32);

      h2 {
         font-family: Merriweather, "Noto Sans Telugu", "Noto Sans Devanagari", serif;
         font-size: px-to-rem(24);
         margin-bottom: px-to-rem(8);
      }

      p {
         line-height: 1.6;
      }
   }

   &__list {
      display: flex;
      flex-direction: column;
      gap: px-to-rem(8);
      padding-left: px-to-rem(20);
      line-height: 1.6;

      a {
         color: #EB730C;
      }
   }

   &__cta {
      display: inline-block;
      margin-top: px-to-rem(12);
      padding: px-to-rem(10) px-to-rem(16);
      border-radius: px-to-rem(10);
      background: #EB730C;
      color: #FAF8F3;
      text-decoration: none;
      font-weight: 600;
   }
}
</style>
