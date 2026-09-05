/**
 * The curated festival table.
 *
 * WHY THIS IS DATA AND NOT A CALCULATION
 * --------------------------------------
 * Hindu festivals are lunisolar: they are fixed to a tithi in a lunar month,
 * not to a Gregorian date, so the same festival lands on a different day every
 * year. Deriving those days needs an ephemeris — solar longitude, lunar
 * longitude, sunrise at a given latitude — plus the regional conventions that
 * sit on top of it (amanta vs purnimanta reckoning, which of two overlapping
 * tithis a region observes, and what happens in an adhika masa).
 *
 * 2026 is exactly why that is not a weekend project: it carries an adhika
 * Jyeshtha (17 May – 15 June 2026), an intercalary month that pushes every
 * festival after it about nineteen days later than a naive year-on-year
 * subtraction would predict. Diwali moved from 20 October 2025 to 8 November
 * 2026 for that reason alone.
 *
 * So the dates are curated, verified against published panchangs, and stored
 * here as plain Gregorian dates. No engine, no dependency, no drift.
 *
 * ADDING THE NEXT YEAR
 * --------------------
 * This file is the only thing to touch. Add one row per festival with the new
 * year's date, keeping the same `id` — the prose in app/locales/*.json is
 * keyed by `id` and is written once per festival, not once per year, so it
 * needs no change. `tests/unit/festivals.spec.ts` will fail if a row's id has
 * no translation, if a date is malformed, or if an (id, year) pair repeats.
 *
 * WHERE A DATE IS CONTESTED
 * -------------------------
 * Some observances legitimately differ between panchangs when a tithi spans
 * two civil days (Varalakshmi Vratam 2026 and Vaikunta Ekadashi 2026 are the
 * live examples). The rule used here is: follow the majority of the Telugu,
 * Tamil and Kannada panchangs, because that is this site's primary audience.
 * The blurbs say so where it matters.
 */

/**
 * Where an observance is most strongly at home.
 *
 * This never filters the calendar — the calendar shows every festival to
 * everyone. It does two things: it labels the festival inside its dialog, so a
 * visitor meeting an unfamiliar name gets the context; and it orders festivals
 * that share a date.
 */
export type FestivalRegion = "pan" | "south" | "north" | "rest";

/**
 * Display order for festivals landing on the same day.
 *
 * Nationwide observances come first because they are the ones most visitors
 * are looking for; the regional ones then follow south → north → rest, the
 * order this calendar was authored in.
 */
export const REGION_ORDER: Record<FestivalRegion, number> = {
   pan: 0,
   south: 1,
   north: 2,
   rest: 3,
};

export interface Festival {
   /**
    * Stable key, and the i18n key under `festivals.entries.*`. Shared by every
    * year's row for the same festival, so the prose is written once.
    */
   id: string;
   /** Gregorian date, `YYYY-MM-DD`. One row per observance per year. */
   date: string;
   region: FestivalRegion;
   /**
    * Deity to link the dialog to, as `/{locale}/slokas/{deityId}`.
    *
    * Only set where the corpus actually has that deity — ganesh, hanuman,
    * rama, shani, shiva, surya — so the link can never 404. Adding a deity to
    * content/slokas is what makes it linkable here.
    */
   deityId?: string;
}

