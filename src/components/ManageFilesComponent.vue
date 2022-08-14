<!-- eslint-disable prettier/prettier -->
<template>
  <div class="container">
    <h2>Gérer les dossiers {{ type === "DOCTOR" ? "des médecins" : "patients" }}</h2>
  </div>
  <br>
  <div class="container">
    <form class="row g-3">
      <div class="col-md-4 input-container">
        <input v-model="searchString" type="text" @input="findFiles" class="form-control" placeholder="Recherche...">
        <div class="options-list" v-show="foundFiles.length > 0">
          <div class="option-item" v-for="file in foundFiles" :key="file.id" @click="select(file)">
            {{ file.id }} {{ file.firstname }} {{ file.lastname }}
          </div>
        </div>
      </div>
    </form>
  </div>
  <br>
  <div v-if="selectedFile" class="container">
    {{ selectedFile.id }} {{ selectedFile.firstname }} {{ selectedFile.lastname }}
  </div>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { Service } from "../services/services.js";

export default {
    name: "ManageFilesComponent",
    props: ["type"],
    data() {
      return {
        searchString: "",
        foundFiles: [],
        selectedFile: null,
      }
    },
    methods: {
      async findFiles() {
        let service;
        if (this.type === "DOCTOR") {
          service = Service.findDoctorsByIdOrFirstnameOrLastname;
        } else {
          service = Service.findPatientFilesByIdOrFirstnameOrLastname;
        }
        try {
          let response = await service(this.searchString);
          this.foundFiles = response.data;
        } catch (error) {
          this.setErrorMessage(error.response.data.message);
        }
      },
      select(f) {
        this.selectedFile = f;
        this.searchString = "";
        this.foundFiles = [];
      }
    }
}
</script>

<!-- eslint-disable prettier/prettier -->
<style>
.input-container {
  position: relative;
}

.options-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 99;
  background-color: #ffffff;
  border: 1px solid #ced4da;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2);
  padding: 0.25em 0 0.5em 0;
}

.option-item {
  padding-left: 1em;
}

.option-item:hover {
  cursor: pointer;
  background-color: #eeeeee;
}
</style>