<!-- eslint-disable prettier/prettier -->
<template>
  <div class="container" v-if="role === 'ADMIN'">
    <br>
    <div class="col-12">
      <RouterLink to="/manage-doctors" type="button" class="btn btn-light">Gérer les dossiers des médecins</RouterLink>
    </div>
    <br>
    <div class="col-12">
      <RouterLink to="/manage-patient-files" type="button" class="btn btn-light">Gérer les dossiers patients
      </RouterLink>
    </div>
  </div>
  <ManageFiles type="patientFile" v-else-if="role === 'DOCTOR'" />
  <PatientFile v-else-if="role === 'PATIENT'"/>
  <div class="container" v-else>Type inconnu</div>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { mapState } from "pinia";
import { useAuthUserStore } from "../stores/authUserStore.js";
import ManageFiles from "./ManageFiles.vue";
import PatientFile from "./PatientFile.vue";

export default {
  name: "HomeComponent",
  components : {
    ManageFiles, PatientFile,
  },
  computed: {
    ...mapState(useAuthUserStore, ["role"]),
  },
};
</script>

<!-- eslint-disable prettier/prettier -->
<style>
</style>
