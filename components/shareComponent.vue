<template>
    <UButton
        v-if="canShare"
        id="share-button"
        color="blue"
        variant="outline"
        size="xl"
        @click="shareBar"
        data-umami-event="share-pub"
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
    computed: {
        canShare() {
            return !!navigator.share;
        },
    },
    methods: {
        async shareBar() {
            if (!this.bar) return;

            const shareData = {
                title: "Bar Recommendation",
                text: `Check out this bar: ${this.bar.tags.name}`,
                url: `https://maps.google.com/?q=${this.bar.lat},${this.bar.lon}`,
            };

            try {
                await navigator.share(shareData);
                console.log("Bar shared successfully");
            } catch (error) {
                console.error("Error sharing bar:", error);
            }
        },
    },
};
</script>
