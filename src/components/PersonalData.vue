<!-- eslint-disable prettier/prettier -->
<template>
  <div class="container">
    <h2>Données personnelles</h2>
  </div>
  <br>
  <div class="container">
    <form @submit.prevent="submitUpdateFile" @input="editing = true; checkForm()" class="row g-3 needs-validation"
      novalidate>
      <div class="col-md-4">
        <label for="id" class="form-label">Identifiant</label>
        <input v-model="file.id" type="text" class="form-control" id="id" readonly>
      </div>
      <div class="col-md-4">
        <label for="prenom" class="form-label">Prénom</label>
        <input v-model="file.firstname" type="text" class="form-control" id="prenom" readonly>
      </div>
      <div class="col-md-4">
        <label for="nom" class="form-label">Nom</label>
        <input v-model="file.lastname" type="text" class="form-control" id="nom" readonly>
      </div>
      <div></div>
      <div v-if="role === 'PATIENT'" class="col-md-4">
        <label for="date_de_naissance" class="form-label">Date de naissance</label>
        <input v-model="file.dateOfBirth" type="date" class="form-control" id="date_de_naissance" readonly>
      </div>
      <div v-if="role === 'DOCTOR'" class="col-md-12">
        <label class="form-label">Spécialités</label>
        <div class="tag-container" style="margin: 0;">
          <div class="tag" v-for="s in file.specialties" :key="s.id">
            {{ s.id }} - {{ s.description }}
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <label for="telephone" class="form-label"><span :style="{ visibility: (update ? 'visible' : 'hidden') }">*
          </span>Numéro de téléphone</label>
        <input v-model.trim="file.phone" type="text" class="form-control" id="telephone" required :readonly="!update">
        <div class="error" :class="{ fieldError: phoneError }">
          Le numéro de téléphone est obligatoire.
        </div>
      </div>
      <div class="col-md-4">
        <label for="email" class="form-label"><span :style="{ visibility: (update ? 'visible' : 'hidden') }">*
          </span>Adresse e-mail</label>
        <input v-model="file.email" type="mail" class="form-control" id="email" required :readonly="!update">
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
        <div class=" col-md-4">
          <label for="rue1" class="form-label"><span :style="{ visibility: (update ? 'visible' : 'hidden') }">*
            </span>Numéro et voie</label>
          <input v-model.trim="file.address.street1" type="text" class="form-control" id="rue1" required
            :readonly="!update">
          <div class="error" :class="{ fieldError: street1Error }">
            La voie est obligatoire.
          </div>
        </div>
        <div class="col-md-4">
          <label for="rue2" class="form-label">Complément d'adresse</label>
          <input v-model.trim="file.address.street2" type="text" class="form-control" id="rue2" :readonly="!update">
        </div>
        <div class="col-md-4">
          <label for="commune" class="form-label"><span :style="{ visibility: (update ? 'visible' : 'hidden') }">*
            </span>Commune</label>
          <input v-model.trim="file.address.city" type="text" class="form-control" id="commune" required
            :readonly="!update">
          <div class="error" :class="{ fieldError: cityError }">
            La commune est obligatoire.
          </div>
        </div>
        <div class="col-md-4">
          <label for="etat" class="form-label">Etat ou région</label>
          <input v-model.trim="file.address.state" type="text" class="form-control" id="etat" :readonly="!update">
        </div>
        <div class="col-md-4">
          <label for="code_postal" class="form-label"><span :style="{ visibility: (update ? 'visible' : 'hidden') }">*
            </span>Code postal</label>
          <input v-model.trim="file.address.zipcode" type="text" class="form-control" id="code_postal" required
            :readonly="!update">
          <div class="error" :class="{ fieldError: zipcodeError }">
            Le code postal est obligatoire.
          </div>
        </div>
        <div class="col-md-4">
          <label for="pays" class="form-label"><span :style="{ visibility: (update ? 'visible' : 'hidden') }">*
            </span>Pays</label>
          <input v-model.trim="file.address.country" type="text" class="form-control" id="pays" required
            :readonly="!update">
          <div class="error" :class="{ fieldError: countryError }">
            Le pays est obligatoire.
          </div>
        </div>
      </fieldset>
      <div v-if="update" class="col-12">
        <button class="btn btn-primary" type="submit">Valider</button>
      </div>
    </form>
    <br>
    <div v-if="update" class="col-12">
      <button @click="getFile" class="btn btn-light" type="button"><i class="fa-solid fa-xmark"></i> Annuler</button>
    </div>
    <div v-if="!update" class="col-12">
      <button @click="update = true" class="btn btn-primary" type="button">Modifier</button>
    </div>
    <br>
    <div class="col-12">
      <RouterLink to="/" type="button" class="btn btn-light"><i class="fa-solid fa-right-from-bracket"></i> Retour
      </RouterLink>
    </div>
    <br>
  </div>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { mapState, mapActions } from "pinia";
