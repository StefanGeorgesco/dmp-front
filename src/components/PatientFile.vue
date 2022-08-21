<!-- eslint-disable prettier/prettier -->
<template>
  <div class="container-custom">
    <div class="row">
      <div v-if="file.id" class="col-md-2">
        <template v-if="role === 'DOCTOR'">
          <div class="card">
            <h4>{{ file.firstname }} {{ file.lastname }} ({{ file.id }})</h4>
            <p>Né(e) le {{ new Date(file.dateOfBirth).toLocaleDateString() }}</p>
          </div>
        </template>
        <div class="card" v-if="role === 'PATIENT' || !isReferringDoctor">
          <h5>Médecin référent</h5>
          <h6>{{ file.referringDoctorFirstname }} {{ file.referringDoctorLastname }} ({{ file.referringDoctorId }})</h6>
          <p>{{ file.referringDoctorSpecialties.join(", ") }}</p>
        </div>
      </div>
      <div class="col-md-3">
        <CorrespondencesComponent :file="file" />
      </div>
      <div class="col-md-7">
        <ItemsComponent :file="file" />
      </div>
      <br>
    </div>
  </div>
  <br>
  <div v-if="role !== 'PATIENT'" class="container">
    <div class="col-12">
      <RouterLink to="/" type="button" class="btn btn-light">Retour</RouterLink>
    </div>
  </div>
  <br>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { mapState, mapActions } from "pinia";
import { useAuthUserStore } from "../stores/authUserStore.js";
import { useMessagesStore } from "../stores/messagesStore";
import { Service } from "../services/services.js";
import ItemsComponent from "./ItemsComponent.vue";
import CorrespondencesComponent from "./CorrespondencesComponent.vue";

export default {
  name: "PatientFile",
  components: {
    CorrespondencesComponent, ItemsComponent
  },
  data() {
    return {
      file: {
        id: "",
        referringDoctorId: "",
        referringDoctorFirstname: "",
        referringDoctorLastname: "",
        referringDoctorSpecialties: [],
      },
    };
  },
  computed: {
    routeId() {
      return this.$route.params.id;
    },
    isReferringDoctor() {
      return this.file.referringDoctorId === this.userId;
    },
    ...mapState(useAuthUserStore, ["role", "userId"]),
  },
  async created() {
    try {
      let response = await Service.getPatientFile(this.routeId);
      this.file = response.data;
    } catch (error) {
      if (error.response.data) {
        this.setErrorMessage(error.response.data.message);
      }
    }
  },
  methods: {
    ...mapActions(useMessagesStore, ["setErrorMessage"]),
  },
}
</script>

<!-- eslint-disable prettier/prettier -->
<style scoped>
.card {
  padding: 0.5rem;
}

.container-custom {
  padding: 0;
  margin: 0;
}

[class*="col-md-"] {
  padding: 0.5rem 2rem;
}
</style>