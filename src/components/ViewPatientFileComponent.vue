<!-- eslint-disable prettier/prettier -->
<template>
  <div class="container-custom">
    <div class="row">
      <div v-show="file.id" class="col-md-2">
        <template v-if="role === 'DOCTOR'">
          <div v-cloak class="card">
            <h4>{{ file.firstname }} {{ file.lastname }} ({{ file.id }})</h4>
            <p>Né(e) le {{ new Date(file.dateOfBirth).toLocaleDateString() }}</p>
          </div>
        </template>
        <div class="card" v-else-if="role === 'PATIENT'">
          <h5>Médecin référent</h5>
          <h6>{{ file.referringDoctorFirstname }} {{ file.referringDoctorLastname }} ({{ file.referringDoctorId }})</h6>
          <p>{{ file.referringDoctorSpecialties.join(", ") }}</p>
        </div>
      </div>
      <div v-cloak class="col-md-3">
        <h5>Correspondances ({{ filteredCorrepondences.length }})</h5>
        <template v-if="correspondencesUpdated">
          <template v-if="correspondences.length > 0">
            <a @click="correspondenceFilter = 'ongoing'" :class="{ active: correspondenceFilter === 'ongoing' }">en
              cours</a> -
            <a @click="correspondenceFilter = 'past'" :class="{ active: correspondenceFilter === 'past' }">passées</a> -
            <a @click="correspondenceFilter = 'all'" :class="{ active: correspondenceFilter === 'all' }">toutes</a>
            <br><br>
            <ViewCorrespondenceComponent v-for="correspondence in filteredCorrepondences" :key="correspondence.id"
              :correspondence="correspondence" :canDelete="isReferringDoctor"
              @correspondenceUpdated="updateCorrespondences" />
            <template v-if="filteredCorrepondences.length === 0">
              <p>Aucune correspondance {{ correspondenceFilter === "ongoing" ? "en cours" : "passée" }}.</p>
            </template>
          </template>
          <template v-else>
            <br>
            <p>Il n'y a aucune correspondance sur ce dossier.</p>
          </template>
        </template>
        <template v-if="isReferringDoctor">
          <br>
          <button v-show="!addingCorrespondence" @click="addingCorrespondence = true" type="button"
            class="btn btn-primary"><i class="fa-solid fa-plus"></i> Ajouter une correspondance</button>
          <AddCorrespondence @correspondenceAdded="addingCorrespondence = false; updateCorrespondences();"
            @canceled="addingCorrespondence = false" v-show="addingCorrespondence" :patientFileId="file.id" />
        </template>
      </div>
      <div v-cloak class="col-md-7">
        <h5>Eléments médicaux ({{ items.length }})</h5>
        <ViewItemComponent v-for="item in items" :key="item.id" :item="item" @itemUpdated="updateItems" />
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
import ViewCorrespondenceComponent from "./ViewCorrespondenceComponent.vue";
import ViewItemComponent from "./ViewItemComponent.vue";
import AddCorrespondence from "./AddCorrespondence.vue";

export default {
  name: "ViewPatientFileComponent",
  components: {
    ViewCorrespondenceComponent, ViewItemComponent, AddCorrespondence,
  },
  data() {
    return {
      file: {
        id: "",
        referringDoctorId: "",
        referringDoctorFirstname: "",
        referringDoctorLastname: "",
      },
      correspondences: [],
      correspondencesUpdated: false,
      correspondenceFilter: "ongoing",
      addingCorrespondence: false,
      items: [],
      itemsUpdated: false,
    };
  },
  computed: {
    routeId() {
      return this.$route.params.id;
    },
    isReferringDoctor() {
      return this.file.referringDoctorId === this.userId;
    },
    filteredCorrepondences() {
      switch (this.correspondenceFilter) {
        case "all":
          return [...this.correspondences];
        case "past":
          return this.correspondences.filter(c => new Date(c.dateUntil) < new Date());
        case "ongoing":
          return this.correspondences.filter(c => new Date(c.dateUntil) >= new Date());
        default:
          return [...this.correspondences];
      }
    },
    ...mapState(useAuthUserStore, ["role", "userId"]),
  },
  async created() {
    try {
      let response = await Service.getPatientFile(this.routeId);
      this.file = response.data;
    } catch (error) {
      this.setErrorMessage(error.response.data.message);
    }
    this.updateItems();
    this.updateCorrespondences();
  },
  methods: {
    async updateItems() {
      this.itemsUpdated = false;
      try {
        let response = await Service.getItems(this.routeId);
        this.items = response.data;
        this.itemsUpdated = true;
      } catch (error) {
        this.setErrorMessage(error.response.data.message);
      }
    },
    async updateCorrespondences() {
      this.correspondencesUpdated = false;
      try {
        let response = await Service.getCorrespondences(this.routeId);
        this.correspondences = response.data;
        this.correspondencesUpdated = true;
        if (this.correspondenceFilter === "past") {
          this.correspondenceFilter = "ongoing";
        }
      } catch (error) {
        this.setErrorMessage(error.response.data.message);
      }
    },
    ...mapActions(useMessagesStore, ["setErrorMessage", "setSuccessMessage"]),
  },
}
</script>

<!-- eslint-disable prettier/prettier -->
<style scoped>
[v-cloak] {
  display: none;
}

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

a:hover {
  cursor: pointer;
}

a.active {
  text-decoration: none;
  color: black;
}
</style>