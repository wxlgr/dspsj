import api from '../../api/index'
Page({
  data: {
    // 视频内容举报原因列表
    reportReasons: [],
    // 视频播放反馈问题列表
    videoPlayQuestions: [],
    activeIndex: -1,
    // 当前被举报视频的_id
    vid: '',
    // 其他问题的文本绑定
    othersText: ''
  },
  async onLoad(params) {
    // 播放反馈
    if (params.feedback) {
      wx.setNavigationBarTitle({
        title: '视频播放反馈',
      })
      this.setData({
        videoPlayQuestions: (await api.getVideoPlayQuestions())?.result || [],
        vid: params.vid
      })

    } else {
      wx.setNavigationBarTitle({
        title: '视频内容举报',
      })
      this.setData({
        reportReasons: (await api.getReportReasons())?.result || [],
        vid: params.vid
      })
    }


  },
  // 举报
  async submitReport(e) {
    const {
      reportReasons,vid
    } = this.data
    const rid = e.detail.value.report
    const reportTitle = reportReasons.find(r => r.id === rid).title
    let obj = {
      reason:{
        id:rid,
        value:reportTitle
      },
      uid: getApp().uid,
      vid
    }
    const {
      msg
    } = await api.postVideoReport(obj)
    wx.showToast({
      title: msg,
      icon: 'none',
      success: () => {
        setTimeout(() => {
          wx.navigateBack()
        }, 1000)
      }
    })


  },
  // 播放反馈
  async submitVideoPlayFeedback(e) {
    const {
      othersText,
      videoPlayQuestions
    } = this.data
    const rid = e.detail.value.feedback
    const feedbackText = videoPlayQuestions.find(r => r.id === rid).title
    let obj = {
      reason: {
        id: rid,
        value: rid === 'others' ? othersText : feedbackText
      },
      uid: getApp().uid,
      vid: this.data.vid
    }
    const {
      msg
    } = await api.postVideoFeedback(obj)
    wx.showToast({
      title: msg,
      icon: 'none',
      success: () => {
        setTimeout(() => {
          wx.navigateBack()
        }, 1000)
      }
    })


  },
  // 选择举报原因
  reportReasonChange(e) {
    let id = e.detail.value
    let index = this.data.reportReasons.findIndex((reason => reason.id === id))
    this.setData({
      activeIndex: index
    })
  },
  // 选择反馈问题
  videoPlayQuestionsChange(e) {
    let id = e.detail.value
    let index = this.data.videoPlayQuestions.findIndex((reason => reason.id === id))
    this.setData({
      activeIndex: index
    })
  },

  // 其他问题文本 输入绑定
  othersTextInputHanlde(e) {
    this.setData({
      othersText: e.detail.value.trim()
    })
  }



})