import { defineStore } from "pinia";
import { Service } from "../services/services.js";

export const useAuthUserStore = defineStore({
  id: "authUser",
  state: () => ({
    currentUser: {},
    authorization: null,
  }),
  getters: {
    userId: (state) => state.currentUser.id,
    username: (state) => state.currentUser.username,
    isAuthenticated: (state) => state.currentUser.id != null,
    role: (state) => state.currentUser.role?.split("_")[1],
  },
  actions: {
    reloadAuth() {
      if (sessionStorage.getItem("userdetails")) {
        this.currentUser = JSON.parse(sessionStorage.getItem("userdetails"));
      }
      if (sessionStorage.getItem("authorization")) {
        this.authorization = sessionStorage.getItem("authorization");
      }
    },
    async login(user) {
      let response = await Service.login(user);
      this.currentUser = response.data;
      this.authorization = response.headers.authorization;
      sessionStorage.setItem("userdetails", JSON.stringify(this.currentUser));
      sessionStorage.setItem("authorization", this.authorization);
    },
    logout() {
      this.currentUser = {};
      this.authorization = null;
      sessionStorage.removeItem("userdetails");
      sessionStorage.removeItem("authorization");
    },
  },
});
