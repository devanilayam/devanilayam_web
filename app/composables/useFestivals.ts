import { FESTIVALS, type Festival, type FestivalRegion } from "~/utils/festivals/dates";
import {
   addMonths,
   buildMonthGrid,
   coveredYears,
   festivalsForMonth,
   groupFestivalsByDate,
   isMonthCovered,
   parseIsoDate,
   toIsoDate,
   type MonthCell,
} from "~/utils/festivals";
import { Locale } from "~/types/locale";

/** A festival row joined with its prose in the active language. */
export interface ResolvedFestival extends Festival {
   name: string;
   significance: string;
   observance: string;
   /** Human label for `region`, e.g. "South India". Never used to filter. */
   regionLabel: string;
   /** Localised deity name, present only when `deityId` is. */
   deityName?: string;
}

type VisibleMonth = { year: number, month: number };

type Translate = (key: string) => string;

const YEARS = coveredYears(FESTIVALS);

const FIRST_YEAR = YEARS[0] ?? new Date().getFullYear();

const LAST_YEAR = YEARS[YEARS.length - 1] ?? FIRST_YEAR;

/** Keeps a year/month pair inside the curated range. */
const clampToRange = (year: number, month: number): VisibleMonth => {

   if (year < FIRST_YEAR) {

      return { year: FIRST_YEAR, month: 0 };

   }

   if (year > LAST_YEAR) {

      return { year: LAST_YEAR, month: 11 };

   }

   return { year, month };

};

const thisMonthInRange = (): VisibleMonth => {

   const now = new Date();

   return clampToRange(now.getFullYear(), now.getMonth());

};

const makeResolver = (t: Translate) => (festival: Festival): ResolvedFestival => ({
   ...festival,
   name: t(`festivals.entries.${festival.id}.name`),
   significance: t(`festivals.entries.${festival.id}.significance`),
   observance: t(`festivals.entries.${festival.id}.observance`),
   regionLabel: t(`festivals.regions.${festival.region}`),
   deityName: festival.deityId ? t(`festivals.deities.${festival.deityId}`) : undefined,
});

/**
 * Sunday-first weekday headers in the active language.
 *
 * Built from a week known to start on a Sunday (4 January 1970 was one) so the
 * labels can never drift out of step with buildMonthGrid.
 */
const makeWeekdays = (tag: string): { short: string, long: string }[] => {

   const short = new Intl.DateTimeFormat(tag, { weekday: "short" });

   const long = new Intl.DateTimeFormat(tag, { weekday: "long" });

   return Array.from({ length: 7 }, (_, index) => {

      const day = new Date(1970, 0, 4 + index);

      return { short: short.format(day), long: long.format(day) };

   });

};

interface FestivalNavigation {
   canGoBack: ComputedRef<boolean>;
   canGoForward: ComputedRef<boolean>;
   canGoToToday: ComputedRef<boolean>;
   step: (delta: number) => void;
   goToToday: () => void;
   syncToToday: () => void;
}

/**
 * Month paging, and the one-time correction of the prerendered month.
 *
 * Split out of the composable so both halves stay small enough to read in one
 * go; it owns nothing, taking the three pieces of state it drives.
 */
const makeNavigation = (
   visible: Ref<VisibleMonth>,
   todayIso: Ref<string | null>,
   synced: Ref<boolean>
): FestivalNavigation => {

   const canGoBack = computed(() => {

      const previous = addMonths(visible.value.year, visible.value.month, -1);

      return isMonthCovered(FESTIVALS, previous.year, previous.month);

   });

   const canGoForward = computed(() => {

      const next = addMonths(visible.value.year, visible.value.month, 1);

      return isMonthCovered(FESTIVALS, next.year, next.month);

   });

   const canGoToToday = computed(() => {

      if (!todayIso.value) {

         return false;

      }

      const today = parseIsoDate(todayIso.value);

      return isMonthCovered(FESTIVALS, today.getFullYear(), today.getMonth())
         && !(today.getFullYear() === visible.value.year && today.getMonth() === visible.value.month);

   });

   const step = (delta: number): void => {

      const target = addMonths(visible.value.year, visible.value.month, delta);

      if (isMonthCovered(FESTIVALS, target.year, target.month)) {

         visible.value = target;

      }

   };

   const goToToday = (): void => {

      visible.value = thisMonthInRange();

   };

   /**
    * Corrects the build-time month to the real one, once, after hydration.
    * Also the only place `todayIso` is set. Later remounts leave the month
    * alone so a visitor coming back keeps whichever month they were reading.
    */
   const syncToToday = (): void => {

      todayIso.value = toIsoDate(new Date());

      if (synced.value) {

         return;

      }

      synced.value = true;
      goToToday();

   };

   return { canGoBack, canGoForward, canGoToToday, step, goToToday, syncToToday };

};

