<template>
   <main class="page page-festivals">
      <home-section :title="$t('festivals.pageTitle')" :subtitle="$t('festivals.subtitle')"
         content-class="page-index-section__content--calendar">
         <festival-calendar />
      </home-section>

      <my-socials />
   </main>
</template>

<script setup lang="ts">
import { SITE_URL, organizationNode } from "~/composables/useJsonLd";
import { useFestivals } from "~/composables/useFestivals";

const { t } = useI18n();

const { locale } = useLocale();

const { allFestivals, syncToToday } = useFestivals();

// The month shown on the server is whatever month the site was BUILT in — this
// page is prerendered, so it cannot know better. syncToToday() corrects it to
// the reader's actual month once, after hydration; see the note in
// useFestivals() on why that cannot be done in the ref initialiser.
onMounted(syncToToday);

useSeoMeta({
   title: () => t("festivals.seo.title"),
   description: () => t("festivals.seo.description"),
   ogTitle: () => t("festivals.seo.title"),
   ogDescription: () => t("festivals.seo.description"),
   ogType: "website",
});

defineOgImageComponent("Default", {
   eyebrow: "Calendar",
   title: "Festival Calendar",
   description: "Every major Hindu festival of 2026 and 2027, with what each day means.",
});

/**
 * One schema.org Event per festival across the whole curated range, not just
 * the month on screen.
 *
 * The grid is paged and client-driven, so a crawler only ever sees one month of
 * it. This is the part of the page that carries every festival and its date in
 * a form a search engine can read, which is what "when is Ugadi in 2027" needs
 * to match against.
 */
useJsonLd(() => [
   organizationNode(),
   ...allFestivals.value.map(festival => ({
      "@type": "Event",
      "@id": `${SITE_URL}/${locale.value}/festivals#${festival.id}-${festival.date}`,
      name: festival.name,
      startDate: festival.date,
      endDate: festival.date,
      description: festival.significance,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      url: `${SITE_URL}/${locale.value}/festivals`,
      location: {
         "@type": "Country",
         name: "India",
      },
   })),
]);
</script>
