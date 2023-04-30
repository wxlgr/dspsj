<template>
  <div class="container">
   <div class="notfound-img">
    <el-image  :src="notfoundImg"/>
   </div>
    <router-link class="back-home" to="/">返回首页</router-link>
  </div>
</template>

<script lang="ts"  setup>
import notfoundImg from '../assets/404.gif'
</script>

<style lang="less" scoped>
.container{
    display: flex;
    flex-direction: column; 
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.notfound-img{
  width: 30%;
}
.back-home{
  color: #63BBFC;
  font-size: 30px;
  text-decoration: underline;
}
</style>