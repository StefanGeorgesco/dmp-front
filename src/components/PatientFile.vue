<!-- eslint-disable prettier/prettier -->
<template>
  <div class="container-custom col-md-12">
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
        <div v-if="role !== 'PATIENT'" class="container">
          <div class="col-12">
            <RouterLink to="/" type="button" class="btn btn-light"><i class="fa-solid fa-right-from-bracket"></i> Retour
            </RouterLink>
          </div>
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
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { mapState, mapActions } from "pinia";
import { useAuthUserStore } from "../stores/authUserStore.js";
import { useMessagesStore } from "../stores/messagesStore";
import { useLoaderStore } from '../stores/loaderStore';
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
    let id = this.setLoader();
    try {
      let response = await Service.getPatientFile(this.routeId);
      this.file = response.data;
    } catch (error) {
      if (error.response.data) {
        this.setErrorMessage(error.response.data.message);
      }
    } finally {
      this.clearLoader(id);
    }
  },
  methods: {
    ...mapActions(useMessagesStore, ["setErrorMessage"]),
    ...mapActions(useLoaderStore, ["setLoader", "clearLoader"]),
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
  overflow: hidden;
}

[class*="col-md-"] {
  padding: 0 0.5rem;
  margin: 0;
}
</style>