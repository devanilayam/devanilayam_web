/**
 * Props for the LocalImage component.
 *
 * Images live in `public/images/` and are served as-is. They are sized to what
 * the layout actually displays, so there is nothing for an optimiser to save.
 *
 * NOT built on <NuxtImg>: rendering it during prerender makes the Nitro
 * prerender step stop partway through — it exits 0 having written only a
 * fraction of the routes, with no error, which would silently ship a mostly
 * empty site. @nuxt/image stays installed but unused until that is understood.
 */
export interface LocalImage {
   /**
    * Optional folder beneath `public/images/`, e.g. "lord".
    */
   folder?: string;

   /**
    * The file name of the image, e.g. "guruji.webp".
    */
   file: string;

   /**
    * The alt text. Empty string marks the image decorative.
    */
   alt?: string;

   /**
    * Intrinsic width in pixels. Always set it alongside `height`: the pair
    * reserves the box before the image arrives, which is what stops the layout
    * shifting as it loads.
    */
   width?: number | string;

   /**
    * Intrinsic height in pixels. See `width`.
    */
   height?: number | string;

   /**
    * Set for the one image that is the page's largest above-the-fold element.
    * It swaps lazy loading for eager plus `fetchpriority="high"` and a preload
    * hint, so the browser starts fetching it immediately instead of waiting
    * for layout. Lazy-loading the LCP element is a well-known way to lose
    * several seconds on that metric.
    */
   priority?: boolean;
}
