<!-- eslint-disable prettier/prettier -->
<template>
    <div class="container">
        <h2>Créer un dossier {{ type === "doctor" ? "de médecin" : "patient" }}</h2>
    </div>
    <br>
    <div class="container" :hidden="created">
        <form @submit.prevent="submitAddFile" @input="editing = true; checkForm()" class="row g-3 needs-validation"
            novalidate>
            <div class="col-md-4">
                <label for="id" class="form-label">* Identifiant</label>
                <input v-model.trim="file.id" type="text" class="form-control" id="id" required>
                <div class="error" :class="{ fieldError: idError }">
                    L'identifiant est obligatoire.
                </div>
            </div>
            <div class="col-md-4">
                <label for="prenom" class="form-label">* Prénom</label>
                <input v-model.trim="file.firstname" type="text" class="form-control" id="prenom" required>
                <div class="error" :class="{ fieldError: firstnameError }">
                    Le prénom est obligatoire.
                </div>
            </div>
            <div class="col-md-4">
                <label for="nom" class="form-label">* Nom</label>
                <input v-model.trim="file.lastname" type="text" class="form-control" id="nom" required>
                <div class="error" :class="{ fieldError: lastnameError }">
                    Le nom est obligatoire.
                </div>
            </div>
            <div></div>
            <div v-if="type === 'doctor'" class="col-md-12">
                <label class="form-label">* Spécialités</label>
                <TagSelector @new-selection="updateSelection" :options="specialties" />
                <div class="error" :class="{ fieldError: specialtiesError }">
                    Le médecin doit avoir au moins une spécialité.
                </div>
            </div>
            <div v-if="type === 'patientFile'" class="col-md-4">
                <label for="date_de_naissance" class="form-label">* Date de naissance</label>
                <input @change="($event) => $event.target.blur()" v-model="file.dateOfBirth" type="date"
                    class="form-control" id="date_de_naissance" required>
                <div class="error" :class="{ fieldError: dateOfBirthPresentError }">
                    La date de naissance est obligatoire.
                </div>
                <div class="error" :class="{ fieldError: dateOfBirthPastOrPresentError }">
                    La date de naissance ne peut pas être dans le futur.
                </div>
            </div>
            <div></div>
            <div class="col-md-4">
                <label for="telephone" class="form-label">* Numéro de téléphone</label>
                <input v-model.trim="file.phone" type="text" class="form-control" id="telephone" required>
                <div class="error" :class="{ fieldError: phoneError }">
                    Le numéro de téléphone est obligatoire.
                </div>
            </div>
            <div class="col-md-4">
                <label for="email" class="form-label">* Adresse e-mail</label>
                <input v-model="file.email" type="mail" class="form-control" id="email" required>
                <div class="error" :class="{ fieldError: emailPresentError }">
                    L'adresse email est obligatoire.
                </div>
                <div class="error" :class="{ fieldError: emailFormatError }">
                    L'adresse email doit respecter le format.
                </div>
            </div>
            <div></div>
            <fieldset class="row g-3">
                <legend>Adresse</legend>
                <div class="col-md-4">
                    <label for="rue1" class="form-label">* Numéro et voie</label>
                    <input v-model.trim="file.address.street1" type="text" class="form-control" id="rue1" required>
                    <div class="error" :class="{ fieldError: street1Error }">
                        La voie est obligatoire.
                    </div>
                </div>
                <div class="col-md-4">
                    <label for="rue2" class="form-label">Complément d'adresse</label>
                    <input v-model.trim="file.address.street2" type="text" class="form-control" id="rue2">
                </div>
                <div class="col-md-4">
                    <label for="commune" class="form-label">* Commune</label>
                    <input v-model.trim="file.address.city" type="text" class="form-control" id="commune" required>
                    <div class="error" :class="{ fieldError: cityError }">
                        La commune est obligatoire.
                    </div>
                </div>
                <div class="col-md-4">
                    <label for="etat" class="form-label">Etat ou région</label>
                    <input v-model.trim="file.address.state" type="text" class="form-control" id="etat">
                </div>
                <div class="col-md-4">
                    <label for="code_postal" class="form-label">* Code postal</label>
                    <input v-model.trim="file.address.zipcode" type="text" class="form-control" id="code_postal"
                        required>
                    <div class="error" :class="{ fieldError: zipcodeError }">
                        Le code postal est obligatoire.
                    </div>
                </div>
                <div class="col-md-4">
                    <label for="pays" class="form-label">* Pays</label>
                    <input v-model.trim="file.address.country" type="text" class="form-control" id="pays" required>
                    <div class="error" :class="{ fieldError: countryError }">
                        Le pays est obligatoire.
                    </div>
                </div>
            </fieldset>
            <div class="col-12">
                <button class="btn btn-primary" type="submit"><i class="fa-solid fa-floppy-disk"></i> Créer</button>
            </div>
        </form>
        <br>
        <div class="col-12">
            <button @click="$router.go(-1);" type="button" class="btn btn-light">
                <i class="fa-solid fa-right-from-bracket"></i> Retour</button>
        </div>
        <br>
    </div>
    <div class="container" :hidden="!created">
        <div class="col-12">
            <div>{{ creationMessage }} <span id="code">{{ creationCode }}</span></div>
        </div>
        <br>
        <div class="col-12">
            <button @click="$router.go(-1);" type="button" class="btn btn-light">
                <i class="fa-solid fa-right-from-bracket"></i> Retour</button>
        </div>
        <br>
    </div>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { Service } from "../services/services.js";
