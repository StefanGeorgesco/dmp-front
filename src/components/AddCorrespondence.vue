<!-- eslint-disable prettier/prettier -->
<template>
    <div ref="newCorrespondence" class="container">
        <form @submit.prevent="submitAddCorrespondence" @input="checkForm" class="row g-3" novalidate>
            <div class="col-md-12">
                <label class="form-label">* Médecin correspondant</label>
                <ObjectFinder object-type="doctor" :object-value="doctor?.id ? doctor : null" :object-rep-fn="toString"
                    :object-filter-fn="objectFilter" @new-selection="updateSelection" />
                <div class="error" :class="{ fieldError: doctorError }">
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
                <button class="btn btn-primary" type="submit"><i class="fa-solid fa-floppy-disk"></i> Créer</button>
            </div>
        </form>
        <br>
        <div class="col-12">
            <button @click="cancelAction" type="button" class="btn btn-light"><i class="fa-solid fa-xmark"></i>
                Annuler</button>
        </div>
    </div>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { nextTick } from 'vue';
import { mapActions, mapState } from "pinia";
import { useMessagesStore } from "../stores/messagesStore.js";
import { useAuthUserStore } from "../stores/authUserStore.js";
import { useLoaderStore } from '../stores/loaderStore';
import { Service } from "../services/services.js";
import ObjectFinder from "./ObjectFinder.vue";

export default {
    name: "AddCorrespondence",
    props: {
        patientFileId: {
            type: String,
            required: true,
        },
    },
    components: {
        ObjectFinder,
    },
    emits: ["correspondenceAdded", "canceled"],
    data() {
        return {
            correspondence: null,
            mustCheck: null,
            dateUntilPresentError: null,
            dateUntilFutureError: null,
            doctorError: null,
        };
    },
    mounted() {
        this.$refs.newCorrespondence.scrollIntoView(false);
    },
    computed: {
        doctor() {
            return {
                id: this.correspondence?.doctorId,
                firstname: this.correspondence?.doctorFirstname,
                lastname: this.correspondence?.doctorLastname,
                specialties: this.correspondence?.doctorSpecialties,
            };
        },
        ...mapState(useAuthUserStore, ["userId"]),
    },
    created() {
        this.reset();
    },
    methods: {
        reset() {
            this.correspondence = {
                dateUntil: null,
                doctorId: null,
                patientFileId: this.patientFileId,
            };
            this.mustCheck = false;
            this.dateUntilPresentError = false;
            this.dateUntilFutureError = false;
            this.doctorError = false;
        },
        updateSelection(selection) {
            this.correspondence.doctorId = selection?.id;
            this.correspondence.doctorFirstname = selection?.firstname;
            this.correspondence.doctorLastname = selection?.lastname;
            this.correspondence.doctorSpecialties = selection?.specialties.map((s) => s.description);
            this.checkForm();
        },
        checkForm() {
            if (this.mustCheck) {
                this.dateUntilPresentError = !this.correspondence.dateUntil;
                this.dateUntilFutureError = this.correspondence.dateUntil && new Date(this.correspondence.dateUntil) <= new Date();
                this.doctorError = !this.correspondence.doctorId;
            }

            return (!this.dateUntilPresentError && !this.dateUntilFutureError && !this.doctorError);
        },
        async submitAddCorrespondence() {
            this.mustCheck = true;
            if (this.checkForm()) {
                let id = this.setLoader();
                try {
                    await Service.addCorrespondence(this.correspondence);
                    this.reset();
                    this.$emit("correspondenceAdded");
                    this.setSuccessMessage("La correspondance a bien été créée.");
                }
                catch (error) {
                    if (error.response.data) {
                        if (error.response.status === 406) {
                            this.setErrorMessage(Object.values(error.response.data).join(", "));
                        } else {
                            this.setErrorMessage(error.response.data.message);
                        }
                    }
                } finally {
                    this.clearLoader(id);
                }
            } else {
                this.setErrorMessage("Les données saisies sont incorrectes.");
                nextTick(() => { document.querySelector(".fieldError")?.scrollIntoView(false); });
            }
        },
        cancelAction() {
            this.reset();
            this.$emit("canceled");
        },
        toString(o) {
            return `${o.firstname} ${o.lastname} (${o.id}) - ${o.specialties?.map(s => s.description ? s.description : s).join(", ")}`;
        },
        objectFilter(o) {
            return o.id !== this.userId;
        },
        ...mapActions(useMessagesStore, ["setErrorMessage", "setSuccessMessage"]),
        ...mapActions(useLoaderStore, ["setLoader", "clearLoader"]),
    },
}
</script>

<!-- eslint-disable prettier/prettier -->
<style scoped>
.container {
    background-color: aliceblue;
}
.error {
    display: none;
}

.error.fieldError {
    display: initial;
    color: red;
}
</style>