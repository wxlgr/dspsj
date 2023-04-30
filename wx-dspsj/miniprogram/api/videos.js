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
   * 分页查询公开视频
   */
  findPublicVideosByPage(pageOptions = {
    pageIndex: 1,
    pageSize: 5
  }) {
    Object.assign({
      pageIndex: 1,
      pageSize: 5
    }, pageOptions)
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
  /**
   * 制作影集
   * @param {*} obj 
   */
  makeAlbums(obj = {
    bgmUrl: '',
    photoUrls: [],
    addText: ''
  }) {
    return request.post('/videos/makeAlbums', obj)
  },
  /**
   * 给视频添加bgm
   * @param {*} options 
   */
  makeVideo(options = {
    videoUrl: '',
    bgmUrl: ''
  }) {
    return request.post('/videos/makeVideo', options)
  },
  /**
   * 获得视频举报的原因列表
   */
  getReportReasons() {
    return request.get('/videos/reportReasons')
  },
  /**
   * 获得视频播放反馈问题的问题
   */
  getVideoPlayQuestions() {
    return request.get('/videos/playQuestions')
  }

}

export {
  videosApi
}