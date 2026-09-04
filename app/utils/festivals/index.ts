import { REGION_ORDER, type Festival, type FestivalRegion } from "./dates";

/**
 * Date arithmetic for the festival calendar.
 *
 * Everything here is pure and synchronous so it can be unit-tested without a
 * Nuxt runtime, and so the calendar can be rendered on the server with no
 * async boundary at all — see app/composables/useFestivals.ts.
 *
 * `month` is ALWAYS zero-indexed, matching the Date constructor: 0 is January,
 * 11 is December. Mixing the two conventions is the classic way to lose a
 * month, so nothing here takes a 1-indexed month.
 */

/** One cell of a rendered month grid. */
export interface MonthCell {
   date: Date;
   /** `YYYY-MM-DD`, the key festivals are grouped under. */
   iso: string;
   /** Day of the month, 1–31. */
   day: number;
   /** False for the leading and trailing days borrowed from the neighbouring months. */
   inMonth: boolean;
}

/** A month grid is always six rows of seven days. */
const WEEKS_IN_GRID = 6;

const DAYS_IN_WEEK = 7;

const pad = (value: number): string => String(value).padStart(2, "0");

/**
 * Formats a Date as `YYYY-MM-DD` in the LOCAL timezone.
 *
 * Deliberately not `Date.toISOString().slice(0, 10)`. That converts to UTC
 * first, so for anyone east of Greenwich — India very much included — a date
 * constructed at local midnight comes back as the previous day. It would move
 * every festival back by one for the entire audience this site is built for.
 */
export const toIsoDate = (date: Date): string =>
   `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/**
 * Parses `YYYY-MM-DD` to a Date at LOCAL midnight.
 *
 * `new Date("2026-11-08")` parses the string as UTC midnight — the same
 * off-by-one-day trap as above, in the other direction. Splitting the parts
 * and handing them to the constructor keeps it local.
 */
export const parseIsoDate = (iso: string): Date => {

   const [year, month, day] = iso.split("-").map(Number);

   return new Date(year ?? 0, (month ?? 1) - 1, day ?? 1);

};

/**
 * Orders festivals that land on the same day: nationwide first, then
 * south → north → rest, and alphabetically by id within a region so the order
 * never depends on where a row happens to sit in the dataset.
 */
export const sortByRegion = (festivals: Festival[]): Festival[] =>
   [...festivals].sort((a, b) => {

      const byRegion = REGION_ORDER[a.region] - REGION_ORDER[b.region];

      return byRegion === 0 ? a.id.localeCompare(b.id) : byRegion;

   });

/**
 * Buckets festivals by their date so a grid cell can look up its own day in
 * constant time rather than filtering the whole dataset once per cell.
 */
export const groupFestivalsByDate = (festivals: Festival[]): Map<string, Festival[]> => {

   const grouped = new Map<string, Festival[]>();

   for (const festival of festivals) {

      const existing = grouped.get(festival.date);

      if (existing) {

         existing.push(festival);

      } else {

         grouped.set(festival.date, [festival]);

      }

   }

   for (const [date, entries] of grouped) {

      grouped.set(date, sortByRegion(entries));

   }

   return grouped;

};

/** Every festival in the given month, earliest first, same-day ties by region. */
export const festivalsForMonth = (festivals: Festival[], year: number, month: number): Festival[] => {

   const prefix = `${year}-${pad(month + 1)}-`;

   const inMonth = festivals.filter(festival => festival.date.startsWith(prefix));

   return sortByRegion(inMonth).sort((a, b) => a.date.localeCompare(b.date));

};

/**
 * Builds the six-by-seven grid for a month, weeks starting on Sunday.
 *
 * Always six rows, even when five would fit. A grid that changes height
 * between months makes the whole page jump under the reader every time they
 * press the arrow, which is exactly the kind of thing that makes a calendar
 * hard to use.
 */
export const buildMonthGrid = (year: number, month: number): MonthCell[][] => {

   const firstOfMonth = new Date(year, month, 1);

   // Walk back to the Sunday on or before the 1st.
   const gridStart = new Date(year, month, 1 - firstOfMonth.getDay());

   const weeks: MonthCell[][] = [];

   for (let week = 0; week < WEEKS_IN_GRID; week += 1) {

      const days: MonthCell[] = [];

      for (let day = 0; day < DAYS_IN_WEEK; day += 1) {

         const date = new Date(
            gridStart.getFullYear(),
            gridStart.getMonth(),
            gridStart.getDate() + (week * DAYS_IN_WEEK) + day
         );

         days.push({
            date,
            iso: toIsoDate(date),
            day: date.getDate(),
            inMonth: date.getMonth() === month && date.getFullYear() === year,
         });

      }

      weeks.push(days);

   }

   return weeks;

};

/**
 * Steps a year/month pair by whole months, rolling the year over correctly in
 * both directions.
 */
export const addMonths = (year: number, month: number, delta: number): { year: number, month: number } => {

   const total = (year * 12) + month + delta;

   return {
      year: Math.floor(total / 12),
      month: ((total % 12) + 12) % 12,
   };

};

/** The years the dataset actually covers, ascending. */
export const coveredYears = (festivals: Festival[]): number[] => {

   const years = new Set(festivals.map(festival => Number(festival.date.slice(0, 4))));

   return [...years].sort((a, b) => a - b);

};

/**
 * True when `year`/`month` sits inside the curated range.
 *
 * The month arrows use this to stop at the edges. Paging into 2029 and finding
 * an empty grid reads as a broken calendar rather than as the end of the data.
 */
export const isMonthCovered = (festivals: Festival[], year: number, month: number): boolean => {

   const years = coveredYears(festivals);

   const first = years[0];

   const last = years[years.length - 1];

   if (first === undefined || last === undefined) {

      return false;

   }

   return year >= first && year <= last && month >= 0 && month <= 11;

};

export type { Festival, FestivalRegion };
