<!-- eslint-disable prettier/prettier -->
<template>
  <h5>Correspondances ({{ filteredCorrepondences.length }})</h5>
  <template v-if="correspondences.length > 0">
    <a @click="correspondenceFilter = 'ongoing'" :class="{ active: correspondenceFilter === 'ongoing' }">en
      cours</a> -
    <a @click="correspondenceFilter = 'past'" :class="{ active: correspondenceFilter === 'past' }">passées</a> -
    <a @click="correspondenceFilter = 'all'" :class="{ active: correspondenceFilter === 'all' }">toutes</a>
    <br><br>
    <CorrespondenceComponent v-for="correspondence in filteredCorrepondences" :key="correspondence.id"
      :correspondence="correspondence" :can-delete="isReferringDoctor" @correspondence-updated="updateCorrespondences" />
    <template v-if="filteredCorrepondences.length === 0">
      <p>Aucune correspondance {{ correspondenceFilter === "ongoing" ? "en cours" : "passée" }}.</p>
    </template>
  </template>
  <template v-else>
    <br>
    <p>Il n'y a aucune correspondance sur ce dossier.</p>
  </template>
  <template v-if="isReferringDoctor">
    <br>
    <button v-show="!addingCorrespondence" @click="addingCorrespondence = true" type="button" class="btn btn-primary"><i
        class="fa-solid fa-plus"></i> Ajouter une correspondance</button>
    <AddCorrespondence v-show="addingCorrespondence"
      @correspondence-added="addingCorrespondence = false; updateCorrespondences();"
      @canceled="addingCorrespondence = false" :patient-file-id="file.id" />
  </template>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { mapState, mapActions } from "pinia";
import { useAuthUserStore } from "../stores/authUserStore.js";
import { useMessagesStore } from "../stores/messagesStore";
import { Service } from "../services/services.js";
import CorrespondenceComponent from "./CorrespondenceComponent.vue";
import AddCorrespondence from "./AddCorrespondence.vue";

export default {
  name: "CorrespondencesComponent",
  components: {
    CorrespondenceComponent, AddCorrespondence,
  },
  props: {
    file: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      correspondences: [],
      correspondenceFilter: "ongoing",
      addingCorrespondence: false,
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
    ...mapState(useAuthUserStore, ["userId"]),
  },
  async created() {
    this.updateCorrespondences();
  },
  methods: {
    async updateCorrespondences() {
      try {
        let response = await Service.getCorrespondences(this.routeId);
        this.correspondences = response.data;
        if (this.correspondenceFilter === "past") {
          this.correspondenceFilter = "ongoing";
        }
      } catch (error) {
        if (error.response.data) {
          this.setErrorMessage(error.response.data.message);
        }
      }
    },
    ...mapActions(useMessagesStore, ["setErrorMessage"]),
  },
}
</script>

<!-- eslint-disable prettier/prettier -->
<style scoped>
a:hover {
  cursor: pointer;
}

a.active {
  text-decoration: none;
  color: black;
}
</style>