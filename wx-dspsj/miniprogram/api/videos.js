import {
  request
} from './request'
// videos相关api操作
const videosApi = {
  /**
   * 新增视频
   * @param {*} videoObj 
   */
  addVideo(videoObj) {
    return request.post('/videos/add', videoObj)
  },

  /**
   * 
   * @param {*} videoConditions 
   */
  findVideosByConditions(videoConditions) {
    return request.post('/videos/find', videoConditions)
  },
  /**
   * 查询所有公开视频
   */
  findAllPublicVideos() {
    return request.get('/videos/findAllPublic')
  },
  /**
   * 分页查询公开视频
   */
  findPublicVideosByPage(pageOptions = {
    pageIndex: 1,
    pageSize: 5
  }) {
    return request.get('/videos/findByPage', pageOptions)
  },
  /**
   * 获取用户作品
   * @param {*} uid 
   */
  findUserWorks(uid) {
    return request.get('/videos/findUserWorks/' + uid)
  },
  /**
   * 获取用户私密作品
   * @param {*} uid 
   */
  findUserSecretWorks(uid) {
    return request.get('/videos/findUserSecretWorks/' + uid)
  },
  /**
   * 获取用户喜欢的视频
   * @param {*} uid 
   */
  findUserLikes(uid) {
    return request.get('/videos/findUserLikes/' + uid)
  },
  /**
   * 获取用户收藏的视频
   * @param {*} uid 
   */
  findUserCollects(uid) {
    return request.get('/videos/findUserCollects/' + uid)
  },

  /**
   * 更新视频
   * @param {*} newVideoObj 
   */
  updateVideo(newVideoObj) {
    return request.post('/videos/update', newVideoObj)
  },
  /**
   * 删除视频
   * @param {*} videoObj 
   */
  deleteVideo(videoObj) {
    return request.post('/videos/delete', videoObj)
  },
}

export {
  videosApi
}