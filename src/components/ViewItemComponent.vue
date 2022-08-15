<!-- eslint-disable prettier/prettier -->
<template>
    <div>{{ item.comments }} - {{ item.authoringDoctorFirstname }} {{ item.authoringDoctorLastname }}</div>
    <br>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
export default {
    name: "ViewItemComponent",
    props: ["item"],
}
</script>

<!-- eslint-disable prettier/prettier -->
<style></style>