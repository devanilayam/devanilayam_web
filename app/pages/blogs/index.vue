<template>
   <main class="page page-blogs">
      <section>
         <h1 class="blogs-heading">{{ $t('blogs.pageTitle') || 'Blogs' }}</h1>
         <div class="blogs-list">
            <div v-for="blog in listOfBlogs" :key="blog.blog_id" class="blog-card" tabindex="0"
               @click="$router.push(`/blogs/${blog.blog_id}`)">
               <div class="blog-card-header">
                  <h2 class="blog-title">{{ blog.title }}</h2>
                  <p v-if="blog.author" class="blog-author">{{ $t('blogs.by', { author: blog.author }) }}</p>
               </div>
               <p class="blog-description">
                  <span v-if="blog.description">{{ blog.description }}</span>
                  <span v-else>&mdash;</span>
               </p>
               <div v-if="blog.tags && blog.tags.length" class="blog-card-tags">
                  <span v-for="tag in blog.tags" :key="tag" class="blog-tag">{{ tag }}</span>
               </div>
            </div>
         </div>
      </section>
      <my-socials />
   </main>
</template>

<script setup lang="ts">
import { useBlogs } from "~/composables/useBlogs";

const { listOfBlogs, getListOfBlogs } = useBlogs();

onMounted(async () => {

   await getListOfBlogs();

});
</script>

<style lang="scss">
.page-blogs {
   padding-block: px-to-rem(32);

   .blogs-heading {
      font-size: px-to-rem(32);
      font-weight: 700;
      margin-bottom: px-to-rem(32);
      letter-spacing: -0.03em;
      text-align: left;
   }

   .blogs-list {
      display: grid;
      grid-template-columns: 1fr;
      gap: px-to-rem(32);

      @media (min-width: px-to-rem(700)) {
         grid-template-columns: repeat(auto-fill, minmax(px-to-rem(340), 1fr));
      }
   }

   .blog-card {
      background: #faf8f3;
      border-radius: px-to-rem(16);
      box-shadow: 0 px-to-rem(2) px-to-rem(14) rgba(36, 30, 7, 0.05);
      padding: px-to-rem(24) px-to-rem(24) px-to-rem(16);
      border: px-to-rem(1) solid #e7e1d6;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      transition: box-shadow 0.18s, transform 0.16s, border-color 0.18s;

      .blog-card-header {
         margin-bottom: px-to-rem(9.6); // 0.6rem = 9.6px

         .blog-title {
            font-size: px-to-rem(20); // 1.25rem = 20px
            font-weight: 600;
            margin: 0 0 px-to-rem(16) 0;
            letter-spacing: -0.01em;
            color: #e8730c;
            line-height: 1.1;
            transition: color 0.16s;
         }

         .blog-author {
            font-size: px-to-rem(14.72); // 0.92em = 14.72px at 16px root
            color: #866735;
            font-weight: 500;
         }
      }

      .blog-description {
         color: #332613;
         font-size: px-to-rem(16); // 1em = 16px
         margin-bottom: px-to-rem(16);
         min-height: px-to-rem(38.4); // 2.4em = 38.4px
         overflow: hidden;
         text-overflow: ellipsis;
         display: -webkit-box;
         -webkit-line-clamp: 2;
         -webkit-box-orient: vertical;
         line-clamp: 2;
      }

      .blog-card-tags {
         display: flex;
         flex-wrap: wrap;
         gap: px-to-rem(5.6); // 0.35em = 5.6px at 16px root

         .blog-tag {
            font-size: px-to-rem(14.72); // 0.92em = 14.72px at 16px root
            background: #f3e6d2;
            color: #a87627;
            border-radius: px-to-rem(8); // 0.5em = 8px at 16px root
            padding: px-to-rem(2.56) px-to-rem(11.2); // 0.16em 0.7em
            font-weight: 500;
         }
      }

      // Hover effects for desktop only
      @media (hover: hover) and (pointer: fine) {

         &:hover,
         &:focus-visible {
            box-shadow: 0 px-to-rem(6) px-to-rem(26) rgba(232, 115, 12, 0.085),
               0 px-to-rem(2) px-to-rem(12) rgba(36, 30, 7, 0.08);
            border-color: #e8730c;
            transform: translateY(px-to-rem(-4)) scale(1.018);

            .blog-title {
               color: #c26009;
            }
         }
      }
   }
}
</style>
