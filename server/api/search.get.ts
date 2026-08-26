import { queryCollection } from "@nuxt/content/nitro";

/**
 * Site search over the devotional corpus.
 *
 * This runs on the server — deliberately, and not just for SSR. /search is the
 * only route that is not prerendered (its results depend on ?q= at request
 * time), so it is also the only place that would otherwise call @nuxt/content's
 * *client* `queryCollection`. That implementation lazily boots a WASM SQLite
 * engine in the browser: ~1.3 MB across sqlite3.wasm, the worker and the OPFS
 * proxy, downloaded the first time a visitor searches. Querying through this
 * endpoint keeps the database on the server, where the data already lives.
 *
 * The corpus is small enough that a scored substring match over titles,
 * descriptions and tags beats shipping an index: nothing to build, nothing to
 * keep in sync.
 */

export interface SearchResult {
   path: string;
   title: string;
   description?: string;
   /**
    * i18n key for the section this result came from. The label is translated
    * on the client — the server has no access to the active i18n messages.
    */
   kindKey: string;
}

const MAX_RESULTS = 40;

/**
 * Ranks a candidate against the query. Higher is better; 0 means no match.
 *
 * A title hit outranks a description hit, and an exact prefix outranks a hit
 * in the middle of the field, so "hanuman" surfaces the Hanuman Chalisa before
 * a blog that merely mentions it.
 */
const score = (needle: string, title: string, description: string, tags: string[]): number => {

   const haystackTitle = title.toLowerCase();

   const haystackDescription = description.toLowerCase();

   if (haystackTitle === needle) {

      return 100;

   }

   if (haystackTitle.startsWith(needle)) {

      return 80;

   }

   if (haystackTitle.includes(needle)) {

      return 60;

   }

   if (tags.some(tag => tag.toLowerCase().includes(needle))) {

      return 40;

   }

   if (haystackDescription.includes(needle)) {

      return 20;

   }

   return 0;

};

export default defineEventHandler(async (event): Promise<SearchResult[]> => {

   const { q, locale } = getQuery(event);

   const needle = String(q ?? "").trim().toLowerCase();

   // Results never cross languages.
   const lang = String(locale ?? "en");

   if (!needle) {

      return [];

   }

   const [slokas, ashtotaras, blogs] = await Promise.all([
      queryCollection(event, "slokas").where("lang", "=", lang).all(),
      queryCollection(event, "ashtotaras").where("lang", "=", lang).all(),
      queryCollection(event, "blogs").where("lang", "=", lang).all(),
   ]);

   const scored: Array<{ result: SearchResult, rank: number }> = [];

   const add = (rank: number, result: SearchResult): void => {

      if (rank > 0) {

         scored.push({ rank, result });

      }

   };

   for (const sloka of slokas) {

      add(
         score(needle, sloka.title ?? "", sloka.description ?? "", sloka.tags ?? []),
         {
            path: `/${lang}/slokas/${sloka.lord_id}/${sloka.sloka_id}`,
            title: sloka.title ?? sloka.sloka_id,
            description: sloka.description,
            kindKey: "header.links.slokas",
         },
      );

   }

   // Ashtotaras are one page per deity, so the deity name is the title.
   for (const ashtotara of ashtotaras) {

      add(
         score(needle, ashtotara.title ?? ashtotara.lord ?? "", ashtotara.description ?? "", ashtotara.tags ?? []),
         {
            path: `/${lang}/ashtotaras/${ashtotara.lord_id}`,
            title: ashtotara.title ?? ashtotara.lord ?? ashtotara.lord_id,
            description: ashtotara.description,
            kindKey: "header.links.ashtotaras",
         },
      );

   }

   for (const blog of blogs) {

      add(
         score(needle, blog.title ?? "", blog.description ?? "", blog.tags ?? []),
         {
            path: `/${lang}/blogs/${blog.blog_id}`,
            title: blog.title ?? blog.blog_id,
            description: blog.description,
            kindKey: "header.links.blogs",
         },
      );

   }

   return scored
      .sort((a, b) => b.rank - a.rank || a.result.title.localeCompare(b.result.title))
      .slice(0, MAX_RESULTS)
      .map(entry => entry.result);

});
