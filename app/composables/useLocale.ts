import { useStorage } from "@vueuse/core";
import { Locale } from "~/types/locale";

export const useLocale = (): IUseLocaleReturn => {

   const i18n = useI18n();

   const fallBackLocale = Locale.English.code;

   const locale = computed(() => i18n.locale.value);

   const locallyStoredLocale = useStorage(LOCAL_STORAGE_KEYS.locale, "en");

   const isLocaleSetFromStore = ref(false);

   const setLocale = async (localeCode?: string): Promise<void> => {

      if (locale.value === localeCode) {

         return;

      }

      const _locale = (localeCode ?? fallBackLocale) as "en" | "te";

      locallyStoredLocale.value = _locale;

      await i18n.setLocale(_locale);

      // Navigate to the equivalent route in the new locale
      const route = useRoute();

      const switchLocalePath = useSwitchLocalePath();

      const newPath = switchLocalePath(_locale);

      if (newPath && route.path !== newPath) {

         await navigateTo(newPath);

      }

   };

   const getSavedLocale = async (): Promise<void> => {

      if (isLocaleSetFromStore.value) {

         return;

      }

      const savedLocale = locallyStoredLocale.value;

      i18n.setLocale((savedLocale ?? fallBackLocale) as "en" | "te");

   };

   onMounted(async () => {

      await getSavedLocale();

      isLocaleSetFromStore.value = true;

   });

   return {
      locale,
      setLocale,
      getSavedLocale,
   };

};

interface IUseLocaleReturn {
   locale: Ref<string>;
   setLocale: (localeCode?: string) => Promise<void>;
   getSavedLocale: () => Promise<void>;
}