import { useMessagesStore } from "../stores/messagesStore";
import { mapActions } from "pinia";
import TagSelector from "./TagSelector.vue";

export default {
    name: "AddFile",
    components: {
        TagSelector,
    },
    props: {
        type: {
            type: String,
            required: true,
            validator(value) {
                return ["patientFile", "doctor"].includes(value);
            },
        },
    },
    data() {
        return {
            editing: false,
            created: false,
            creationMessage: "",
            creationCode: "",
            specialties: [],
            file: {
                id: "",
                firstname: "",
                lastname: "",
                specialties: [],
                dateOfBirth: "",
                phone: "",
                email: "",
                address: {
                    street1: "",
                    street2: "",
                    city: "",
                    state: "",
                    zipcode: "",
                    country: "",
                },
            },
            mustCheck: false,
            idError: false,
            firstnameError: false,
            lastnameError: false,
            specialtiesError: false,
            dateOfBirthPresentError: false,
            dateOfBirthPastOrPresentError: false,
            phoneError: false,
            emailPresentError: false,
            emailFormatError: false,
            street1Error: false,
            cityError: false,
            zipcodeError: false,
            countryError: false,
        }
    },
    async created() {
        if (this.type === "doctor") {
            try {
                let response = await Service.getSpecialties();
                this.specialties = response.data;
            } catch (error) {
                if (error.response.data) {
                    this.setErrorMessage(error.response.data.message);
                }
            }
        }
    },
    beforeRouteLeave(to) {
        if (to.name !== "login" && this.editing) {
            const answer = window.confirm("Voulez-vous vraiment quitter la page ? Les données saisies seront perdues.")
            if (!answer)
                return false;
        }
    },
    methods: {
        updateSelection(selection) {
            this.file.specialties = selection;
            this.checkForm();
        },
        checkForm() {
            this.file.id = this.file.id.toUpperCase();

            if (this.mustCheck) {
                this.idError = !this.file.id;
                this.firstnameError = !this.file.firstname;
                this.lastnameError = !this.file.lastname;
                this.specialtiesError = this.type === "doctor" && this.file.specialties.length < 1;
                this.dateOfBirthPresentError = this.type === "patientFile" && !this.file.dateOfBirth;
                this.dateOfBirthPastOrPresentError = this.type === "patientFile" && this.file.dateOfBirth && new Date(this.file.dateOfBirth) > new Date();
                this.phoneError = !this.file.phone;
                this.emailPresentError = !this.file.email;
                this.emailFormatError = this.file.email && !new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'g').test(this.file.email);
                this.street1Error = !this.file.address.street1;
                this.cityError = !this.file.address.city;
                this.zipcodeError = !this.file.address.zipcode;
                this.countryError = !this.file.address.country;
            }

            return (
                !this.IdError &&
                !this.firstnameError &&
                !this.lastnameError &&
                !this.specialtiesError &&
                !this.dateOfBirthPresentError &&
                !this.dateOfBirthPastOrPresentError &&
                !this.phoneError &&
                !this.emailPresentError &&
                !this.emailFormatError &&
                !this.street1Error &&
                !this.cityError &&
                !this.zipcodeError &&
                !this.countryError
            );
        },
        async submitAddFile() {
            this.mustCheck = true;
            if (this.checkForm()) {
                let service;
                if (this.type === "doctor") {
                    service = Service.addDoctor;
                } else {
                    service = Service.addPatientFile;
                }
                try {
                    let response = await service(this.file);
                    this.setSuccessMessage(`Le dossier ${this.type === "doctor" ? "de médecin" : "patient"} a bien été créé.`);
                    this.creationMessage = `Le dossier ${this.type === "doctor" ? "de médecin" : "patient"} ${response.data.id} pour ${response.data.firstname} ${response.data.lastname} a bien été créé. Veuillez transmettre ce code secret au ${this.type === "doctor" ? "médecin" : "patient"} afin qu'il puisse créer sont compte : `;
                    this.creationCode = `${response.data.securityCode}`;
                    this.created = true;
                    this.editing = false;
                } catch (error) {
                    if (error.response.data) {
                        if (error.response.status === 406) {
                            this.setErrorMessage(Object.values(error.response.data).join(", "));
                        } else {
                            this.setErrorMessage(error.response.data.message);
                        }
                    }
                }
            } else {
                this.setErrorMessage("Certaines données saisies sont manquantes ou incorrectes.");
                document.querySelector(".fieldError")?.scrollIntoView();
            }
        },
        ...mapActions(useMessagesStore, ["setErrorMessage", "setSuccessMessage"]),
    },
};
</script>

<style scoped>
.error {
    display: none;
}

.error.fieldError {
    display: initial;
    color: red;
}

#code {
    color: blue;
}
</style>
