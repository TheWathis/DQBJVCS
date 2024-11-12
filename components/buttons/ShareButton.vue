<template>
    <div
        v-if="canShare"
        @click="shareBar"
        data-umami-event="share-pub"
        :data-umami-event-pub="bar.tags.name"
        class="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
    >
        <Icon name="mdi:share-variant" class="h-6 w-6" />
    </div>
</template>

<script>
export default {
    props: {
        bar: {
            type: Object,
            required: true,
        },
    },
    computed: {
        canShare() {
            return !!navigator.share;
        },
    },
    methods: {
        async shareBar() {
            if (!this.bar) return;

            // Get address first
            const address = await this.getAddress(this.bar.lat, this.bar.lon);

            const shareData = {
                title: "Dans quel bar je vais ce soir ? 🍻",
                text: [
                    `Je vais au ${this.bar.tags.name} ! 🍻🎉`,
                    address ? `📍 : ${address}` : "",
                    "",
                    "Trouve ton prochain bar sur https://dansquelbarjevaiscesoir.fr",
                    "",
                ].join("\n"),
                url: `https://maps.google.com/?q=${this.bar.lat},${this.bar.lon}`,
            };

            try {
                await navigator.share(shareData);
            } catch (error) {
                console.error("Error sharing bar:", error);
            }
        },
        async getAddress(lat, lon) {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
                );
                const data = await response.json();
                return `${data.address.house_number || ""} ${data.address.road || ""}, ${data.address.city || ""}`;
            } catch (error) {
                console.error("Error getting address:", error);
                return null;
            }
        },
    },
};
</script>
