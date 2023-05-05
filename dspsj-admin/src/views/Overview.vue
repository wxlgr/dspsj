<template>
    <div>
        <h2>概览统计卡片</h2>
        <!-- 卡片统计列表 -->
        <CardList :cardList="cardList"/>
        <h2>echarts图表</h2>
        <div class="charts-list">
            <el-card class="echart" id="bar">
            </el-card>
            <el-card class="echart" id="pie">
            </el-card>
            <el-card class="echart" id="pie2">
            </el-card>
        </div>
    </div>
</template>
  
<script setup>
import api from '@/api/index.js';
import CardList from '@/components/CardList/index.vue';
import { onMounted, getCurrentInstance,ref } from 'vue';
const { proxy } = getCurrentInstance()
const cardList = ref([])

onMounted(async () => {
    cardList.value = (await api.getCardList()).result
    proxy.$bar('bar',cardList.value)
    proxy.$pie('pie',cardList.value)
    proxy.$pie2('pie2',cardList.value)
})

</script>
  
<style lang="less" scoped>
h2 {
    margin: 10px;
    font-size: 1.6rem;
    min-width: 200px;
    color: #01847f;
}

.charts-list {
    height: 360px;
    display: flex;
    .echart {
        min-width: 200px;
        flex: 1;
        margin: 0 10px;
        padding: 20px;
    }
}
</style>