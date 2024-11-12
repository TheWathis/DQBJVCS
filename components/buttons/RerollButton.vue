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
        Reroll ({{ remainingRerolls }}/{{ maxRerolls }})
    </UButton>
</template>

<script>
export default {
    props: {
        bar: {
            type: Object,
            required: true,
        },
        maxRerolls: {
            type: Number,
            default: 2,
        },
    },
    data() {
        return {
            remainingRerolls: this.maxRerolls,
        };
    },
    mounted() {
        this.updateDisableReroll();
    },
    watch: {
        remainingRerolls() {
            updateDisableReroll();
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
        /**
         * Disable the button if there are no more rerolls.
         */
        updateDisableReroll() {
            if (this.remainingRerolls === 0) {
                // Disable reroll button
                const rerollButton = document.getElementById("reroll-button");
                if (rerollButton) {
                    rerollButton.disabled = true;
                }
            }
        },
    },
};
</script>
