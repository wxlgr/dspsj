<template>
    <div class="settings-btn" @click="openDrawer = true">
        <el-button class="btn">
            <el-icon class="settings-icon">
                <Setting />
            </el-icon></el-button>

    </div>
    <el-drawer v-model="openDrawer" title="系统设置">
        <div class="sideMenu-logoToggle">
            <el-space><span>侧边菜单logo显示与隐藏</span> <el-switch v-model="systemSettingsStore.isShowLogo" /></el-space>
        </div>
        <el-divider />
    </el-drawer>
</template>

<script setup>
import { ref } from 'vue';
import { useSystemSettingsStore } from '@/stores/systemSettingsStore.js'

const systemSettingsStore = useSystemSettingsStore()
// 打开抽屉
const openDrawer = ref(false)

</script>

<style lang="less" scoped>
.settings-btn {
    position: fixed;
    right: 0;
    top: 200px;
    z-index: 100;
    transition: 0.3s;
    &:hover{
        .btn{
            padding-right:30px;
        }
    }

    .btn{
        padding: 0;
        background-color: #fff;
    }
}


.settings-icon {
    font-size: 30px;
    color: #01847f;
}
</style>