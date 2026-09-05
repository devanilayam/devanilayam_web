import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { FESTIVALS } from "../../app/utils/festivals/dates";
import {
   addMonths,
   buildMonthGrid,
   coveredYears,
   festivalsForMonth,
   groupFestivalsByDate,
   isMonthCovered,
   parseIsoDate,
   sortByRegion,
   toIsoDate,
} from "../../app/utils/festivals";

describe("toIsoDate", () => {

   it("formats a date in the local timezone, not UTC", () => {

      // Local midnight on 8 November. toISOString() would return the 7th for
      // any timezone east of Greenwich, which is the whole target audience.
      expect(toIsoDate(new Date(2026, 10, 8))).toBe("2026-11-08");

   });

   it("zero-pads single-digit months and days", () => {

      expect(toIsoDate(new Date(2026, 0, 4))).toBe("2026-01-04");

   });

});

describe("parseIsoDate", () => {

   it("parses to local midnight, so the day never shifts", () => {

      const date = parseIsoDate("2026-11-08");

      expect(date.getFullYear()).toBe(2026);
      expect(date.getMonth()).toBe(10);
      expect(date.getDate()).toBe(8);
      expect(date.getHours()).toBe(0);

   });

   it("round-trips with toIsoDate", () => {

      for (const festival of FESTIVALS) {

         expect(toIsoDate(parseIsoDate(festival.date))).toBe(festival.date);

      }

   });

});

describe("buildMonthGrid", () => {

   it("always returns six weeks of seven days", () => {

      for (let month = 0; month < 12; month += 1) {

         const grid = buildMonthGrid(2026, month);

         expect(grid).toHaveLength(6);
         expect(grid.every(week => week.length === 7)).toBe(true);

      }

   });

   it("starts every week on a Sunday", () => {

      const grid = buildMonthGrid(2026, 10);

      expect(grid.every(week => week[0]?.date.getDay() === 0)).toBe(true);

   });

   it("marks the leading and trailing days as outside the month", () => {

      // 1 November 2026 is a Sunday, so the grid opens exactly on the 1st and
      // the padding is all at the end.
      const grid = buildMonthGrid(2026, 10);

      expect(grid[0]?.[0]).toMatchObject({ iso: "2026-11-01", inMonth: true });
      expect(grid[5]?.[6]).toMatchObject({ inMonth: false });

   });

   it("covers every day of the month exactly once", () => {

      const days = buildMonthGrid(2026, 1)
         .flat()
         .filter(cell => cell.inMonth)
         .map(cell => cell.day);

      // February 2026 is not a leap February.
      expect(days).toEqual(Array.from({ length: 28 }, (_, index) => index + 1));

   });

   it("handles a leap February", () => {

      const days = buildMonthGrid(2028, 1).flat().filter(cell => cell.inMonth);

      expect(days).toHaveLength(29);

   });

});

describe("addMonths", () => {

   it("rolls forward over a year boundary", () => {

      expect(addMonths(2026, 11, 1)).toEqual({ year: 2027, month: 0 });

   });

   it("rolls backward over a year boundary", () => {

      expect(addMonths(2027, 0, -1)).toEqual({ year: 2026, month: 11 });

   });

   it("steps by more than a year", () => {

      expect(addMonths(2026, 5, 14)).toEqual({ year: 2027, month: 7 });

   });

});

describe("sortByRegion", () => {

   it("puts nationwide festivals ahead of regional ones", () => {

      const sorted = sortByRegion([
         { id: "gudi-padwa", date: "2026-03-19", region: "rest" },
         { id: "lohri", date: "2026-03-19", region: "north" },
         { id: "holi", date: "2026-03-19", region: "pan" },
         { id: "ugadi", date: "2026-03-19", region: "south" },
      ]);

      expect(sorted.map(festival => festival.id)).toEqual([
         "holi",
         "ugadi",
         "lohri",
         "gudi-padwa",
      ]);

   });

   it("breaks ties inside a region alphabetically, not by dataset order", () => {

      const sorted = sortByRegion([
         { id: "vishu", date: "2026-04-15", region: "south" },
         { id: "bhogi", date: "2026-04-15", region: "south" },
      ]);

      expect(sorted.map(festival => festival.id)).toEqual(["bhogi", "vishu"]);

   });

   it("does not mutate its input", () => {

      const input = [
         { id: "b", date: "2026-01-01", region: "rest" as const },
         { id: "a", date: "2026-01-01", region: "pan" as const },
      ];

      sortByRegion(input);

      expect(input[0]?.id).toBe("b");

   });

});

