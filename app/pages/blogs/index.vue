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
   padding-block: 2rem;

   .blogs-heading {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 2rem;
      letter-spacing: -0.03em;
      text-align: left;
   }

   .blogs-list {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;

      @media (min-width: 700px) {
         grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      }
   }

   .blog-card {
      background: #faf8f3;
      border-radius: 1rem;
      box-shadow: 0 2px 14px rgba(36, 30, 7, 0.05);
      padding: 1.5rem 1.5rem 1rem;
      border: 1px solid #e7e1d6;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      transition: box-shadow 0.18s, transform 0.16s, border-color 0.18s;

      .blog-card-header {
         margin-bottom: 0.6rem;

         .blog-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin: 0 0 px-to-rem(16) 0;
            letter-spacing: -0.01em;
            color: #e8730c;
            line-height: 1.1;
            transition: color 0.16s;
         }

         .blog-author {
            font-size: 0.92em;
            color: #866735;
            font-weight: 500;
         }
      }

      .blog-description {
         color: #332613;
         font-size: 1em;
         margin-bottom: 1rem;
         min-height: 2.4em;
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
         gap: 0.35em;

         .blog-tag {
            font-size: 0.92em;
            background: #f3e6d2;
            color: #a87627;
            border-radius: 0.5em;
            padding: 0.16em 0.7em;
            font-weight: 500;
         }
      }

      // Hover effects for desktop only
      @media (hover: hover) and (pointer: fine) {

         &:hover,
         &:focus-visible {
            box-shadow: 0 6px 26px rgba(232, 115, 12, 0.085),
               0 2px 12px rgba(36, 30, 7, 0.08);
            border-color: #e8730c;
            transform: translateY(-4px) scale(1.018);

            .blog-title {
               color: #c26009;
            }
         }
      }
   }
}
</style>
