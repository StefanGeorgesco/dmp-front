import { defineStore } from "pinia";

export const useAuthUserStore = defineStore({
  id: "authUser",
  state: () => ({
    currentUser: {},
    authorization: null,
  }),
  getters: {
    isAuthenticated: (state) => state.currentUser.id != null,
    role: (state) => state.currentUser.role?.split("_")[1],
  },
});
