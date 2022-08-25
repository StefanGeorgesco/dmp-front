<!-- eslint-disable prettier/prettier -->
<template>
    <div class="card col-md-4">
        <div class="card-body">
            <h5 class="card-title">{{ file.id }} - {{ file.firstname }} {{ file.lastname }}</h5>
            <h6 class="card-subtitle mb-2 text-muted">{{ type === "doctor" ? "Médecin" : "Patient" }}</h6>
            <template v-if="type === 'patientFile'">
                <p class="card-text">
                    Date de naissance : {{ new Date(file.dateOfBirth).toLocaleDateString() }}
                </p>
                <p v-if="!updatingReferringDoctor">
                    Médecin référent : {{ file.referringDoctorId }} - {{ file.referringDoctorFirstname }}
                    {{ file.referringDoctorLastname }} ({{ file.referringDoctorSpecialties.join(", ") }})
                    <span v-if="role === 'ADMIN'" @click="updatingReferringDoctor = true" class="btn btn-primary"><i
                            class="fa-solid fa-pen"></i> Modifier le médecin</span>
                </p>
                <div v-else class="container">
                    <form @submit.prevent="submitUpdateReferringDoctor" @input="checkForm" class="row g-3" novalidate>
                        <div class="col-md-12"></div>
                        <ObjectFinder @new-selection="updateDoctorSelection" object-type="doctor" :object-value="{
                            id: file.referringDoctorId,
                            firstname: file.referringDoctorFirstname,
                            lastname: file.referringDoctorLastname,
                            specialties: file.referringDoctorSpecialties
                        }" :object-rep-fn="toString" :object-filter-fn="objectFilter" />
                        <div class="col-12">
                            <button class="btn btn-primary" type="submit"><i class="fa-solid fa-floppy-disk"></i>
                                Enregistrer</button>
                        </div>
                    </form>
                    <div class="error" :class="{ fieldError: doctorPresentError }">
                        Le médecin est obligatoire.
                    </div>
                    <br>
                    <div class="col-12">
                        <button @click="cancelEditReferringDoctorAction" type="button" class="btn btn-light"><i
                                class="fa-solid fa-xmark"></i> Annuler</button>
                    </div>
                </div>
                <RouterLink v-if="role === 'DOCTOR' && canEditKnown && canEdit" :to="viewFileUrl"
                    class="btn btn-primary"><i class="fa-solid fa-pen"></i> Editer
                </RouterLink>
            </template>
            <p v-else-if="type === 'doctor'" class="card-text">
                {{ file.specialties.map(s => s.description).join(", ") }}
            </p>
            <button v-if="role === 'ADMIN' && !updatingReferringDoctor" type="button" class="btn btn-danger"
                data-bs-toggle="modal" data-bs-target="#deleteModal">
                <i class="fa-solid fa-trash-can"></i> Supprimer le dossier
            </button>
            <span @click="$emit('close')"></span>
        </div>
    </div>
    <div class="modal fade" id="deleteModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteModalLabel">Suppression</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                        ref="modalClose"></button>
                </div>
                <div class="modal-body">
                    <p>Confirmez-vous la suppression du dossier {{ file.id }} - {{ file.firstname }} {{ file.lastname }}
                        ?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                    <button @click="deleteFile" type="button" class="btn btn-primary" ref="confirm">Confirmer</button>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { RouterLink } from "vue-router";
import { mapState, mapActions } from "pinia";
import { useAuthUserStore } from "../stores/authUserStore.js";
import { useMessagesStore } from "../stores/messagesStore.js";
import { Service } from "../services/services.js";
import ObjectFinder from "./ObjectFinder.vue";

