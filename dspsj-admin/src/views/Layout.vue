<template>
  <div class="container">
    <!-- 悬浮系统设置的抽屉 -->
    <DrawerSettings />
    <!-- 左侧导航栏 -->
    <SideNavs />
    <div class="content-right" :style="{ marginLeft: menuStore.isCollapse ? '64px' : '200px' }">
      <!-- 头部 -->
      <NavTop />
      <!-- 主容器 -->
      <div class="wrapper">
        <div class="main-page">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMenuStore } from "@/stores/menuStore.js";
import SideNavs from "@/components/SideNavs.vue";
import NavTop from "@/components/NavTop.vue";
import DrawerSettings from "@/components/DrawerSettings.vue";

const menuStore = useMenuStore()

</script>

<style lang="less" scoped>
.container {
  height: 100%;
}


.side.collapse+.content-right {
  margin-left: 64px;
}

// 右侧整体
.content-right {
  margin-left: 200px;
}

// 主要容器
.wrapper {
  background-color: #eef0f3;
  // 减去nav-top
  height: calc(100vh - 50px);
  padding: 20px;

  // 页面容器
  .main-page {
    height: 100%;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.5);
  }
}
</style>