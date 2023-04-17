// pages/playVideo/index.js
Page({
  data: {
    videoUrl: '',
    videoInfo: {}
  },
  onLoad(options) {
    const baseUrl = getApp().globalData.baseUrl
    this.player = wx.createVideoContext('video')
    const eventChannel = this.getOpenerEventChannel()
    // 接受
    eventChannel.on('video', (data) => {
      this.setData({
        videoUrl: baseUrl + data.videoPath,
        video: data
      })
      this.player.play()
    })

    // 获取视频meta信息
    wx.downloadFile({
      url: this.data.videoUrl,
      success: (async res => {
        if (res.statusCode === 200) {
          const videoInfo = await wx.getVideoInfo({
            src: res.tempFilePath,
          })
          this.setData({
            videoInfo: {
              ...videoInfo,
              size: (videoInfo.size / 1024).toFixed(2)
            }
          })
        }
      })

    })

  },


})