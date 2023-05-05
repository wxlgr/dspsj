<template>
  <div class="login-wrapper">
    <div class="model-content">
      <h1 class="title">欢迎登录后台管理系统</h1>
      <el-form ref="loginFormRef" status-icon :model="loginForm" :rules="loginRules">
        <el-form-item label="用户名" label-width="80px" prop="username">
          <el-input :prefix-icon="UserFilled" v-model="loginForm.username" placeholder="请输入用户名" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="80px" prop="password">
          <el-input clearable :prefix-icon="View" v-model="loginForm.password" type="password" placeholder="请输入密码"
            show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="loginbtn" type="primary" @click="submitLoginForm(loginFormRef)">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script  setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

import api from "@/api/index";

import md5 from "md5";
// 图标
import { UserFilled, View } from "@element-plus/icons-vue";

import { useLoginStore } from '@/stores/loginStore.js';
import { ElMessage } from "element-plus";
// import { ElMessage } from "element-plus";
const loginStore = useLoginStore()
// 路由对象
const router = useRouter();

// 登录表单
// prop 必须和v-model字段一致
const loginForm = reactive({
  username: "admin",
  password: "admin",
});

// 原生表单句柄
const loginFormRef = ref();

// 提交登录表单
const submitLoginForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 表单验证通过
      console.log("submit!");
      const { username, password } = loginForm;
      const data = {
        username,
        password: md5(password),
      };
      api.login(data).then((data) => {

        const { code, msg, result, token } = data;
        if(result.role!=='admin') {
          return ElMessage["error"]('登陆失败，您不是管理员');
        }
        ElMessage[code === 0 ? "success" : "error"](msg);
        if (code === 0) {
          loginStore.username = result.username
          loginStore.nickname = result.nickname
          loginStore.token = token
          loginStore.avatarPath = result.avatarPath
          loginStore._id = result._id
          router.push({
            path: "/welcome",
          });
        }
      });
    } else {
      console.log("error submit!", fields);
      return false;
    }
  });
};

// 登录校验规则
const loginRules = reactive({
  username: [
    {
      required: true,
      message: "请输入用户名",
      trigger: "blur",
    },
  ],
  password: {
    required: true,
    message: "请输入密码",
    trigger: "blur",
  }
});
</script>

<style lang="less" scoped>
.login-wrapper {
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: #eee;
  justify-content: center;
  align-items: center;
}

.model-content {
  background-color: #fff;
  width: 500px;
  padding: 50px;
  text-align: center;
  border-radius: 4px;
  box-shadow: 0 0 10px 3px #999;

  h1.title {
    color: #333;
    font-size: 20px;
    margin: 10px 0 30px 0;
  }

  .loginbtn {
    width: 100%;
    height: 40px;
  }
}
</style>