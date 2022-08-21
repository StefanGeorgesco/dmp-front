<!-- eslint-disable vue/no-mutating-props -->
<!-- eslint-disable prettier/prettier -->
<template>
    <div class="container" :class="{ highlighted: item.editing }">
        <form @submit.prevent="submitSaveItem" @input="checkForm" class="row g-3 needs-validation" novalidate>
            <div class="col-md-4">
                <label for="item_type" class="form-label"><span v-show="item.editing && !item.id">*</span> Type</label>
                <select v-model="item['@type']" :disabled="item.id" id="item_type" class="form-control">
                    <option v-for="t in types" :key="t.value" :value="t.value" v-text="t.name" :disabled="!t.value">
                    </option>
                </select>
                <div class="error" :class="{ fieldError: typeError }">
                    Le type est obligatoire.
                </div>
            </div>
            <div class="col-md-4">
                <label for="item_date" class="form-label"><span v-show="item.editing && !item.id">*</span> Date</label>
                <input v-model="item.date" type="date" class="form-control" id="item_date" :readonly="item.id" />
                <div class="error" :class="{ fieldError: datePresentError }">
                    La date est obligatoire.
                </div>
                <div class="error" :class="{ fieldError: datePastOrPresentError }">
                    La date ne peut pas être dans le futur.
                </div>
            </div>
            <div v-if="item.id" class="col-md-12">
                <i>Créé par {{ item.authoringDoctorFirstname }} {{ item.authoringDoctorLastname }}
                    ({{ item.authoringDoctorId }})
                    - Spécialité{{ item.authoringDoctorSpecialties.length > 1 ? "s" : "" }} : {{
                    item.authoringDoctorSpecialties.join(", ")
                    }}</i>
            </div>
            <div class="col-md-12">
                <label for="item_comments" class="form-label">Commentaires</label>
                <textarea v-model.trim="item.comments" id="item_comments" class="form-control"
                    :readonly="!item.editing"></textarea>
            </div>
            <template v-if="item['@type'] === 'act'">
                <label class="form-label"><span v-show="item.editing">*</span> Acte dispensé</label>
                <ObjectFinder objectType="medical-act" :preSelection="item.medicalAct"
                    :objectRepFn="(o) => `${o.id} - ${o.description}`" :objectFilterFn="(o) => true"
                    :finderState="objectFinderSate" :disabled="!item.editing"
                    @newSelection="selectMedicalAct($event, selection)" />
                <div class="error" :class="{ fieldError: medicalActError }">
                    L'acte médical dispensé est obligatoire.
                </div>
            </template>
            <template v-if="item['@type'] === 'diagnosis'">
                <label class="form-label"><span v-show="item.editing">*</span> Maladie diagnostiquée</label>
                <ObjectFinder objectType="disease" :preSelection="item.disease"
                    :objectRepFn="(o) => `${o.id} - ${o.description}`" :objectFilterFn="(o) => true"
                    :finderState="objectFinderSate" :disabled="!item.editing"
                    @newSelection="selectDisease($event, selection)" />
                <div class="error" :class="{ fieldError: diseaseError }">
                    La maladie diagnostiquée est obligatoire.
                </div>
            </template>
            <template v-if="item['@type'] === 'mail'">
                <label class="form-label"><span v-show="item.editing">*</span> Médecin destinataire</label>
                <ObjectFinder objectType="doctor" :preSelection="item.recipientDoctorId ? {
                    id: item.recipientDoctorId,
                    firstname: item.recipientDoctorFirstname,
                    lastname: item.recipientDoctorLastname,
                    specialties: null,
                } : null"
                    :objectRepFn="(o) => `${o.firstname} ${o.lastname} (${o.id}) - ${o.specialties?.map(s => s.description).join(', ')}`"
                    :objectFilterFn="(o) => true" :finderState="objectFinderSate" :disabled="!item.editing"
                    @newSelection="selectRecipientDoctor($event, selection)" />
                <div class="error" :class="{ fieldError: recipientDoctorIdError }">
                    Le médecin destinataire est obligatoire.
                </div>
                <label for="mail_text" class="form-label"><span v-show="item.editing">*</span> Texte</label>
                <textarea v-model.trim="item.text" id="mail_text" class="form-control"
                    :readonly="!item.editing"></textarea>
                <div class="error" :class="{ fieldError: textError }">
                    Le texte du courrier est obligatoire.
                </div>
            </template>
            <div class="col-12">
                <button v-show="item.editing" class="btn btn-primary" type="submit">Enregistrer</button>
            </div>
        </form>
        <button v-show="!globalEditing && !item.editing && isAuthor" class="btn btn-primary" type="button"
            @click="item.editing = true; $emit('editingStart');">Modifier</button>
        <br>
        <button v-show="item.editing" class="btn btn-light" type="button"
            @click="item.editing = false; $emit('editingEnd'); objectFinderSate.counter++;">Annuler</button>
        <br><br>
    </div>
    <hr>
