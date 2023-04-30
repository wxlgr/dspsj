function checkAuth() {
  const uid = wx.getStorageSync('userInfo')._id
  getApp().uid=uid
  return !!uid
}
export {
  checkAuth
}