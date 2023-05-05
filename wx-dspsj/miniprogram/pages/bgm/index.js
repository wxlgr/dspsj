// pages/bgm/index.js
import api from '../../api/index';
import {
  formatAudioTime
} from '../../utils/formatAudioTime'
// 
let player = null
Page({
  data: {
    // tab下标
    baseUrl: '',
    uid: '',
    currentIndex: 0,
    bgmList: [],
    myBgms: [

    ],
    // 正在播放的bgm在数组的下标
    playingIndex: -1
  },
  onLoad(options) {
    this.setData({
      options,
      uid: getApp().uid,
      baseUrl: getApp().globalData.baseUrl
    })

    this.initBgmPlayer()
    this.getBgms()
  },
  // 离开页面时
  onUnload() {
    if (player) {
      player.stop()
      player = null
    }
  },
  // 跳转播放页
  goPlayBgm(e) {
    const index = +e.target.dataset.index;
    const {
      currentIndex,
      myBgms,
      bgmList
    } = this.data
    const bgms = currentIndex === 0 ? bgmList : myBgms
    const bgm = bgms[index]
    wx.navigateTo({
      url: '../playBgm/index',
      success: (res => {
        res.eventChannel.emit('bgm', bgm)
      })
    })
  },

  // 初始化音乐播放
  initBgmPlayer() {
    player = wx.createInnerAudioContext()
    player.onCanplay(res => {
      // 调用这个才能触发 onTimeUpdate
      (player?.duration)
    })
    player.onTimeUpdate(() => {
      const {
        playingIndex,
        bgmList
      } = this.data
      const bgm = bgmList[playingIndex]
      bgm.progressText = `${formatAudioTime(player.currentTime)}/${formatAudioTime(player.duration)}`
      // console.log(player.currentTime, player.duration);
      this.setData({
        bgmList
      })
    })
    player.onEnded(res => {
      const {
        bgmList,
        playingIndex
      } = this.data
      // 改变上一次播放的播放状态
      if (playingIndex >= 0) {
        bgmList[playingIndex].isPlaying = false
        bgmList[playingIndex].progressText = ''
      }
      this.setData({
        bgmList
      })
    })
  },

  // 获取bgm
  async getBgms() {
    const {
      baseUrl
    } = this.data
    const {
      result: bgms
    } = await api.findAllBGMs()
    this.setData({
      bgmList: bgms
    })
  },
  // 获取用户bgm
  async getMyBgms() {
    console.log('获取我的bgms');
    const {
      baseUrl,
      uid
    } = this.data
    const {
      result: bgms
    } = await api.findUserBgms(uid)
    this.setData({
      myBgms: bgms
    })
  },
  // 新增bgm
  async addBGM() {
    const {
      tempFiles
    } = await wx.chooseMessageFile({
      count: 1
    })
    const tempBgm = tempFiles[0]

    if (!tempBgm.name.endsWith('.mp3')) {
      return wx.showToast({
        icon: "error",
        title: '仅支持mp3格式！',
      })
    }
    // 上传文件到服务器
    const {
      result: file
    } = await api.uploadFile(tempBgm.path, "bgm")
    //  数据库添加
    const bgmAdded = await api.addBGM({
      uid: this.data.uid,
      title: tempBgm.name,
      bgmPath: file.path
    })
    if (bgmAdded) {
      wx.showToast({
        title: bgmAdded.msg
      })
      this.getMyBgms()
    }
  },
  // 修改bgm名称
  async changeBgmName(e) {
    const index = +e.target.dataset.index
    const {
      myBgms
    } = this.data
    const bgm = myBgms[index]

    let {
      content: newTitle
    } = await wx.showModal({
      title: '修改bgm名称',
      content: bgm.title,
      editable: true,
      placeholderText: ''
    })
    if (newTitle) {
      newTitle = newTitle.trim()
      bgm.title = newTitle
      // ui跟新
      this.setData({
        myBgms
      })
      //数据库更改
      const {
        code,
        msg
      } = await api.updateBgm(bgm)
      wx.showToast({
        icon: code === 0 ? 'success' : 'error',
        title: msg,
      })
    }

  },
  // 删除bgm
  async deleteBGM(e) {

    const res = await wx.showModal({
      title: '确认删除此bgm?'
    })
    if (res.cancel) {
      return
    }
    const index = +e.target.dataset.index
    const {
      myBgms
    } = this.data
    const bgm = myBgms.splice(index, 1)[0]
    console.log(bgm);
    // UI更新
    this.setData({
      myBgms
    })
    // 数据库删除
    await api.deleteBgm(bgm._id)
    // 删除文件
    await api.deleteFile(bgm.bgmPath)
    wx.showToast({
      title: '删除成功',
    })
  },

  downLoadBgm(e) {
    const {
      bgmList,
      baseUrl
    } = this.data
    const index = +e.target.dataset.index
    const bgm = bgmList[index]

    wx.downloadFile({
      url: baseUrl + bgm.bgmPath,
      success: (res => {
        // 保存视频到相册
        wx.saveVideoToPhotosAlbum({
          filePath: res.tempFilePath,
        }).then(res => {
          wx.showToast({
            title: '下载成功',
          })
        }).catch(err => {
          wx.showToast({
            icon: 'error',
            title: '已取消下载',
          })
        })
      })
    })
  },
  // 
  playMusic(e) {
    this.resetPlayerUI()
    const index = +e.target.dataset.index
    const {
      bgmList,
      baseUrl
    } = this.data
    const bgm = bgmList[index]
    bgm.isPlaying = true
    player.src = baseUrl + bgm.bgmPath
    this.setData({
      bgmList,
      playingIndex: index
    })
    player.play()
  },
  stopMusic(e) {
    this.resetPlayerUI()
  },
  chooseBgm(e) {
    // console.log(bgm);
    const pages = getCurrentPages()
    const prePage = pages[pages.length - 2]
    if (!this.data.options.chosenAndBack || prePage.__route__ !== "pages/uploadVideo/index") {
      return
    }
    const {
      currentIndex,
      myBgms,
      bgmList
    } = this.data
    const bgms = currentIndex === 0 ? bgmList : myBgms
    const index = +e.target.dataset.index
    prePage.setData({
      bgm: bgms[index]
    })
    wx.navigateBack()
  },


  // 点击tab
  changeTab(e) {
    this.setData({
      currentIndex: +e.target.dataset.index
    })
  },
  // swiper切换
  bgmSwiperChange(e) {
    let index = +e.detail.current
    this.setData({
      currentIndex: index
    })
    if (index === 1) {
      this.getMyBgms()
    }
    if (index === 0) {
      this.getBgms()
    }
    this.resetPlayerUI()

  },
  // 重置播放器和ui
  resetPlayerUI() {
    const {
      bgmList,
      playingIndex
    } = this.data
    if (player && playingIndex >= 0) {
      // 改变上一次播放的播放状态
      if (playingIndex >= 0) {
        bgmList[playingIndex].isPlaying = false
        bgmList[playingIndex].progressText = ''
      }
      this.setData({
        bgmList
      })
      player.stop()
    }
  }
})