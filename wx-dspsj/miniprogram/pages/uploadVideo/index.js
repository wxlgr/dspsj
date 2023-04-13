import api from '../../api/index'
import {
  checkAuth
} from '../../utils/checkAuth'
Page({
  data: {
    uid: '',
    tempFilePath: '', //视频暂存地址
    size: '', //视频大小,
    video: {
      vtitle: '',
      vdesc: '',
      isPublic: true
    }
  },
  async onLoad(params) {
    if (!await checkAuth()) {
      return wx.redirectTo({
        url: '../login/index',
      })
    }
    this.setData({
      uid: getApp().uid
    })
  },
  // title输入框失去焦点
  titleBlur(e) {
    this.setData({
      'video.vtitle': ('' + e.detail.value).trim()
    })
  },
  //选择视频
  async chooseVideo() {
    // 选择视频
    const chooseResult = await wx.chooseMedia({
      mediaType: "video",
      count: 1
    })
    const {
      tempFilePath,
      size
    } = chooseResult.tempFiles[0]
    this.setData({
      tempFilePath,
      size: (size / 1024 / 1024).toFixed(2) + "MB"
    })
  },
  //上传视频
  async doUploadVideo(event) {
    const {
      tempFilePath,
      uid
    } = this.data
    let {
      vtitle,
      vdesc,
      isPublic
    } = event.detail.value;
    // 上传视频
    const {
      result
    } = await api.uploadFile(tempFilePath, 'video')
    // 相对路径和访问地址，相对路径用于数据库存储
    const {
      path,
      url
    } = result
    //数据库添加
    const data = await api.addVideo({
      title: vtitle,
      desc: vdesc,
      author: uid,
      videoPath: path,
      isPublic,
    })
    if (data) {
      wx.showToast({
        title: '作品发布成功',
      })
      wx.switchTab({
        url: '../mine/index',
      })
    }
  },

})