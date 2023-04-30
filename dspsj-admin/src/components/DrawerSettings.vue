<template>
    <div class="settings-btn" @click="openDrawer = true">
        <el-button class="btn" type="primary">
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

<script setup lang="ts">
import { ref } from 'vue';
import { useSystemSettingsStore } from '@/stores/systemSettingsStore.js'

const systemSettingsStore = useSystemSettingsStore()

const openDrawer = ref(false)

</script>

<style lang="less" scoped>
.settings-btn {
    position: fixed;
    right: -20px;
    top: 200px;
    z-index: 100;
    transition: 0.25s;
    &:hover{
        right: 0;
    }
    .btn{
        padding-left: 0;
    }
}


.settings-icon {
    font-size: 30px;
    color: #fff
}
</style>