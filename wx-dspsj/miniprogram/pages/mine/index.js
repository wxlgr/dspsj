import {
  checkAuth
} from '../../utils/checkAuth'
import api from '../../api/index';
import utils from '../../utils/chooseAndUploadPic'
Page({
  data: {
    bgUrl: '',
    // 默认头像
    avatarDefault: '../../assets/images/noneface.png',
    // 默认背景图路径 在服务器
    defaultBgPath: 'static/assets/bg.png',
    userInfo: null,
    // 访问基本地址
    baseUrl: '',
    // 头像
    avatarUrl: '',
    logined: false,
    //
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
    video_Chosen: {
      tempFilePath: ''
    }
  },
  onLoad: async function () {
    if (!checkAuth()) {
      return wx.redirectTo({
        url: '../login/index',
      })
    }
    await this.getUserInfo()
    await this.getMyWorks()
  },
  async onShow() {
    const {
      activeTabIndex,
      tabList
    } = this.data
    const getMyXXXs = tabList[activeTabIndex].fn
    await this.getUserInfo()
    // 执行对应tab的刷新获取数据函数
    await this[getMyXXXs]()
  },
  // 下拉刷新
  async onPullDownRefresh() {
    wx.showNavigationBarLoading()
    this.onShow()
    await wx.showToast({
      icon: 'none',
      title: '刷新成功',
    })
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()

  },

  // 预览背景图
  preViewBg() {
    wx.previewImage({
      urls: [this.data.bgUrl],
    })
  },
  // 预览视频
  preViewVideos(e) {
    let index = +e.currentTarget.dataset.index
    const {
      baseUrl,
      activeTabIndex,
      tabList
    } = this.data
    // myWorks mySecrets myLikes myCollects
    const myXXXs = tabList[activeTabIndex].videos
    const videos = this.data[myXXXs]
    const sources = videos.map(video => {
      return {
        url: baseUrl + video.videoPath,
        type: 'video',
        poster: baseUrl + video.coverPath
      }
    })
    wx.previewMedia({
      sources,
      current: index
    })
  },


  // 跳转bgm管理页面
  goBGM() {
    wx.navigateTo({
      url: '../bgm/index',
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
    const r = await wx.showModal({
      title: '修改头像?',
    })
    // 取消上传
    if (r.cancel) return
    // 选择图片并上传
    const result = await utils.chooseAndUploadPic('avatar')
    if (!result.path) return
    // 数据库更新 需传入用户id
    const {
      userInfo,
    } = this.data;
    await api.updateUser({
      _id: userInfo._id,
      avatarPath: result.path,
    })
    // 更新显示头像
    this.setData({
      avatarUrl: result.url,
      'userInfo.avatarPath': result.path
    })
    wx.showToast({
      title: '更换头像成功',
    })
    // 删除旧文件
    await api.deleteFile(userInfo.avatarPath)
  },
  // 修改昵称
  async changeNickname() {
    const {
      userInfo: user
    } = this.data
    let oldNickName = user.nickname
    const r = await wx.showModal({
      title: '修改昵称',
      editable: true,
      content: oldNickName,
      placeholderText: "请输入新的昵称"
    })
    if (r.cancel) return;
    let newNickname = r.content.trim()
    if (!newNickname) {
      return wx.showToast({
        title: '新昵称不能为空'
      })
    } else if (oldNickName === newNickname) {
      return wx.showToast({
        icon: 'none',
        title: '新旧昵称不能一样'
      })
    }
    await api.updateUser({
      _id: user._id,
      nickname: newNickname
    })
    wx.showToast({
      title: '昵称修改成功'
    })
    this.getUserInfo()

  },
  // 跳转编辑资料
  updateUser() {
    wx.navigateTo({
      url: '../updateUser/index?uid=' + this.data.userInfo._id,
    })
  },

  //获取用户基本信息
  async getUserInfo() {
    // console.log('获取用户信息');
    const uid = getApp().uid
    const baseUrl = getApp().globalData.baseUrl
    if (!uid) return
    const {
      result
    } = await api.getUserInfo(uid)
    this.setData({
      bgUrl: result.bgPath ? baseUrl + result.bgPath : baseUrl + this.data.defaultBgPath,
      logined: true,
      userInfo: result,
      baseUrl,
      avatarUrl: result.avatarPath ? baseUrl + result.avatarPath : ''
    })
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
    // console.log(result);
    this.setData({
      myWorks: result.reverse()
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
    this.setData({
      mySecrets: result.reverse()
    })
  },

  // 获取我的喜欢
  async getMyLikes() {
    console.log('获取我的喜欢');
    const {
      userInfo
    } = this.data
    const {
      result
    } = await api.findUserLikes(userInfo._id)
    this.setData({
      myLikes: result.reverse()
    })
  },
  // 获取我的收藏
  async getMyCollects() {
    console.log('获取我的收藏');
    const {
      userInfo
    } = this.data
    const {
      result
    } = await api.findUserCollects(userInfo._id)
    this.setData({
      myCollects: result.reverse()
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
      tabList,
      baseUrl
    } = this.data
    // 作品，私密，喜欢，收藏数组
    const myXXXs = tabList[activeTabIndex].videos
    const video = this.data[myXXXs][index]
    // console.log(video);

    // 先将封面图片缓存
    wx.downloadFile({
      url: baseUrl + video.coverPath,
      success: res => {
        if (res.statusCode === 200) {
          video.tempFilePath = res.tempFilePath
          this.setData({
            'modal.show': true,
            'modal.justlook': justlook,
            video_Chosen: video,
          })
        }
      }
    })


  },
  // 编辑框中修改视频封面
  async changeCover() {
    try {
      const file = (await wx.chooseMedia()).tempFiles[0]
      if (file.fileType !== 'image') {
        return wx.showToast({
          title: '请选择图片文件',
          icon: 'error'
        })
      }
      const {
        video_Chosen
      } = this.data

      video_Chosen.tempFilePath = file.tempFilePath
      console.log(file.tempFilePath);
      this.setData({
        video_Chosen
      })
    } catch (error) {
      console.log(error);
    }
  },
  // 预览封面
  preViewCover() {
    const {
      baseUrl,
      video_Chosen
    } = this.data
    wx.previewImage({
      urls: [video_Chosen.tempFilePath],
    })
  },
  //模态框 提交修改视频信息
  async submitVideo(e) {
    let {
      vtitle,
      vdesc,
      isPublic,
      cover
    } = e.detail.value
    vtitle = vtitle.trim()
    vdesc = vdesc.trim()
    if (vtitle==='') {
      return wx.showToast({
        title: '标题不能为空!',
        icon:'error'
      })
    }
    const {
      result
    } = await api.uploadFile(cover, 'photo')
    await api.updateVideo({
      _id: this.data.video_Chosen._id,
      title: vtitle,
      desc: vdesc,
      coverPath: result.path,
      isPublic
    })
    wx.showToast({
      title: '编辑成功',
    })
    // 关闭模态框
    this.closeModal()
    // 刷新数据
    this.onShow()
  },
  //在作品、私密中删除视频
  async deleteVideo(e) {
    const r = await wx.showModal({
      title: '确认删除此视频？',
    })
    if (r.cancel) return;
    const index = +e.target.dataset.index
    const {
      activeTabIndex,
      tabList,
    } = this.data
    // myWorks / mySecrets
    const myXXXs = tabList[activeTabIndex].videos

    // 当前的视频
    const video = this.data[myXXXs][index]
    // 数据库删除
    await api.deleteVideo({
      _id: video._id,
    })
    // 删除文件
    await api.deleteFile(video.videoPath)
    await api.deleteFile(video.coverPath)
    wx.showToast({
      title: '删除成功',
    })
    // 刷新数据
    this.onShow()
  },

  // 点击移除喜欢/收藏
  async cancelLikeOrCollect(e) {
    const r = await wx.showModal({
      title: '确认从此列表移除？'
    })
    if (r.cancel) return;
    // myLikes/myCollects中的视频下标
    const vIndex = +e.target.dataset.index
    const {
      activeTabIndex,
      tabList,
      userInfo
    } = this.data
    // 刷新数据的方法，tab的id
    const {
      id: tabId,
      // myLikes myCollects
      videos: myXXXs
    } = tabList[activeTabIndex]

    const video = this.data[myXXXs][vIndex]

    // 当前是喜欢tab，移除喜欢
    if (tabId === 'likes') {
      api.unLikeVideo(userInfo._id, video._id)
    } else if (tabId === 'collects') {
      // 当前收藏tab，取消收藏
      api.unCollectVideo(userInfo._id, video._id)
    }
    wx.showToast({
      title: '移除成功',
    })
    //刷新数据
    this.onShow()
  },

  //点击注销
  logout() {
    wx.showModal({
      title: '确定退出登录？',
      success: (res => {
        if (res.confirm) {
          wx.clearStorage()
          wx.redirectTo({
            url: '../login/index',
          })
        }
      })
    })
  },
  // 点击查看获赞
  getStarHandle() {
    wx.showToast({
      icon: 'none',
      title: this.data.userInfo.star + ' 获赞',
    })
  },
  // 点击查看关注
  followHandle() {
    wx.showToast({
      icon: 'none',
      title: this.data.userInfo.followsCount + ' 关注',
    })
  },
  //点击查看粉丝情况
  fansHandle() {
    wx.showToast({
      icon: 'none',
      title: this.data.userInfo.fansCount + ' 粉丝',
    })
  },
  // 点击tab
  clickTab(e) {
    this.setData({
      activeTabIndex: +e.target.dataset.index,
    })
  },
  // tab 滚动
  tabSwiperChange(e) {
    const index = +e.detail.current
    this.setData({
      activeTabIndex: index,
    })
    let getMyXXXs = this.data.tabList[index].fn
    //调用对应的tab方法,刷新数据
    this[getMyXXXs]();
  }
})