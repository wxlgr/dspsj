import {
  formatDate
} from '../../utils/dateFormat'
import {
  checkAuth
} from '../../utils/checkAuth'
import api from '../../api/index'
// 播放器
let player = null

Page({
  data: {
    avatarDefault: '../../assets/images/noneface.png',
    baseUrl: '',
    userInfo: {},
    videoList: [], // 视频列表
    // 第几页视频
    pageIndex: 1,
    totalCount: 0,
    totalSize: 0,
    currentIndex: 0, //当前在播视频index
    // 留言内容绑定
    mysay: '',

    // 展示分享模态框
    isShowShareModal: false,
    // 在操作的视频
    video_Chosen: {}
  },

  // 页面加载
  onLoad: async function (params) {
    this.setData({
      baseUrl: getApp().globalData.baseUrl,
    })
    if (!checkAuth()) {
      return wx.redirectTo({
        url: '../login/index',
      })
    }

    //查询用户喜爱、收藏记录
    await this.getUserInfo()
    //获取视频列表
    await this.getVideosByPage()
    // 播放第一个视频
    player = wx.createVideoContext(`video0`)
    player.play()

  },
  async onShow() {
    await this.getUserInfo()
    //查询用户喜爱、收藏记录
    //获取视频列表
    await this.getVideosByPage(1, true)
  },
  // 离开时，关闭分享模态框
  onHide() {
    this.closeShareModal()
    if (player) {
      player.stop()
    }
  },

  // 
  //获取用户基本信息
  async getUserInfo() {
    const uid = getApp().uid
    if (!uid) {
      return
    }
    const {
      result
    } = await api.getUserInfo(uid)
    if (result) {
      this.setData({
        userInfo: result,
      })
    }

  },
  //获取视频列表
  async getVideosByPage(pIndex = 1, refresh = false) {
    const {
      result
    } = await api.findPublicVideosByPage({
      pageIndex: pIndex,
      pageSize: 5
    })
    const videos = result.list
    this.setData({
      totalCount: result.totalCount,
      totalSize: result.totalSize,
    })
    //  return  console.log(result);
    let {
      baseUrl,
      avatarDefault,
      userInfo,
      videoList,
      pageIndex
    } = this.data
    // 给视频对象添加一些属性
    videos.map(video => {
      // 修正作者头像路径
      if (video.author) {
        video.author.avatarUrl = video.author.avatarPath ? baseUrl + video.author.avatarPath : avatarDefault
      }
      // 修正视频地址
      video.videoUrl = baseUrl + video.videoPath
      let meta = {
        //是否展示评论 默认不展示
        isShowComments: false,
        // 是否被用户喜欢、点赞
        isUserLiked: userInfo.likes.includes(video._id),
        // 是否被用户收藏
        isUserCollected: userInfo.collects.includes(video._id),
        // 视频作者是否被用户关注
        isAuthorFollowedByUser: userInfo.follows.includes(video.author._id)
      }
      // 合并属性
      Object.assign(video, {
        meta
      })
    })
    if (!refresh) {
      videoList.push(...videos)
    } else {
      videoList = videos,
        this.setData({
          pageIndex: 1,
          videoList
        })
    }
    this.setData({
      videoList
    })

  },
  bindanimationfinish(e) {
    const {
      currentIndex,
      videoList,
      pageIndex,
      totalSize
    } = this.data
    // 在最后一页触发了上拉
    if (currentIndex === videoList.length - 1) {

      if (pageIndex < totalSize) {
        this.getVideosByPage(pageIndex + 1)
        this.setData({
          pageIndex: pageIndex + 1
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '没有更多了',
        })
      }
    }
  },
  //滑动切换
  onMySwiperChange(e) {
    let newIndex = +e.detail.current
    if (player) {
      player.stop()
    }
    player = wx.createVideoContext(`video${newIndex}`)
    player.play()
    this.setData({
      currentIndex: newIndex,
    })
  },

  clickAuthor() {
    let {
      videoList,
      currentIndex
    } = this.data;
    const video = videoList[currentIndex]
    wx.showToast({
      icon: 'none',
      title: '我是作者' + video.author.username,
    })
  },

  // 关注视频的作者
  async followAuthor() {
    const {
      currentIndex,
      videoList,
      userInfo
    } = this.data
    const video = videoList[currentIndex]

    // 更新
    video.meta.isAuthorFollowedByUser = true
    this.setData({
      videoList
    })
    // 数据库
    const {
      msg
    } = await api.followSomeOne(userInfo._id, video.author._id)
    wx.showToast({
      title: msg,
      icon: 'none'
    })

    // 重新获取视频信息
    this.onShow()

  },

  //点击添加喜欢、收藏图标
  async toggleLike() {
    const {
      userInfo: user,
      videoList,
      currentIndex
    } = this.data
    const video = videoList[currentIndex]
    // ui切换
    video.meta.isUserLiked = !video.meta.isUserLiked
    // 是否点亮
    let flag = video.meta.isUserLiked
    const {
      msg,
      star,
      likes
    } = flag ? await api.likeVideo(user._id, video._id) : await api.unLikeVideo(user._id, video._id)
    wx.showToast({
      title: msg,
      icon: 'none'
    })
    video.star = star
    user.likes = likes
    // 更新star,likes
    this.setData({
      videoList,
      userInfo: user
    })
  },

  // 点击收藏
  async toggleCollect() {
    const {
      userInfo: user,
      videoList,
      currentIndex
    } = this.data
    const video = videoList[currentIndex]
    // ui切换
    video.meta.isUserCollected = !video.meta.isUserCollected
    // 是否点亮
    let flag = video.meta.isUserCollected
    const {
      msg,
      collect,
      collects
    } = flag ? await api.collectVideo(user._id, video._id) : await api.unCollectVideo(user._id, video._id)
    console.log(msg,flag,user._id, video._id);
    wx.showToast({
      title: msg,
      icon: 'none'
    })
    video.collect = collect
    user.collects = collects
    // 更新star,likes
    this.setData({
      videoList,
      userInfo: user
    })
  },
  //点击蒙版，关闭评论区
  closeComments() {
    const {
      videoList,
      currentIndex
    } = this.data
    // 当前视频
    let video = videoList[currentIndex]
    video.meta.isShowComments = false
    this.setData({
      videoList
    })
  },
  //点击评论图标
  clickComents() {
    const {
      videoList,
      currentIndex
    } = this.data
    // 当前视频
    let video = videoList[currentIndex]
    video.meta.isShowComments = true
    this.setData({
      videoList
    })
  },
  async doSay() {
    let {
      mysay,
      currentIndex,
      videoList,
      userInfo
    } = this.data
    mysay = mysay.trim()
    if (!mysay) {
      return wx.showToast({
        icon: "none",
        title: '评论你还输入空字符？!!!',
      })
    }
    const video = videoList[currentIndex]
    // ui
    const who = {
      _id: userInfo._id,
      nickname: userInfo.nickname,
      avatarPath: userInfo.avatarPath
    }
    console.log(formatDate(Date.now()))
    let comment = {
      who,
      say: mysay,
      when: formatDate()
    }
    video.comments.unshift(comment)

    // 更新
    this.setData({
      videoList,
      mysay: ''
    })

    // 数据库
    const {
      result
    } = await api.updateVideo(video)
    console.log(result);
    if (result) {
      wx.showToast({
        title: '留言成功',
      })
    }
  },
  // 打开分享模态框
  openShareModal() {
    const {
      currentIndex,
      videoList
    } = this.data
    const video = videoList[currentIndex]

    this.setData({
      isShowShareModal: true,
      video_Chosen: video
    })


  },
  // 关闭分享模态框
  closeShareModal() {
    this.setData({
      isShowShareModal: false
    })
  },
  // 下载视频文件分享给微信好友
  doShareVideo() {
    //  下载到本地
    wx.downloadFile({
      url: this.data.video_Chosen.videoUrl,
      success: (async res => {
        // 转发到聊天
        await wx.shareVideoMessage({
          videoPath: res.tempFilePath,
        })
      })
    })
  },
  //下载视频
  async doDownVideo() {
    const {
      video_Chosen
    } = this.data
    //
    const r = await wx.showModal({
      title: '确定下载该视频?',
      content: video_Chosen.title,
    })
    if (r.confirm) {
      //下载
      wx.downloadFile({
        url: video_Chosen.videoUrl,
        success: (res) => {
          if (res.statusCode === 200) {
            // 保存视频到相册
            wx.saveVideoToPhotosAlbum({
              filePath: res.tempFilePath,
            }).then(res => {
              wx.showToast({
                title: '下载成功',
              })
            }).catch(err => {
              console.log(err);
            })
          }
        }
      })
    }
  },

  //删除评论
  deleteMysay(e) {
    // 第几条评论
    const {
      commentIndex
    } = e.target.dataset
    let {
      videoList,
      currentIndex,
    } = this.data;
    const video = videoList[currentIndex]

    wx.showModal({
      title: '确定删除此评论？',
      success: (async (res) => {
        if (res.confirm) {
          //本地更新删除
          video.comments.splice(commentIndex, 1)
          this.setData({
            videoList
          })
          //数据库删除
          const {
            result
          } = await api.updateVideo(video)
          console.log(result);
          if (result) {
            wx.showToast({
              title: '删除成功',
            })
          }
        }

      })
    })
  },
// 待开发
  tobeDeveloped(){
    wx.showToast({
      title: '待开发模块~',
      icon:'none'
    })
  }


});