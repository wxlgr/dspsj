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
    return request.get('/users/findById/' + uid)
  },
  /**
   * 获取其他用户的基本信息
   * @param {*} uid
   */
  getHisBasicInfo(uid) {
    return request.get('/users/hisInfo/' + uid)
  },
  /**
   * 获取用户的关注列表
   * @param {*} uid
   */
  getUserFollows(uid) {
    return request.get('/users/follows', {
      uid
    })
  },
  /**
   * 获取用户的粉丝列表
   * @param {*} uid 
   */
  getUserFans(uid) {
    return request.get('/users/fans', {
      uid
    })
  },
  /**
   * 关注某人
   * @param {String} uid 
   * @param {String} tid 
   */
  followSomeOne(uid, tid) {
    return request.post('/users/follow', {
      uid,
      tid
    })
  },
  /**
   * 取关某人
   * @param {String} uid 
   * @param {String} tid 
   */
  unFollowSomeOne(uid, tid) {
    return request.post('/users/unfollow', {
      uid,
      tid
    })
  },
  /**
   * 移除粉丝
   * @param {String} uid 
   * @param {String} tid 
   */
  removeFan(uid, tid) {
    return request.post('/users/removeFan', {
      uid,
      tid
    })
  },
  /**
   * 给视频点赞,添加到喜欢
   * @param {String} uid 
   * @param {String} vid 
   */
  likeVideo(uid, vid) {
    return request.post('/users/likeVideo', {
      uid,
      vid
    })
  },
  /**
   * 给视频取赞,取消喜欢
   * @param {String} uid 
   * @param {String} vid 
   */
  unLikeVideo(uid, vid) {
    return request.post('/users/unLikeVideo', {
      uid,
      vid
    })
  },
  /**
   * 收藏视频
   * @param {String} uid 
   * @param {String} vid 
   */
  collectVideo(uid, vid) {
    return request.post('/users/collectVideo', {
      uid,
      vid
    })
  },
  /**
   * 取消收藏视频
   * @param {String} uid 
   * @param {String} vid 
   */
  unCollectVideo(uid, vid) {
    return request.post('/users/unCollectVideo', {
      uid,
      vid
    })
  },
}

export {
  usersApi
}