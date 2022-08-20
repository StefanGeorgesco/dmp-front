<!-- eslint-disable prettier/prettier -->
<template>
  <div class="container">
    <h2>S'identifier</h2>
  </div>
  <br>
  <div class="container">
    <form @submit.prevent="submitLogin">
      <div class="mb-3">
        <label for="username" class="form-label">identifiant</label>
        <input type="text" class="form-control" v-model="user.username" id="username" aria-describedby="usernameHelp" />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">mot de passe</label>
        <input type="password" class="form-control" v-model="user.password" id="password" />
      </div>
      <div class="col-12">
        <button class="btn btn-primary" type="submit">Entrer</button>
      </div>
    </form>
    <br>
    <div class="col-12">
      <RouterLink to="/sign-up" type="button" class="btn btn-light">S'enregistrer</RouterLink>
    </div>
    <br>
  </div>
</template>

<script>
import { useAuthUserStore } from "../stores/authUserStore.js";
import { useMessagesStore } from "../stores/messagesStore";
import { mapActions } from "pinia";

export default {
  name: "LoginComponent",
  data() {
    return {
      user: {},
    };
  },
  methods: {
    async submitLogin() {
      try {
        await this.login(this.user);
        this.$router.push("/");
      } catch (error) {
        this.setErrorMessage("Identifiant ou mot de passe incorrect.");
      }
    },
    ...mapActions(useMessagesStore, ["setErrorMessage"]),
    ...mapActions(useAuthUserStore, ["login"]),
  },
};
</script>

<style scoped>
</style>
