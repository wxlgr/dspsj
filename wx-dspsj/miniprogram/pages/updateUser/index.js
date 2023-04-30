import api from '../../api/index'
import utils from '../../utils/chooseAndUploadPic'
Page({
  data: {
    userInfo: {},
    uid: '',
    // 背景图
    bgUrl: '',
    avatarUrl: '',
    avatarDefault: '../../assets/images/noneface.png',
    // 默认背景图路径 在服务器
    defaultBgPath: 'static/assets/bg.png',

    genderRange: ['男', '女']
  },
  async onLoad(options) {
    this.setData({
      uid: options.uid
    })
    this.getUserInfo()
  },
  async onPullDownRefresh() {
    wx.showNavigationBarLoading()
    await this.getUserInfo()
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
    wx.showToast({
      title: '刷新成功',
    })
  },
  // 更换头像
  async changeAvatar() {
    const result = await utils.chooseAndUploadPic('avatar')
    if (!result) return
    const {
      userInfo
    } = this.data
    // 数据库更新
    await api.updateUser({
      _id: userInfo._id,
      avatarPath: result.path
    })
    if (userInfo.avatarPath) {
      api.deleteFile(userInfo.avatarPath)
    }
    //  ui
    this.setData({
      avatarUrl: result.url
    })
    wx.showToast({
      title: '头像更换成功',
    })
  },

  // 预览背景图
  previewBg() {
    wx.previewImage({
      urls: [this.data.bgUrl]
    })
  },
  // 更换背景图
  async changeBg() {
    const result = await utils.chooseAndUploadPic()
    if (!result?.path) return
    const {
      userInfo
    } = this.data
    // 数据库更新
    await api.updateUser({
      _id: userInfo._id,
      bgPath: result.path
    })
    // 删除旧文件
    if (userInfo.bgPath) {
      api.deleteFile(userInfo.bgPath)
    }
    //  ui
    this.setData({
      bgUrl: result.url,
      'userInfo.bgPath': result.path
    })
    wx.showToast({
      title: '背景更换成功',
    })

  },

  // 获取用户信息
  async getUserInfo() {
    if (!this.data.uid) return;
    const {
      result: user,
    } = await api.getUserInfo(this.data.uid)
    const baseUrl = getApp().globalData.baseUrl
    this.setData({
      userInfo: user,
      baseUrl,
      bgUrl: user.bgPath ? baseUrl + user.bgPath : baseUrl + this.data.defaultBgPath,
      avatarUrl: user.avatarPath ? baseUrl + user.avatarPath : ''
    })
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
  // 修改性别
  async changeGender(e) {
    const index = +e.detail.value
    const value = this.data.genderRange[index]

    const isPublic = (await wx.showModal({
      title: '是否公开生日',
      cancelText: '保密',
      confirmText: '公开'
    })).confirm

    const {
      userInfo: user
    } = this.data
    user.gender = {
      isPublic,
      value
    }
    this.setData({
      userInfo: user
    })
    await api.updateUser(user)
    wx.showToast({
      title: '性别修改成功',
    })
  },
  // 修改生日
  async changeBirthday(e) {
    let value = e.detail.value
    // 日期大于当前日期
    if (new Date(value) > new Date()) {
      return wx.showToast({
        title: '日期非法',
      })
    }
    const isPublic = (await wx.showModal({
      title: '是否公开生日',
      cancelText: '保密',
      confirmText: '公开'
    })).confirm
    let birthday = {
      isPublic,
      value
    }
    const {
      userInfo: user
    } = this.data
    user.birthday = birthday
    this.setData({
      userInfo: user
    })
    await api.updateUser(user)
    wx.showToast({
      title: '生日修改成功',
    })
  }
})