import { defineStore } from "pinia";

export const useLoaderStore = defineStore({
  id: "loader",
  state: () => ({
    timeouts: new Map(),
    loaders: new Set(),
  }),
  getters: {
    loading: (state) => state.loaders.size > 0,
  },
  actions: {
    setLoader() {
      let id = Math.floor(Math.random() * 100000);
      this.timeouts.set(
        id,
        setTimeout(() => {
          this.loaders.add(id);
        }, 500)
      );
      return id;
    },
    clearLoader(id) {
      clearTimeout(this.timeouts.get(id));
      this.timeouts.delete(id);
      this.loaders.delete(id);
    },
  },
});
