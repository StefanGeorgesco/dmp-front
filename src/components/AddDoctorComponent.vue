<!-- eslint-disable prettier/prettier -->
<template>
    <div class="container">
        <h2>Ajouter un médecin</h2>
    </div>
    <br>
    <div class="container" :hidden="created">
        <form @submit.prevent="submitAddDoctor" @input="checkForm" class="row g-3 needs-validation" novalidate>
            <div class="col-md-4">
                <label for="id" class="form-label">* Identifiant</label>
                <input v-model.trim="doctor.id" type="text" class="form-control" id="id" required>
                <div class="error" :class="{ fieldError: idError }">
                    L'identifiant est obligatoire.
                </div>
            </div>
            <div class="col-md-4">
                <label for="prenom" class="form-label">* Prénom</label>
                <input v-model.trim="doctor.firstname" type="text" class="form-control" id="prenom" required>
                <div class="error" :class="{ fieldError: firstnameError }">
                    Le prénom est obligatoire.
                </div>
            </div>
            <div class="col-md-4">
                <label for="nom" class="form-label">* Nom</label>
                <input v-model.trim="doctor.lastname" type="text" class="form-control" id="nom" required>
                <div class="error" :class="{ fieldError: lastnameError }">
                    Le nom est obligatoire.
                </div>
            </div>
            <div></div>
            <div class="col-md-12">
                <label class="form-label">* Spécialités</label>
                <TagSelectorComponent @newSelection="updateSelection($event, selection)"
                    :options="specialties" />
                <div class="error" :class="{ fieldError: specialtiesError }">
                    Le médecin doit avoir au moins une spécialité.
                </div>
            </div>
            <div></div>
            <div class="col-md-4">
                <label for="telephone" class="form-label">* Numéro de téléphone</label>
                <input v-model.trim="doctor.phone" type="text" class="form-control" id="telephone" required>
                <div class="error" :class="{ fieldError: phoneError }">
                    Le numéro de téléphone est obligatoire.
                </div>
            </div>
            <div class="col-md-4">
                <label for="email" class="form-label">* Adresse e-mail</label>
                <input v-model="doctor.email" type="mail" class="form-control" id="email" required>
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
                    <input v-model.trim="doctor.address.street1" type="text" class="form-control" id="rue1" required>
                    <div class="error" :class="{ fieldError: street1Error }">
                        La voie est obligatoire.
                    </div>
                </div>
                <div class="col-md-4">
                    <label for="rue2" class="form-label">Complément d'adresse</label>
                    <input v-model.trim="doctor.address.street2" type="text" class="form-control" id="rue2">
                </div>
                <div class="col-md-4">
                    <label for="commune" class="form-label">* Commune</label>
                    <input v-model.trim="doctor.address.city" type="text" class="form-control" id="commune" required>
                    <div class="error" :class="{ fieldError: cityError }">
                        La commune est obligatoire.
                    </div>
                </div>
                <div class="col-md-4">
                    <label for="etat" class="form-label">Etat ou région</label>
                    <input v-model.trim="doctor.address.state" type="text" class="form-control" id="etat">
                </div>
                <div class="col-md-4">
                    <label for="code_postal" class="form-label">* Code postal</label>
                    <input v-model.trim="doctor.address.zipcode" type="text" class="form-control" id="code_postal"
                        required>
                    <div class="error" :class="{ fieldError: zipcodeError }">
                        Le code postal est obligatoire.
                    </div>
                </div>
                <div class="col-md-4">
                    <label for="pays" class="form-label">* Pays</label>
                    <input v-model.trim="doctor.address.country" type="text" class="form-control" id="pays" required>
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
import TagSelectorComponent from "./TagSelectorComponent.vue";

export default {
    name: "AddDoctorComponent",
    components: {
        TagSelectorComponent,
    },
    data() {
        return {
            created: false,
            creationMessage: "",
            creationCode: "",
            specialties: [],
            doctor: {
                id: "",
                firstname: "",
                lastname: "",
                specialties: [],
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
            phoneError: false,
            emailPresentError: false,
            emailFormatError: false,
            street1Error: false,
            cityError: false,
            zipcodeError: false,
            countryError: false,
        }
    },
    computed: {
        filteredSpecialties() {
            return this.specialties.filter(specialty => specialty.id.toLowerCase().indexOf(this.specialtySearchText.toLowerCase()) !== -1 ||
                specialty.description.toLowerCase().indexOf(this.specialtySearchText.toLowerCase()) !== -1
            );
        },
    },
    async created() {
        try {
            let response = await Service.getSpecialties();
            this.specialties = response.data;
        } catch (error) {
            this.setErrorMessage(error.response.data.message);
        }

    },
    methods: {
        updateSelection(selection) {
            this.doctor.specialties = selection;
            this.checkForm();
        },
        checkForm() {
            this.doctor.id = this.doctor.id.toUpperCase();
            if (this.mustCheck) {
                this.idError = !this.doctor.id;
                this.firstnameError = !this.doctor.firstname;
                this.lastnameError = !this.doctor.lastname;
                this.specialtiesError = this.doctor.specialties.length < 1;
                this.phoneError = !this.doctor.phone;
                this.emailPresentError = !this.doctor.email;
                this.emailFormatError = this.doctor.email && !new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'g').test(this.doctor.email);
                this.street1Error = !this.doctor.address.street1;
                this.cityError = !this.doctor.address.city;
                this.zipcodeError = !this.doctor.address.zipcode;
                this.countryError = !this.doctor.address.country;
                this.referringDoctorIdError = !this.doctor.referringDoctorId;

                return (
                    !this.IdError &&
                    !this.firstnameError &&
                    !this.lastnameError &&
                    !this.specialtiesError &&
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
        async submitAddDoctor() {
            this.mustCheck = true;
            if (this.checkForm()) {
                try {
                    let response = await Service.addDoctor(this.doctor);
                    this.setSuccessMessage("Le médecin a bien été créé.");
                    this.creationMessage = `Le dossier ${response.data.id} pour ${response.data.firstname} ${response.data.lastname} a bien été créé. Veuillez transmettre ce code secret au médecin afin qu'il puisse créer sont compte : `;
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
