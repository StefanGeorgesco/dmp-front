<!-- eslint-disable prettier/prettier -->
<template>
  <div class="container">Gestion des dossiers des {{ type === "DOCTOR" ? "médecins" : "patients" }}...</div>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
export default {
    name: "ManageFilesComponent",
    props: ["type"],
}
</script>

<!-- eslint-disable prettier/prettier -->
<style></style>