// pages/HisHome/index.js
import api from '../../api/index'
Page({

  data: {
    uid: '',
    userInfo: {},
    bgUrl: '',
    // 默认背景图路径 在服务器
    defaultBgPath: 'static/assets/bg.png',
    // 默认头像
    avatarDefault: '../../assets/images/noneface.png',
    avatarUrl:'',
    works: []
  },

  async onLoad(options) {
    let uid = options.uid
    if (!uid) {
      wx.navigateBack()
    }
    this.setData({
      uid
    })
    await this.getUserInfo()
    await this.getWorks()
  },
  async onShow() {
    await this.getWorks()
  },
  previewBg() {
    wx.previewImage({
      urls: [this.data.bgUrl]
    })
  },
  //获取用户基本信息
  async getUserInfo() {
    const uid = this.data.uid
    const baseUrl = getApp().globalData.baseUrl
    if (!uid) {
      return
    }
    const {
      result
    } = await api.getHisBasicInfo(uid)
    if (result) {
      this.setData({
        userInfo: result,
        baseUrl,
        bgUrl: result.bgPath ? baseUrl + result.bgPath : baseUrl + this.data.defaultBgPath,
        avatarUrl: result.avatarPath ? baseUrl + result.avatarPath : ''
      })
      await wx.setNavigationBarTitle({
        title: result.nickname.slice(0, 5) + '的主页'
      })
    }
  },

  async getWorks() {
    const {
      uid
    } = this.data
    if (!uid) return;
    const {
      result: works
    } = await api.findUserWorks(uid)
    this.setData({
      works
    })
  },
  // 预览视频
  preViewVideos(e) {
    let index = +e.currentTarget.dataset.index
    const {
      baseUrl,
      works
    } = this.data
    const sources = works.map(video => {
      return {
        url: baseUrl + video.videoPath,
        type: 'video',
        poster: baseUrl + video.coverPath
      }
    })
    wx.previewMedia({
      sources,
      current: index
    })
  },

})