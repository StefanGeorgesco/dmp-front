<template>
  <header>
    <nav class="navbar navbar-expand-lg bg-light">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <RouterLink v-show="currentUser.id && currentUser.role === 'ROLE_ADMIN'" class="nav-link"
                to="/manage-doctors">
                Médecins
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink v-show="currentUser.id && currentUser.role === 'ROLE_ADMIN'" class="nav-link"
                to="/manage-patients">
                Patients
              </RouterLink>
            </li>
            <li v-show="currentUser.id" class=" nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                {{ currentUser.username }}
              </a>
              <ul class="dropdown-menu">
                <li>
                  <RouterLink v-show="currentUser.role !== 'ROLE_ADMIN'" class="dropdown-item"
                    to="/manage-personal-data">
                    Modifier mes données
                    personnelles</RouterLink>
                </li>
                <li>
                  <hr v-show="currentUser.role !== 'ROLE_ADMIN'" class="dropdown-divider">
                </li>
                <li><a class="dropdown-item" href="#" @click="logout">Déconnexion</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router';
import { useAuthUserStore } from './stores/authUserStore.js';
import { mapWritableState } from 'pinia';

export default {
  name: "App",
  created() {
    if (sessionStorage.getItem('userdetails')) {
      this.currentUser = JSON.parse(sessionStorage.getItem('userdetails'));
    }
  },
  methods: {
    logout() {
      this.currentUser = {};
      sessionStorage.removeItem('userdetails');
      sessionStorage.removeItem('Authorization');
      this.$router.push("/")
    }
  },
  computed: {
    ...mapWritableState(useAuthUserStore, ["currentUser"])
  }
}
</script>

<style>
</style>