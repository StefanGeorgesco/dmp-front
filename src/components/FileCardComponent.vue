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
                <p>
                    Médecin référent : {{ file.referringDoctorId }} - {{ file.referringDoctorFirstname }}
                    {{ file.referringDoctorLastname }} ({{ file.referringDoctorSpecialties.join(", ") }})
                </p>
                <RouterLink v-if="role === 'DOCTOR' && canEditKnown && canEdit" :to="viewFileUrl"
                    class="btn btn-primary"><i class="fa-solid fa-pen"></i>
                </RouterLink>
            </template>
            <p v-else-if="type === 'doctor'" class="card-text">
                {{ file.specialties.map(s => s.description).join(", ") }}
            </p>
            <button v-if="role === 'ADMIN'" type="button" class="btn btn-primary" data-bs-toggle="modal"
                data-bs-target="#deleteModal">
                <i class="fa-solid fa-trash-can"></i>
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

export default {
    name: "FileCardComponent",
    emits: ["fileDeleted", "close"],
    props: ["type", "file"],
    data() {
        return {
            canEditKnown: false,
            canEdit: null,
        };
    },
    components: {
        RouterLink,
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
        async deleteFile() {
            this.$refs.modalClose.click();
            let service;
            if (this.type ==="doctor") {
                service = Service.deleteDoctor;
            } else {
                service = Service.deletePatientFile;
            }
            try {
                await service(this.file.id);
                this.$emit("fileDeleted");
                this.setSuccessMessage(`Le dossier ${ this.type === "doctor" ? "de docteur" : "patient"} ${this.file.id} a bien été supprimé, ainsi que le compte utilisateur associé.`)
            } catch (error) {
                this.setErrorMessage(`Le dossier ${this.type === "doctor" ? "de docteur" : "patient"} ne peut pas être supprimé.${this.type === "doctor" ? " Il doit être référencé dans au moins un dossier patient." : ""}`);
            }
        },
        async updateCanEdit() {
            if (this.role === "DOCTOR" && this.type === "patientFile") {
                try {
                    await Service.getCorrespondences(this.file.id);
                    this.canEdit = true;
                } catch (error) {
                    this.canEdit = false;
                }
                this.canEditKnown = true;
            }
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
</style>
