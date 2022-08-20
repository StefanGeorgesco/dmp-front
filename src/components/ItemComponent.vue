<!-- eslint-disable prettier/prettier -->
<template>
    <div>{{ item.comments }} - {{ item.authoringDoctorFirstname }} {{ item.authoringDoctorLastname }}</div>
    <br>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
export default {
    name: "ItemComponent",
    props: ["item"],
    emits: ["itemUpdated"],
}
</script>

<!-- eslint-disable prettier/prettier -->
<style></style>