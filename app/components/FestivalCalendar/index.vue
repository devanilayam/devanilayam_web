<template>
   <section class="festival-calendar">

      <div class="festival-calendar__bar">
         <button type="button" class="festival-calendar__nav" :disabled="!canGoBack" :aria-label="$t('festivals.previousMonth')" @click="step(-1)">
            <icon name="chevron-left" :size="24" color="#854D0E" />
         </button>

         <p class="festival-calendar__month" aria-live="polite">{{ monthLabel }}</p>

         <button type="button" class="festival-calendar__nav" :disabled="!canGoForward" :aria-label="$t('festivals.nextMonth')" @click="step(1)">
            <icon name="chevron-right" :size="24" color="#854D0E" />
         </button>
      </div>

      <div class="festival-calendar__actions">
         <button v-if="canGoToToday" type="button" class="my-button my-button--plain festival-calendar__today" @click="goToToday">
            {{ $t('festivals.goToToday') }}
         </button>
         <p class="festival-calendar__coverage">{{ $t('festivals.coverage', { start: firstYear, end: lastYear }) }}</p>
      </div>

      <!--
         A real <table>, not a grid of divs. A month IS tabular — seven named
         columns and a row per week — and the table gives screen readers the
         column header for free, so a festival cell is announced with its
         weekday rather than as a bare number in a list.
      -->
      <table class="festival-calendar__grid">
         <caption class="festival-calendar__caption">{{ monthLabel }}</caption>
         <thead>
            <tr>
               <th v-for="weekday in weekdays" :key="weekday.long" scope="col">
                  <abbr :title="weekday.long">{{ weekday.short }}</abbr>
               </th>
            </tr>
         </thead>
         <tbody>
            <tr v-for="(week, index) in decoratedWeeks" :key="index">
               <td v-for="cell in week" :key="cell.iso" :class="['festival-calendar__cell', {
                  'is-outside': !cell.inMonth,
                  'is-today': cell.isToday,
               }]">
                  <!--
                     Only days that have something to read are buttons. Making
                     every one of the 42 cells focusable would mean forty-two
                     tab stops to get past a month that has three festivals in
                     it.
                  -->
                  <button v-if="cell.inMonth && cell.festivals.length > 0" type="button" class="festival-calendar__day festival-calendar__day--has-festival"
                     :aria-label="dayLabel(cell)" @click="openDay(cell.iso)">
                     <span class="festival-calendar__number">{{ cell.day }}</span>
                     <span class="festival-calendar__names">{{ cell.festivals.map(festival => festival.name).join(", ") }}</span>
                     <span class="festival-calendar__dot" aria-hidden="true" />
                  </button>

                  <span v-else class="festival-calendar__day" :aria-hidden="!cell.inMonth">{{ cell.day }}</span>
               </td>
            </tr>
         </tbody>
      </table>

      <!--
         The same month as a plain list. Not a mobile fallback — it is always
         there, because reading down a list of dated names is easier than
         scanning a grid for anyone who finds the grid hard work, and it is the
         only place the full festival name is guaranteed to fit.
      -->
      <div class="festival-calendar__agenda">
         <h2 class="festival-calendar__agenda-title">{{ $t('festivals.monthFestivals') }}</h2>

         <ul v-if="monthFestivals.length > 0" class="festival-calendar__list">
            <li v-for="festival in monthFestivals" :key="`${festival.id}-${festival.date}`">
               <button type="button" class="festival-calendar__row" @click="openDay(festival.date)">
                  <span class="festival-calendar__date">
                     <span class="festival-calendar__date-day">{{ parseIsoDate(festival.date).getDate() }}</span>
                     <span class="festival-calendar__date-weekday">{{ shortWeekday(festival.date) }}</span>
                  </span>
                  <span class="festival-calendar__meta">
                     <span class="festival-calendar__name">{{ festival.name }}</span>
                     <span class="festival-calendar__region">{{ festival.regionLabel }}</span>
                  </span>
               </button>
            </li>
         </ul>

         <p v-else class="festival-calendar__empty">{{ $t('festivals.noFestivals') }}</p>
      </div>

      <my-dialog :open="selectedIso !== null" :close-label="$t('festivals.dialog.close')" @close="closeDay">
         <template #title>{{ selectedIso ? formatFullDate(selectedIso) : "" }}</template>

         <article v-for="festival in selectedFestivals" :key="festival.id" class="festival-detail">
            <h3 class="festival-detail__name">{{ festival.name }}</h3>
            <p class="festival-detail__region">{{ festival.regionLabel }}</p>

            <h4 class="festival-detail__heading">{{ $t('festivals.dialog.significance') }}</h4>
            <p class="festival-detail__text">{{ festival.significance }}</p>

            <h4 class="festival-detail__heading">{{ $t('festivals.dialog.observance') }}</h4>
            <p class="festival-detail__text">{{ festival.observance }}</p>

            <nuxt-link v-if="festival.deityId" :to="localePath(`/slokas/${festival.deityId}`)" class="my-button my-button--outlined festival-detail__link"
               @click="closeDay">
               {{ $t('festivals.dialog.readSlokas', { deity: festival.deityName }) }}
            </nuxt-link>
         </article>
      </my-dialog>

   </section>
</template>

<script setup lang="ts">
import { useFestivals, type MonthCell, type ResolvedFestival } from "~/composables/useFestivals";
import { parseIsoDate } from "~/utils/festivals";
import { Locale } from "~/types/locale";

const { locale } = useLocale();

const localePath = useLocalePath();

const {
   weeks,
   weekdays,
   monthLabel,
   monthFestivals,
   todayIso,
   festivalsOn,
   formatFullDate,
   canGoBack,
   canGoForward,
   canGoToToday,
   step,
   goToToday,
   firstYear,
   lastYear,
} = useFestivals();

interface DecoratedCell extends MonthCell {
   festivals: ResolvedFestival[];
   isToday: boolean;
}

/**
 * Resolves each cell's festivals once per month rather than once per read.
 * The template touches a cell's festivals three times — to decide whether it
 * is a button, to label it and to render the names — and there are 42 cells.
 */
const decoratedWeeks = computed<DecoratedCell[][]>(() =>
   weeks.value.map(week => week.map(cell => ({
      ...cell,
      festivals: cell.inMonth ? festivalsOn(cell.iso) : [],
      isToday: cell.iso === todayIso.value,
   }))));

const selectedIso = ref<string | null>(null);

const selectedFestivals = computed<ResolvedFestival[]>(() =>
   selectedIso.value ? festivalsOn(selectedIso.value) : []);

const openDay = (iso: string): void => {

   selectedIso.value = iso;

};

const closeDay = (): void => {

   selectedIso.value = null;

};

const shortWeekday = (iso: string): string =>
   new Intl.DateTimeFormat(Locale.getByCode(locale.value)?.language ?? "en-US", { weekday: "short" })
      .format(parseIsoDate(iso));

/**
 * The cell's own label, because the visible text is a bare number plus a
 * truncated name. Read out, it becomes "8 November 2026, Deepavali".
 */
const dayLabel = (cell: DecoratedCell): string =>
   `${formatFullDate(cell.iso)}, ${cell.festivals.map(festival => festival.name).join(", ")}`;
</script>
