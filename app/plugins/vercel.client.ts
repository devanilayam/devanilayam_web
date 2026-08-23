/**
 * Loads Vercel Analytics and Speed Insights, but only on Vercel.
 *
 * `runtimeConfig.public.isVercel` is baked from the `VERCEL` environment
 * variable at build time, so local dev, CI previews and any self-hosted
 * deployment ship neither script and make no third-party requests.
 */
import { inject as injectAnalytics } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";

export default defineNuxtPlugin(() => {

   const { public: { isVercel } } = useRuntimeConfig();

   if (!isVercel) {

      return;

   }

   injectAnalytics({ mode: import.meta.dev ? "development" : "production" });

   injectSpeedInsights();

});
