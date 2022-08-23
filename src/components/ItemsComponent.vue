<!-- eslint-disable prettier/prettier -->
<template>
  <h5>Eléments médicaux ({{ items.length }})</h5>
  <ItemComponent v-for="item in items" :key="item.id" :item-value="item" :global-editing="editing"
    @editing-start="editing = true;" @editing-canceled="cancelEditing"
    @editing-end="completeEditing" />
  <br>
  <button v-show="!editing" @click="addItem" type="button" class="btn btn-primary">
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
    };
  },
  async created() {
    this.fetchItems();
  },
  watch: {
    fetchedItems() {
      this.items = [...this.fetchedItems];
    },
  },
  computed: {
    routeId() {
      return this.$route.params.id;
    },
    ...mapState(useAuthUserStore, ["userId"]),
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
    cancelEditing() {
      this.editing = false;
      this.items = [...this.fetchedItems];
    },
    completeEditing() {
      this.editing = false;
      this.fetchItems();
    },
    ...mapActions(useMessagesStore, ["setErrorMessage"]),
  },
}
</script>

<!-- eslint-disable prettier/prettier -->
<style scoped>
</style>