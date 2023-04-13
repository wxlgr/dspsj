import {
  formatDate
} from '../../utils/dateFormat'
import api from '../../api/index'
// 播放器
let players = []

Page({
  data: {
    avatarDefault: '../../assets/images/noneface.png',
    baseUrl: '',
    userInfo: {},
    videoList: [], // 视频列表
    currentIndex: 0, //当前在播视频index
    mysay: '',
  },

  // 页面加载
  onLoad: function (params) {
    this.setData({
      baseUrl: getApp().globalData.baseUrl,
    })

    //查询用户喜爱、收藏记录
    this.getUserInfo()
    //获取视频列表
    this.getAllVideos()
  },
  onShow() {
    //查询用户喜爱、收藏记录
    this.getUserInfo()
    //获取视频列表
    this.getAllVideos()
  },
  // 下拉刷新
  async onPullDownRefresh() {
    wx.showNavigationBarLoading()
    await this.getUserInfo()
    //查询用户喜爱、收藏记录
    //获取视频列表
    await this.getAllVideos()
    await wx.showToast({
      icon: 'none',

      title: '下拉加载成功',
    })
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()

  },
  // 上拉加载
  async onReachBottom() {

    wx.showToast({
      title: '上拉加载成功',
    })

  },

  // 
  //获取用户基本信息
  async getUserInfo() {
    console.log('获取用户信息');
    const uid = getApp().uid
    if (!uid) {
      return
    }
    const {
      result
    } = await api.getUserInfo(uid)
    if (result) {}
    this.setData({
      userInfo: result,
    })

  },
  //获取视频列表
  async getAllVideos() {
    console.log('获取视频列表');
    const allPublicVideos = await api.findAllPublicVideos()
    console.log(allPublicVideos);
    const videos = allPublicVideos.result || []

    const {
      baseUrl,
      avatarDefault,
      userInfo
    } = this.data
    // 给视频对象添加一些属性
    videos.map(video => {
      // 修正作者头像路径
      if (video.author) {
        video.author.avatarUrl = video.author.avatarPath ? baseUrl + video.author.avatarPath : avatarDefault
      }
      // 修正视频地址
      video.videoUrl = baseUrl + video.videoPath

      // 
      let meta = {
        //是否展示评论 默认不展示
        isShowComments: false,
        // 是否被用户喜欢、点赞
        isUserLiked: userInfo.likes.includes(video._id),
        isUserCollected: userInfo.collects.includes(video._id)
      }
      // 合并属性
      Object.assign(video, {
        meta
      })
    })
    // console.log(videos[0]);
    this.setData({
      videoList: videos,
    })

    // 初始化视频播放器数组
    for (let i = 0; i < videos.length; i++) {
      // 根据video id 创建媒体上下文
      let temp = wx.createVideoContext(`video${i}`)
      players.push(temp)
    }
  },

  //滑动切换
  onMySwiperChange(e) {
    const {
      currentIndex
    } = this.data
    // 记录上一次的index
    let oldIndex = currentIndex

    let newIndex = +e.detail.current
    this.setData({
      currentIndex: newIndex,
    })

    // console.log(oldIndex,newIndex);
    players[oldIndex].stop()
    players[newIndex].play()
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

  //下载视频
  downVideo() {
    const {
      videoList,
      currentIndex
    } = this.data
    const video = videoList[currentIndex]
    console.log(video);
    //
    wx.showModal({
      title: '确定下载该视频?',
      success: (r => {
        if (r.confirm) {
          //下载
          wx.downloadFile({
            url: video.videoUrl,
            success: (res => {
              // 保存视频到相册
              wx.saveVideoToPhotosAlbum({
                filePath: res.tempFilePath,
              }).then(errMsg => {
                wx.showToast({
                  title: '视频下载成功',
                })
              })

            })
          })
        }
      })
    })


  },

  // 统一处理点击喜欢或者点击收藏按钮的函数
  async clickLikeOrCollect({
    // 点击的时喜欢还是收藏
    type = 'like',
    // 对应videos表中的什么字段
    videoField = 'star',
    // meta中的是什么属性
    metaKey = 'isUserLiked',
    // 对应users表中那个数组
    userField = 'likes'
  }) {

    const {
      videoList,
      currentIndex,
      userInfo
    } = this.data
    const video = videoList[currentIndex]

    // 修改ui对应data
    video.meta[metaKey] = !video.meta[metaKey]
    // 点击之后是否时激活
    let flag = video.meta[metaKey]

    // 点赞、收藏数目
    video[videoField] += flag ? 1 : -1

    if (flag) {
      userInfo[userField].push(video._id)
    } else {
      let index = userInfo[userField].findIndex(item => item === video._id)
      if (index > -1) {
        //删除
        userInfo[userField].splice(index, 1)
      }
    }

    wx.showToast({
      icon: "none",
      title: flag ? "添加成功" : "取消成功"
    })
    // 显式改变
    this.setData({
      videoList,
      userInfo
    })

    // 数据库更新
    const newUser = await api.updateUser(userInfo)
    const newVideo = await api.updateVideo(video)
    console.log(`视频${videoField}:`, newVideo.result[videoField])
    console.log(`用户${userField}:`, newUser.result[userField])

  },
  //点击添加喜欢、收藏图标
  async clickLove() {
    this.clickLikeOrCollect({
      type: 'like',
      videoField: 'star',
      metaKey: 'isUserLiked',
      userField: 'likes'
    })
  },

  // 点击收藏
  async clickCollection() {
    this.clickLikeOrCollect({
      type: 'collect',
      videoField: 'collect',
      metaKey: 'isUserCollected',
      userField: 'collects'
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
      username: userInfo.username.substr(0, 4),
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
  // 点击分享按钮 真机调试
  async shareVideo() {
    const {
      currentIndex,
      videoList
    } = this.data
    const video = videoList[currentIndex]
    // 下载到本地
    wx.downloadFile({
      url: video.videoUrl,
      success: (async res => {
        // 转发到聊天
        await wx.shareVideoMessage({
          videoPath: res.tempFilePath,
        })
      })
    })

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


});