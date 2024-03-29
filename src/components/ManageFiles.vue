<!-- eslint-disable prettier/prettier -->
<template>
  <div class="container">
    <h2>Gérer les dossiers {{ type === "doctor" ? "des médecins" : "patients" }}</h2>
  </div>
  <br>
  <div class="container">
    <form class="row g-3">
      <div class="col-md-4 input-container">
        <input @keyup.esc="clear" v-model="searchString" type="text" @input="findFiles" class="form-control"
          placeholder="Recherche...">
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
    <FileCard @referring-doctor-updated="updateFile" @close="clear" @file-deleted="clear" :type="type"
      :file="selectedFile">
    </FileCard>
  </div>
  <div class="container">
    <RouterLink to="/add-doctor" v-if="type === 'doctor' && role === 'ADMIN'" class="btn btn-primary">
      <i class="fa-solid fa-plus"></i> Ajouter un médecin
    </RouterLink>
    <RouterLink to="/add-patient-file" v-if="type === 'patientFile' && role === 'DOCTOR'" class="btn btn-primary">
      <i class="fa-solid fa-plus"></i> Ajouter un dossier patient
    </RouterLink>
  </div>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { mapState, mapActions } from "pinia";
import { useAuthUserStore } from "../stores/authUserStore.js";
import { useMessagesStore } from "../stores/messagesStore";
import { useLoaderStore } from '../stores/loaderStore';
import { Service } from "../services/services.js";
import FileCard from "./FileCard.vue";

export default {
  name: "ManageFiles",
  props: {
    type: {
      type: String,
      required: true,
      validator(value) {
        return ["patientFile", "doctor"].includes(value);
      },
    },
  },
  components: {
    FileCard,
  },
  data() {
    return {
      searchString: "",
      foundFiles: [],
      selectedFile: null,
    }
  },
  computed: {
    ...mapState(useAuthUserStore, ["role"]),
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.clear();
    })
  },
  beforeRouteLeave() {
    this.clear();
  },
  methods: {
    async findFiles() {
      this.selectedFile = null;
      let service;
      if (this.type === "doctor") {
        service = Service.findDoctorsByIdOrFirstnameOrLastname;
      } else {
        service = Service.findPatientFilesByIdOrFirstnameOrLastname;
      }
      let id = this.setLoader();
      try {
        let response = await service(this.searchString);
        this.foundFiles = response.data;
      } catch (error) {
        if (error.response.data) {
          this.setErrorMessage(error.response.data.message);
        }
      } finally {
        this.clearLoader(id);
      }
    },
    async updateFile(file) {
      let id = this.setLoader();
      try {
        let response = await Service.getPatientFile(file.id);
        this.select(response.data);
      } catch (error) {
        this.clear();
      } finally {
        this.clearLoader(id);
      }
    },
    select(f) {
      this.selectedFile = f;
      this.searchString = "";
      this.foundFiles = [];
    },
    clear() {
      this.searchString = "";
      this.foundFiles = [];
      this.selectedFile = null;
    },
    ...mapActions(useMessagesStore, ["setErrorMessage"]),
    ...mapActions(useLoaderStore, ["setLoader", "clearLoader"]),
  },
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