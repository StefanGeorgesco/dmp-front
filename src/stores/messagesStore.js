import { defineStore } from "pinia";

export const useMessagesStore = defineStore({
  id: "messages",
  state: () => ({
    errorMessage: "",
    successMessage: "",
  }),
});
