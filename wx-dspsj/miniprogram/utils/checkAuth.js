import api from '../api/index'
async function checkAuth() {
  const data = await api.getUserInfo(getApp().uid)
  return data.code !== 401
}
export {
  checkAuth
}