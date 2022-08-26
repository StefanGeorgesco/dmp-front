<!-- eslint-disable prettier/prettier -->
<template>
  <div class="container">
    <h5 style="display: inline-block; margin-right: 0.5rem;">Correspondances ({{ processedCorrepondences.length }})</h5>
    <template v-if="addingCorrespondence || correspondences.length > 0">
      <input v-if="correspondences.length > 0" v-model="searchString"
        @keyup.esc="searchString = ''; $event.target.blur();"
        style="border: 1px solid #ced4da; border-radius: 0.375rem;" type="text" placeholder="Recherche..." size="15">
      <br>
      <div class="commands" v-if="correspondences.length > 0" style="height: 2rem;">
        <a @click="correspondenceFilter = 'ongoing'" :class="{ active: correspondenceFilter === 'ongoing' }">en
          cours</a> -
        <a @click="correspondenceFilter = 'past'" :class="{ active: correspondenceFilter === 'past' }">passées</a> -
        <a @click="correspondenceFilter = 'all'" :class="{ active: correspondenceFilter === 'all' }">toutes</a>
        <template v-if="processedCorrepondences.length > 1">
          <span style="margin-left: 1.25rem;">date </span>
          <a @click="sortDirection = -1" :class="{ active: sortDirection === -1 }"
            style="font-size: x-large; margin-right: 0.25rem; text-decoration: none">&uarr;</a>
          <a @click="sortDirection = 1" :class="{ active: sortDirection === 1 }"
            style="font-size: x-large; text-decoration: none;">&darr;</a>
        </template>
      </div>
      <br>
      <div class="overflow-auto scroll-pane">
        <template v-if="correspondences.length > 0 && processedCorrepondences.length === 0">
          <p>Aucune correspondance ne correspond à la sélection.</p>
        </template>
        <CorrespondenceComponent v-for="correspondence in processedCorrepondences" :key="correspondence.id"
          :correspondence="correspondence" :can-delete="isReferringDoctor"
          @correspondence-updated="updateCorrespondences" />
        <AddCorrespondence v-if="addingCorrespondence"
          @correspondence-added="addingCorrespondence = false; updateCorrespondences();"
          @canceled="addingCorrespondence = false" :patient-file-id="file.id" />
      </div>
    </template>
    <template v-else>
      <p style="padding: 0.8rem 0;">Il n'y a aucune correspondance sur ce dossier.</p>
    </template>
  </div>
  <template v-if=" isReferringDoctor">
    <button v-show="!addingCorrespondence" @click="addingCorrespondence = true" type="button" class="btn btn-primary"><i
        class="fa-solid fa-plus"></i> Ajouter</button>
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
import { filterFn } from "../utils/utils";

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
      sortDirection: 1,
      searchString: "",
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
    processedCorrepondences() {

      let result;

      switch (this.correspondenceFilter) {
        case "all":
          result = [...this.correspondences];
          break;
        case "past":
          result = this.correspondences.filter(c => new Date(c.dateUntil) < new Date());
          break;
        case "ongoing":
          result = this.correspondences.filter(c => new Date(c.dateUntil) >= new Date());
          break;
        default:
          result = [...this.correspondences];
      }

      result = result.filter(filterFn(this.searchString));

      return result.sort((c1, c2) => this.sortDirection * (new Date(c1.dateUntil) - new Date(c2.dateUntil)));
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
        this.searchString = "";
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
.container {
  padding: 0.8rem 0;
}
.commands {
  height: 3.5em;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

a:hover {
  cursor: pointer;
}

a.active {
  text-decoration: none;
  color: black;
  cursor: auto;
}

.scroll-pane {
  height: calc(100vh - 18.5rem);
}
</style>