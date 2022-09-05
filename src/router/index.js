import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthUserStore } from "../stores/authUserStore.js";
import HomeComponent from "../components/HomeComponent.vue";
import LoginComponent from "../components/LoginComponent.vue";
import SignUp from "../components/SignUp.vue";
import PersonalData from "../components/PersonalData.vue";
import AddFile from "../components/AddFile.vue";
import ManageFiles from "../components/ManageFiles.vue";
import PatientFile from "../components/PatientFile.vue";

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
  history: createWebHashHistory(),
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
      component: SignUp,
    },
    {
      path: "/personal-data",
      name: "personal-data",
      component: PersonalData,
      beforeEnter: roleGuard(["DOCTOR", "PATIENT"]),
    },
    {
      path: "/add-doctor",
      name: "add-doctor",
      component: AddFile,
      props: { type: "doctor" },
      beforeEnter: roleGuard(["ADMIN"]),
    },
    {
      path: "/add-patient-file",
      name: "add-patient-file",
      component: AddFile,
      props: { type: "patientFile" },
      beforeEnter: roleGuard(["DOCTOR"]),
    },
    {
      path: "/manage-doctors",
      name: "manage-doctors",
      component: ManageFiles,
      props: { type: "doctor" },
      beforeEnter: roleGuard(["ADMIN"]),
    },
    {
      path: "/manage-patient-files",
      name: "manage-patient-files",
      component: ManageFiles,
      props: { type: "patientFile" },
      beforeEnter: roleGuard(["ADMIN", "DOCTOR"]),
    },
    {
      path: "/view-patient-file/:id",
      name: "view-patient-file",
      component: PatientFile,
      beforeEnter: roleGuard(["DOCTOR"]),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const store = useAuthUserStore();

  if (to.name !== "login" && to.name !== "sign-up" && !store.isAuthenticated) {
    next({ name: "login" });
  } else if (to.name === "login" && store.isAuthenticated) {
    next({ name: "home" });
  } else {
    next();
  }
});

export default router;
