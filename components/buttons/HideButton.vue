<template>
    <UButton
        id="hide-button"
        color="red"
        variant="outline"
        size="xl"
        @click="hideBar"
        data-umami-event="hide-pub"
        :data-umami-event-pub="bar.tags.name"
    >
        Cache moi ce bar
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
         * Hide the current bar and get a new one.
         */
        hideBar() {
            if (!this.bar) return;

            if (localStorage.getItem("ignoredBar") === null) {
                localStorage.setItem("ignoredBar", JSON.stringify([]));
            }

            let ignoredBar = JSON.parse(localStorage.getItem("ignoredBar"));
            ignoredBar.push(this.bar.tags.name);
            localStorage.setItem("ignoredBar", JSON.stringify(ignoredBar));

            // Trigger storage event to update the list of ignored bars
            window.dispatchEvent(new Event("storage"));

            // Emit an event to notify the parent
            this.$emit("barHidden");
        },
    },
};
</script>
