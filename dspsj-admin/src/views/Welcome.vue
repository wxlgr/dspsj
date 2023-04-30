<template>
  <div class="welcome">
    <div class="content">
      <div class="sub-title">欢迎使用</div>
      <div class="title">短视频社交 后台管理系统</div>
      <div class="description">Vue3 + Element-plus+ Express + MongooDB</div>
    </div>
    <div class="img">
      <img src="https://img.yzcdn.cn/vant/logo.png" alt="" />
    </div>
  </div>
</template>



<style lang="less" scoped>
.welcome {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f5faff;
}

.content {
  margin-right: 100px;

  .sub-title {
    font-size: 1.4rem;
    line-height: 1.5;
    color: #333;
  }

  .title {
    font-size: 2rem;
    line-height: 1.5;
    color: #0075ff;
  }

  .description {
    font-size: 1rem;
    line-height: 32px;
    color: #999;

    text-align: right;
  }
}

.img {
  width: 20%;

  img {
    width: 100%;
  }
}
</style>