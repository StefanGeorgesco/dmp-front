import { createRouter, createWebHistory } from "vue-router";
import { useAuthUserStore } from "../stores/authUserStore.js";
import HomeComponent from "../components/HomeComponent.vue";
import LoginComponent from "../components/LoginComponent.vue";
import SignUpComponent from "../components/SignUpComponent.vue";
import AddPatientFileComponent from "../components/AddPatientFileComponent.vue";
import AddDoctorComponent from "../components/AddDoctorComponent.vue";
import PatientFileComponent from "../components/PatientFileComponent.vue";

const roleGuard = (roles) => {
  return () => {
    const store = useAuthUserStore();
    if (!roles.includes(store.role)) {
      return { path: "/" };
    } else {
      return true;
    }
  };
};

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
      path: "/sign-up",
      name: "sign-up",
      component: SignUpComponent,
    },
    {
      path: "/add-patient-file",
      name: "add-patient-file",
      component: AddPatientFileComponent,
      beforeEnter: roleGuard(["DOCTOR"]),
    },
    {
      path: "/add-doctor",
      name: "add-doctor",
      component: AddDoctorComponent,
      beforeEnter: roleGuard(["ADMIN"]),
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
      component: PatientFileComponent, // for test
    },
  ],
});

router.beforeEach((to, from, next) => {
  const store = useAuthUserStore();

  if (to.name !== "login" && to.name !== "sign-up" && !store.isAuthenticated) {
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;
