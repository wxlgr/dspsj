import api from '../../api/index'
import {
  checkAuth
} from '../../utils/checkAuth'
Page({
  data: {
    baseUrl: '',
    uid: '',
    tempPhotosPath: [], //相册暂存地址
    // 最后的作品视频链接
    videoPath: '',
    // 是否已加工
    processed: false,
    // 是否可以发布
    canPublish: false,

    video: {
      vtitle: '',
      vdesc: '',
      isPublic: true,
      size: '', //视频大小,
    }
  },
  async onLoad(params) {
    if (!await checkAuth()) {
      return wx.redirectTo({
        url: '../login/index',
      })
    }
    this.setData({
      uid: getApp().uid,
      baseUrl: getApp().globalData.baseUrl
    })

  },
  // title输入 动态绑定video.vtitle
  vtitleInputHandle(e) {
    let vtitle = e.detail.value.trim()
    const {
      videoPath
    } = this.data
    this.setData({
      canPublish: vtitle !== '' && videoPath !== '',
      'video.vtitle': vtitle
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
      videoPath: tempFilePath,
      tempPhotosPath: [],
      'video.size': (size / 1024 / 1024).toFixed(2) + "MB"
    })
  },
  //选择图片
  async choosePhotos() {
    const chooseResult = await wx.chooseMedia({
      mediaType: 'image',
      // 最多6张
      count: 6
    })
    this.setData({
      tempPhotosPath: chooseResult.tempFiles,
      videoPath: ''
    })

  },
  //添加图片
  async addPhotos() {
    // 选择视频
    const chooseResult = await wx.chooseMedia({
      mediaType: 'image',
      // 最多6张
      count: 6
    })

    const {
      tempPhotosPath
    } = this.data
    const photos = tempPhotosPath.concat(chooseResult.tempFiles)

    if (photos.length > 6) {
      wx.showToast({
        icon: 'error',
        title: '最多6张图片!!',
      })
    }
    this.setData({
      tempPhotosPath: photos.slice(0, 6),
      videoPath: ''
    })
  },

  // 移除一张图片
  removePhoto(e) {
    const index = +e.target.dataset.index
    const {
      tempPhotosPath
    } = this.data
    tempPhotosPath.splice(index, 1)
    this.setData({
      tempPhotosPath
    })
  },
  //上传视频
  async doUploadVideo(event) {
    const {
      videoPath,
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
    } = await api.uploadFile(videoPath, 'video')
    // 相对路径和访问地址，相对路径用于数据库存储
    const {
      path,
      url
    } = result
    console.log(result);
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
  // 跳转bgm页面
  goBGMPage() {
    wx.navigateTo({
      url: '../bgm/index?chosenAndBack=1',
    })
  },
  cancelBgm() {
    this.setData({
      bgm: null
    })
  },

  // 加工
  async processVideo() {
    const {
      videoPath,
      bgm,
      baseUrl
    } = this.data
    const {
      result: video
    } = await api.uploadFile(videoPath, "video")
    let obj = {
      videoUrl: video.url,
      bgmUrl: baseUrl + bgm.bgmPath
    }
    console.log(obj);
    wx.showLoading({
      title: '视频加工中...',
    })
    const processVideo = await api.makeVideo(obj)
    if (processVideo) {
      wx.hideLoading()
      wx.downloadFile({
        url: processVideo.result,
        success: (res => {
          if (res.statusCode === 200) {
            this.setData({
              videoPath: res.tempFilePath,
              processed: true
            })
          }
        })
      })

    }
  },

  // 上传图片
  async uploadPhotos() {
    const {
      tempPhotosPath
    } = this.data
    // 服务器图片绝对地址
    const photos = []
    const promises = tempPhotosPath.map(item => {
      let temp = item.tempFilePath
      return api.uploadFile(temp, 'photos')
    })
    return Promise.all(promises)
  },
  // 制作影集
  async makeAlbums() {
    const results = await this.uploadPhotos()
    const photos = results.map(item => item.result.photos[0])
    const photosPathTobeDeleted = results.map(item => item.result.photosPath[0])
    const {
      bgm,
      baseUrl
    } = this.data
    wx.showLoading({
      title: '影集制作中...',
    })
    const album = await api.makeAlbums({
      bgmUrl: baseUrl + bgm.bgmPath,
      photoUrls: photos
    })
    if (album) {
      console.log(album);
      wx.hideLoading()
      wx.showToast({
        title: '制作成功',
      })
      wx.downloadFile({
        url: album.result,
        success: (res => {
          if (res.statusCode === 200) {
            this.setData({
              videoPath: res.tempFilePath,
              processed: true
            })
          }
        })
      })
    
    }
    // 删除文件
    photosPathTobeDeleted.forEach(async filePath => {
      await api.deleteFile(filePath)
    })
  }
})