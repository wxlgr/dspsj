<template>
    <div class="nav-top">
        <div class="nav-top-left">
            <div class="toggle-side-menu">
                <div class="collapseBtn" @click="menuStore.isCollapse = !menuStore.isCollapse">
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
                <el-avatar style="margin-right: 10px;width: 40px;height: 40px;" fit="cover"
                    :src="avatarUrl(loginStore.avatarPath) || avatarDefault">
                    {{ loginStore.nickname }}</el-avatar>
                <el-dropdown @command="handleDropDownCommond">
                    <span class="el-dropdown-link">
                        {{ loginStore.nickname }}
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

<script setup >
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { useLoginStore } from '../stores/loginStore.js'
import { useMenuStore } from '../stores/menuStore.js'
import Breadcrumb from "./Breadcrumb.vue";

import config from '@/config/index';
const router = useRouter()
const loginStore = useLoginStore()
const menuStore = useMenuStore()

const avatarUrl = (avatarPath) => {
    return avatarPath ? config.baseUrl + avatarPath : ''
}
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
        }).catch(() => { });

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

.collapseBtn,
.nav-top-left {
    display: flex;
    align-items: center;

}

.collapseBtn {
    margin-right: 10px;
}

.user{
    display: flex;
    align-items: center;
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