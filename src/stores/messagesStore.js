import { defineStore } from "pinia";

export const useMessagesStore = defineStore({
  id: "messages",
  state: () => ({
    errorMessage: "",
    successMessage: "",
    showErrorMessage: false,
    showSuccessMessage: false,
    errorMessageTimeout: null,
    successMessageTimeout: null,
    showErrorMessageTimeout: null,
    showSuccessMessageTimeout: null,
  }),
  actions: {
    setErrorMessage(message) {
      clearTimeout(this.errorMessageTimeout);
      clearTimeout(this.showErrorMessageTimeout);
      this.errorMessageTimeout = setTimeout(() => {
        this.errorMessage = "";
      }, 5000);
      this.showErrorMessageTimeout = setTimeout(() => {
        this.showErrorMessage = false;
      }, 3000);
      this.errorMessage = message;
      this.showErrorMessage = true;
    },
    setSuccessMessage(message) {
      clearTimeout(this.successMessageTimeout);
      clearTimeout(this.showSuccessMessageTimeout);
      this.successMessageTimeout = setTimeout(() => {
        this.successMessage = "";
      }, 5000);
      this.showSuccessMessageTimeout = setTimeout(() => {
        this.showSuccessMessage = false;
      }, 3000);
      this.successMessage = message;
      this.showSuccessMessage = true;
    },
  },
});
