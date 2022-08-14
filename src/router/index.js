import { createRouter, createWebHistory } from "vue-router";
import { useAuthUserStore } from "../stores/authUserStore.js";
import HomeComponent from "../components/HomeComponent.vue";
import LoginComponent from "../components/LoginComponent.vue";
import SignUpComponent from "../components/SignUpComponent.vue";
import PersonalDataComponent from "../components/PersonalDataComponent.vue";
import AddPatientFileComponent from "../components/AddPatientFileComponent.vue";
import AddDoctorComponent from "../components/AddDoctorComponent.vue";
import ManageFilesComponent from "../components/ManageFilesComponent.vue";

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
      path: "/personal-data",
      name: "personal-data",
      component: PersonalDataComponent,

      beforeEnter: roleGuard(["DOCTOR", "PATIENT"]),
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
      component: ManageFilesComponent,
      props: { type: "DOCTOR" },
      beforeEnter: roleGuard(["ADMIN"]),
    },
    {
      path: "/manage-patient-files",
      name: "manage-patient-files",
      component: ManageFilesComponent,
      props: { type: "PATIENT" },
      beforeEnter: roleGuard(["ADMIN", "DOCTOR"]),
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
