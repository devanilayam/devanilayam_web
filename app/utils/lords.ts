import type { Lord } from "~/composables/useSlokas";

/** The shape every deity-bearing content document shares. */
interface LordBearingDocument {
   lord_id: string;
   lord: string;
}

/**
 * Collapses content documents down to one entry per deity.
 *
 * The slokas and ashtotaras collections store one document per verse, so a
 * deity with eight slokas comes back from `queryCollection` eight times. The
 * deity grids render — and key — on `lord_id`, so handing them the raw rows
 * paints one card per verse and hands Vue duplicate keys. That stayed
 * invisible while every deity had exactly one document, and surfaced the day
 * Ganesh got a second.
 *
 * First occurrence wins, so the collection's own ordering is preserved.
 */
export const toUniqueLords = (documents: LordBearingDocument[] | undefined | null): Lord[] => {

   const seen = new Set<string>();

   return (documents ?? []).reduce<Lord[]>((lords, document) => {

      if (!seen.has(document.lord_id)) {

         seen.add(document.lord_id);
         lords.push({ lord_id: document.lord_id, name: document.lord });

      }

      return lords;

   }, []);

};
