import apiUrls from '../../apiUrls/index'
Page({
  data: {
    avatarDefault: '../../images/noneface.png',
    userInfo: {
      avatarUrl: '', //头像
    },
    baseUrl: '',

    logined: false,
    userLikes: [],
    userCollections: [],
    //
    myFansCount: 11,
    myFollowCount: 12,
    myStarCount: 13,
    activeTabIndex: 0, //默认选中tab
    allVideos: [], //所有视频，未过滤
    myworks: [], //我的作品,
    mylikeVideos: [], //我喜欢的视频
    mycollectVideos: [], //我收藏的视频
  },
  onLoad: function () {
    const that = this;
    const {
      baseUrl
    } = getApp().globalData;
    that.setData({
      userInfo: wx.getStorageSync('userInfo'),
      baseUrl
    })
    //未登录
    if (!this.data.userInfo) {
      console.log("未登录");
      wx.navigateTo({
        url: '../login/index',
      })
    } else { //已登录
      //初始化数据
      that.setData({
        logined: true,
      })
    }
  },
  onShow() {

  },
  // 跳转上传视频页
  goVideoUpload() {
    wx.navigateTo({
      url: '../uploadVideo/index',
    })
  },
  //更换头像
  changeAvatar() {
    const that = this;
    const {
      userInfo
    } = this.data;
    // 选择图片并上传
    wx.chooseMedia({
      mediaType: "image",
      camera: 'back',
      success(res) {
        const tempPath = res.tempFiles[0].tempFilePath
        // console.log(tempPath);
        const {
          username,
          _id
        } = that.data.userInfo
        wx.uploadFile({
          url: apiUrls.uploadAvatar,
          filePath: tempPath, //res.tempFilepaths
          name: 'avatar',
          formData: {
            username
          }, //上传额外携带的参数
          success(f) {
            // data传过来是string类型
            const avatarData = JSON.parse(f.data)
            console.log(avatarData);
            // 显示头像更新
            that.setData({
              'userInfo.avatarUrl': avatarData.avatarUrl
            })
            wx.showToast({
              title: '头像更换成功'
            })
            wx.setStorageSync('userInfo', that.data.userInfo)
            // //数据库信息更新
            wx.request({
              url: apiUrls.updateUser,
              method: 'POST',
              data: {
                _id,
                avatarUrl: avatarData.avatarUrl
              },
              success(d) {
                console.log(d);
              }
            })
          }
        })


      }
    })
  },

  //获取用户对此视频的记录，喜欢、收藏与否
  getUserRecord() {

  },

  //获取视频列表
  getAllVideos() {

  },

  //获取作品列表
  getMyWorks() {

  },

  //删除我的作品
  deleteMyWork(e) {


  },

  getMylikes() {},

  getMyCollections() {

  },


  //点击注销
  logout() {
    const that = this;
    wx.showModal({
      title: '确定退出登录？',
      success: (res => {
        console.log(res);
        if (res.confirm) {
          that.setData({
            userInfo: {},
            avatar: {
              url: '../../images/face/1.webp' //默认头像
            },
            logined: false
          })
          //
          wx.removeStorageSync('userInfo')
          wx.removeStorageSync('token')
          wx.navigateTo({
            url: '../login/index',
          })
        }
      })
    })


  },

  //切换tab
  cilckTab(e) {
    let tabsArr = ['work', 'like', 'collection']
    // console.log(e.target.id);
    let {
      activeTabIndex,
    } = this.data
    activeTabIndex = tabsArr.indexOf(e.target.id)

    this.setData({
      activeTabIndex
    })
    switch (activeTabIndex) {
      case 0:
        this.getMyWorks();
        break;
      case 1:
        this.getMylikes();
        break;
      case 2:
        this.getMyCollections();
        break;
    }
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
  }
})