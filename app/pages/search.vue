<template>
   <main class="page page-search">
      <section>
         <h1 class="search-heading">{{ $t('search.pageTitle') }}</h1>

         <!-- A real GET form: it works without JavaScript, and the resulting
              /search?q=… URL is what the SearchAction in the WebSite schema
              tells search engines to use. -->
         <form class="search-form" role="search" method="get" :action="localePath('/search')" @submit.prevent="submit">
            <label class="search-form__label" for="search-input">{{ $t('search.label') }}</label>
            <div class="search-form__row">
               <input
                  id="search-input" v-model="term" class="search-form__input" type="search" name="q"
                  autocomplete="off" :placeholder="$t('search.placeholder')">
               <my-button type="submit">
                  {{ $t('search.submit') }}
               </my-button>
            </div>
         </form>

         <p v-if="!query" class="search-hint">
            {{ $t('search.hint') }}
         </p>

         <template v-else>
            <p class="search-summary">
               {{ $t('search.results', { count: results.length, query }) }}
            </p>

            <ul v-if="results.length" class="search-results">
               <li v-for="result in results" :key="result.path" class="search-result">
                  <nuxt-link class="search-result__link" :to="result.path">
                     <span class="search-result__kind">{{ $t(result.kindKey) }}</span>
                     <span class="search-result__title">{{ result.title }}</span>
                     <span v-if="result.description" class="search-result__description">
                        {{ result.description }}
                     </span>
                  </nuxt-link>
               </li>
            </ul>

            <p v-else class="search-hint">
               {{ $t('search.empty') }}
            </p>
         </template>
      </section>
   </main>
</template>

<script setup lang="ts">
const { t } = useI18n();

const route = useRoute();

const router = useRouter();

const localePath = useLocalePath();

const { locale } = useLocale();

const query = computed(() => String(route.query.q ?? "").trim());

const term = ref(query.value);

watch(query, value => {

   term.value = value;

});

const submit = (): void => {

   router.push({ path: localePath("/search"), query: term.value ? { q: term.value } : {} });

};

// Searched on the server so the results are in the HTML.
//
// This goes through /api/search rather than calling queryCollection() here:
// /search is the only route that is not prerendered, so a query in this
// component would run against @nuxt/content's *client* database and pull down
// ~1.3 MB of WASM SQLite the first time anyone searched. See server/api/search.get.ts.
const { data: results } = await useFetch("/api/search", {
   key: () => `search-${locale.value}-${query.value}`,
   query: { q: query, locale },
   default: () => [],
});

useSeoMeta({
   title: () => (query.value ? t("search.titleWithQuery", { query: query.value }) : t("search.pageTitle")),
   description: () => t("search.description"),
   ogTitle: () => t("search.pageTitle"),
   ogType: "website",
   // A result listing is thin, duplicate-prone and infinite in cardinality —
   // exactly what Google asks not to be indexed. `follow` keeps the links
   // themselves crawlable.
   robots: "noindex, follow",
});

defineOgImageComponent("Default", {
   eyebrow: t("search.pageTitle"),
   title: t("search.pageTitle"),
   description: t("search.description"),
});
</script>

<style lang="scss">
.page-search {
   padding-block: px-to-rem(32);
}

.search-heading {
   color: #EB730C;
   font-family: Merriweather, "Noto Sans Telugu", "Noto Sans Devanagari", serif;
   font-size: px-to-rem(36);
   margin-bottom: px-to-rem(24);
}

.search-form {
   display: flex;
   flex-direction: column;
   gap: px-to-rem(8);
   margin-bottom: px-to-rem(32);

   &__label {
      font-size: px-to-rem(14);
      color: #6B6760;
   }

   &__row {
      display: flex;
      gap: px-to-rem(12);
      flex-wrap: wrap;
   }

   &__input {
      flex: 1 1 px-to-rem(280);
      padding: px-to-rem(12) px-to-rem(16);
      border: px-to-rem(1) solid #E7E1D6;
      border-radius: px-to-rem(10);
      background: #FFF;
      font-size: px-to-rem(16);

      &:focus-visible {
         outline: px-to-rem(2) solid #EB730C;
         outline-offset: px-to-rem(2);
      }
   }
}

.search-summary {
   color: #6B6760;
   margin-bottom: px-to-rem(16);
}

.search-hint {
   color: #6B6760;
}

.search-results {
   display: flex;
   flex-direction: column;
   gap: px-to-rem(12);
   list-style: none;
   padding: 0;
}

.search-result {
   &__link {
      display: flex;
      flex-direction: column;
      gap: px-to-rem(4);
      padding: px-to-rem(16);
      border: px-to-rem(1) solid #E7E1D6;
      border-radius: px-to-rem(12);
      background: #FAF8F3;
      text-decoration: none;
      color: inherit;

      &:hover {
         border-color: #EB730C;
      }
   }

   &__kind {
      font-size: px-to-rem(12);
      text-transform: uppercase;
      letter-spacing: px-to-rem(1);
      color: #EB730C;
   }

   &__title {
      font-size: px-to-rem(20);
      font-weight: 600;
   }

   &__description {
      color: #6B6760;
   }
}
</style>
