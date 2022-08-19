<!-- eslint-disable prettier/prettier -->
<template>
  <div class="container-custom">
    <div class="row">
      <div v-cloak class="col-md-2">
        <h5>{{ file.firstname }} {{ file.lastname }} ({{ file.id }})</h5>
        <p>Né(e) le {{ new Date(file.dateOfBirth).toLocaleDateString() }}</p>
      </div>
      <div v-cloak class="col-md-3">
        <h5>Correspondances ({{ filteredCorrepondences.length }})</h5>
        <template v-if="correspondencesUpdated">
          <template v-if="correspondences.length > 0">
            <a @click="correspondenceFilter='ongoing'" :class="{ active: correspondenceFilter ==='ongoing'}">en
              cours</a> -
            <a @click="correspondenceFilter='past'" :class="{ active: correspondenceFilter ==='past'}">passées</a> -
            <a @click="correspondenceFilter='all'" :class="{ active: correspondenceFilter ==='all'}">toutes</a>
            <ViewCorrespondenceComponent v-for="correspondence in filteredCorrepondences" :key="correspondence.id"
              :correspondence="correspondence" :canDelete="isReferringDoctor"
              @correspondenceUpdated="updateCorrespondences" />
          </template>
          <template v-else>
            <p>Il n'y a aucune correspondance sur ce dossier.</p>
          </template>
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

export default {
  name: "ViewPatientFileComponent",
  components: {
    ViewCorrespondenceComponent, ViewItemComponent,
  },
  data() {
    return {
      file: {
        id: "",
        referringDoctorId: "",
      },
      correspondences: [],
      correspondencesUpdated: false,
      correspondenceFilter: "ongoing",
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
      switch(this.correspondenceFilter) {
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