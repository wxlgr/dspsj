import api from '../../api/index'
import {
  checkAuth
} from '../../utils/checkAuth'
import {
  formatVideoSize
} from '../../utils/formatVideoSize'

import socket from '../../utils/socket'

Page({
  data: {
    baseUrl: '',
    uid: '',
    tempPhotos: [], //相册暂存地址
    // 最后的作品视频链接
    videoPath: '',
    // 是否已加工
    processed: false,
    // 是否可以发布
    canPublish: false,
    // 是否显示进度条
    showProgress: false,
    // 进度条
    progress: 0,
    video: {
      vtitle: '',
      vdesc: '',
      coverPath: '',
      size: '',
      // 加工后的视频大小
      processedSize: '',
      isPublic: true,
    },
    bgm: {
      bgmPath: ''
    },
    addText:''
  },
  async onLoad(params) {
    if (!checkAuth()) {
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
    try {
      const chooseResult = await wx.chooseMedia({
        mediaType: "video",
        count: 1
      })
      // 视频临时路径
      // 视频封面临时路径
      let {
        tempFilePath,
        thumbTempFilePath,
        fileType
      } = chooseResult.tempFiles[0]
      if (fileType !== 'video') {
        return wx.showToast({
          icon: 'error',
          title: '请选择视频文件',
        })
      }
      const {
        size
      } = await wx.getVideoInfo({
        src: tempFilePath,
      })
      //长度剪辑
      wx.openVideoEditor({
        filePath: tempFilePath,
        success: res => {
          tempFilePath = res.tempFilePath,
            thumbTempFilePath = res.tempThumbPath
        },
        fail: err => {
          console.log(err);
        }
      })
      this.setData({
        videoPath: tempFilePath,
        'video.coverPath': thumbTempFilePath,
        'video.size': formatVideoSize(size),
        processed: false,
        // 之前的图片影集数据复原
        tempPhotos: [],
      })
    } catch (error) {
      console.log(error);
    }

  },
  // 选择封面
  async chooseCover() {
    try {
      const cover = (await wx.chooseMedia({
        mediaType: 'image',
        count: 1
      })).tempFiles[0]
      if (cover.fileType !== 'image') {
        return wx.showToast({
          title: '请选择图片文件',
          icon: 'error'
        })
      }
      this.setData({
        'video.coverPath': cover.tempFilePath
      })
    } catch (err) {
      console.log(err);
    }
  },
  //选择图片
  async choosePhotos() {
    try {
      const chooseResult = await wx.chooseMedia({
        mediaType: 'image',
        // 最多6张
        count: 6
      })
      if (chooseResult.type !== 'image') {
        return wx.showToast({
          title: '请选择图片文件',
          icon: 'error'
        })
      }
      this.setData({
        tempPhotos: chooseResult.tempFiles,
        // 之前的视频数据复原
        videoPath: '',
        // 取第一张图作为影集封面
        'video.coverPath': chooseResult.tempFiles[0].tempFilePath
      })
    } catch (error) {
      console.log(error);
    }

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
      tempPhotos
    } = this.data
    const photos = tempPhotos.concat(chooseResult.tempFiles)

    if (photos.length > 6) {
      wx.showToast({
        icon: 'error',
        title: '最多6张图片!!',
      })
    }
    this.setData({
      tempPhotos: photos.slice(0, 6),
      videoPath: ''
    })
  },
  // 添加文字
 async addText(){
   const r = await wx.showModal({
      title: '添加图集中的视频',
      content: 'FFCreator 图集',
      editable:true,
    })
    if(r.cancel) return;
    this.setData({
      addText:r.content
    })
  },
  // 移除一张图片
  removePhoto(e) {
    const index = +e.target.dataset.index
    const {
      tempPhotos
    } = this.data
    tempPhotos.splice(index, 1)
    this.setData({
      tempPhotos
    })
  },
  //上传发布视频
  async doUploadVideo(event) {
    const {
      videoPath,
      video,
      uid
    } = this.data
    let {
      vtitle,
      vdesc,
      isPublic
    } = event.detail.value;
    // 上传视频
    const {
      result: uploadedVideo
    } = await api.uploadFile(videoPath, 'video')
    // 上传视频封面
    const {
      result: cover
    } = await api.uploadFile(video.coverPath, 'photo')

    console.log(cover, uploadedVideo);
    //数据库添加
    await api.addVideo({
      title: vtitle,
      coverPath: cover.path,
      desc: vdesc,
      author: uid,
      videoPath: uploadedVideo.path,
      isPublic,
    })
    wx.showToast({
      title: '作品发布成功',
    })
    wx.switchTab({
      url: '../mine/index',
    })
  },
  // 跳转bgm页面
  async goBGMPage() {
    wx.navigateTo({
      url: '../bgm/index?chosenAndBack=1',
    })
  },
  //取消bgm
  cancelBgm() {
    this.setData({
      bgm: null,
      processed: false
    })
  },
  //取消addText
  cancelText() {
    this.setData({
      addText: '',
      processed: false
    })
  },
  // 上传图片
  async uploadPhotos() {
    const {
      tempPhotos
    } = this.data
    // 服务器图片绝对地址
    const promises = tempPhotos.map(item => {
      let temp = item.tempFilePath
      return api.uploadFile(temp, 'photos')
    })
    return Promise.all(promises)
  },
  // 加工视频，添加背景音乐
  async processVideo() {
    const {
      videoPath,
      bgm,
      baseUrl
    } = this.data
    if (!bgm.bgmPath || !videoPath) return

    // 上传用于加工的临时视频文件
    const {
      result: video
    } = await api.uploadFile(videoPath, "temp")
    let obj = {
      videoUrl: video.url,
      bgmUrl: baseUrl + bgm.bgmPath
    }
    console.log(obj);
    const {
      taskId
    } = await api.makeVideo(obj)
    // 询问服务器加工进度，cb
    socket.askTask({
      type: 'progress',
      taskId: taskId
    }, (msg) => {
      console.log(msg);
      wx.showLoading({
        title: '视频制作中...'
      })
      if (msg.type === 'progress') {
        // 更新进度
        this.setData({
          showProgress: msg.data === 100 ? false : true,
          progress: msg.data
        })
      } else if (msg.type === 'complete') {
        // 加工完成
        wx.hideLoading()
        wx.showToast({
          title: '加工完成',
        })
        // 下载预览
        wx.downloadFile({
          url: msg.data.url,
          success: async res => {
            if (res.statusCode === 200) {
              const {
                size
              } = await wx.getVideoInfo({
                src: res.tempFilePath,
              })
              console.log(size);
              // 设置预览视频地址
              this.setData({
                videoPath: res.tempFilePath,
                processed: true,
                'video.processedSize': formatVideoSize(size)
              })
              console.log(size, formatVideoSize(size));
              // 删除ffout中加工视频文件，以及用于加工的视频
              api.deleteFile(msg.data.path)
              api.deleteFile(video.path)
            }
          }
        })
      }
    })

  },

  // 制作影集
  async makeAlbums() {
    const {
      bgm,
      baseUrl,
      addText
    } = this.data
    if (!bgm?.bgmPath) return;
    const results = await this.uploadPhotos()
    const photos = results.map(item => item.result.photos[0])
    const photosPathTobeDeleted = results.map(item => item.result.photosPath[0])
    const {
      taskId
    } = await api.makeAlbums({
      bgmUrl: baseUrl + bgm.bgmPath,
      photoUrls: photos,
      addText:addText.trim()
    })
    wx.showLoading({
      title: '影集制作中...',
    })
    // 询问服务器加工进度，cb
    socket.askTask({
      type: 'progress',
      taskId: taskId
    }, (msg) => {
      console.log(msg);
      if (msg.type === 'progress') {
        // 更新进度
        this.setData({
          showProgress: msg.data === 100 ? false : true,
          progress: msg.data
        })
      } else if (msg.type === 'complete') {
        wx.hideLoading()
        wx.showToast({
          title: '制作完成',
        })
        wx.downloadFile({
          url: msg.data.url,
          success: async (res) => {
            if (res.statusCode === 200) {
              const {
                size
              } = await wx.getVideoInfo({
                src: res.tempFilePath,
              })
              // 更新预览video地址
              this.setData({
                videoPath: res.tempFilePath,
                'video.processedSize': formatVideoSize(size),
                processed: true
              })
              // 删除图片文件
              photosPathTobeDeleted.forEach(async filePath => {
                await api.deleteFile(filePath)
              })

              // 删除ffout输出的加工文件
              console.log(msg.data.path);
              api.deleteFile(msg.data.path)
            }
          }
        })

      }
    })

  }
})