import { useAuthUserStore } from "../stores/authUserStore.js";
import { useMessagesStore } from "../stores/messagesStore";
import { Service } from "../services/services.js";

export default {
  name: "PersonalData",
  data() {
    return {
      editing: false,
      update: false,
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
      phoneError: false,
      emailPresentError: false,
      emailFormatError: false,
      street1Error: false,
      cityError: false,
      zipcodeError: false,
      countryError: false,
    };
  },
  async created() {
    this.getFile();
  },
  beforeRouteLeave(to) {
    if (to.name !== "login" && this.editing) {
      const answer = window.confirm("Voulez-vous vraiment quitter la page ? Les données saisies seront perdues.")
      if (!answer)
        return false;
    }
  },
  computed: {
    ...mapState(useAuthUserStore, ["role"]),
  },
  methods: {
    async getFile() {
      let getService;
      if (this.role === "DOCTOR") {
        getService = Service.getDoctorDetails;
      } else {
        getService = Service.getPatientFileDetails;
      }
      try {
        let response = await getService();
        this.file = response.data;
        this.checkForm();
        this.update = false;
        this.editing = false;
        this.mustCheck = false;
      } catch (error) {
        if (error.response.data) {
          this.setErrorMessage(error.response.data.message);
        }
      }
    },
    checkForm() {
      if (this.mustCheck) {
        this.phoneError = !this.file.phone;
        this.emailPresentError = !this.file.email;
        this.emailFormatError = this.file.email && !new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'g').test(this.file.email);
        this.street1Error = !this.file.address.street1;
        this.cityError = !this.file.address.city;
        this.zipcodeError = !this.file.address.zipcode;
        this.countryError = !this.file.address.country;

      }

      return (
        !this.phoneError &&
        !this.emailPresentError &&
        !this.emailFormatError &&
        !this.street1Error &&
        !this.cityError &&
        !this.zipcodeError &&
        !this.countryError
      );
    },
    async submitUpdateFile() {
      this.mustCheck = true;
      if (this.checkForm()) {
        let updateService;
        if (this.role === "DOCTOR") {
          updateService = Service.updateDoctorDetails;
        } else {
          updateService = Service.updatePatientFileDetails;
        }
        try {
          let response = await updateService(this.file);
          this.setSuccessMessage("Les données ont bien été modifiées.");
          this.file = response.data;
          this.update = false;
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

<!-- eslint-disable prettier/prettier -->
<style scoped>
input[readonly],
.tag-container {
  outline: none;
  border: none;
  background-color: #eeeeee;
  border-radius: 0.375rem;
}

.tag-container {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin: 0;
}

.tag-container>.tag {
  flex: 0 1 auto;
  border-radius: 0.375rem;
  background-color: gray;
  padding: 0.25em 1em;
  margin: 0.25em;
  color: white;
}
.error {
  display: none;
}

.error.fieldError {
  display: initial;
  color: red;
}
</style>
