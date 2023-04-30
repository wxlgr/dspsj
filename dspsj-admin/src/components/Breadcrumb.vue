<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="item in breadCrumbList" :key="item.name" :to="{ path: item.path }">{{ item?.meta?.title ||
      "" }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script  lang="ts" setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();

// 面包屑数据
const breadCrumbList = computed(() => {
  return route.matched;
});
</script>

<style lang="less" scoped></style>