<script setup lang="ts">
import RandomBar from "./components/RandomBar.vue";

useHead({
    htmlAttrs: {
        lang: "fr",
    },
});
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <nav
            class="w-full py-4 px-6 bg-white dark:bg-black border-b dark:border-gray-800"
        >
            <div class="flex justify-between items-center">
                <!-- Left side - Address -->
                <div
                    v-if="currentAddress"
                    class="text-sm text-gray-600 dark:text-gray-400"
                >
                    {{ currentAddress }}
                </div>
                <div v-else class="invisible"><!-- Placeholder --></div>
                <!-- Right side - Actions -->
                <div class="flex justify-end gap-4">
                    <UButton
                        color="gray"
                        variant="ghost"
                        @click="showHiddenBars = true"
                    >
                        Voir les bars cachés
                    </UButton>
                    <UButton
                        color="gray"
                        variant="ghost"
                        @click="showAboutModal = true"
                    >
                        À propos
                    </UButton>
                </div>
            </div>
        </nav>
        <div
            class="antialiased bg-white dark:bg-black dark:text-white flex-1 flex flex-col items-center justify-center sm:text-base text-black text-sm"
        >
            <h1
                class="dark:text-white font-semibold sm:text-5xl text-4xl text-black text-center mb-8"
            >
                Dans quel bar je vais ce soir ?
            </h1>
            <div
                class="dark:text-white font-semibold sm:text-4xl text-3xl text-black text-center mt-8 lg:w-1/2 w-full"
            >
                <RandomBar ref="randomBar" @address-updated="updateAddress" />
            </div>
        </div>

        <!-- Footer with copyright -->
        <footer class="w-full py-4 text-center bg-white dark:bg-black">
            <div class="text-xs text-gray-500 dark:text-gray-400">
                Les données proviennent d'<a
                    href="https://www.openstreetmap.org/copyright"
                    target="_blank"
                    class="hover:underline"
                    >OpenStreetMap</a
                >
                © OpenStreetMap contributors
            </div>
        </footer>

        <AboutModal v-model="showAboutModal" />
        <HiddenBars
            v-model="showHiddenBars"
            @bar-unhidden="handleBarUnhidden"
        />
    </div>
</template>

<script lang="ts">
import AboutModal from "./components/AboutModal.vue";
import HiddenBars from "./components/HiddenBars.vue";

export default {
    name: "App",
    components: {
        AboutModal,
        HiddenBars,
    },
    data() {
        return {
            showAboutModal: false,
            showHiddenBars: false,
            currentAddress: "",
        };
    },
    mounted() {
        const script = document.createElement("script");
        script.async = true;
        script.defer = true;
        script.src = "https://umami.wathis.com/script.js";
        script.setAttribute(
            "data-website-id",
            "931fa87c-714d-40de-974a-a62149db4899",
        );
        document.head.appendChild(script);
        document.title = "DQBJVCS";
    },
    methods: {
        /**
         * Handles the event when a bar is unhidden from the hidden bars list.
         * Refreshes the random bar component to update the available bars.
         */
        handleBarUnhidden() {
            // Refresh the random bar component when a bar is unhidden
            if (this.$refs.RandomBar) {
                this.$refs.RandomBar.getRandomBar();
            }
        },
        /**
         * Updates the current address displayed in the header.
         * @param address The new address to display
         */
        updateAddress(address: string) {
            this.currentAddress = address;
        },
    },
};
</script>