</template>

<!-- eslint-disable vue/no-mutating-props -->
<!-- eslint-disable prettier/prettier -->
<script>
import { mapActions, mapState } from "pinia";
import { useMessagesStore } from "../stores/messagesStore.js";
import { useAuthUserStore } from "../stores/authUserStore.js";
import { Service } from "../services/services.js";
import ObjectFinder from "./ObjectFinder.vue";

export default {
    name: "ItemComponent",
    props: ["item", "globalEditing"],
    emits: ["editingStart", "editingEnd"],
    components: {
        ObjectFinder,
    },
    data() {
        return {
            types: [
                {
                    name: "Choisir...",
                    value: null,
                },
                {
                    name: "Acte",
                    value: "act",
                },
                {
                    name: "Diagnostic",
                    value: "diagnosis",
                },
                {
                    name: "Courrier",
                    value: "mail",
                },
                {
                    name: "Prescription",
                    value: "prescription",
                },
                {
                    name: "Symptôme",
                    value: "symptom",
                },
            ],
            mustCheck: false,
            typeError: false,
            datePresentError: false,
            datePastOrPresentError: false,
            medicalActError: false,
            diseaseError: false,
            recipientDoctorIdError: false,
            textError: false,
            descriptionError: false,
            objectFinderSate: {
                counter: 0,
            },
        };
    },
    computed: {
        isAuthor() {
            return this.item.authoringDoctorId === this.userId;
        },
        ...mapState(useAuthUserStore, ["userId"]),
    },
    methods: {
        checkForm() {
            if (this.mustCheck) {
                this.typeError = !this.item["@type"];
                this.datePresentError = !this.item.date;
                this.datePastOrPresentError = this.item.date && new Date(this.item.date) > new Date();
                this.medicalActError = this.item["@type"] === "act" && !this.item.medicalAct?.id;
                this.diseaseError = this.item["@type"] === "diagnosis" && !this.item.disease?.id;
                this.recipientDoctorIdError = this.item["@type"] === "mail" && !this.item.recipientDoctorId;
                this.textError = this.item["@type"] === "mail" && !this.item.text;
                this.descriptionError = ["prescription", "symptom"].includes(this.item["@type"]) && !this.item.description;
            }

            return (
                !this.typeError &&
                !this.datePresentError &&
                !this.datePastOrPresentError &&
                !this.medicalActError &&
                !this.diseaseError &&
                !this.recipientDoctorIdError &&
                !this.textError &&
                !this.descriptionError);
        },
        selectMedicalAct(selection) {
            this.item.medicalAct = selection;
            this.checkForm();
        },
        selectDisease(selection) {
            this.item.disease = selection;
            this.checkForm();
        },
        selectRecipientDoctor(selection) {
            this.item.recipientDoctorId = selection?.id;
            this.checkForm();
        },
        async submitSaveItem() {
            this.mustCheck = true;

            if (this.checkForm()) {
                let service;
                let action;

                if (this.item.id) {
                    service = Service.updateItem;
                    action = "modifié";
                } else {
                    service = Service.addItem;
                    action = "créé"
                }

                try {
                    await service(this.item);
                    this.item.editing = false;
                    this.$emit("editingEnd");
                    this.setSuccessMessage(`L'élément a bien été ${action}.`);
                } catch (error) {
                    if (error.response.data) {
                        if (error.response.status === 406) {
                            this.setErrorMessage(Object.values(error.response.data).join(", "));
                        } else {
                            this.setErrorMessage(error.response.data.message);
                        }
                    }
                } finally {
                    this.objectFinderSate.counter++;
                }
            }
        },
        toString(o) {
            return `${o.id} - ${o.description}`;
        },
        ...mapActions(useMessagesStore, ["setErrorMessage", "setSuccessMessage"]),
    },
}
</script>

<!-- eslint-disable prettier/prettier -->
<style scoped>
[readonly],
[disabled] {
    outline: none;
    border: none;
}

select[disabled] {
    background-color: white;
}

label,
div>i {
    font-weight: 100;
}

.highlighted {
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