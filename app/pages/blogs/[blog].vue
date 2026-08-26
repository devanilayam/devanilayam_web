<template>
   <main class="page page-sloka-preview">
      <font-size-controller />

      <ContentRenderer v-if="blog" :value="blog" class="sloka-area" />
   </main>
</template>

<script lang="ts" setup>
import { useBlogs } from "~/composables/useBlogs";

const { t } = useI18n();

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

defineOgImageComponent("Default", {
   eyebrow: t("header.links.blogs"),
   title: title.value,
   description: description.value,
});

useJsonLd(() => ({
   "@type": "BlogPosting",
   headline: title.value,
   description: description.value,
   inLanguage: locale.value,
   author: blog.value?.author ? { "@type": "Person", name: blog.value.author } : undefined,
   keywords: blog.value?.tags,
   datePublished: blog.value?.date,
   // nuxt-og-image renders a per-page card and advertises it via og:image;
   // its URL is content-hashed and not derivable here, so the schema image
   // is the stable site mark rather than a URL that could go stale.
   image: `${SITE_URL}/icons/icon-512.png`,
   isPartOf: { "@id": `${SITE_URL}/#website` },
   publisher: { "@id": `${SITE_URL}/#organization` },
}));
</script>
