// app.js
import api from './api/index'
App({
  onLaunch: function () {
    this.globalData = {
      // baseUrl: 'http://localhost:3000/',
      baseUrl: 'http://192.168.31.89:3000/',
    }
    this.uid=wx.getStorageSync('userInfo')._id

  }
});