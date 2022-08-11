import { defineStore } from "pinia";

export const useAuthUserStore = defineStore({
  id: "authUser",
  state: () => ({
    currentUser: {},
    authorization: null,
    errorMessage: '',
    successMessage: ''
  })
});
