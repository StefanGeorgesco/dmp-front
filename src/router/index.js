import { createRouter, createWebHistory } from "vue-router";
import { useAuthUserStore } from "../stores/authUserStore.js";
import HomeComponent from "../components/HomeComponent.vue";
import LoginComponent from "../components/LoginComponent.vue";
import PatientFileComponent from "../components/PatientFileComponent.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeComponent,
    },
    {
      path: "/login",
      name: "login",
      component: LoginComponent,
    },
    {
      path: "/manage-doctors",
      name: "manage-doctors",
      component: HomeComponent,
    },
    {
      path: "/manage-patients",
      name: "manage-patients",
      component: HomeComponent,
    },
    {
      path: "/manage-personal-data",
      name: "manage-personal-data",
      component: PatientFileComponent,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const store = new useAuthUserStore();

  if (to.name !== "login" && !store.currentUser.id) next({ name: "login" });
  else next();
});

export default router;
