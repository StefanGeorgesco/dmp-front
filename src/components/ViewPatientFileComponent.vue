<!-- eslint-disable prettier/prettier -->
<template>
  <div v-if="role === 'DOCTOR'" class="container">
    <h2>Gérer un dossier patient</h2>
  </div>
  <br>
  <div class="container">
    <div>
      Visualiser le dossier patient {{ file.id }} - {{ file.firstname }} {{ file.lastname }} avec le rôle {{ role }}.
    </div>
    <br>
    <div>
      <p>Correspondances :</p>
      <ul>
        <li v-for="correspondence in correspondences" :key="correspondence.id">
          {{ correspondence.dateUntil }} - {{ correspondence.doctorFirstName }} {{ correspondence.doctorLastName }}
        </li>
      </ul>
    </div>
    <br>
    <div>
      <p>Items :</p>
      <ul>
        <li v-for="item in items" :key="item.id">
          {{ item.comments }} - {{ item.authoringDoctorFirstname }} {{ item.authoringDoctorLastname }}
        </li>
      </ul>
    </div>
    <br>
    <div class="col-12">
      <RouterLink to="/" type="button" class="btn btn-light">Retour</RouterLink>
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
  name: "ViewPatientFileComponent",
  components: {

  },
  data() {
    return {
      file: {
        id: "",
      },
      correspondences: [],
      items: [],
    };
  },
  computed: {
    routId() {
      return this.$route.params.id;
    },
    ...mapState(useAuthUserStore, ["role"]),
  },
  async created() {
    let errorMessages = [];
    try {
      let response = await Service.getPatientFile(this.routId);
      this.file = response.data;
    } catch (error) {
      errorMessages.push(error.response.data.message);
    }
    try {
      let response = await Service.getItems(this.routId);
      this.items = response.data;
    } catch (error) {
      errorMessages.push(error.response.data.message);
    }
    try {
      let response = await Service.getCorrespondences(this.routId);
      this.correspondences = response.data;
    } catch (error) {
      errorMessages.push(error.response.data.message);
    }
    if (errorMessages.length > 0) {
      this.setErrorMessage(errorMessages.join("; "));
    }
  },
  methods: {
    ...mapActions(useMessagesStore, ["setErrorMessage", "setSuccessMessage"]),
  },
}
</script>

<!-- eslint-disable prettier/prettier -->
<style>
</style>