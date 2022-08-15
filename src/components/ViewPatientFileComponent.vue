<!-- eslint-disable prettier/prettier -->
<template>
  <div class="container">Visualiser le dossier patient {{ id }} avec le rôle {{ role }}...</div>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { mapState } from "pinia";
import { useAuthUserStore } from "../stores/authUserStore.js";

export default {
  name: "ViewPatientFileComponent",
  props: ["fileId"],
  computed: {
    id() {
      return this.$route.params.id ? this.$route.params.id : this.fileId;
    },
    ...mapState(useAuthUserStore, ["role"]),
  }
}
</script>

<!-- eslint-disable prettier/prettier -->
<style></style>