import {
  baseApiUrl
} from '../../api/base';
import {
  checkAuth
} from '../../utils/checkAuth'
import api from '../../api/index';
Page({
  data: {
    // 默认头像
    avatarDefault: '../../assets/images/noneface.png',
    userInfo: null,
    // 访问基本地址
    baseUrl: '',
    // 头像
    avatarUrl: '',
    logined: false,
    //
    myFansCount: 11,
    myFollowCount: 12,
    myStarCount: 13,
    tabList: [{
        id: 'works',
        // 对应的视频数组
        videos: 'myWorks',
        name: '作品',
        // 刷新数据调用的方法
        fn: "getMyWorks"
      },
      {
        id: 'secrets',
        videos: 'mySecrets',
        name: '私密',
        fn: "getMySecrets"
      },
      {
        id: 'likes',
        videos: 'myLikes',
        name: '喜欢',
        fn: "getMyLikes"
      },
      {
        id: "collects",
        videos: 'myCollects',
        name: '收藏',
        fn: "getMyCollects"
      }
    ],
    activeTabIndex: 0, //默认选中tab
    allVideos: [], //所有视频，未过滤

    myWorks: [],
    mySecrets: [],
    myLikes: [],
    myCollects: [],

    //模态框
    modal: {
      // 展示
      show: false,
      // 只可查阅
      // input textarea swtich disabled
      justlook: false
    },
    // 在操作的视频
    video_Chosen: {}
  },
  onLoad: async function () {
    if (!await checkAuth()) {
      return this.goLogin()
    }
    this.getUserInfo()
    this.getMyWorks()
  },
  async onShow() {
    if (!await checkAuth()) {
      return this.goLogin()
    }
    this.getMyWorks()
  },

  // 跳转登录页
  goLogin() {
    wx.redirectTo({
      url: '../login/index',
    })
  },
  // 跳转上传视频页
  goVideoUpload() {
    wx.navigateTo({
      url: '../uploadVideo/index',
    })
  },
  //更换头像
  async changeAvatar() {
    // 未登录
    if (!this.data.logined) {
      return wx.showToast({
        title: '请先登录',
        icon: 'error'
      })
    }
    // 选择图片并上传
    const res = await wx.chooseMedia({
      mediaType: "image",
      count: 1
    })
    const tempPath = res.tempFiles[0].tempFilePath
    // console.log(tempPath);

    wx.showLoading({
      title: '请等待……',
    })
    const data = await api.uploadFile(tempPath, "avatar")
    console.log(data);
    // 相对路径path，访问地址url
    const {
      path,
      url
    } = data.avatar

    // 数据库更新 需传入用户id
    const {
      userInfo,
      baseUrl
    } = this.data;
    const updatedUser = await api.updateUser({
      _id: userInfo._id,
      avatarPath: path,
      // 用于删除
      removeFilePath: userInfo.avatarPath
    })
    if (updatedUser) {
      wx.hideLoading()
      wx.showToast({
        title: '更换成功',
      })
    }

    // 更新显示头像
    this.setData({
      avatarUrl: url,
      'userInfo.avatarPath': path
    })

  },

  //获取用户基本信息
  async getUserInfo() {
    console.log('获取用户信息');
    const {
      result
    } = await api.getUserInfo(getApp().uid)
    if (result) {
      const baseUrl = getApp().globalData.baseUrl
      this.setData({
        logined: true,
        userInfo: result,
        baseUrl,
        avatarUrl: result.avatarPath ? baseUrl + result.avatarPath : ''
      })

    }
  },

  //获取作品列表
  async getMyWorks() {
    console.log('获取作品列表');
    const uid = getApp().uid
    if (!uid) {
      return
    }
    const {
      result
    } = await api.findUserWorks(uid)
    console.log(result);
    this.setData({
      myWorks: result
    })
  },
  //获取私密作品表
  async getMySecrets() {
    console.log('获取私密作品');
    const {
      userInfo
    } = this.data
    const {
      result
    } = await api.findUserSecretWorks(userInfo._id)
    console.log(result);
    this.setData({
      mySecrets: result
    })
  },

  // 获取我的喜欢
  async getMyLikes() {
    console.log('获取我的喜欢');
    const {
      userInfo
    } = this.data
    const {
      result: videos
    } = await api.findUserLikes(userInfo._id)
    console.log(videos);
    this.setData({
      myLikes: videos
    })

  },
  // 获取我的收藏
  async getMyCollects() {
    console.log('获取我的收藏');
    const {
      userInfo
    } = this.data
    // 解构并重命名
    const {
      result: videos
    } = await api.findUserCollects(userInfo._id)
    if (videos) {
      this.setData({
        myCollects: videos
      })
    }
  },
  // 跳转播放详情页
  goVideoPlayer(e) {
    const index = +e.target.dataset.index;
    const video = this.data.myWorks[index]
    wx.navigateTo({
      url: '../playVideo/index?index=' + index,
      events: {
        cb(msg) {
          console.log("mine收到反馈", msg);
        }
      },
      success: (res => {
        res.eventChannel.emit("video", video)
      })
    })
  },
  // 关闭模态框
  closeModal() {
    this.setData({
      'modal.show': false,
      'modal.justlook': false,
      // 关闭模态框，代表当前没有选中的视频对象
      video_Chosen: {}
    })
  },
  //编辑/查看 视频
  openModal(e) {
    const index = +e.target.dataset.index
    const justlook = e.target.dataset.justlook || false
    const {
      activeTabIndex,
      tabList
    } = this.data
    // 作品，私密，喜欢，收藏数组
    const myXXXs = tabList[activeTabIndex].videos
    const video = this.data[myXXXs][index]
    this.setData({
      'modal.show': true,
      'modal.justlook': justlook,
      video_Chosen: video
    })

  },
  //模态框 提交修改视频信息
  async submitVideo(e) {
    let {
      vtitle,
      vdesc,
      isPublic
    } = e.detail.value
    vtitle = vtitle.trim()
    vdesc = vdesc.trim()
    const {
      result
    } = await api.updateVideo({
      _id: this.data.video_Chosen._id,
      title: vtitle,
      desc: vdesc,
      isPublic
    })
    if (result) {
      wx.showToast({
        title: '编辑成功',
      })
    }
    // 关闭模态框
    this.closeModal()
    const {
      activeTabIndex,
      tabList
    } = this.data
    let getMyXXX = tabList[activeTabIndex].fn
    // 执行对应tab的刷新获取数据函数
    this[getMyXXX]()
  },
  //删除视频
  deleteVideo(e) {
    const index = +e.target.dataset.index
    const video = this.data.myWorks[index]
    wx.showModal({
      title: '确认删除此视频？',
      success: (async res => {
        if (res.confirm) {
          console.log(video._id);
          const {
            result
          } = await api.deleteVideo({
            _id: video._id,
            removeFilePath: video.videoPath
          })
          if (result) {
            console.log(result);
            wx.showToast({
              title: '删除成功',
            })
            this.getMyWorks()
          }
        }
      })
    })


  },

  // 点击移除喜欢/收藏
  cancelLikeOrCollect(e) {
    // myLikes/myCollects中的视频下标
    const vIndex = +e.target.dataset.index
    const {
      activeTabIndex,
      tabList,
      userInfo
    } = this.data
    // 保存喜欢、收藏视频的数组名称 'myLikes'/'myCollects'
    const myXXX = tabList[activeTabIndex].videos
    // user表中的对应的喜爱/收藏数组字段: lieks/collects
    const fieldInUserSchema = tabList[activeTabIndex].id
    // videos表中的对应的被喜爱、收藏数目字段: lieks/collects
    // user:likes[]对应 video:star  user:collects对应video:collect
    const fieldInVideoSchema = fieldInUserSchema === 'likes' ? 'star' : 'collect'
    //移除喜欢时 myLikes likes star
    //移除收藏时 myCollects collects collect
    // return console.log(myXXX,fieldInUserSchema,fieldInVideoSchema)
    console.log(myXXX, fieldInUserSchema, fieldInVideoSchema)
    // 视频列表 
    const myXXXArr = this.data[myXXX]
    // 喜欢、收藏视频列表的第几个视频
    const video = myXXXArr[vIndex]
    // console.log(fieldInVideoSchema, video[fieldInVideoSchema]);

    wx.showModal({
      title: '确认从此列表移除？'
    }).then(async res => {
      if (res.confirm) {
        // 对应视频star/collect数目减一
        video[fieldInVideoSchema] -= 1

        //user表 likes/collects数组中 移除对应视频vid
        // 找到vid在对应数组的下标
        const i = userInfo[fieldInUserSchema].findIndex(vid => vid === video._id)
        userInfo[fieldInUserSchema].splice(i, 1)

        // ui 更新
        // 移除myLikes/myCollects中的视频元素 ，这样视图即更新，不必重新请求刷新
        myXXXArr.splice(vIndex, 1)
        this.setData({
          [myXXX]: myXXXArr
        })

        // 数据库更新
        const {
          result: newUser
        } = await api.updateUser({
          _id: userInfo._id,
          // likes /collects 喜爱/收藏数组
          [fieldInUserSchema]: userInfo[fieldInUserSchema]
        })
        const {
          result: newVideo
        } = await api.updateVideo(video)
        if (newUser && newVideo) {
          wx.showToast({
            title: '移除成功',
          })
        }
      }
    })

  },

  //点击注销
  logout() {
    const that = this;
    wx.showModal({
      title: '确定退出登录？',
      success: (res => {
        if (res.confirm) {
          that.setData({
            userInfo: {},
            logined: false
          })
          //
          wx.clearStorage()
          wx.navigateTo({
            url: '../login/index',
          })
        }
      })
    })


  },


  //点击查看粉丝情况
  fansHandle() {
    wx.showToast({
      icon: 'none',
      title: this.data.myFansCount + '粉丝',
    })
  },
  followHandle() {
    wx.showToast({
      icon: 'none',
      title: this.data.myFollowCount + '关注',
    })
  },
  getStarHandle() {
    wx.showToast({
      icon: 'none',
      title: this.data.myStarCount + '获赞',
    })
  },
  // 点击tab
  clickTab(e) {
    const index = +e.target.dataset.index;
    this.setData({
      activeTabIndex: index,
    })
  },

  // tab 滚动
  tabSwiperChange(e) {
    const index = +e.detail.current
    this.setData({
      activeTabIndex: index,
    })
    let tabFn = this.data.tabList[index].fn
    //调用对应的tab方法
    this[tabFn]();
  }
})