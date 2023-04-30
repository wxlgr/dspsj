import { defineStore } from "pinia";
export const useMenuStore = defineStore("menu", {
  state() {
    return {
      // 是否折叠
     isCollapse:false
    };
  },
  persist:{
    enabled: true,
    strategies: [
      {
        storage: localStorage,
      },
    ],
  },
});

