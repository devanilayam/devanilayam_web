import { useStorage } from "@vueuse/core";
import { Locale } from "~/types/locale";

export const useLocale = (): IUseLocaleReturn => {

   const i18n = useI18n();

   const fallBackLocale = Locale.English.code;

   const locale = computed(() => i18n.locale.value);

   // Write-only record of the user's last explicit choice.
   //
   // Nothing reads it back any more: restoring the locale from storage is
   // @nuxtjs/i18n's job, via the `detectBrowserLanguage` cookie configured in
   // nuxt.config.ts. That mechanism *redirects*, which is the only correct way
   // to change locale under the `prefix` strategy — see the note on the removed
   // getSavedLocale() below.
   const locallyStoredLocale = useStorage(LOCAL_STORAGE_KEYS.locale, "en");

   const setLocale = async (localeCode?: string): Promise<void> => {

      if (locale.value === localeCode) {

         return;

      }

      const _locale = (localeCode ?? fallBackLocale) as "en" | "te";

      locallyStoredLocale.value = _locale;

      // Navigate to the equivalent route in the new locale.
      //
      // Deliberately WITHOUT calling i18n.setLocale() first. Under the `prefix`
      // strategy the locale is derived from the route, so navigating is enough
      // — and setting it up front actively hurt: it flipped `locale` while the
      // OLD page was still mounted, so every reactive useAsyncData key on that
      // page changed ("slokas-lords-en" -> "slokas-lords-te") and Nuxt re-ran
      // the handler client-side. That handler calls queryCollection, which
      // boots a 1.3 MB WASM SQLite engine in the browser — to fetch data the
      // very next navigation was about to receive in its prerendered payload.
      //
      // Navigating first means the locale changes as the new route mounts,
      // and the data arrives with it.
      const route = useRoute();

      const switchLocalePath = useSwitchLocalePath();

      const newPath = switchLocalePath(_locale);

      if (newPath && route.path !== newPath) {

         await navigateTo(newPath);

      } else {

         // Same path in both locales (nothing to navigate to) — set it directly.
         await i18n.setLocale(_locale);

      }

   };

   // REMOVED: getSavedLocale() and its onMounted() hook.
   //
   // It read the stored locale on mount and called i18n.setLocale() WITHOUT
   // navigating. Two things went wrong with that:
   //
   //  1. Correctness. Under the `prefix` strategy the URL is the source of
   //     truth for locale. Setting the ref alone meant /en/slokas could render
   //     Telugu while its canonical, hreflang and <html lang> all still said
   //     English — telling search engines one thing and showing another.
   //
   //  2. Cost. useLocale() is called from 13 places, so the hook ran 13 times
   //     per mount, each flipping `locale` and so changing every reactive
   //     useAsyncData key on the page. Nuxt re-ran those handlers client-side;
   //     they call queryCollection, which boots a 1.3 MB WASM SQLite engine in
   //     the browser. It fired on every locale switch, mid-navigation, undoing
   //     the switch and redoing it (te -> en -> te in the network log).
   //
   // Restoring a returning visitor's locale is already handled — properly, by
   // redirect — by `i18n.detectBrowserLanguage` in nuxt.config.ts.

   return {
      locale,
      setLocale,
   };

};

interface IUseLocaleReturn {
   locale: Ref<string>;
   setLocale: (localeCode?: string) => Promise<void>;
}
