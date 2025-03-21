// 登陆页
import md5 from 'md5'
import api from '../../api/index'
Page({
  data: {
    // 处于登录、注册
    isLogin: true,
  },
  // 加载时
  onLoad: (params) => {

  },
  // 切换登录、注册
  toggleIsLogin() {
    this.setData({
      isLogin: !this.data.isLogin
    })
  },

  // 提交表单，进行登录或者注册
  submitForm: function (event) {
    let {
      username,
      password
    } = event.detail.value
    //去掉首尾空格
    username = username.trim()
    password = password.trim()
    // 简单验证
    if (username === "" || password === "") {
      return wx.showToast({
        title: '用户名或密码不能为空',
        icon: 'none'
      })
    }
    const {
      isLogin
    } = this.data

    
    let obj = {
      username,
      password: md5(password),
      // 用户名是admin，则默认为管理员，可以登录web-admin后台
      role:username ==='admin'?'admin':'user'
    }
    // 请求后端登陆获注册
    if (isLogin) {
      this.login(obj)
    } else {
      this.register(obj)
    }

  },
  async login(userObj) {
    const data = await api.login(userObj)
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
      getApp().uid = _id
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
  async register(userObj) {
    const data = await api.register(userObj)
    wx.showToast({
      title: data?.msg,
      icon: data?.code === 0 ? 'success' : 'error'
    })
  },

});