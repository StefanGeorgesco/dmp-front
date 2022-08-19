import { createRouter, createWebHistory } from "vue-router";
import { useAuthUserStore } from "../stores/authUserStore.js";
import HomeComponent from "../components/HomeComponent.vue";
import LoginComponent from "../components/LoginComponent.vue";
import SignUpComponent from "../components/SignUpComponent.vue";
import PersonalDataComponent from "../components/PersonalDataComponent.vue";
import AddFileComponent from "../components/AddFileComponent.vue";
import ManageFilesComponent from "../components/ManageFilesComponent.vue";
import ViewPatientFileComponent from "../components/ViewPatientFileComponent.vue";

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
      path: "/add-doctor",
      name: "add-doctor",
      component: AddFileComponent,
      props: { type: "doctor" },
      beforeEnter: roleGuard(["ADMIN"]),
    },
    {
      path: "/add-patient-file",
      name: "add-patient-file",
      component: AddFileComponent,
      props: { type: "patientFile" },
      beforeEnter: roleGuard(["DOCTOR"]),
    },
    {
      path: "/manage-doctors",
      name: "manage-doctors",
      component: ManageFilesComponent,
      props: { type: "doctor" },
      beforeEnter: roleGuard(["ADMIN"]),
    },
    {
      path: "/manage-patient-files",
      name: "manage-patient-files",
      component: ManageFilesComponent,
      props: { type: "patientFile" },
      beforeEnter: roleGuard(["ADMIN", "DOCTOR"]),
    },
    {
      path: "/view-patient-file/:id",
      name: "view-patient-file",
      component: ViewPatientFileComponent,
      beforeEnter: roleGuard(["DOCTOR"]),
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
