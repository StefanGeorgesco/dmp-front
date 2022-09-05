<!-- eslint-disable prettier/prettier -->
<template>
  <header>
    <h1>Dossier médical partagé</h1>
    <nav class="navbar navbar-expand-lg bg-light">
      <div class="container">
        <button ref="navbarToggler" class="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div @click="foldMenu" class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/">
                <i class="fa-solid fa-house"></i>
              </RouterLink>
            </li>
            <li v-show="isAuthenticated && role === 'ADMIN'" class="nav-item">
              <RouterLink class="nav-link" to="/manage-doctors">
                Médecins
              </RouterLink>
            </li>
            <li v-show="isAuthenticated && role === 'ADMIN'" class="nav-item">
              <RouterLink class="nav-link" to="/manage-patient-files">
                Patients
              </RouterLink>
            </li>
            <li v-show="isAuthenticated" class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" @click.stop
                aria-expanded="false">
                {{ username }}
              </a>
              <ul class="dropdown-menu">
                <li v-show="role !== 'ADMIN'">
                  <RouterLink class="dropdown-item" to="/personal-data">
                    Données personnelles</RouterLink>
                </li>
                <li v-show="role !== 'ADMIN'">
                  <hr class="dropdown-divider" />
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click="doLogout">Déconnexion</a>
                </li>
              </ul>
            </li>
            <li v-if="isAuthenticated" class="nav-item">
              <i class="nav-link">{{ roles[role] }}</i>
            </li>
          </ul>
        </div>
      </div>
      <div class="container">
        <transition name="errorMessageTransition">
          <div v-show="showErrorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>
        </transition>
        <transition name="successMessageTransition">
          <div v-show="showSuccessMessage" class="alert alert-success" role="alert">
            {{ successMessage }}
          </div>
        </transition>
      </div>
    </nav>
  </header>
  <main class="main-section">
    <RouterView />
  </main>
</template>

<script>
import { RouterLink, RouterView } from "vue-router";
import { mapState, mapActions } from "pinia";
import { useAuthUserStore } from "./stores/authUserStore.js";
import { useMessagesStore } from "./stores/messagesStore.js";

export default {
  name: "App",
  components: {
    RouterLink,
    RouterView,
  },
  data() {
    return {
      state: 0,
      roles: {
        ADMIN: "Administrateur",
        DOCTOR: "Médecin",
        PATIENT: "Patient",
      },
    };
  },
  created() {
    this.reloadAuth();
  },
  watch: {
    $route() {
      this.state++;
    },
  },
  computed: {
    ...mapState(useMessagesStore, [
      "errorMessage",
      "successMessage",
      "showErrorMessage",
      "showSuccessMessage",
    ]),
    ...mapState(useAuthUserStore, ["isAuthenticated", "role", "username"]),
  },
  methods: {
    foldMenu() {
      this.$refs.navbarToggler.click();
    },
    doLogout() {
      this.logout();
      this.$router.push("/");
    },
    ...mapActions(useAuthUserStore, ["reloadAuth", "logout"]),
  },
};
</script>

<style scoped>
header {
  position: fixed;
  top: 0;
  z-index: 1;
  width: 100%;
  background-color: white;
  margin: 0;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2);
}

header > * {
  margin: 0;
}

header > nav {
  height: 3.5em;
}

header > h1 {
  padding: 0.5rem;
}

.main-section {
  padding: 1rem 0;
  margin: 7rem 0 0;
  box-sizing: border-box;
}

.collapse.navbar-collapse {
  background-color: rgba(var(--bs-light-rgb), var(--bs-bg-opacity));
  padding-left: 1em;
}

.dropdown-menu {
  z-index: 2;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2);
}

.alert {
  padding: 0.25rem 0.5rem;
  position: absolute;
  top: 0.45rem;
  bottom: auto;
  left: 27%;
  z-index: 2;
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