describe("groupFestivalsByDate", () => {

   it("buckets festivals under their date", () => {

      const grouped = groupFestivalsByDate(FESTIVALS);

      expect(grouped.get("2026-11-08")?.map(festival => festival.id)).toEqual(["deepavali"]);

   });

   it("sorts the festivals inside each bucket by region", () => {

      const grouped = groupFestivalsByDate(FESTIVALS);

      // Ugadi and Gudi Padwa are the same lunar day; Chaitra Navratri opens on it too.
      expect(grouped.get("2026-03-19")?.map(festival => festival.id)).toEqual([
         "ugadi",
         "chaitra-navratri",
         "gudi-padwa",
      ]);

   });

});

describe("festivalsForMonth", () => {

   it("returns only that month, in date order", () => {

      const november = festivalsForMonth(FESTIVALS, 2026, 10);

      expect(november.every(festival => festival.date.startsWith("2026-11-"))).toBe(true);

      const dates = november.map(festival => festival.date);

      expect([...dates].sort()).toEqual(dates);

   });

   it("does not leak the same month from the other year", () => {

      const dates = festivalsForMonth(FESTIVALS, 2027, 10).map(festival => festival.date);

      expect(dates.some(date => date.startsWith("2026"))).toBe(false);

   });

});

describe("coveredYears / isMonthCovered", () => {

   it("reports the curated range", () => {

      expect(coveredYears(FESTIVALS)).toEqual([2026, 2027]);

   });

   it("accepts a month inside the range and rejects one outside it", () => {

      expect(isMonthCovered(FESTIVALS, 2026, 0)).toBe(true);
      expect(isMonthCovered(FESTIVALS, 2027, 11)).toBe(true);
      expect(isMonthCovered(FESTIVALS, 2025, 11)).toBe(false);
      expect(isMonthCovered(FESTIVALS, 2028, 0)).toBe(false);

   });

});

/**
 * The dataset is hand-curated, so these are the guard rails that make a
 * mistake fail CI instead of reaching a visitor. They check structure and
 * internal consistency — a human still has to check that the dates themselves
 * match a panchang.
 */
interface LocaleMessages {
   festivals?: {
      entries?: Record<string, { name?: string, significance?: string, observance?: string }>,
   };
}