export default {
    name: "FileCard",
    emits: ["fileDeleted", "close", "referringDoctorUpdated"],
    props: {
        type: {
            type: String,
            required: true,
            validator(value) {
                return ["patientFile", "doctor"].includes(value);
            },
        },
        file: {
            type: Object,
            required: true,
        },
    },
    components: {
        ObjectFinder, RouterLink,
    },
    data() {
        return {
            canEditKnown: false,
            canEdit: null,
            updatingReferringDoctor: false,
            referringDoctor: {
                id: "",
            },
            mustCheck: false,
            doctorPresentError: false,
        };
    },
    async created() {
        this.updateCanEdit();
    },
    watch: {
        async file() {
            this.canEditKnown = false;
            this.canEdit = null;
            this.updateCanEdit();
        },
    },
    computed: {
        viewFileUrl() {
            return `/view-${this.type === "doctor" ? "doctor" : "patient-file"}/${this.file.id}`;
        },
        ...mapState(useAuthUserStore, ["role"]),
    },
    methods: {
        checkForm() {
            if (this.mustCheck) {
                this.doctorPresentError = !this.correspondence.doctorId;
            }
            return (!this.doctorPresentError);
        },
        async deleteFile() {
            this.$refs.modalClose.click();
            let service;
            if (this.type === "doctor") {
                service = Service.deleteDoctor;
            } else {
                service = Service.deletePatientFile;
            }
            try {
                await service(this.file.id);
                this.$emit("fileDeleted");
                this.setSuccessMessage(`Le dossier ${this.type === "doctor" ? "de médecin" : "patient"} ${this.file.id} a bien été supprimé, ainsi que le compte utilisateur associé.`)
            } catch (error) {
                if (error.response.data) {
                    this.setErrorMessage(`Le dossier ${this.type === "doctor" ? "de médecin" : "patient"} ne peut pas être supprimé.${this.type === "doctor" ? " Il doit être référencé dans au moins un dossier patient." : ""}`);
                }
            }
        },
        async updateCanEdit() {
            if (this.role === "DOCTOR" && this.type === "patientFile") {
                try {
                    await Service.getCorrespondences(this.file.id);
                    this.canEdit = true;
                } catch (error) {
                    this.canEdit = false;
                } finally {
                    this.canEditKnown = true;
                }
            }
        },
        updateDoctorSelection(selection) {
            this.referringDoctor = selection;
        },
        async submitUpdateReferringDoctor() {
            try {
                await Service.updateReferringDoctor(this.file.id, this.referringDoctor);
                this.setSuccessMessage("Le médecin référent a bien été modifié.");
                this.updatingReferringDoctor = false;
                this.clearReferringDoctor();
                this.$emit("referringDoctorUpdated", this.file);
            } catch (error) {
                this.canEdit = false;
                if (error.response.data) {
                    if (error.response.status === 406) {
                        this.setErrorMessage(Object.values(error.response.data).join(", "));
                    } else {
                        this.setErrorMessage(error.response.data.message);
                    }
                }
            }
        },
        cancelEditReferringDoctorAction() {
            this.clearReferringDoctor();
            this.updatingReferringDoctor = false;
        },
        clearReferringDoctor() {
            this.referringDoctor = {
                id: "",
            };
        },
        toString(o) {
            return `${o.firstname} ${o.lastname} (${o.id}) - ${o.specialties.map(s => s.description ? s.description : s).join(", ")}`;
        },
        objectFilter(o) {
            return o.id !== this.file.referringDoctorId;
        },
        ...mapActions(useMessagesStore, ["setErrorMessage", "setSuccessMessage"]),
    },
};
</script>

<!-- eslint-disable prettier/prettier -->
<style>
.card-body {
    position: relative;
}

.card-body>span {
    cursor: pointer;
}

.card-body>span:after {
    position: absolute;
    right: 1rem;
    top: .5rem;
    display: inline-block;
    content: "\00d7";
    margin: 0 0 0 1em;
    font-size: x-large;
    font-weight: bold;
}

.error {
    display: none;
}

.error.fieldError {
    display: initial;
    color: red;
}
</style>
