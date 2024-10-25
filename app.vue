<script setup lang="ts">
import RandomBar from "./components/randomBar.vue";

useHead({
    htmlAttrs: {
        lang: 'fr',
    }
})
</script>

<template>
    <div>
        <div
            class="antialiased bg-white dark:bg-black dark:text-white flex flex-col items-center justify-center min-h-screen place-content-center sm:text-base text-black text-sm">
            <h1 class="dark:text-white font-semibold sm:text-5xl text-4xl text-black text-center mb-8">
                Dans quel bar je vais ce soir ?
            </h1>
            <div class="dark:text-white font-semibold sm:text-4xl text-3xl text-black text-center mt-8 lg:w-1/2 w-full">
                <RandomBar />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: "App",
    mounted() {
        const script = document.createElement("script");
        script.async = true;
        script.defer = true;
        script.src = "https://umami.wathis.com/script.js";
        script.setAttribute("data-website-id", "931fa87c-714d-40de-974a-a62149db4899");
        document.head.appendChild(script);
        document.title = "DQBJVCS";
    },
};
</script>
