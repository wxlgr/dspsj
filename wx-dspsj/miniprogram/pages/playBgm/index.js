import {
  formatAudioTime
} from '../../utils/formatAudioTime'

let player = null

Page({
  data: {
    bgm: {},
    // 进度
    percent: 0,
    nowTime: '',
    allTime: '',
    isPlaying: true
  },
  onLoad() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('bgm', bgm => {
      this.setData({
        bgm,
        baseUrl: getApp().globalData.baseUrl
      })
    })

    this.initAudioPlayer()
  },
  onUnload() {
    player.stop()
  },
  playMusic() {
    if (player) {
      player.play()
      this.setData({
        isPlaying: true
      })
    }

  },
  pauseMusic() {
    if (player) {
      player.pause()
      this.setData({
        isPlaying: false
      })
    }
  },

  bindchanging(e) {
    player.pause()
    this.setData({
      isPlaying: false
    })
  },
  bindchanged(e) {
    const percent = +e.detail.value * player.duration / 100
    player.seek(percent)
    player.play()
    this.setData({
      isPlaying: true
    })
  },
  initAudioPlayer() {
    player = wx.createInnerAudioContext()
    const {
      bgm,
      baseUrl
    } = this.data
    player.src = baseUrl + bgm.bgmPath
    player.play()
    player.onCanplay(() => {
      (player.duration)
    })
    player.onTimeUpdate(() => {
      // console.log(player.currentTime,player.duration);
      this.setData({
        allTime: formatAudioTime(player.duration),
        nowTime: formatAudioTime(player.currentTime),
        percent: player.currentTime * 100 / player.duration
      })
    })

    player.onEnded(()=>{
      player.seek(0)
      player.play()
    })
  },
  update() {

  }


})