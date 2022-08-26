<!-- eslint-disable prettier/prettier -->
<template>
  <div class="login-container">
    <div class="login-form-container">
      <div class="container">
        <h2>S'identifier</h2>
      </div>
      <br>
      <div class="container">
        <form @submit.prevent="submitLogin">
          <div class="mb-3">
            <label for="username" class="form-label">identifiant</label>
            <input type="text" class="form-control" v-model="user.username" id="username"
              aria-describedby="usernameHelp" />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">mot de passe</label>
            <input type="password" class="form-control" v-model="user.password" id="password" />
          </div>
          <div class="col-12">
            <button class="btn btn-primary" type="submit"><i class="fa-solid fa-right-to-bracket"></i> Entrer</button>
          </div>
        </form>
        <br>
        <div class="col-12">
          <RouterLink to="/sign-up" type="button" class="btn btn-light"><i class="fa-solid fa-user-plus"></i>
            S'enregistrer
          </RouterLink>
        </div>
        <br>
      </div>
    </div>
  </div>
</template>

<!-- eslint-disable prettier/prettier -->
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
        if (error.response.status === 401) {
          this.setErrorMessage("Identifiant ou mot de passe incorrect.");
        }
      }
    },
    ...mapActions(useMessagesStore, ["setErrorMessage"]),
    ...mapActions(useAuthUserStore, ["login"]),
  },
};
</script>

<!-- eslint-disable prettier/prettier -->
<style scoped>
.login-container {
  position: relative;
  height: calc(100vh - 10rem);
  width: 100vw;
  overflow: hidden;
}

.login-form-container {
  position: absolute;
  width: 30vw;
  left: 30%;
  right: 35%;
  top: 20%;
  bottom: 20%;
}
</style>
