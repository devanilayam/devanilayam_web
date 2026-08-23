<template>
    <MyHeader />
    <SideMenu />
    <main class="page error-page">
        <div class="error-content">
            <h1>{{ heading }}</h1>
            <p>{{ message }}</p>
            <my-button @click="goHome">Go back to Home Page</my-button>
        </div>
    </main>
    <MyFooter />
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{ error?: NuxtError }>();

const isNotFound = computed(() => props.error?.statusCode === 404);

const heading = computed(() => (isNotFound.value ? "Page not found" : "Something went wrong"));

// Avoid leaking internal error details to users/crawlers; show a safe message.
const message = computed(() =>
    isNotFound.value
        ? "The page you are looking for doesn't exist or may have moved."
        : "An unexpected error occurred. Please try again later."
);

// Error pages must never be indexed.
useHead({
    title: computed(() => heading.value),
    meta: [{ name: "robots", content: "noindex, follow" }],
});

const goHome = (): Promise<void> => clearError({ redirect: "/" });

</script>

<style scoped lang="scss">
.error-page {
   flex: 1;
   display: flex;
   align-items: center;
   justify-content: center;

   .error-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      max-width: 440px;
      padding: 2rem;
      background: #FFFBE8; // soft yellow, lighter background
      border: 1px solid #FFE4B5; // soft orange border (moccasin)
      border-radius: 0.75rem;
      box-shadow: 0 2px 12px rgba(255, 152, 0, 0.08); // soft orange shadow

      h1 {
         font-size: 2rem;
         margin-bottom: 1rem;
         color: #FB8C00; // vivid orange (Material orange 600)
      }

      p {
         font-size: 1.15rem;
         margin-bottom: 1.5rem;
         color: #AD6500; // dark orange for text
      }
   }
}
</style>