export const useFestivals = (): IUseFestivalsReturn => {

   const { t } = useI18n();

   const { locale } = useLocale();

   /**
    * The BCP-47 tag Intl needs. `Locale` already carries it for each of the
    * three scripts, so month and weekday names come from ICU rather than from
    * thirty-six hand-translated strings that would only rot.
    */
   const intlLocale = computed(() => Locale.getByCode(locale.value)?.language ?? "en-US");

   /**
    * The month on screen.
    *
    * `useState` rather than `ref` on purpose. This page is prerendered, so the
    * server ran `new Date()` at BUILD time. A plain ref would re-run that
    * initialiser in the browser against the REAL date, and any build older
    * than the current month would hydrate a different month than it rendered.
    * useState serialises the server's value into the payload, so the first
    * client render matches the HTML exactly; syncToToday() then corrects it.
    */
   const visible = useState<VisibleMonth>("festivals-visible-month", thisMonthInRange);

   /** Set on the client only, so the "today" ring never causes a mismatch. */
   const todayIso = useState<string | null>("festivals-today", () => null);

   const synced = useState("festivals-synced-to-today", () => false);

   const byDate = computed(() => groupFestivalsByDate(FESTIVALS));

   const resolve = computed(() => makeResolver(t as Translate));

   const festivalsOn = (iso: string): ResolvedFestival[] =>
      (byDate.value.get(iso) ?? []).map(resolve.value);

   const weeks = computed<MonthCell[][]>(() =>
      buildMonthGrid(visible.value.year, visible.value.month));

   const monthFestivals = computed<ResolvedFestival[]>(() =>
      festivalsForMonth(FESTIVALS, visible.value.year, visible.value.month).map(resolve.value));

   /** Every festival in the curated range — used for the page's Event JSON-LD. */
   const allFestivals = computed<ResolvedFestival[]>(() =>
      [...FESTIVALS].sort((a, b) => a.date.localeCompare(b.date)).map(resolve.value));

   const monthLabel = computed(() =>
      new Intl.DateTimeFormat(intlLocale.value, { month: "long", year: "numeric" })
         .format(new Date(visible.value.year, visible.value.month, 1)));

   const weekdays = computed(() => makeWeekdays(intlLocale.value));

   const formatFullDate = (iso: string): string =>
      new Intl.DateTimeFormat(intlLocale.value, {
         weekday: "long",
         day: "numeric",
         month: "long",
         year: "numeric",
      }).format(parseIsoDate(iso));

   return {
      visible,
      todayIso,
      weeks,
      weekdays,
      monthLabel,
      monthFestivals,
      allFestivals,
      festivalsOn,
      formatFullDate,
      firstYear: FIRST_YEAR,
      lastYear: LAST_YEAR,
      ...makeNavigation(visible, todayIso, synced),
   };

};

export interface IUseFestivalsReturn {
   visible: Ref<VisibleMonth>;
   todayIso: Ref<string | null>;
   weeks: ComputedRef<MonthCell[][]>;
   weekdays: ComputedRef<{ short: string, long: string }[]>;
   monthLabel: ComputedRef<string>;
   monthFestivals: ComputedRef<ResolvedFestival[]>;
   allFestivals: ComputedRef<ResolvedFestival[]>;
   festivalsOn: (iso: string) => ResolvedFestival[];
   formatFullDate: (iso: string) => string;
   canGoBack: ComputedRef<boolean>;
   canGoForward: ComputedRef<boolean>;
   canGoToToday: ComputedRef<boolean>;
   step: (delta: number) => void;
   goToToday: () => void;
   syncToToday: () => void;
   firstYear: number;
   lastYear: number;
}

export type { Festival, FestivalRegion, MonthCell };
