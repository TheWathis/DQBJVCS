<template>
    <UModal v-model="isOpen">
        <UCard>
            <template #header>
                <div class="text-2xl font-bold">À propos</div>
            </template>
            <div class="text-base font-normal">
                <p>
                    "Dans quel bar je vais ce soir ?" est ton compagnon idéal
                    pour découvrir le bar parfait pour ta soirée !
                </p>

                <p>
                    Grâce aux données OpenStreetMap, on te proposons une
                    sélection de bars à proximité. Plus besoin de te prendre la
                    tête pour choisir où aller !
                </p>

                <p>Personnalise ton expérience :</p>
                <ul>
                    <li>
                        • Masque les établissements qui ne t'intéressent pas
                    </li>
                    <li>• Gère facilement ta liste de bars masqués</li>
                </ul>

                <p>Alors, prêt à découvrir ton nouveau bar favori ? 🍻</p>
            </div>
        </UCard>
    </UModal>
</template>

<script>
export default {
    props: {
        modelValue: Boolean,
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
};
</script>
