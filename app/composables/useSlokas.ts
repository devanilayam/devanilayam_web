import type { MarkdownRoot } from "@nuxt/content";

export const useSlokas = (): IUseSlokasReturn => {

   const { locale } = useLocale();

   const listOfLords = ref<Lord[]>([]);

   const getListOfLords = async (): Promise<Lord[]> => {

      const lords = await queryCollection("slokas")
         .where("lang", "=", locale.value)
         .all();

      listOfLords.value = lords?.map((l) => ({
         lord_id: l.lord_id,
         name: l.lord,
      }));

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
