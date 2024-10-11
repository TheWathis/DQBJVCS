<!-- pages/index.vue -->
<template>
    <div>
        <div v-if="errorMessage">
            <p>{{ errorMessage }}</p>
        </div>
        <div v-else-if="randomBar">
            <p>{{ randomBar.properties.name }} !</p>
        </div>
        <div v-else>
            <p>Chargement...</p>
        </div>
    </div>
</template>

<script>
import { fetchNearbyBars } from '~/server/placesService';

export default {
    data() {
        return {
            bars: [],
            randomBar: null,
            errorMessage: ''
        };
    },
    async mounted() {
        if (!navigator.geolocation) {
            this.errorMessage = 'La géolocalisation n\'est pas supportée par ce navigateur.';
            console.error('Geolocation is not supported by this browser.');
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
                    if (data.features.length === 0) {
                        this.errorMessage = 'Aucun bar n\'a été trouvé.';
                        console.error('No bars found nearby.');
                        return;
                    }

                    this.bars = data.features;
                    this.randomBar = this.getRandomBar();
                } catch (error) {
                    this.errorMessage = 'Erreur lors de la récupération des bars : ' + error.message;
                    console.error('Error fetching bars:', error);
                }
            },
            (error) => {
                this.errorMessage = 'Erreur lors de l\'obtention de la position actuelle : ' + error.message;
                console.error('Error getting current position:', error);
            }
        );
    },
    methods: {
        getRandomBar() {
            if (this.bars.length === 0) return null;
            const randomIndex = Math.floor(Math.random() * this.bars.length);
            return this.bars[randomIndex];
        }
    }
};
</script>