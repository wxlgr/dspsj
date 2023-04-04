const {
  formatDate
} = require('../../utils/dateFormat')
Page({
  data: {
    baseUrl: '',
    userInfo: '',
    videoList: [], // 视频列表
    currentIndex: 0, //当前在播视频index

    userLikes: [], //当前用户喜欢的视频v_id
    userCollections: [], //当前用户收藏的视频v_id
    mysay: '',
    nowTime: '', //
    hasAvatar: false
  },

  // 页面加载
  onLoad: function (params) {
    this.setData({
      baseUrl: getApp().globalData.baseUrl,
      userInfo: getApp().globalData.userInfo,
    })

    if (this.data.userInfo.username) {
      wx.reLaunch({
        url: '../login/index',
      })
    } else {
      //查询用户喜爱、收藏记录
      // this.getUserRecord()
      console.log("欢迎");
    }
  },
  onShow() {
    // 获取用户记录

    // 
    this.setData({
      nowTime: Date.now(),
      hasAvatar: getApp().hasAvatar
    })
    //获取视频列表
    this.getAllVideos()
  },
  //获取用户对此视频的记录，喜欢、收藏与否
  getUserRecord() {
    const that = this;
    const {
      userInfo
    } = this.data
    wx.cloud.callFunction({
      name: 'myapi',
      data: {
        type: 'queryUser',
        username: userInfo.username
      }
    }).then(res => {
      // console.log(res);
      that.setData({
        userLikes: res.result.data[0].likes,
        userCollections: res.result.data[0].collections,
      })
    })
  },

  //获取视频列表
  getAllVideos() {
    const that = this;
    const {
      baseUrl,
      videoList
    } = this.data
    //1.显示加载
    wx.showLoading({
      title: '视频列表加载中',
    });
    //2. 获取数据
    wx.cloud.callFunction({
      name: 'myapi',
      data: {
        type: 'getVideos'
      }
    }).then(res => {
      //处理,新增属性
      // 视频数据
      const dataList = res.result.data

      // 用户喜爱
      const userLikes = that.data.userLikes
      //  用户收藏
      const userCollections = that.data.userCollections

      let newdataList = dataList.map(item => {
        //默认隐藏评论区
        item.showComments = false
        //拼接上baseUrl,设置用户头像地址
        item.path = baseUrl + item.path;
        item.avatar = baseUrl + '/users/' + item.author + '_avatar.jpg'
        //
        userLikes.map(likeVideo => {
          if (likeVideo.v_id === item._id) {
            item.userLiked = true; //是否被当前用户喜欢
          }

        })
        userCollections.map(collectVideo => {
          if (collectVideo.v_id == item._id) {
            item.userCollected = true //被当前用户收藏
          }
        })


        return item
      })

      that.setData({
        videoList: newdataList.reverse(), //后上传先展示
      })
      wx.hideLoading();
    }).catch((e) => {
      console.log(e);
      wx.hideLoading();
    });

  },

  //滑动切换
  onMySwiperChange(e) {
    // console.log(e.detail.current);
    this.setData({
      currentIndex: e.detail.current
    })
    const {
      videoList,
      currentIndex
    } = this.data

    // 初始化视频播放器数组
    let players = []
    for (let i = 0; i < videoList.length; i++) {
      let temp = wx.createVideoContext(`myvideo${i}`)
      players.push(temp)
    }
    players.forEach((player, index) => {
      if (currentIndex == index) {
        player.seek(0)
        player.play()
      } else {
        player.stop()
      }
    })
  },

  clickAuthor() {
    let {
      videoList,
      currentIndex
    } = this.data;
    let vItem = videoList[currentIndex];
    wx.showToast({
      icon: 'none',
      title: '我是作者' + vItem.author,
    })
  },

  //下载视频
  downVideo() {
    let {
      videoList,
      currentIndex
    } = this.data;
    let vItem = videoList[currentIndex];
    //
    wx.showModal({
      title: '确定下载该视频?',
      success: (r => {
        console.log(r);
        if (r.confirm) {
          //下载
          wx.downloadFile({
            url: vItem.path,
            success: (res => {
              console.log(res);
              if (res.statusCode == 200) {
                // 保存视频到相册
                wx.saveVideoToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success(errMsg) {
                    console.log(errMsg);
                    // 隐藏进度加载条
                    wx.showToast({
                      title: '视频下载成功',
                    })
                  }
                })
              }

            }),
            fail: (err => {
              console.log(err);
            })
          })
        }
      })
    })


  },

  //点击添加喜欢、收藏图标
  clickLove() {
    const that = this;
    //取反
    let {
      videoList,
      currentIndex,
      userLikes,
      userInfo
    } = this.data;

    let vItem = videoList[currentIndex]
    // console.log(vItem); //视频信息
    vItem.userLiked = !vItem.userLiked;
    vItem.star = vItem.star + (vItem.userLiked ? 1 : -1) //获赞数

    if (vItem.userLiked) {
      //添加喜欢
      userLikes.push({
        v_id: vItem._id
      })
    } else {
      //去除喜欢
      userLikes = userLikes.filter(likeItem => {
        return likeItem.v_id != vItem._id
      })
    }
    console.log(userLikes);

    //显式设置才会视图更新
    this.setData({
      videoList,
      userLikes
    })
    wx.showToast({
      icon: 'none',
      title: `${vItem.userLiked?'添加喜欢成功':'已取消喜欢'}`,
    })

    // 1.该视频获赞数更改
    wx.cloud.callFunction({
      name: 'myapi',
      data: {
        type: 'updateVideo',
        _id: vItem._id,
        video: {
          star: vItem.star, //获赞数
        }
      }
    }).then(res => {
      // console.log(res);
    })

    // 2.用户喜欢的视频列表更改
    wx.cloud.callFunction({
      name: 'myapi',
      data: {
        type: 'updateUser',
        username: userInfo.username,
        user: {
          likes: userLikes, //获赞数
        }
      }
    }).then(res => {
      console.log(res);
    })

  },

  clickCollection() {
    //取反
    let {
      videoList,
      currentIndex,
      userCollections,
      userInfo
    } = this.data;
    let vItem = videoList[currentIndex]
    // console.log(vItem); //视频信息
    vItem.userCollected = !vItem.userCollected;
    vItem.collection = vItem.collection + (vItem.userCollected ? 1 : -1) //被收藏数

    //
    if (vItem.userCollected) {
      //添加喜欢
      userCollections.push({
        v_id: vItem._id
      })
    } else {
      //去除收藏
      userCollections = userCollections.filter(collectItem => {
        return collectItem.v_id != vItem._id
      })
    }
    console.log(userCollections);


    //显示设置才会视图更新
    this.setData({
      videoList,
      userCollections
    })
    wx.showToast({
      icon: 'none',
      title: `${vItem.userCollected?'添加收藏成功':'已取消收藏'}`,
    })

    // 1.该视频被收藏数更改
    wx.cloud.callFunction({
      name: 'myapi',
      data: {
        type: 'updateVideo',
        _id: vItem._id,
        video: {
          star: vItem.star, //获赞数
        }
      }
    }).then(res => {
      // console.log(res);
    })

    // 2.用户收藏的视频列表更改
    wx.cloud.callFunction({
      name: 'myapi',
      data: {
        type: 'updateUser',
        username: userInfo.username,
        user: {
          collections: userCollections, //获赞数
        }
      }
    }).then(res => {
      console.log(res);
    })

  },

  //点击评论图标
  saySome() {
    let {
      videoList,
      currentIndex,
    } = this.data;
    let vItem = videoList[currentIndex]
    // console.log(vItem); //视频信息
    vItem.showComments = !vItem.showComments;
    //显示设置才会视图更新
    this.setData({
      videoList
    })
  },

  //添加评论的操作
  doSay(e) {
    console.log(e);
    const that = this;
    let {
      videoList,
      currentIndex,
      mysay,
      userInfo
    } = this.data;

    let vItem = videoList[currentIndex]

    // console.log(vItem);
    vItem.comments.unshift({
      say: mysay,
      time: formatDate(), //格式化了的当前时间
      username: userInfo.username
    })
    console.log('该视频的评论列表', vItem.comments);

    //添加评论
    wx.cloud.callFunction({
      name: 'myapi',
      data: {
        type: 'updateVideo',
        _id: vItem._id,
        video: {
          comments: vItem.comments
        }
      }
    }).then(res => {
      // console.log(res);
      if (res.result.stats.updated == 1) {
        wx.showToast({
          title: '留言成功',
        })
        //初始化输入框
        that.setData({
          mysay: ''
        })
      }
      //显示设置更新
      that.setData({
        videoList
      })
    })


  },

  hideComments() {
    let {
      videoList,
      currentIndex,
    } = this.data;

    let vItem = videoList[currentIndex]
    // console.log(vItem); //视频信息
    if (vItem.showComments) {
      vItem.showComments = !vItem.showComments;
    }
    //显示设置才会视图更新
    this.setData({
      videoList
    })
  },

  //删除评论
  deleteMysay(e) {
    const that = this;
    const {
      commentIndex
    } = e.target.dataset
    console.log(commentIndex);

    let {
      videoList,
      currentIndex,
    } = this.data;
    let vItem = videoList[currentIndex]
    console.log(vItem); //当前视频信息

    wx.showModal({
      title: '确定删除此评论？',
      success: (res => {
        if (res.confirm) {
          //本地更新删除
          vItem.comments.splice(commentIndex, 1)

          //数据库删除
          wx.cloud.callFunction({
              name: "myapi",
              data: {
                type: 'updateVideo',
                _id: vItem._id,
                video: {
                  comments: vItem.comments
                }
              }
            }).then(res => {
              console.log(res)
              wx.showToast({
                icon: "none",
                title: '已删除',
              })
              //显示设置更新
              that.setData({
                videoList
              })
            })
            .catch(err => console.log(err))
        }
      })
    })
  },

  //点击评论区不做什么，只是用于阻止冒泡
  doNothing() {
    return
  },
});