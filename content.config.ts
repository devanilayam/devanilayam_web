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
   },
});
