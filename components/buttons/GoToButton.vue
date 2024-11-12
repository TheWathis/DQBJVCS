<template>
    <UButton
        id="go-to-button"
        color="blue"
        variant="outline"
        size="xl"
        @click="openMap"
        data-umami-event="go-to-pub"
        :data-umami-event-pub="bar.tags.name"
        class="w-full md:w-auto"
    >
        Allons-y !
    </UButton>
</template>

<script>
export default {
    props: {
        bar: {
            type: Object,
            required: true,
        },
    },
    methods: {
        /**
         * Open the map with the bar's location
         */
        openMap() {
            if (!this.bar) return;
            const { lat, lon } = this.bar;
            const name = encodeURIComponent(this.bar.tags.name);

            // Check platform
            const isAndroid = /Android/i.test(navigator.userAgent);
            const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

            let mapsUrl;
            if (isAndroid) {
                // Android native maps
                mapsUrl = `geo:${lat},${lon}?q=${lat},${lon}(${name})`;
            } else if (isIOS) {
                // iOS Apple Maps
                mapsUrl = `maps:?q=${name}&ll=${lat},${lon}`;
            } else {
                // Default to Google Maps for others
                mapsUrl = `https://maps.google.com/?q=${name}&ll=${lat},${lon}`;
            }

            window.open(mapsUrl, "_blank");
        },
    },
};
</script>
