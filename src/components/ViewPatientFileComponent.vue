<!-- eslint-disable prettier/prettier -->
<template>
  <div class="container-custom">
    <div class="row">
      <div class="col-md-2">
        <h5>{{ file.firstname }} {{ file.lastname }} ({{ file.id }})</h5>
        <p>Né(e) le {{ new Date(file.dateOfBirth).toLocaleDateString() }}</p>
      </div>
      <div class="col-md-3">
        <h5>Correspondances ({{ filteredCorrepondences.length }})</h5>
        <template v-if="correspondences.length > 0">
          <a @click="correspondenceFilter='all'" :class="{ active: correspondenceFilter ==='all'}">toutes</a> -
          <a @click="correspondenceFilter='ongoing'" :class="{ active: correspondenceFilter ==='ongoing'}">en cours</a>
          -
          <a @click="correspondenceFilter='past'" :class="{ active: correspondenceFilter ==='past'}">passées</a>
          <ViewCorrespondenceComponent v-for="correspondence in filteredCorrepondences" :key="correspondence.id"
            :correspondence="correspondence" :canDelete="file.referringDoctorId === userId"
            @correspondenceUpdated="updateCorrespondences" />
        </template>
        <template v-else-if="correspondenceUpdated">
          <p>Il n'y a aucune correspondance sur ce dossier.</p>
        </template>
      </div>
      <div class="col-md-7">
        <h5>Eléments médicaux ({{ items.length }})</h5>
        <ViewItemComponent v-for="item in items" :key="item.id" :item="item" @itemUpdated="updateItems" />
      </div>
      <br>
    </div>
  </div>
  <br>
  <div class="container">
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
      },
      correspondences: [],
      correspondenceFilter: "all",
      items: [],
      correspondenceUpdated: false,
      itemsUpdated: false,
    };
  },
  computed: {
    routeId() {
      return this.$route.params.id;
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
      this.correspondenceUpdated = false;
      try {
        let response = await Service.getCorrespondences(this.routeId);
        this.correspondences = response.data;
        this.correspondenceUpdated = true;
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