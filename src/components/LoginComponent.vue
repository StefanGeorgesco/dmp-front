<template>
  <div class="container">
    <form @submit.prevent="submitLogin">
      <div class="mb-3">
        <label for="username" class="form-label">identifiant</label>
        <input
          type="text"
          class="form-control"
          v-model="user.username"
          id="username"
          aria-describedby="usernameHelp"
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">mot de passe</label>
        <input
          type="password"
          class="form-control"
          v-model="user.password"
          id="password"
        />
      </div>
      <button type="submit" class="btn btn-primary">Entrer</button>
    </form>
    <br />
  </div>
</template>

<script>
import { Service } from "../services/services.js";
import { useAuthUserStore } from "../stores/authUserStore.js";
import { mapWritableState } from "pinia";

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
        let response = await Service.login(this.user);
        this.currentUser = response.data;
        this.authorization = response.headers.authorization;
        sessionStorage.setItem("userdetails", JSON.stringify(response.data));
        sessionStorage.setItem("Authorization", response.headers.authorization);
        this.$router.push("/");
      } catch (error) {
        console.log(error.response.status + " " + error.response.statusText);
        this.errorMessage = "identifiant ou mot de passe incorrect";
      }
    },
  },
  computed: {
    ...mapWritableState(useAuthUserStore, [
      "currentUser",
      "authorization",
      "errorMessage",
    ]),
  },
};
</script>

<style scoped></style>