describe("the festival dataset", () => {

   const ids = [...new Set(FESTIVALS.map(festival => festival.id))];

   /** Deities the corpus actually carries, derived from the content tree itself. */
   const corpusDeities = new Set(
      Object.keys(import.meta.glob("../../content/slokas/*/*/*.md"))
         .map(path => path.split("/").at(-2))
         .filter((deity): deity is string => Boolean(deity))
   );

   it("stores every date as a real YYYY-MM-DD calendar day", () => {

      for (const festival of FESTIVALS) {

         expect(festival.date, festival.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
         expect(toIsoDate(parseIsoDate(festival.date)), festival.id).toBe(festival.date);

      }

   });

   it("has no duplicate festival in the same year", () => {

      const seen = FESTIVALS.map(festival => `${festival.id}@${festival.date.slice(0, 4)}`);

      expect(seen).toHaveLength(new Set(seen).size);

   });

   it("covers every festival in every curated year", () => {

      for (const year of coveredYears(FESTIVALS)) {

         const present = new Set(
            FESTIVALS
               .filter(festival => festival.date.startsWith(String(year)))
               .map(festival => festival.id)
         );

         expect([...ids].filter(id => !present.has(id)), `missing in ${year}`).toEqual([]);

      }

   });

   it("only links deities the slokas corpus actually has", () => {

      const linked = FESTIVALS
         .map(festival => festival.deityId)
         .filter((deity): deity is string => Boolean(deity));

      expect([...new Set(linked)].filter(deity => !corpusDeities.has(deity))).toEqual([]);

   });

});

/**
 * The prose lives in app/locales/*.json, keyed by festival id. These are what
 * stop a festival from reaching a visitor with a blank blurb in one language,
 * or a translation lingering after its festival was removed.
 */
describe("the festival translations", () => {

   const ids = [...new Set(FESTIVALS.map(festival => festival.id))];

   const localeDir = join(dirname(fileURLToPath(import.meta.url)), "../../app/locales");

   /**
    * Read from disk rather than imported.
    *
    * `import en from "../../app/locales/en.json"` does not hand back the file.
    * @nuxtjs/i18n's Vite plugin pre-compiles locale JSON into @intlify message
    * ASTs at build time, so every string arrives as a parse tree — which is
    * exactly right for the app and useless for asserting on the text. Reading
    * the file is also the more honest check: it tests what ships.
    */
   const locales = Object.fromEntries(
      ["en", "hi", "te"].map(code => [
         code,
         JSON.parse(readFileSync(join(localeDir, `${code}.json`), "utf8")) as LocaleMessages,
      ])
   );

   it("has a name, a significance and an observance in all three languages", () => {

      for (const [code, messages] of Object.entries(locales)) {

         for (const id of ids) {

            const entry = messages.festivals?.entries?.[id];

            expect(entry, `${code}: festivals.entries.${id}`).toBeDefined();
            expect(entry?.name?.trim(), `${code}: ${id}.name`).toBeTruthy();
            expect(entry?.significance?.trim(), `${code}: ${id}.significance`).toBeTruthy();
            expect(entry?.observance?.trim(), `${code}: ${id}.observance`).toBeTruthy();

         }

      }

   });

   it("has no orphaned translation left behind by a removed festival", () => {

      for (const [code, messages] of Object.entries(locales)) {

         const translated = Object.keys(messages.festivals?.entries ?? {});

         expect(translated.filter(id => !ids.includes(id)), code).toEqual([]);

      }

   });

   /**
    * Anchors against the solar and seasonal facts that no panchang can move.
    * They will not catch a date that is wrong by a day, but they do catch a
    * festival transcribed into the wrong month entirely.
    */
   it("keeps each festival in the window its reckoning allows", () => {

      const windows: Record<string, [number, number]> = {
         // Solar: the sun's entry into Capricorn, 14 or 15 January.
         "makar-sankranti": [0, 0],
         // Lunar new year, always Chaitra: March or April.
         "ugadi": [2, 3],
         "gudi-padwa": [2, 3],
         // Solar new year, mid-April.
         "tamil-puthandu": [3, 3],
         "vishu": [3, 3],
         "baisakhi": [3, 3],
         // Kartika Amavasya: never outside October–November.
         "deepavali": [9, 10],
         "dhanteras": [9, 10],
         // Bhadrapada Shukla Chaturthi: August or September.
         "ganesh-chaturthi": [7, 8],
      };

      for (const festival of FESTIVALS) {

         const window = windows[festival.id];

         if (!window) {

            continue;

         }

         const month = parseIsoDate(festival.date).getMonth();

         expect(month, `${festival.id} ${festival.date}`).toBeGreaterThanOrEqual(window[0]);
         expect(month, `${festival.id} ${festival.date}`).toBeLessThanOrEqual(window[1]);

      }

   });

   it("puts Makar Sankranti on 14 or 15 January", () => {

      for (const festival of FESTIVALS.filter(entry => entry.id === "makar-sankranti")) {

         expect([14, 15], festival.date).toContain(parseIsoDate(festival.date).getDate());

      }

   });

});
