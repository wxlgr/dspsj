<template>
  <div class="container">
    <div class="side" :class="{ collapse: isCollapse }">
      <div class="logo">
        <img src="../assets/logo.png" alt="" />
        <h1 v-show="!isCollapse" class="logo-title">dspsj</h1>
      </div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#001529"
        :default-active="activeMenuIndex"
        text-color="#fff"
        router
        class="el-menu-vertical"
        :collapse="isCollapse"
      >
        <el-sub-menu index="/">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>用户管理</span>
          </template>
          <el-menu-item index="/users">用户列表</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/videos">
          <template #title>
            <el-icon><VideoPlay /></el-icon>
            <span>视频管理</span>
          </template>
          <el-menu-item index="/videos">视频列表</el-menu-item>
        </el-sub-menu>
      </el-menu>
      <div class="collapseBtn" @click="isCollapse = !isCollapse">
        <el-icon v-show="isCollapse"><Expand /></el-icon>
        <el-icon v-show="!isCollapse"><Fold /></el-icon>
        菜单
      </div>
    </div>
    <div class="content-right">
      <div class="nav-top">
        <div class="nav-top-left">
          <Breadcrumb />
        </div>
        <div class="nav-top-right">
          <div class="nav-top-right-user-center">
            <el-dropdown @command="handleDropDownCommond">
              <span class="el-dropdown-link">
                admin
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
      <div class="wrapper">
        <div class="main-page">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import store from "../store";
import Breadcrumb from "./Breadcrumb.vue";

const router = useRouter(),
  route = useRoute();

let activeMenuIndex = ref("/users");

watch(route, (newV,oldV) => {
  console.log(1);
},{
  immediate: true
});

// 处理下拉菜单
function handleDropDownCommond(command) {
  if (command === "logout") {
    ElMessageBox.confirm("确定退出登录?", "提示", {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    })
      .then(() => {
        store.commit("saveUserInfo", "");

        ElMessage({
          type: "success",
          message: "已退出登录",
        });

        router.push("/login");
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "logout canceled",
        });
      });
  }
}

// 菜单是否叠收
let isCollapse = ref(false);
</script>

<style lang="less" scoped>
.container {
  height: 100%;
}

.side {
  position: fixed;
  height: 100%;
  width: 200px;
  overflow: hidden;
  background-color: #001529;
  z-index: 1000;
  transition: width 0.3s;
  color: #fff;
  // 去除右边白色边框

  .logo {
    // border: 1px solid #ccc;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .logo-title {
      font-size: 20px;
      color: #fff;
    }
    img {
      width: 80px;
    }
  }
  .el-menu {
    border: 0;
    padding: 0;
  }

  .el-menu-vertical {
    height: calc(100vh - 150px);
    // border: 1px solid yellow;
    overflow: hidden auto;
  }
}

// 折叠时
.side.collapse {
  width: 80px;
  .logo {
    img {
      width: 50px;
    }
  }
}
.side.collapse + .content-right {
  margin-left: 80px;
}

.collapseBtn {
  position: absolute;
  right: 10px;
  bottom: 10px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-right {
  margin-left: 200px;
  .nav-top {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // border-bottom: 1px solid #999;
    background-color: #fffdff;
    padding: 0 20px;
  }
  .wrapper {
    background-color: #eef0f3;
    height: calc(100vh - 50px);
    padding: 20px;

    .main-page {
      height: 100%;
      border-radius: 5px;
      overflow: hidden;
      box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }
  }
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}
.el-dropdown-link:focus {
  border: 0;
  outline: 0;
}
</style>