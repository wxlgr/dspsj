// 登陆页
import md5 from 'md5'
import apiUrls from '../../apiUrls/index'
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
  login(userObj) {
    let that = this
    // 显示进度条
    wx.showLoading({
      title: '请等待……',
    });
    wx.request({
      url: apiUrls.login,
      method: 'POST',
      data: userObj,
      success({
        data
      }) {
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
            nickname = '',
            avatarUrl = ''
          } = data.result;
          //保存
          wx.setStorageSync('token', token);
          wx.setStorageSync('userInfo', {
            _id,
            username,
            nickname,
            avatarUrl
          });
          setTimeout(() => {
            wx.reLaunch({
              url: '../mine/index'
            })
          }, 1000)
        }
        wx.hideLoading()
        wx.showToast({
          title: data?.msg,
          icon: token ? 'success' : 'error'
        })
      },
      fail(err) {
        console.log(err);
      }
    })


  },

  // 跳转到注册页事件
  goRegistPage: function () {
    wx.redirectTo({
      url: '../regist/index',
    })
  }
});