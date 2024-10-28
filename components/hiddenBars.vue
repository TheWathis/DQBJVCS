<template>
    <UModal v-model="isOpen" @show="loadHiddenBars">
        <UCard>
            <template #header>
                <div class="text-2xl font-bold">Bars masqués</div>
            </template>
            <div v-if="hiddenBars.length === 0" class="text-base font-normal">
                Aucun bar masqué
            </div>
            <div v-else class="text-base font-normal">
                <ul class="list-disc list-inside">
                    <li
                        v-for="bar in hiddenBars"
                        :key="bar"
                        class="flex items-center justify-between mb-2"
                    >
                        {{ bar }}
                        <UButton
                            color="orange"
                            variant="outline"
                            size="sm"
                            @click="unhideBar(bar)"
                            data-umami-event="unhide-pub"
                            :data-umami-event-pub="bar"
                        >
                            Restaurer
                        </UButton>
                    </li>
                </ul>
            </div>
        </UCard>
    </UModal>
</template>

<script>
export default {
    props: {
        modelValue: Boolean,
    },
    data() {
        return {
            hiddenBars: [],
        };
    },
    computed: {
        isOpen: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit("update:modelValue", value);
            },
        },
    },
    mounted() {
        this.loadHiddenBars();
        window.addEventListener("storage", this.loadHiddenBars);
    },
    beforeUnmount() {
        window.removeEventListener("storage", this.loadHiddenBars);
    },
    methods: {
        loadHiddenBars() {
            this.hiddenBars = JSON.parse(
                localStorage.getItem("ignoredBar") || "[]",
            );
        },
        unhideBar(barName) {
            let ignoredBars = JSON.parse(
                localStorage.getItem("ignoredBar") || "[]",
            );
            ignoredBars = ignoredBars.filter((bar) => bar !== barName);
            localStorage.setItem("ignoredBar", JSON.stringify(ignoredBars));
            this.loadHiddenBars();
            this.$emit("bar-unhidden");
        },
    },
};
</script>
