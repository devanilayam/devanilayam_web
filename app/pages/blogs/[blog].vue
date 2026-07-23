<template>
   <main class="page">
      <div class="font-size-controls">
         <p class="font-size-display">{{ $t('sloka-page.fontSize') }}</p>
         <button class="font-size-btn" :disabled="fontSize <= minFontSize" aria-label="Decrease font size"
            @click="decreaseFontSize">
            <span class="font-size-icon">−</span>
         </button>
         <button class="font-size-btn" :disabled="fontSize >= maxFontSize" aria-label="Increase font size"
            @click="increaseFontSize">
            <span class="font-size-icon">+</span>
         </button>
      </div>

      <ContentRenderer v-if="blog" :value="blog" class="sloka-area" :style="{ fontSize: `${fontSize}px` }" />
   </main>
</template>

<script lang="ts" setup>
import { useStorage } from "@vueuse/core";
import { useBlogs } from "~/composables/useBlogs";

const { getBlogById } = useBlogs();

const route = useRoute();

const { locale } = useLocale();

const blogId = computed(() => route.params.blog as string);

// Fetch on the server so crawlers receive the fully-rendered blog in the HTML.
const { data: blog } = await useAsyncData(
   () => `blog-${locale.value}-${blogId.value}`,
   () => getBlogById(blogId.value),
   { watch: [locale] }
);

if (!blog.value) {

   throw createError({ statusCode: 404, statusMessage: "Blog not found", fatal: true });

}

// Font size controller with localStorage persistence
const minFontSize = 12;

const maxFontSize = 24;

const defaultFontSize = 16;

const fontSize = useStorage("sloka-font-size", defaultFontSize);

const increaseFontSize = () => {

   if (fontSize.value < maxFontSize) {

      fontSize.value += 2;

   }

};

const decreaseFontSize = () => {

   if (fontSize.value > minFontSize) {

      fontSize.value -= 2;

   }

};

const fallbackDescription = "Read devotional blogs at Devanilayam.";

const title = computed(() => blog.value?.title || "Blog");

const description = computed(() => blog.value?.description || fallbackDescription);

useSeoMeta({
   title,
   description,
   ogTitle: title,
   ogDescription: description,
   ogType: "article",
   articleAuthor: computed(() => (blog.value?.author ? [blog.value.author] : undefined)),
   twitterTitle: title,
   twitterDescription: description,
   twitterCard: "summary_large_image",
});

useJsonLd(() => ({
   "@type": "BlogPosting",
   headline: title.value,
   description: description.value,
   inLanguage: locale.value,
   author: blog.value?.author ? { "@type": "Person", name: blog.value.author } : undefined,
   keywords: blog.value?.tags,
   datePublished: blog.value?.date,
   image: `${SITE_URL}/og-image.png`,
   isPartOf: { "@id": `${SITE_URL}/#website` },
   publisher: { "@id": `${SITE_URL}/#organization` },
}));
</script>

<style lang="scss">
.font-size-display {
   font-size: px-to-rem(20);
   font-weight: 500;
   min-width: px-to-rem(50);
   text-align: center;
   margin-right: auto;
}

.font-size-controls {
   display: flex;
   align-items: center;
   gap: px-to-rem(12);
   justify-content: flex-end;
}

.font-size-btn {
   display: flex;
   align-items: center;
   justify-content: center;
   width: px-to-rem(36);
   height: px-to-rem(36);
   border-radius: px-to-rem(8);
   background: #EB730C;
   color: #FAF8F3;
   cursor: pointer;
   transition: background 0.15s, opacity 0.15s;
   border: none;

   &:hover:not(:disabled) {
      background: #d25f07;
   }

   &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
   }

   .font-size-icon {
      font-size: px-to-rem(20);
      font-weight: 600;
      line-height: 1;
   }
}

.sloka-area {
   background: #FEF3C7;
   border-radius: px-to-rem(12);
   flex: 1;
   padding: px-to-rem(8) px-to-rem(16) px-to-rem(20) px-to-rem(16);
   max-height: fit-content;
   transition: font-size 0.2s ease;

   @include web-screen {
      // margin: px-to-rem(32);
      padding: px-to-rem(32);
   }
}
</style>
