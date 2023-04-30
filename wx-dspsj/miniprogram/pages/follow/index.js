import api from '../../api/index'

Page({
  data: {
    userInfo: {},
    // 用户的关注列表信息
    follows: [{}],
    // 用户的粉丝列表信息
    fans: [{}],
    // tab index
    currentIndex: 0,
    // 排序规则的下标
    selectIndex: 0,
    // 显示下拉菜单
    isShowSelect: false,
    sortRules: ['综合', '最近', '最先'],
  },
  async onLoad(options) {
    this.setData({
      currentIndex: options.tab === 'follows' ? 0 : 1
    })
    await this.getUserInfo()
    // 获取用户的关注列表
    await this.getUserFollows()
    await this.getUserFans()

  },
  async onPullDownRefresh() {
    wx.showNavigationBarLoading()
    // 
    this.data.currentIndex === 0 ? await this.getUserFollows() : await this.getUserFans();
    await wx.showToast({
      icon: 'none',
      title: '刷新成功',
    })
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  },
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
  // 改变排序规则
  changeSortOrder(e) {
    let index = +e.target.dataset.index
    // 排序
    const {
      follows,
      fans,
      currentIndex,
      selectIndex
    } = this.data

    // 当前对关注、粉丝列表的引用
    let arr = currentIndex === 0 ? follows : fans

    // 默认排序为数据库记录创建顺序，也就是最先排序
    // 综合排序即最先 排序
    // 之前不是按最近关注排序，现在要按最近
    if (selectIndex !== 1 && index === 1) {
      // 最近排序
      arr.reverse()
    }
    // 由其他排序转为最先排序
    if (selectIndex === 1 && index !== 1) {
      arr.reverse()
    }
    // 关注列表
    if (currentIndex === 0) {
      this.setData({
        follows: arr
      })
    } else if (currentIndex === 1) {
      // 粉丝列表
      this.setData({
        fans: arr
      })
    }
    this.setData({
      selectIndex: index,
      isShowSelect: false
    })


  },
  // 打开排序下拉框
  toggleShowSelect() {
    this.setData({
      isShowSelect: !this.data.isShowSelect
    })
  },
  // 点击按钮 切换关注/取消关注
  async toggleFollow(e) {
    const index = +e.target.dataset.index
    const {
      currentIndex,
      userInfo: user
    } = this.data
    // 当前是关注列表还是粉丝列表
    let followsOrfans = currentIndex===0?'follows':'fans'
    // 
    const ta =this.data[followsOrfans][index]
    // ui更新
    ta.meta.isFollowedByUser = !ta.meta.isFollowedByUser
    this.setData({
      [followsOrfans]:this.data[followsOrfans]
    })

    // 记录是否关注
    const followed = ta.meta.isFollowedByUser
    // 数据库操作
    const {
      msg
    } = followed ? await api.followSomeOne(user._id, ta._id) :
      await api.unFollowSomeOne(user._id, ta._id);
    wx.showToast({
      icon: 'none',
      title: msg
    })
  },

  // 移除粉丝
  async removeFan(e) {
    const r = await wx.showModal({
      title: '您确定移除此粉丝?'
    })
    if (!r.confirm) return
    const index = +e.target.dataset.index
    const {
      fans,
      userInfo: user
    } = this.data
    // 当前这个粉丝
    const fan = fans[index]

    // 视图更新
    fans.splice(index, 1)
    this.setData({
      fans
    })

    // 数据库更新
    const {
      msg
    } = await api.removeFan(user._id, fan._id)
    wx.showToast({
      icon: 'none',
      title: msg,
    })

  },
  // 获取用户的关注列表
  async getUserFollows() {
    console.log('获取用户的关注列表');
    const uid = getApp().uid
    const baseUrl = getApp().globalData.baseUrl
    if (!uid) return
    const {
      result: follows
    } = await api.getUserFollows(uid)
    follows.forEach(item => {
      // 补充头像路径
      item.avatarUrl = baseUrl + item.avatarPath
      // item.meta 用于控制按钮
      item.meta = {
        isFollowedByUser: true
      }
    })
    this.setData({
      follows
    })
  },
  // 获取用户的粉丝列表
  async getUserFans() {
    console.log('获取用户的粉丝列表');
    const uid = getApp().uid
    const baseUrl = getApp().globalData.baseUrl
    const {
      userInfo
    } = this.data
    if (!uid) return
    const {
      result: fans
    } = await api.getUserFans(uid)
    fans.forEach(item => {
      // 补充头像路径
      item.avatarUrl = baseUrl + item.avatarPath
      // item.meta 用于控制按钮
      item.meta = {
        // 用户是否关注了他
        isFollowedByUser: userInfo.follows.includes(item._id),
        // 他是不是用户的粉丝
        isFansofUser: true
      }
    })
    this.setData({
      fans
    })
  },
  // 切换tab
  changeTab(e) {
    this.setData({
      currentIndex: +e.target.dataset.index
    })
  },
  // 轮播滚动
  swiperChange(e) {
    this.setData({
      currentIndex: +e.detail.current
    })
  }
})