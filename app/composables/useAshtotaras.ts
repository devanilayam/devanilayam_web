import type { MarkdownRoot } from "@nuxt/content";
import type { Lord } from "./useSlokas";

export const useAshtotaras = (): IUseAshtotarasReturn => {

   const { locale } = useLocale();

   const listOfLords = ref<Lord[]>([]);

   const getListOfLords = async (): Promise<Lord[]> => {

      const lords = await queryCollection("ashtotaras")
         .where("lang", "=", locale.value)
         .all();

      console.log("lords", lords);
      listOfLords.value = lords?.map((l) => ({
         lord_id: l.lord_id,
         name: l.lord,
         image: l.image,
      }));

      return listOfLords.value;

   };

   const getListOfAshtotarasByLordId = async (lord_id: string): Promise<Ashtotara[]> => {

      const ashtotaras = await queryCollection("ashtotaras")
         .where("lang", "=", locale.value)
         .where("lord_id", "=", lord_id)
         .all();

      const output = ashtotaras?.map((a) => ({
         title: a.title,
         body: a.body,
         lord: a.lord,
      }));

      return output;

   };

   const getAshtotara = async (lord_id: string): Promise<any> => {

      const ashtotara = await queryCollection("ashtotaras")
         .where("lang", "=", locale.value)
         .where("lord_id", "=", lord_id)
         .first();

      return ashtotara;

   };

   return {
      listOfLords,
      getListOfLords,
      getListOfAshtotarasByLordId,
      getAshtotara,
   };

};

export interface IUseAshtotarasReturn {
   listOfLords: Ref<Lord[]>;
   getListOfLords: () => Promise<Lord[]>;
   getListOfAshtotarasByLordId: (lord_id: string) => Promise<any[]>;
   getAshtotara: (lord_id: string) => Promise<any>;
}

export interface Ashtotara {
   title: string;
   body: MarkdownRoot;
   lord: string;
   excerpt?: any;
}
