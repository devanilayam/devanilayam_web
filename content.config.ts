import { defineCollection, defineContentConfig } from "@nuxt/content";
import { z } from "zod";

export default defineContentConfig({
   collections: {
      slokas: defineCollection({
         type: "page",
         source: "slokas/**/*.md",
         schema: z.object({
            lord_id: z.string(),
            sloka_id: z.string(),
            image: z.string(),
            name: z.string(),
            lord: z.string(),
            lang: z.string(),
            tags: z.array(z.string()),
            date: z.string(),
            excerpt: z.object().optional(),
         }),
      }),
      policies: defineCollection({
         type: "page",
         source: "policies/**/*.md",
         schema: z.object({
            title: z.string(),
            date: z.string(),
            lang: z.string(),
         }),
      }),
      ashtotaras: defineCollection({
         type: "page",
         source: "ashtotaras/**/*.md",
         schema: z.object({
            lord_id: z.string(),
            ashtotara_id: z.string(),
            image: z.string(),
            name: z.string(),
            lord: z.string(),
            lang: z.string(),
            tags: z.array(z.string()),
            date: z.string(),
         }),
      }),
      blogs: defineCollection({
         type: "page",
         source: "blogs/**/*.md",
         schema: z.object({
            blog_id: z.string(),
            title: z.string(),
            lang: z.string(),
            author: z.string().optional(),
            tags: z.array(z.string()).optional(),
            excerpt: z.object().optional(),
            date: z.string(),
         }),
      }),

   },
});
