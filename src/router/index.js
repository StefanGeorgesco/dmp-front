import { createRouter, createWebHistory } from "vue-router";
import HomeComponent from "../components/HomeComponent.vue";
import LoginComponent from "../components/LoginComponent.vue";
import PatientFileComponent from "../components/PatientFileComponent.vue";

let user = {};

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
  user = JSON.parse(sessionStorage.getItem('userdetails'));

  if (to.name !== 'login' && !user) next({ name: 'login' })
  else next()
})

export default router;
