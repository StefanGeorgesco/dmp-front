<!-- eslint-disable prettier/prettier -->
<template>
    <div class="container">
        <form @submit.prevent="submitAddCorrespondence" @input="checkForm" class="row g-3" novalidate>
            <div class="col-md-12">
                <label class="form-label">* Médecin correspondant</label>
                <ObjectFinderComponent objectType="doctor" :objectRepFn="toString" :finderState="objectFinderSate"
                    :objectFilterFn="objectFilter" @newSelection="updateSelection($event, selection)" />
                <div class="error" :class="{ fieldError: doctorPresentError }">
                    Le médecin est obligatoire.
                </div>
            </div>
            <div class="col-md-12">
                <label class="form-label" for="dateUntil">* Jusqu'au</label>
                <input @change="($event) => $event.target.blur()" class="form-control"
                    v-model="correspondence.dateUntil" type="date" id="dateUntil" required>
                <div class="error" :class="{ fieldError: dateUntilPresentError }">
                    La date est obligatoire.
                </div>
                <div class="error" :class="{ fieldError: dateUntilFutureError }">
                    La date doit être dans le futur.
                </div>
            </div>
            <div class="col-12">
                <button class="btn btn-primary" type="submit">Créer</button>
            </div>
        </form>
        <br>
        <div class="col-12">
            <button @click="cancelAction" type="button" class="btn btn-light">Annuler</button>
        </div>
    </div>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { mapActions, mapState } from "pinia";
import { useMessagesStore } from "../stores/messagesStore.js";
import { useAuthUserStore } from "../stores/authUserStore.js";
import { Service } from "../services/services.js";
import ObjectFinderComponent from "./ObjectFinderComponent.vue";

export default {
    name: "AddCorrespondence",
    props: ["patientFileId"],
    components: {
        ObjectFinderComponent,
    },
    emits: ["correspondenceAdded", "canceled"],
    data() {
        return {
            correspondence: {
                dateUntil: null,
                doctorId: "",
            },
            mustCheck: false,
            dateUntilPresentError: false,
            dateUntilFutureError: false,
            doctorPresentError: false,
            objectFinderSate: {
                counter: 0,
            },
        };
    },
    methods: {
        checkForm() {
            if (this.mustCheck) {
                this.dateUntilPresentError = !this.correspondence.dateUntil;
                this.dateUntilFutureError = this.correspondence.dateUntil && new Date(this.correspondence.dateUntil) <= new Date();
                this.doctorPresentError = !this.correspondence.doctorId;
            }
            return (!this.dateUntilPresentError && !this.dateUntilFutureError && !this.doctorPresentError);
        },
        updateSelection(selection) {
            this.correspondence.doctorId = selection?.id;
            this.checkForm();
        },
        async submitAddCorrespondence() {
            this.mustCheck = true;
            if (this.checkForm()) {
                try {
                    await Service.addCorrespondence(this.patientFileId, this.correspondence);
                    this.clear();
                    this.$emit("correspondenceAdded");
                    this.objectFinderSate.counter++;
                    this.setSuccessMessage("La correspondance a bien été créée.");
                }
                catch (error) {
                    if (error.response.status === 406) {
                        this.setErrorMessage(Object.values(error.response.data).join(", "));
                    }
                    else {
                        this.setErrorMessage(error.response.data.message);
                    }
                }
            }
        },
        cancelAction() {
            this.clear();
            this.$emit('canceled');
            this.objectFinderSate.counter++;
        },
        clear() {
            this.correspondence = {
                dateUntil: null,
                doctorId: "",
            };
            this.mustCheck = false;
            this.dateUntilPresentError = false;
            this.dateUntilFutureError = false;
            this.doctorPresentError = false;
        },
        toString(o) {
            return `${o.firstname} ${o.lastname} (${o.id}) - ${o.specialties.map(s => s.description).join(", ")}`;
        },
        objectFilter(o) {
            return o.id !== this.userId;
        },
        ...mapActions(useMessagesStore, ["setErrorMessage", "setSuccessMessage"]),
    },
    computed: {
        ...mapState(useAuthUserStore, ["userId"]),
    },
}
</script>

<!-- eslint-disable prettier/prettier -->
<style>
.error {
    display: none;
}

.error.fieldError {
    display: initial;
    color: red;
}
</style>