export const FESTIVALS: Festival[] = [

   // ---------------------------------------------------------------
   // Observed across India
   // ---------------------------------------------------------------

   { id: "makar-sankranti", date: "2026-01-14", region: "pan", deityId: "surya" },
   { id: "makar-sankranti", date: "2027-01-14", region: "pan", deityId: "surya" },

   { id: "maha-shivaratri", date: "2026-02-15", region: "pan", deityId: "shiva" },
   { id: "maha-shivaratri", date: "2027-03-06", region: "pan", deityId: "shiva" },

   { id: "holi", date: "2026-03-04", region: "pan" },
   { id: "holi", date: "2027-03-22", region: "pan" },

   { id: "sri-rama-navami", date: "2026-03-26", region: "pan", deityId: "rama" },
   { id: "sri-rama-navami", date: "2027-04-15", region: "pan", deityId: "rama" },

   { id: "akshaya-tritiya", date: "2026-04-21", region: "pan" },
   { id: "akshaya-tritiya", date: "2027-05-09", region: "pan" },

   { id: "buddha-purnima", date: "2026-05-01", region: "pan" },
   { id: "buddha-purnima", date: "2027-05-20", region: "pan" },

   { id: "guru-purnima", date: "2026-07-29", region: "pan" },
   { id: "guru-purnima", date: "2027-07-18", region: "pan" },

   { id: "raksha-bandhan", date: "2026-08-28", region: "pan" },
   { id: "raksha-bandhan", date: "2027-08-17", region: "pan" },

   { id: "krishna-janmashtami", date: "2026-09-04", region: "pan" },
   { id: "krishna-janmashtami", date: "2027-08-24", region: "pan" },

   { id: "ganesh-chaturthi", date: "2026-09-14", region: "pan", deityId: "ganesh" },
   { id: "ganesh-chaturthi", date: "2027-09-04", region: "pan", deityId: "ganesh" },

   { id: "sharad-navratri", date: "2026-10-11", region: "pan" },
   { id: "sharad-navratri", date: "2027-09-30", region: "pan" },

   { id: "vijayadashami", date: "2026-10-20", region: "pan", deityId: "rama" },
   { id: "vijayadashami", date: "2027-10-09", region: "pan", deityId: "rama" },

   { id: "dhanteras", date: "2026-11-06", region: "pan" },
   { id: "dhanteras", date: "2027-10-27", region: "pan" },

   { id: "naraka-chaturdashi", date: "2026-11-07", region: "pan" },
   { id: "naraka-chaturdashi", date: "2027-10-28", region: "pan" },

   { id: "deepavali", date: "2026-11-08", region: "pan" },
   { id: "deepavali", date: "2027-10-29", region: "pan" },

   { id: "bhai-dooj", date: "2026-11-11", region: "pan" },
   { id: "bhai-dooj", date: "2027-10-31", region: "pan" },

   // ---------------------------------------------------------------
   // South India
   // ---------------------------------------------------------------

   { id: "bhogi", date: "2026-01-13", region: "south" },
   { id: "bhogi", date: "2027-01-13", region: "south" },

   { id: "kanuma", date: "2026-01-15", region: "south" },
   { id: "kanuma", date: "2027-01-15", region: "south" },

   { id: "ratha-saptami", date: "2026-01-25", region: "south", deityId: "surya" },
   { id: "ratha-saptami", date: "2027-02-13", region: "south", deityId: "surya" },

   { id: "thaipusam", date: "2026-02-01", region: "south" },
   { id: "thaipusam", date: "2027-01-22", region: "south" },

   { id: "ugadi", date: "2026-03-19", region: "south" },
   { id: "ugadi", date: "2027-04-07", region: "south" },

   { id: "tamil-puthandu", date: "2026-04-14", region: "south" },
   { id: "tamil-puthandu", date: "2027-04-14", region: "south" },

   { id: "vishu", date: "2026-04-15", region: "south" },
   { id: "vishu", date: "2027-04-14", region: "south" },

   { id: "narasimha-jayanti", date: "2026-04-30", region: "south" },
   { id: "narasimha-jayanti", date: "2027-05-18", region: "south" },

   { id: "varalakshmi-vratam", date: "2026-08-21", region: "south" },
   { id: "varalakshmi-vratam", date: "2027-08-13", region: "south" },

   { id: "onam", date: "2026-08-26", region: "south" },
   { id: "onam", date: "2027-09-12", region: "south" },

   { id: "bathukamma", date: "2026-10-18", region: "south" },
   { id: "bathukamma", date: "2027-10-07", region: "south" },

   { id: "ayudha-puja", date: "2026-10-19", region: "south" },
   { id: "ayudha-puja", date: "2027-10-08", region: "south" },

   { id: "karthika-deepam", date: "2026-11-24", region: "south", deityId: "shiva" },
   { id: "karthika-deepam", date: "2027-11-14", region: "south", deityId: "shiva" },

   { id: "vaikunta-ekadashi", date: "2026-12-20", region: "south" },
   { id: "vaikunta-ekadashi", date: "2027-12-09", region: "south" },

   // ---------------------------------------------------------------
   // North India
   // ---------------------------------------------------------------

   { id: "lohri", date: "2026-01-13", region: "north" },
   { id: "lohri", date: "2027-01-13", region: "north" },

   { id: "vasant-panchami", date: "2026-01-23", region: "north" },
   { id: "vasant-panchami", date: "2027-02-11", region: "north" },

   { id: "holika-dahan", date: "2026-03-03", region: "north" },
   { id: "holika-dahan", date: "2027-03-21", region: "north" },

   { id: "chaitra-navratri", date: "2026-03-19", region: "north" },
   { id: "chaitra-navratri", date: "2027-04-07", region: "north" },

   { id: "hanuman-jayanti", date: "2026-04-01", region: "north", deityId: "hanuman" },
   { id: "hanuman-jayanti", date: "2027-04-20", region: "north", deityId: "hanuman" },

   { id: "baisakhi", date: "2026-04-14", region: "north" },
   { id: "baisakhi", date: "2027-04-14", region: "north" },

   { id: "shani-jayanti", date: "2026-05-16", region: "north", deityId: "shani" },
   { id: "shani-jayanti", date: "2027-06-04", region: "north", deityId: "shani" },

   { id: "vat-savitri", date: "2026-05-16", region: "north" },
   { id: "vat-savitri", date: "2027-06-04", region: "north" },

   { id: "nag-panchami", date: "2026-08-17", region: "north", deityId: "shiva" },
   { id: "nag-panchami", date: "2027-08-06", region: "north", deityId: "shiva" },

   { id: "hartalika-teej", date: "2026-09-13", region: "north", deityId: "shiva" },
   { id: "hartalika-teej", date: "2027-09-03", region: "north", deityId: "shiva" },

   { id: "karva-chauth", date: "2026-10-29", region: "north" },
   { id: "karva-chauth", date: "2027-10-18", region: "north" },

   { id: "govardhan-puja", date: "2026-11-10", region: "north" },
   { id: "govardhan-puja", date: "2027-10-30", region: "north" },

   { id: "chhath-puja", date: "2026-11-15", region: "north", deityId: "surya" },
   { id: "chhath-puja", date: "2027-11-04", region: "north", deityId: "surya" },

   // ---------------------------------------------------------------
   // Rest of India
   // ---------------------------------------------------------------

   { id: "gudi-padwa", date: "2026-03-19", region: "rest" },
   { id: "gudi-padwa", date: "2027-04-07", region: "rest" },

   { id: "poila-boishakh", date: "2026-04-15", region: "rest" },
   { id: "poila-boishakh", date: "2027-04-15", region: "rest" },

   { id: "bohag-bihu", date: "2026-04-15", region: "rest" },
   { id: "bohag-bihu", date: "2027-04-15", region: "rest" },

   { id: "jagannath-rath-yatra", date: "2026-07-16", region: "rest" },
   { id: "jagannath-rath-yatra", date: "2027-07-05", region: "rest" },

   { id: "anant-chaturdashi", date: "2026-09-25", region: "rest", deityId: "ganesh" },
   { id: "anant-chaturdashi", date: "2027-09-14", region: "rest", deityId: "ganesh" },

   { id: "mahalaya-amavasya", date: "2026-10-10", region: "rest" },
   { id: "mahalaya-amavasya", date: "2027-09-29", region: "rest" },

   { id: "durga-puja", date: "2026-10-17", region: "rest" },
   { id: "durga-puja", date: "2027-10-06", region: "rest" },

];
