<!-- eslint-disable prettier/prettier -->
<template>
  <h5>Eléments médicaux ({{ items.length }})</h5>
  <ItemComponent v-for="item in items" :key="item.id" :item="item" :global-editing="editing"
    @editing-start="editing = true;" @editing-end="editing = false; updateItems();" />
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
      editing: false,
    };
  },
  computed: {
    routeId() {
      return this.$route.params.id;
    },
    ...mapState(useAuthUserStore, ["role", "userId"]),
  },
  async created() {
    this.updateItems();
  },
  methods: {
    addItem() {
      this.items.push({
        "@type": null,
        date: new Date().toISOString().slice(0, 10),
        authoringDoctorId: this.userId,
        patientFileId: this.file.id,
        editing: true,
      });
      this.editing = true;
    },
    async updateItems() {
      try {
        let response = await Service.getItems(this.routeId);
        this.items = response.data;
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
</style>