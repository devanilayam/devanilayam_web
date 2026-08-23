/**
 * Site search over the devotional corpus.
 *
 * Runs on the server during SSR so results are present in the HTML. The corpus
 * is small enough that a scored substring match over titles, descriptions and
 * tags beats shipping an index: nothing to build, nothing to keep in sync, and
 * no client-side bundle.
 */

export interface SearchResult {
   path: string;
   title: string;
   description?: string;
   /** Localised label for the section this result came from. */
   kind: string;
}

type Translate = (key: string) => string;

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

/**
 * @param query  Raw user input.
 * @param locale Active locale code — results never cross languages.
 * @param t      Translator, used for the section labels.
 */
export const searchContent = async (
   query: string,
   locale: string,
   t: Translate,
): Promise<SearchResult[]> => {

   const needle = query.trim().toLowerCase();

   if (!needle) {

      return [];

   }

   const [slokas, ashtotaras, blogs] = await Promise.all([
      queryCollection("slokas").where("lang", "=", locale).all(),
      queryCollection("ashtotaras").where("lang", "=", locale).all(),
      queryCollection("blogs").where("lang", "=", locale).all(),
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
            path: `/${locale}/slokas/${sloka.lord_id}/${sloka.sloka_id}`,
            title: sloka.title ?? sloka.sloka_id,
            description: sloka.description,
            kind: t("header.links.slokas"),
         },
      );

   }

   // Ashtotaras are one page per deity, so the deity name is the title.
   for (const ashtotara of ashtotaras) {

      add(
         score(needle, ashtotara.title ?? ashtotara.lord ?? "", ashtotara.description ?? "", ashtotara.tags ?? []),
         {
            path: `/${locale}/ashtotaras/${ashtotara.lord_id}`,
            title: ashtotara.title ?? ashtotara.lord ?? ashtotara.lord_id,
            description: ashtotara.description,
            kind: t("header.links.ashtotaras"),
         },
      );

   }

   for (const blog of blogs) {

      add(
         score(needle, blog.title ?? "", blog.description ?? "", blog.tags ?? []),
         {
            path: `/${locale}/blogs/${blog.blog_id}`,
            title: blog.title ?? blog.blog_id,
            description: blog.description,
            kind: t("header.links.blogs"),
         },
      );

   }

   return scored
      .sort((a, b) => b.rank - a.rank || a.result.title.localeCompare(b.result.title))
      .slice(0, MAX_RESULTS)
      .map(entry => entry.result);

};
