import type { MarkdownRoot } from "@nuxt/content";

/**
 * Content access for slokas.
 *
 * KEEP THESE QUERIES OFF THE CLIENT
 * ---------------------------------
 * `queryCollection` auto-imports to @nuxt/content's *client* implementation.
 * On the server it reads the database directly; in the browser it lazily boots
 * a WASM SQLite engine — ~1.1 MB across sqlite3.wasm, a worker and an OPFS
 * proxy — and then downloads the collection's SQL dump on top.
 *
 * It never has to run in the browser here. Every content route is prerendered
 * per locale, so `useAsyncData` is answered from the route's own _payload.json
 * — including after a language switch, which is a navigation to a different
 * prefix (/en/slokas -> /te/slokas) and therefore a different payload.
 *
 * `watch: [locale]` at the call sites is correct and load-bearing: it is what
 * repaints the page in the new language, and the payload is what answers it.
 *
 * What used to break this was useLocale(), not the watchers. It changed the
 * locale ref while the OLD page was still mounted — once by setting the locale
 * before navigating, and again by restoring it from localStorage on every
 * mount. Either one changed every useAsyncData key on a live page, so Nuxt
 * re-ran the handlers in the browser and booted SQLite to recompute data the
 * next navigation was about to deliver for free. Both are fixed in
 * app/composables/useLocale.ts; read the note there before changing it.
 *
 * /search is the one real exception — it is not prerendered and its results
 * change with ?q= at request time, so it queries through
 * server/api/search.get.ts instead of the client database.
 */
export const useSlokas = (): IUseSlokasReturn => {

   const { locale } = useLocale();

   const listOfLords = ref<Lord[]>([]);

   const getListOfLords = async (): Promise<Lord[]> => {

      const lords = await queryCollection("slokas")
         .where("lang", "=", locale.value)
         .all();

      listOfLords.value = toUniqueLords(lords);

      return listOfLords.value;

   };

   const getListOfSlokasByLordId = async (lord_id: string): Promise<Sloka[]> => {

      const slokas = await queryCollection("slokas")
         .where("lang", "=", locale.value)
         .where("lord_id", "=", lord_id)
         .all();

      const output = slokas?.map((s) => ({
         sloka_id: s.sloka_id,
         title: s.title,
         body: s.body,
         excerpt: s.excerpt,
         lord: s.lord,
      }));

      return output;

   };

   const getSloka = async (lord_id: string, sloka_id: string): Promise<any> => {

      const sloka = await queryCollection("slokas")
         .where("lang", "=", locale.value)
         .where("lord_id", "=", lord_id)
         .where("sloka_id", "=", sloka_id)
         .first();

      return sloka;

   };

   return {
      listOfLords,
      getListOfLords,
      getListOfSlokasByLordId,
      getSloka,
   };

};

export interface IUseSlokasReturn {
   listOfLords: Ref<Lord[]>;
   getListOfLords: () => Promise<Lord[]>;
   getListOfSlokasByLordId: (lord_id: string) => Promise<any[]>;
   getSloka: (lord_id: string, sloka_id: string) => Promise<any>;
}

export interface Lord {
   lord_id: string;
   name: string;
   description?: string;
}

export interface Sloka {
   title: string;
   sloka_id: string;
   body: MarkdownRoot;
   lord: string;
   excerpt?: any;
}
