import { defineStore } from "pinia";
export const useLoginStore = defineStore("login", {
  state() {
    return {
      token: "",
      username: "",
    };
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "login",
        storage: localStorage,
      },
    ],
  },
});
