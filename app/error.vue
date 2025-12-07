<template>
    <MyHeader />
    <SideMenu />
    <main class="page error-page">
        <div class="error-content">
            <h1>Something went wrong</h1>
            <p v-if="error">
                <strong>Error:</strong> {{ error?.message || error?.statusMessage || 'An unexpected error occurred.' }}
            </p>
            <p v-else>
                An unexpected error occurred.
            </p>
            <my-button @click="goHome">Go back to Home Page</my-button>
        </div>
    </main>
    <MyFooter />
</template>

<script setup lang="ts">

const props = defineProps<{ error?: any }>();

const router = useRouter();

const goHome = () => {

    router.replace({ path: "/" });

};

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
        background: #fffbe8; // soft yellow, lighter background
        border: 1px solid #ffe4b5; // soft orange border (moccasin)
        border-radius: 0.75rem;
        box-shadow: 0 2px 12px rgba(255, 152, 0, 0.08); // soft orange shadow

        h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: #fb8c00; // vivid orange (Material orange 600)
        }

        p {
            font-size: 1.15rem;
            margin-bottom: 1.5rem;
            color: #ad6500; // dark orange for text
        }
    }
}
</style>
