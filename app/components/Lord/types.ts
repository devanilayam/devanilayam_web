import type { Lord } from "~/composables/useSlokas";

export interface LordCardCommonProps {
   /**
    * Indicates if the Lord is for Ashtotara.
    * @default false
    */
   isAshtotara?: boolean;
}

export interface LordCardProps extends LordCardCommonProps {
   lord: Lord;
}

export interface LordListProps extends LordCardCommonProps { }
