<template>
    <div class="nav-top">
        <div class="nav-top-left">
            <div class="toggle-side-menu">
                <div class="collapseBtn" @click="menuStore.isCollapse=!menuStore.isCollapse">
                    <el-icon v-show="menuStore.isCollapse">
                        <Expand />
                    </el-icon>
                    <el-icon v-show="!menuStore.isCollapse">
                        <Fold />
                    </el-icon>
                    {{ menuStore.isCollapse ? "展开" : "收缩" }}
                </div>
            </div>
            <Breadcrumb />
        </div>
        <div class="nav-top-right">
            <div class="user">
                <el-dropdown @command="handleDropDownCommond">
                    <span class="el-dropdown-link">
                        {{ loginStore.username }}
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
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { useLoginStore } from '../stores/loginStore.js'
import { useMenuStore } from '../stores/menuStore.js'
import Breadcrumb from "./Breadcrumb.vue";
const router = useRouter()
const loginStore = useLoginStore()
const menuStore = useMenuStore()
// 处理下拉菜单
function handleDropDownCommond(command) {
    if (command === "logout") {
        ElMessageBox.confirm("确定退出登录?", "提示", {
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            type: "warning",
        }).then(() => {

            // 清楚登录仓库信息
            loginStore.$reset()
            ElMessage({
                type: "success",
                message: "已退出登录",
            });
            router.push("/login");
        }).catch(() => {});

    }
}
</script>

<style lang="less" scoped>
.nav-top {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fffdff;
    padding: 0 20px;
}

.collapseBtn,.nav-top-left{
    display: flex;
    align-items: center;
   
}
.collapseBtn{
    margin-right: 10px;
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