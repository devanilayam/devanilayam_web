<template>
   <div class="og">
      <div class="og__rays" />

      <div class="og__body">
         <div class="og__eyebrow">
            {{ eyebrow }}
         </div>

         <div class="og__title">
            {{ title }}
         </div>

         <div v-if="description" class="og__description">
            {{ description }}
         </div>
      </div>

      <div class="og__footer">
         <div class="og__wordmark">
            Devanilayam
         </div>
         <div class="og__url">
            devanilayam.com
         </div>
      </div>
   </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
   title?: string
   description?: string
   eyebrow?: string
}>(), {
   title: "Devanilayam",
   description: "",
   eyebrow: "",
});
</script>

<style scoped>
/* Inline, self-contained styles. Satori renders only a subset of CSS — flexbox
   only, no grid, no blur — and resolves neither SCSS nor the design tokens the
   site uses, so the palette is repeated literally here. These hex values mirror
   $color-map / the brand constants in assets/scss/tokens; change them together.

   The "… OG" families are the static TTF faces declared in nuxt.config's
   `fonts.families` — Satori reads neither WOFF2 nor variable fonts, so it
   cannot use the ones the browser gets. The Indic faces are listed on every
   text element so a Telugu or Devanagari title renders glyphs, not tofu. */
.og {
   position: relative;
   width: 100%;
   height: 100%;
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   padding: 72px 80px;
   background-color: #FAF8F3;
   color: #2D2A23;
}

/* A brand wash bled in from the corner so the card is not a flat block.
   Pushed well off-canvas on purpose: Satori has no blur, so a circle sitting
   fully in frame reads as a hard disc rather than a glow. */
.og__rays {
   position: absolute;
   top: -260px;
   right: -220px;
   width: 680px;
   height: 680px;
   border-radius: 680px;
   background-color: #EB730C;
   opacity: 0.12;
}

.og__body {
   display: flex;
   flex-direction: column;
}

.og__eyebrow {
   display: flex;
   font-family: "Noto Sans OG", "Noto Sans Telugu OG", "Noto Sans Devanagari OG";
   font-size: 28px;
   letter-spacing: 4px;
   text-transform: uppercase;
   color: #EB730C;
   margin-bottom: 28px;
}

.og__title {
   display: flex;
   font-family: "Merriweather OG", "Noto Sans Telugu OG", "Noto Sans Devanagari OG";
   font-size: 76px;
   font-weight: 700;
   line-height: 1.1;
   color: #2D2A23;
}

.og__description {
   display: flex;
   font-family: "Noto Sans OG", "Noto Sans Telugu OG", "Noto Sans Devanagari OG";
   font-size: 32px;
   line-height: 1.4;
   color: #6B6760;
   margin-top: 28px;
}

.og__footer {
   display: flex;
   align-items: center;
   justify-content: space-between;
   border-top: 2px solid rgba(45, 42, 35, 0.12);
   padding-top: 28px;
}

.og__wordmark {
   display: flex;
   font-family: "Merriweather OG", "Noto Sans Telugu OG", "Noto Sans Devanagari OG";
   font-size: 36px;
   font-weight: 700;
   color: #EB730C;
}

.og__url {
   display: flex;
   font-family: "Noto Sans OG", "Noto Sans Telugu OG", "Noto Sans Devanagari OG";
   font-size: 26px;
   color: #6B6760;
}
</style>
