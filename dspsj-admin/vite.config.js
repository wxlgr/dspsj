import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from "unplugin-element-plus/vite";

export default defineConfig({
  plugins: [
    Vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    // 手动导入，已带样式
    ElementPlus(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
