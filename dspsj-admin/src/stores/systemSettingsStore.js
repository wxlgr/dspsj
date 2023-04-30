import { defineStore } from "pinia";

export const useSystemSettingsStore = defineStore("systemSettings", {
  state() {
    return {
      isShowLogo: true,
    };
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
      },
    ],
  },
});
