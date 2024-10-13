<template>
    <div>
        <div v-if="errorMessage" class="sm:text-2xl text-1xl mx-4">
            <p>
                {{ errorMessage }}
            </p>
            <div v-if="canBeFixed">
                <br />
                <p class="mb-4">Pas de soucis, on va se la faire à l'ancienne !</p>
                <div class="flex items-center">
                    <UInput icon="i-heroicons-map-pin" color="orange" variant="outline" size="xl" v-model="address"
                        placeholder="Où est-ce qu'on se trouve ?" class="flex-grow mr-2" />
                    <UButton :loading="loading" color="orange" variant="solid" size="xl" @click="fetchBarsByAddress">
                        Rechercher
                    </UButton>
                </div>
            </div>
        </div>
        <div v-else-if="randomBar">
            <p>{{ randomBar.properties.name }} !</p>
        </div>
        <div v-else>
            <p>En recherche du bar...</p>
        </div>
    </div>
</template>

<script>
import { fetchNearbyBars, fetchBarsByAddress } from '~/server/placesService';

export default {
    data() {
        return {
            bars: [],
            randomBar: null,
            errorMessage: '',
            address: '',
            loading: false,
            canBeFixed: false
        };
    },
    async mounted() {
        if (!navigator.geolocation) {
            this.errorMessage = 'La géolocalisation n\'est pas supportée par ce navigateur.';
            console.error('Geolocation is not supported by this browser.');
            this.canBeFixed = true;
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                console.debug(position);
                const { latitude, longitude } = position.coords;
                const radius = 3000;
                const limit = 20;
                try {
                    const data = await fetchNearbyBars(longitude, latitude, radius, limit);
                    // Remove bars without a name
                    data.features = data.features.filter(bar => bar.properties.name);

                    if (data.features.length === 0) {
                        this.errorMessage = 'Aucun bar n\'a été trouvé. On déménage dans une autre ville !';
                        console.info('No bars found nearby.');
                        this.canBeFixed = false;
                        return;
                    }

                    this.bars = data.features;
                    this.randomBar = this.getRandomBar();
                } catch (error) {
                    this.errorMessage = 'Erreur lors de la récupération des bars. On va dans un bar au hasard !';
                    console.error('Error fetching bars:', error);
                    this.canBeFixed = false;
                }
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    this.errorMessage = 'Il nous faut la géolocalisation pour faire fonctionner l\'application.';
                    console.error('User denied geolocation.');
                    this.canBeFixed = true;
                    return;
                }
                this.errorMessage = 'Erreur lors de l\'obtention de la position actuelle.';
                console.error('Error getting current position:', error);
                this.canBeFixed = true;
            }
        );
    },
    watch: {
        errorMessage() {
            this.loading = false;
        }
    },
    methods: {
        /**
         * Get a random bar from the list.
         * @returns {Object} A random bar.
         */
        getRandomBar() {
            if (this.bars.length === 0) return null;
            const randomIndex = Math.floor(Math.random() * this.bars.length);
            return this.bars[randomIndex];
        },
        /**
         * Fetch bars by address.
         */
        async fetchBarsByAddress() {
            if (!this.address) {
                this.errorMessage = 'Il nous faut une adresse.';
                return;
            }

            this.loading = true;

            try {
                const limit = 20;
                const data = await fetchBarsByAddress(this.address, limit);
                // Remove bars without a name
                data.features = data.features.filter(bar => bar.properties.name);

                if (data.features.length === 0) {
                    this.errorMessage = 'Aucun bar n\'a été trouvé proche de cette adresse.';
                    console.error('No bars found near this address.');
                    this.canBeFixed = true;
                    return;
                }

                this.bars = data.features;
                this.randomBar = this.getRandomBar();
                this.errorMessage = '';
            } catch (error) {
                this.errorMessage = 'Erreur lors de la récupération des bars. On va dans un bar au hasard !';
                console.error('Error fetching bars:', error);
                this.canBeFixed = false;
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>