<!-- eslint-disable prettier/prettier -->
<template>
  <h5>Eléments médicaux ({{ processedItems.length }})</h5>
  <template v-if="items.length > 0">
    <select v-model="typeFilter" @change="$event.target.blur();"
      style="border: 1px solid #ced4da; border-radius: 0.375rem;">
      <option v-for="t in types" :key="t.value" :value="t.value" v-text="t.name"></option>
    </select>
    <span style="margin-left: 1.25rem;">tri par date </span>
    <a @click="sortDirection = -1" :class="{ active: sortDirection === -1 }"
      style="font-size: x-large; margin-right: 0.25rem; text-decoration: none">&uarr;</a>
    <a @click="sortDirection = 1" :class="{ active: sortDirection === 1 }"
      style="font-size: x-large; text-decoration:none">&darr;</a>
    <br><br>
    <input v-model="searchString" @keyup.esc="searchString = ''; $event.target.blur();"
      style="border: 1px solid #ced4da; border-radius: 0.375rem;" type="text" placeholder="Recherche...">
    <br><br>
    <ItemComponent v-for="item in processedItems" :key="item.id" :item-value="item" :global-editing="editing"
      @editing-start="startEditing;" @editing-canceled="cancelEditing" @editing-end="completeEditing" />
    <template v-if="processedItems.length === 0">
      <p>Aucun élément ne correspond à la sélection</p>
    </template>
  </template>
  <template v-else>
    <br>
    <p>Il n'y a aucun élément médical sur ce dossier.</p>
  </template>
  <br>
  <button v-if="role === 'DOCTOR'" v-show="!editing" @click="addItem" type="button" class="btn btn-primary">
    <i class="fa-solid fa-plus"></i> Ajouter un élément
  </button>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { mapState, mapActions } from "pinia";
import { useAuthUserStore } from "../stores/authUserStore.js";
import { useMessagesStore } from "../stores/messagesStore";
import { Service } from "../services/services.js";
import ItemComponent from "./ItemComponent.vue";
import { filterFn } from "../utils/utils";

export default {
  name: "ItemsComponent",
  components: {
    ItemComponent,
  },
  props: {
    file: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      items: [],
      fetchedItems: [],
      editing: false,
      types: [
        {
          name: "Tous",
          value: "",
        },
        {
          name: "Actes",
          value: "act",
        },
        {
          name: "Diagnostics",
          value: "diagnosis",
        },
        {
          name: "Courriers",
          value: "mail",
        },
        {
          name: "Prescriptions",
          value: "prescription",
        },
        {
          name: "Symptômes",
          value: "symptom",
        },
      ],
      typeFilter: "",
      sortDirection: 1,
      searchString: "",
    };
  },
  async created() {
    this.fetchItems();
  },
  watch: {
    fetchedItems: {
      handler() {
        this.items = this.fetchedItems.map((item) => ({ ...item }));
      },
      deep: true,
    }
  },
  computed: {
    routeId() {
      return this.$route.params.id;
    },
    processedItems() {
      return this.items.filter((item) => item.id ? item["@type"].indexOf(this.typeFilter) >= 0 : true)
        .filter(filterFn(this.searchString))
        .sort((i1, i2) => {
          if (!i1.id) return 1;
          if (!i2.id) return -1;
          return this.sortDirection * (new Date(i1.date) - new Date(i2.date));
        });
    },
    ...mapState(useAuthUserStore, ["role", "userId"]),
  },
  methods: {
    async fetchItems() {
      try {
        let response = await Service.getItems(this.routeId);
        this.fetchedItems = response.data;
      } catch (error) {
        if (error.response.data) {
          this.setErrorMessage(error.response.data.message);
        }
      }
    },
    startEditing() {
      this.editing = true;
    },
    cancelEditing() {
      this.editing = false;
      this.items = this.fetchedItems.map((item) => ({ ...item }));
    },
    completeEditing() {
      this.editing = false;
      this.typeFilter = "";
      this.searchString = "";
      this.fetchItems();
    },
    addItem() {
      this.editing = true;
      this.items.push({
        "@type": null,
        date: new Date().toISOString().slice(0, 10),
        authoringDoctorId: this.userId,
        patientFileId: this.file.id,
        editing: true,
      });
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
  cursor: auto;
}
</style>