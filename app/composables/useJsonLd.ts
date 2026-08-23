/**
 * Injects one or more JSON-LD structured-data nodes into the document head,
 * server-rendered so search engines and AI crawlers read them without
 * executing JavaScript.
 *
 * We inject directly via `useHead` (rather than relying on the schema-org
 * graph) to guarantee the markup is present in the SSR HTML response.
 */
export const SITE_URL = "https://devanilayam.com";

type JsonLdNode = Record<string, unknown>;

export const useJsonLd = (nodes: MaybeRefOrGetter<JsonLdNode | JsonLdNode[]>): void => {

   const script = computed(() => {

      const value = toValue(nodes);

      const graph = Array.isArray(value) ? value : [value];

      return JSON.stringify({
         "@context": "https://schema.org",
         "@graph": graph.map(node => ({ ...node })),
      });

   });

   useHead({
      script: [
         {
            type: "application/ld+json",
            innerHTML: script,
         },
      ],
   });

};

/** Organization node reused across the site (publisher / identity). */
export const organizationNode = (): JsonLdNode => ({
   "@type": "Organization",
   "@id": `${SITE_URL}/#organization`,
   name: "Devanilayam",
   url: SITE_URL,
   logo: `${SITE_URL}/icons/icon-512.png`,
   sameAs: [
      "https://www.facebook.com/devanilayam",
      "https://www.instagram.com/devanilayam",
      "https://www.youtube.com/@devanilayam",
      "https://twitter.com/devanilayam",
      "https://www.linkedin.com/company/devanilayam",
   ],
});
