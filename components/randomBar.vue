<template>
    <div>
        <div v-if="errorMessage" class="sm:text-2xl text-1xl mx-4">
            <p>
                {{ errorMessage }}
            </p>
            <div v-if="canBeFixed">
                <br />
                <p class="mb-4">
                    Pas de soucis, on va se la faire à l'ancienne !
                </p>
                <div class="flex items-center">
                    <UInput
                        icon="i-heroicons-map-pin"
                        color="orange"
                        variant="outline"
                        size="xl"
                        v-model="address"
                        placeholder="Où est-ce qu'on se trouve ?"
                        class="flex-grow mr-2"
                        @keyup.enter="fetchBarsByAddress"
                    />
                    <UButton
                        :loading="loading"
                        color="orange"
                        variant="solid"
                        size="xl"
                        @click="fetchBarsByAddress"
                        data-umami-event="manual-search"
                    >
                        Rechercher
                    </UButton>
                </div>
            </div>
        </div>
        <div v-else-if="randomBar">
            <div class="flex items-center justify-center gap-2">
                <p>{{ randomBar.tags.name }} !</p>
                <ShareButton :bar="randomBar" />
            </div>
            <!-- Desktop -->
            <div class="hidden md:grid grid-cols-3 gap-4 mt-8 mx-4">
                <div class="flex justify-start">
                    <HideButton :bar="randomBar" @barHidden="getRandomBar" />
                </div>

                <div class="flex justify-center">
                    <RerollButton
                        :bar="randomBar"
                        @barRerolled="getRandomBar"
                    />
                </div>

                <div class="flex justify-end">
                    <GoToButton :bar="randomBar" />
                </div>
            </div>
            <!-- Mobile -->
            <div class="md:hidden flex flex-col gap-4 mt-8 mx-4">
                <RerollButton :bar="randomBar" @barRerolled="getRandomBar" />

                <div class="grid grid-cols-2 gap-4">
                    <HideButton :bar="randomBar" @barHidden="getRandomBar" />

                    <ShareButton :bar="randomBar" class="w-full" />
                </div>
            </div>
        </div>
        <div v-else>
            <p>En recherche du bar...</p>
        </div>
    </div>
</template>

<script>
import { fetchNearbyBars, fetchBarsByAddress } from "~/server/placesService";
import GoToButton from "~/components/buttons/GoToButton.vue";
import HideButton from "~/components/buttons/HideButton.vue";
import RerollButton from "~/components/buttons/RerollButton.vue";
import ShareButton from "~/components/buttons/ShareButton.vue";

export default {
    components: {
        GoToButton,
        HideButton,
        RerollButton,
        ShareButton,
    },
    data() {
        return {
            bars: [],
            randomBar: null,
            errorMessage: "",
            address: "",
            loading: false,
            canBeFixed: false,
        };
    },
    async mounted() {
        if (!navigator.geolocation) {
            this.errorMessage =
                "La géolocalisation n'est pas supportée par ce navigateur.";
            console.error("Geolocation is not supported by this browser.");
            this.canBeFixed = true;
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const radius = 3000;
                const limit = 20;
                try {
                    let data = await fetchNearbyBars(
                        longitude,
                        latitude,
                        radius,
                        limit,
                    );
                    // Remove bars without a name
                    data = data.filter((bar) => bar.tags.name);

                    if (data.length === 0) {
                        this.errorMessage =
                            "Aucun bar n'a été trouvé. On déménage dans une autre ville !";
                        console.info("No bars found nearby.");
                        this.canBeFixed = false;
                        return;
                    }

                    this.bars = data;
                    this.getRandomBar();
                } catch (error) {
                    this.errorMessage =
                        "Erreur lors de la récupération des bars. On va dans un bar au hasard !";
                    console.error("Error fetching bars:", error);
                    this.canBeFixed = false;
                }
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    this.errorMessage =
                        "Il nous faut la géolocalisation pour faire fonctionner l'application.";
                    console.error("User denied geolocation.");
                    this.canBeFixed = true;
                    return;
                }
                this.errorMessage =
                    "Erreur lors de l'obtention de la position actuelle.";
                console.error("Error getting current position:", error);
                this.canBeFixed = true;
            },
        );
    },
    watch: {
        errorMessage() {
            this.loading = false;
        },
    },
    methods: {
        /**
         * Get a random bar from the list.
         * @returns {Object} A random bar.
         */
        getRandomBar() {
            // Fail-safe (can't call this method if there are no bars fetched)
            if (this.bars.length === 0) {
                this.randomBar = null;
                return;
            }
            let ignoredBars = JSON.parse(
                localStorage.getItem("ignoredBar") || "[]",
            );

            const availableBars = this.bars.filter((bar) => {
                return !ignoredBars.includes(bar.tags.name);
            });
            if (availableBars.length === 0) {
                // Should fetch new bars from the API
                this.randomBar = null;
                return;
            }

            const randomIndex = Math.floor(
                Math.random() * availableBars.length,
            );
            const randomBar = availableBars[randomIndex];

            // Fail-safe (should not happen, but just in case)
            if (!randomBar.tags.name) {
                this.getRandomBar();
                return;
            }
            // Do not show the same bar twice in a row
            if (randomBar.tags.name === this.randomBar?.tags.name) {
                this.getRandomBar();
                return;
            }
            this.randomBar = randomBar;
        },
        /**
         * Fetch bars by address.
         */
        async fetchBarsByAddress() {
            if (!this.address) {
                this.errorMessage = "Il nous faut une adresse.";
                return;
            }

            this.loading = true;

            try {
                const limit = 20;
                let data = await fetchBarsByAddress(this.address, limit);
                // Remove bars without a name
                data = data.filter((bar) => bar.tags.name);

                if (data.length === 0) {
                    this.errorMessage =
                        "Aucun bar n'a été trouvé proche de cette adresse.";
                    console.error("No bars found near this address.");
                    this.canBeFixed = true;
                    return;
                }

                this.bars = data;
                this.getRandomBar();
                this.errorMessage = "";
            } catch (error) {
                this.errorMessage =
                    "Erreur lors de la récupération des bars. On va dans un bar au hasard !";
                console.error("Error fetching bars:", error);
                this.canBeFixed = false;
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>
