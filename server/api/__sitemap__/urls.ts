import { queryCollection } from "@nuxt/content/nitro";
import { defineSitemapEventHandler } from "#imports";
import type { SitemapUrlInput } from "#sitemap/types";

/**
 * Enumerates every content-driven page (slokas, per-deity sloka lists,
 * ashtotaras and blogs) across all locales so they are included in the
 * XML sitemap. Without this, only the statically-known routes are listed
 * and the most valuable content stays invisible to crawlers.
 */
export default defineSitemapEventHandler(async (event) => {

   const urls: SitemapUrlInput[] = [];

   const [slokas, ashtotaras, blogs] = await Promise.all([
      queryCollection(event, "slokas").all(),
      queryCollection(event, "ashtotaras").all(),
      queryCollection(event, "blogs").all(),
   ]);

   // Individual slokas + per-deity sloka lists (deduplicated).
   const lordListSeen = new Set<string>();

   for (const s of slokas) {

      urls.push({
         loc: `/${s.lang}/slokas/${s.lord_id}/${s.sloka_id}`,
         lastmod: s.date,
         changefreq: "monthly",
         priority: 0.8,
      });

      const lordKey = `${s.lang}/${s.lord_id}`;

      if (!lordListSeen.has(lordKey)) {

         lordListSeen.add(lordKey);

         urls.push({
            loc: `/${s.lang}/slokas/${s.lord_id}`,
            changefreq: "weekly",
            priority: 0.6,
         });

      }

   }

   for (const a of ashtotaras) {

      urls.push({
         loc: `/${a.lang}/ashtotaras/${a.lord_id}`,
         lastmod: a.date,
         changefreq: "monthly",
         priority: 0.7,
      });

   }

   for (const b of blogs) {

      urls.push({
         loc: `/${b.lang}/blogs/${b.blog_id}`,
         lastmod: b.date,
         changefreq: "monthly",
         priority: 0.7,
      });

   }

   return urls;

});
