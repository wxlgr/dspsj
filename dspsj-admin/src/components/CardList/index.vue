<template>
    <div class="card-list">
        <template v-for="(card, index) in props.cardList" v-key="card.title">
            <el-card class="box-card">
                <div class="card-body">
                    <div class="icon">
                        <component :style="{ color: bgColors[index], fontSize: '14px' }" :is="Icons[index]"></component>
                    </div>
                    <div class="count">
                        <div class="title">{{ card.title }}(*8k)</div>
                        <div class="num"><strong>{{ formatNumberString(card.count * 8000) }}</strong></div>
                    </div>
                </div>
            </el-card>
        </template>
    </div>
</template>

<script  setup>
import { formatNumberString } from '@/utils/formatNumStr.js';
import { Avatar, VideoCameraFilled, Headset } from '@element-plus/icons-vue';
const props = defineProps({
    cardList:{
        required:true,
        type:Array
    }
})
const bgColors = ['#3498db', '#9b59b6', '#d35400']
const Icons = [Avatar, VideoCameraFilled, Headset]



</script>

<style lang="less" scoped>
.card-list {
    display: flex;
}

.box-card {
    min-width: 200px;
    flex: 1;
    margin: 0 10px;
    .card-body {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1rem;
        .icon {
            min-width: 4vw;
            width: 6vw;
        }
        .count {
            // background-color: #d33a3a;
            text-align: right;
            flex: 1;
            color: #666;
            font-size: 1.2rem;
            strong {
                font-size: 2.6rem;
            }
        }
    }
}
</style>