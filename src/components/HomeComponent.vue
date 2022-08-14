<!-- eslint-disable prettier/prettier -->
<template>
  <div class="container" v-if="role === 'ADMIN'">
    <div class="col-12">
      <RouterLink to="/manage-doctors" type="button" class="btn btn-light">Gérer les dossiers des docteurs</RouterLink>
    </div>
    <br>
    <div class="col-12">
      <RouterLink to="/manage-patient-files" type="button" class="btn btn-light">Gérer les dossiers patients
      </RouterLink>
    </div>
  </div>
  <ManagePatientFilesComponent v-if="role === 'DOCTOR'" />
  <ViewPatientFileComponent v-if="role === 'PATIENT'" />
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { mapState } from "pinia";
import { useAuthUserStore } from "../stores/authUserStore.js";
import ManagePatientFilesComponent from "./ManagePatientFilesComponent.vue";
import ViewPatientFileComponent from "./ViewPatientFileComponent.vue";

export default {
  name: "HomeComponent",
  components : {
    ManagePatientFilesComponent, ViewPatientFileComponent,
  },
  computed: {
    ...mapState(useAuthUserStore, ["role"]),
  },
};
</script>

<!-- eslint-disable prettier/prettier -->
<style>
</style>
