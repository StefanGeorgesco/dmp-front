<!-- eslint-disable prettier/prettier -->
<template>
  <h5>Eléments médicaux ({{ items.length }})</h5>
  <ItemComponent v-for="item in items" :key="item.id" :item="item" @itemUpdated="updateItems" />
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
  data() {
    return {
      items: [],
      itemsUpdated: false,
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
    ...mapActions(useMessagesStore, ["setErrorMessage", "setSuccessMessage"]),
  },
}
</script>

<!-- eslint-disable prettier/prettier -->
<style scoped></style>