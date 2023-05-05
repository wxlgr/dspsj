import { defineStore } from "pinia";
export const useLoginStore = defineStore("login", {
  state() {
    return {
      token: "",
      username: "",
      nickname:'',
      avatarPath: "",
      _id:''
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
