// 登陆页
import md5 from 'md5'
import api from '../../api/index'
Page({
  data: {},
  // 加载时
  onLoad: (params) => {},
  // 登陆事件
  doLogin: function (event) {
    let {
      username,
      password
    } = event.detail.value
    //去掉首尾空格
    username = username.trim()
    password = password.trim()
    // 简单验证
    if (username == "" || password == "") {
      return wx.showToast({
        title: '用户名或密码不能为空',
        icon: 'none',
        duration: 2000
      })
    }
    // 请求后端登陆
    this.login({
      username,
      password: md5(password)
    })

  },
  async login(userObj) {
    const data = await api.login(userObj)
    console.log(data)
    let {
      token
    } = data
    if (token) {
      //登录成功
      //记录用户信息
      const {
        _id,
        username,
        avatarPath
      } = data.result;
      //保存
      getApp().globalData.logined = true
      wx.setStorageSync('token', token);
      wx.setStorageSync('userInfo', {
        _id,
        username,
        avatarPath
      });
      setTimeout(() => {
        wx.reLaunch({
          url: '../mine/index'
        })
      }, 1000)
    }
    wx.showToast({
      title: data?.msg,
      icon: data.code === 0 ? 'success' : 'error'
    })
  },

  // 跳转到注册页事件
  goRegistPage: function () {
    wx.redirectTo({
      url: '../regist/index',
    })
  }
});