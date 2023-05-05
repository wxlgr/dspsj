<template>
    <div class="side" :class="{ collapse: menuStore.isCollapse }">
        <div v-show="systemSettingsStore.isShowLogo" class="logo">
            <img src="@/assets/logo.png" alt="" />
            <h1 v-show="!menuStore.isCollapse" class="logo-title">dspsj</h1>
        </div>
        <el-menu active-text-color="#ffd04b" background-color="#001529" :default-active="activeMenuIndex" text-color="#fff"
            router class="el-menu-vertical" :collapse="menuStore.isCollapse">
            <el-menu-item index="/welcome">
                <el-icon>
                    <House />
                </el-icon>
                <span>首页</span>
            </el-menu-item>
            <el-menu-item index="/overview">
                <el-icon>
                    <Histogram />
                </el-icon>
                <span>概览统计图表</span>
            </el-menu-item>
            <el-menu-item index="/users">
                <el-icon>
                    <UserFilled />
                </el-icon>
                <span>用户管理</span>
            </el-menu-item>
            <el-menu-item index="/videos">
                <el-icon>
                    <VideoCameraFilled />
                </el-icon>
                <span>视频管理</span>
            </el-menu-item>
            <el-menu-item index="/bgms">
                <el-icon>
                    <Headset />
                </el-icon>
                <span>bgm管理</span>
            </el-menu-item>
            <el-sub-menu index="/reports_feedbacks">
                <template #title>
                    <el-icon>
                        <Promotion />
                    </el-icon>
                    <span>视频举报与反馈</span>
                </template>
                <el-menu-item index="/reports">
                    <el-icon>
                        <Message />
                    </el-icon>
                    <span>视频内容举报</span>
                </el-menu-item>
                <el-menu-item index="/feedbacks">
                    <el-icon>
                        <BellFilled />
                    </el-icon>
                    <span>视频播放反馈</span>
                </el-menu-item>
            </el-sub-menu>


        </el-menu>
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
</template>

<script setup >
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useMenuStore } from "@/stores/menuStore.js";
import { useSystemSettingsStore } from '@/stores/systemSettingsStore.js'

const route = useRoute();
const menuStore = useMenuStore();
const systemSettingsStore = useSystemSettingsStore()

// 选中的菜单
const activeMenuIndex = ref("/users");


// 地址栏手动改变url时，菜单跟随刷新
watch(
    () => route.path,
    (newVal, oldVal) => {
        activeMenuIndex.value = newVal;
    },
    {
        immediate: true,
    }
);


</script>


<style lang="less" scoped>
.side {
    position: fixed;
    height: 100%;
    width: 200px;
    overflow: hidden;
    background-color: #001529;
    z-index: 1;
    transition: width 0.3s ease-in;
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
            color: #ff6700;
            font-weight: bold;
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

    }
}

// 菜单折叠时
// 折叠时
.side.collapse {
    width: 64px;

    .logo {
        img {
            width: 40px;
        }
    }
}


// 折叠菜单的按钮
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
}</style>
