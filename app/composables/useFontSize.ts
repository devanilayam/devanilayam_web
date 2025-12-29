import { useLocalStorage } from "@vueuse/core";

export const useFontSize = (): any => {

   // Font size controller with localStorage persistence
   const minFontSize = 12;

   const maxFontSize = 24;

   const defaultFontSize = 16;

   const fontSize = useLocalStorage("sloka-font-size", defaultFontSize);

   const computedFontSize = computed(() => `${fontSize.value / 16}rem`);

   // Utility: Update CSS variable on html element
   const setFontSizeCSSVar = (value: string): void => {

      if (typeof window !== "undefined") {

         document.documentElement.style.setProperty("--sloka-font-size", value);

      }

   };

   // Watch fontSize and inject CSS variable
   watch(computedFontSize, (newVal) => {

      setFontSizeCSSVar(newVal);

   }, { immediate: true });

   const increaseFontSize = (): void => {

      if (fontSize.value < maxFontSize) {

         fontSize.value += 2;

      }

   };

   const decreaseFontSize = (): void => {

      if (fontSize.value > minFontSize) {

         fontSize.value -= 2;

      }

   };

   return {
      minFontSize,
      maxFontSize,
      fontSize,
      computedFontSize,
      increaseFontSize,
      decreaseFontSize,
   };

};
