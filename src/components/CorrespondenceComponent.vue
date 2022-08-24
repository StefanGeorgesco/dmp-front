<!-- eslint-disable prettier/prettier -->
<template>
    <div class="card col-md-12" style="with: 100%;">
        <div class="card-body">
            <h6 class="card-title">Médecin : {{ correspondence.doctorFirstname }}
                {{ correspondence.doctorLastname }} ({{ correspondence.doctorId }})</h6>
            <p><i>{{ correspondence.doctorSpecialties.join(", ") }}</i></p>
            <p class="card-text">
                Jusqu'au : {{ new Date(correspondence.dateUntil).toLocaleDateString() }}
            </p>
            <button v-if="canDelete" type="button" class="btn btn-danger" data-bs-toggle="modal"
                :data-bs-target="'#deleteModal-' + correspondence.id">
                <i class="fa-solid fa-trash-can"></i> Supprimer
            </button>
        </div>
    </div>
    <div class="modal fade" :id="'deleteModal-' + correspondence.id" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Suppression</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                        ref="modalClose"></button>
                </div>
                <div class="modal-body">
                    <p>
                        Confirmez-vous la suppression de la correspondance du médecin
                        {{ correspondence.doctorId }} - {{ correspondence.doctorFirstname }}
                        {{ correspondence.doctorLastname }} qui était prévue jusqu'au
                        {{ new Date(correspondence.dateUntil).toLocaleDateString() }} ?
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                    <button @click="deleteCorrespondence" type="button" class="btn btn-primary"
                        ref="confirm">Confirmer</button>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { mapActions } from "pinia";
import { useMessagesStore } from "../stores/messagesStore.js";
import { Service } from "../services/services.js";

export default {
    name: "CorrespondenceComponent",
    props: {
        correspondence: {
            type: Object,
            required: true,
        },
        canDelete: {
            type: Boolean,
            required: true,
        },
    },
    emits: ["correspondenceUpdated"],
    methods: {
        async deleteCorrespondence() {
            this.$refs.modalClose.click();
            try {
                await Service.deleteCorrespondence(this.correspondence);
                this.$emit("correspondenceUpdated");
                this.setSuccessMessage("La correspondance a bien été supprimée.");
            } catch (error) {
                if (error.response.data) {
                    this.setErrorMessage(error.response.data.message);
                }
            }
        },
        ...mapActions(useMessagesStore, ["setErrorMessage", "setSuccessMessage"]),
    },
}
</script>

<!-- eslint-disable prettier/prettier -->
<style>
.card {
    margin: 0.5rem;
}
</style>