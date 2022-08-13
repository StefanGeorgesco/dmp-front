import { defineStore } from "pinia";

export const useMessagesStore = defineStore({
  id: "messages",
  state: () => ({
    errorMessage: "",
    successMessage: "",
    errorMessageTimeout: null,
    successMessageTimeout: null,
  }),
  actions: {
    setErrorMessage(message) {
      clearTimeout(this.errorMessageTimeout);
      this.errorMessageTimeout = setTimeout(() => {
        this.errorMessage = "";
      }, 3000);
      this.errorMessage = message;
    },
    setSuccessMessage(message) {
      clearTimeout(this.successMessageTimeout);
      this.successMessageTimeout = setTimeout(() => {
        this.successMessage = "";
      }, 3000);
      this.successMessage = message;
    },
  },
});
