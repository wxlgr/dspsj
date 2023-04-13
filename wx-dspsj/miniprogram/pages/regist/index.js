// 注册页
const app = getApp();
import md5 from 'md5'
import api from '../../api/index'
Page({
  data: {},
  onLoad() {},
  doRegist: function (event) {
    const {
      username,
      password
    } = event.detail.value
    // 简单验证
    if (username.length === 0 || password.length === 0) {
      return wx.showToast({
        title: '用户名或密码不能为空',
        icon: 'none',
        duration: 3000
      })
    }
    // 请求后台注册接口
    this.register({
      username,
      nickname: username,
      password: md5(password)
    });
  },
  async register(userObj) {
    // 显示进度条
    wx.showLoading({
      title: '请等待……',
    });
    const data = await api.register(userObj)
    console.log(data);
    wx.hideLoading()
    wx.showToast({
      title: data?.msg,
      icon: data?.code === 0 ? 'success' : 'error'
    })
  },

  // 跳转到登陆页
  goLoginPage: function () {
    wx.navigateTo({
      url: '../login/index',
    })
  }
});