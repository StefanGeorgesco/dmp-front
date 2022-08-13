<template>
  <header>
    <h1>Dossier médical partagé</h1>
  </header>
  <nav class="navbar navbar-expand-lg bg-light">
    <div class="container-fluid">
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">
              <i class="fa-solid fa-house"></i>
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink
              v-show="isAuthenticated && role === 'ADMIN'"
              class="nav-link"
              to="/manage-doctors"
            >
              Médecins
            </RouterLink>
          </li>
          <li class="nav-item" v-show="isAuthenticated && role === 'ADMIN'">
            <RouterLink class="nav-link" to="/manage-patients">
              Patients
            </RouterLink>
          </li>
          <li v-show="isAuthenticated" class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ currentUser.username }}
            </a>
            <ul class="dropdown-menu">
              <li v-show="role !== 'ADMIN'">
                <RouterLink class="dropdown-item" to="/manage-personal-data">
                  Mes données personnelles</RouterLink
                >
              </li>
              <li v-show="role !== 'ADMIN'">
                <hr class="dropdown-divider" />
              </li>
              <li>
                <a class="dropdown-item" href="#" @click="logout"
                  >Déconnexion</a
                >
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <main>
    <section>
      <div class="container">
        <transition name="errorMessageTransition">
          <div v-show="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>
        </transition>
        <transition name="successMessageTransition">
          <div v-show="successMessage" class="alert alert-success" role="alert">
            {{ successMessage }}
          </div>
        </transition>
      </div>
    </section>
    <section>
      <RouterView />
    </section>
  </main>
</template>

<script>
import { RouterLink, RouterView } from "vue-router";
import { mapState, mapWritableState } from "pinia";
import { useAuthUserStore } from "./stores/authUserStore.js";
import { useMessagesStore } from "./stores/messagesStore.js";

export default {
  name: "App",
  components: {
    RouterLink,
    RouterView,
  },
  created() {
    if (sessionStorage.getItem("userdetails")) {
      this.currentUser = JSON.parse(sessionStorage.getItem("userdetails"));
    }
    if (sessionStorage.getItem("authorization")) {
      this.authorization = sessionStorage.getItem("authorization");
    }
  },
  methods: {
    logout() {
      this.currentUser = {};
      this.authorization = null;
      sessionStorage.removeItem("userdetails");
      sessionStorage.removeItem("authorization");
      this.$router.push("/");
    },
  },
  computed: {
    ...mapWritableState(useAuthUserStore, [
      "currentUser",
      "authorization",
      "isAuthenticated",
      "role",
    ]),
    ...mapState(useMessagesStore, ["errorMessage", "successMessage"]),
  },
};
</script>

<style scoped>
nav,
.container,
.alert {
  height: 4em;
}

.errorMessageTransition-enter-from,
.successMessageTransition-enter-from,
.errorMessageTransition-leave-to,
.successMessageTransition-leave-to {
  opacity: 0;
}

.errorMessageTransition-enter-active,
.successMessageTransition-enter-active,
.errorMessageTransition-leave-active,
.successMessageTransition-leave-active {
  transition: opacity 2s;
}
</style>
