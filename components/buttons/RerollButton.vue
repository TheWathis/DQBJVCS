<template>
    <UButton
        id="reroll-button"
        color="orange"
        variant="outline"
        size="xl"
        @click="rerollBar"
        data-umami-event="reroll-pub"
        :data-umami-event-pub="bar.tags.name"
    >
        Reroll ({{ remainingRerolls }}/2)
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
    data() {
        return {
            remainingRerolls: 2,
        };
    },
    watch: {
        remainingRerolls() {
            if (this.remainingRerolls === 0) {
                // Disable reroll button
                const rerollButton = document.getElementById("reroll-button");
                if (rerollButton) {
                    rerollButton.disabled = true;
                }
            }
        },
    },
    methods: {
        /**
         * Reroll the bar.
         */
        rerollBar() {
            if (this.remainingRerolls === 0) return;
            // Emit an event to notify the parent
            this.$emit("barRerolled");
            this.remainingRerolls--;
        },
    },
};
</script>
