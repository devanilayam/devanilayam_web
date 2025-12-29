import type { Lord } from "~/composables/useSlokas";

export interface LordCardProps {
   lord: Lord;

   /**
    * Indicates if the Lord is for Ashtotara.
    * @default false
    */
   isAshtotara?: boolean;
}

export interface LordListProps {
   /**
    * Indicates if the Lord is for Ashtotara.
    * @default false
    */
   isAshtotara?: boolean;
}
