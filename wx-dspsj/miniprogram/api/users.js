// 导入基于Promise 封装过的网络请求函数
import {
  request
} from './request'

// 用户相关api操作
const usersApi = {
  /**
   * 用户注册
   * @param {} userObj 
   */
  register(userObj) {
    return request.post('/users/register', userObj)
  },
  /**
   * 用户登录
   * @param {*} data 
   */
  login(userObj) {
    return request.post('/users/login', userObj)
  },
  /**
   * 更新用户信息
   * @param {*} newUserObj 
   */
  updateUser(newUserObj) {
    return request.post('/users/update', newUserObj)
  },
  /**
   * 根据等于条件查找、获取用户基本信息
   * @param {*} uid
   */
  getUserInfo(uid) {
    return request.get('/users/findById/'+uid)
  },
  /**
   * 
   * @param {*} userObj 
   */
  getUserPreferences(userObj) {
    return request.get('/users/preferences', userObj)
  }
}

export {
  usersApi
}