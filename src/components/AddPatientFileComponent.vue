<!-- eslint-disable prettier/prettier -->
<template>
    <div class="container">
        <h2>Ajouter un dossier patient</h2>
    </div>
    <br>
    <div class="container" :hidden="created">
        <form @submit.prevent="submitAddPatientFile" @input="checkForm" class="row g-3 needs-validation" novalidate>
            <div class="col-md-4">
                <label for="id" class="form-label">* Identifiant</label>
                <input v-model.trim="patientFile.id" type="text" class="form-control" id="id" required>
                <div class="error" :class="{ fieldError: idError }">
                    L'identifiant est obligatoire.
                </div>
            </div>
            <div class="col-md-4">
                <label for="prenom" class="form-label">* Prénom</label>
                <input v-model.trim="patientFile.firstname" type="text" class="form-control" id="prenom" required>
                <div class="error" :class="{ fieldError: firstnameError }">
                    Le prénom est obligatoire.
                </div>
            </div>
            <div class="col-md-4">
                <label for="nom" class="form-label">* Nom</label>
                <input v-model.trim="patientFile.lastname" type="text" class="form-control" id="nom" required>
                <div class="error" :class="{ fieldError: lastnameError }">
                    Le nom est obligatoire.
                </div>
            </div>
            <div></div>
            <div class="col-md-4">
                <label for="date_de_naissance" class="form-label">* Date de naissance</label>
                <input v-model.trim="patientFile.dateOfBirth" type="date" class="form-control" id="date_de_naissance"
                    required>
                <div class="error" :class="{ fieldError: dateOfBirthPresentError }">
                    La date de naissance est obligatoire.
                </div>
                <div class="error" :class="{ fieldError: dateOfBirthPastOrPresentError }">
                    La date de naissance ne peut pas être dans le futur.
                </div>
            </div>
            <div class="col-md-4">
                <label for="telephone" class="form-label">* Numéro de téléphone</label>
                <input v-model.trim="patientFile.phone" type="text" class="form-control" id="telephone" required>
                <div class="error" :class="{ fieldError: phoneError }">
                    Le numéro de téléphone est obligatoire.
                </div>
            </div>
            <div class="col-md-4">
                <label for="email" class="form-label">* Adresse e-mail</label>
                <input v-model="patientFile.email" type="mail" class="form-control" id="email" required>
                <div class="error" :class="{ fieldError: emailPresentError }">
                    L'adresse email est obligatoire.
                </div>
                <div class="error" :class="{ fieldError: emailFormatError }">
                    L'adresse email doit respecter le format.
                </div>
            </div>
            <div></div>
            <fieldset>
                <legend>Adresse</legend>
                <div class="col-md-4">
                    <label for="rue1" class="form-label">* Numéro et voie</label>
                    <input v-model.trim="patientFile.address.street1" type="text" class="form-control" id="rue1"
                        required>
                    <div class="error" :class="{ fieldError: street1Error }">
                        La voie est obligatoire.
                    </div>
                </div>
                <div class="col-md-4">
                    <label for="rue2" class="form-label">Complément d'adresse</label>
                    <input v-model.trim="patientFile.address.street2" type="text" class="form-control" id="rue2">
                </div>
                <div class="col-md-4">
                    <label for="commune" class="form-label">* Commune</label>
                    <input v-model.trim="patientFile.address.city" type="text" class="form-control" id="commune"
                        required>
                    <div class="error" :class="{ fieldError: cityError }">
                        La commune est obligatoire.
                    </div>
                </div>
                <div class="col-md-4">
                    <label for="etat" class="form-label">Etat ou région</label>
                    <input v-model.trim="patientFile.address.state" type="text" class="form-control" id="etat">
                </div>
                <div class="col-md-4">
                    <label for="code_postal" class="form-label">* Code postal</label>
                    <input v-model.trim="patientFile.address.zipcode" type="text" class="form-control" id="code_postal"
                        required>
                    <div class="error" :class="{ fieldError: zipcodeError }">
                        Le code postal est obligatoire.
                    </div>
                </div>
                <div class="col-md-4">
                    <label for="pays" class="form-label">* Pays</label>
                    <input v-model.trim="patientFile.address.country" type="text" class="form-control" id="pays"
                        required>
                    <div class="error" :class="{ fieldError: countryError }">
                        Le pays est obligatoire.
                    </div>
                </div>
            </fieldset>
            <div class="col-12">
                <button class="btn btn-primary" type="submit">Entrer</button>
            </div>
        </form>
    </div>
    <div :hidden="!created">
        <div class="container">
            <div>{{ creationMessage }} <span id="code">{{ creationCode }}</span></div>
        </div>
        <div></div><br>
        <div class="container">
            <RouterLink to="/" type="button" class="btn btn-light">Retour</RouterLink>
        </div>
    </div>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { Service } from "../services/services.js";
import { useMessagesStore } from "../stores/messagesStore";
import { mapActions } from "pinia";

export default {
    name: "AddPatientFileComponent",
    data() {
        return {
            created: false,
            creationMessage: "",
            creationCode: "",
            patientFile: {
                id: "",
                firstname: "",
                lastname: "",
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
    methods: {
        checkForm() {
            this.patientFile.id = this.patientFile.id.toUpperCase();
            if (this.mustCheck) {
                this.idError = !this.patientFile.id;
                this.firstnameError = !this.patientFile.firstname;
                this.lastnameError = !this.patientFile.lastname;
                this.phoneError = !this.patientFile.phone;
                this.emailPresentError = !this.patientFile.email;
                this.emailFormatError = this.patientFile.email &&!new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'g').test(this.patientFile.email);
                this.street1Error = !this.patientFile.address.street1;
                this.cityError = !this.patientFile.address.city;
                this.zipcodeError = !this.patientFile.address.zipcode;
                this.countryError = !this.patientFile.address.country;
                this.dateOfBirthPresentError = !this.patientFile.dateOfBirth;
                this.dateOfBirthPastOrPresentError = new Date(this.patientFile.dateOfBirth) > new Date();
                this.referringDoctorIdError = !this.patientFile.referringDoctorId;

                return (
                    !this.IdError &&
                    !this.firstnameError &&
                    !this.lastnameError &&
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
            }
        },
        async submitAddPatientFile() {
            this.mustCheck = true;
            if (this.checkForm()) {
                try {
                    let response = await Service.addPatientFile(this.patientFile);
                    this.setSuccessMessage("Le dossier patient a bien été créé.");
                    this.creationMessage = `Le dossier patient ${response.data.id} pour ${response.data.firstname} ${response.data.lastname} a bien été créé. Veuillez transmettre ce code secret au patient afin qu'il puisse créer sont compte : `;
                    this.creationCode = `${response.data.securityCode}`;
                    this.created = true;
                } catch (error) {
                    console.error(error);
                    if (error.response.status === 406) {
                        this.setErrorMessage(Object.values(error.response.data).join(", "));
                    } else {
                        this.setErrorMessage(error.response.data.message);
                    }
                }
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
