// 导入基于Promise 封装过的网络请求函数
import {
  request
} from './request'


const reportsApi = {
  /**
   * 提交一个视频举报
   * @param {*} uid 
   * @param {*} vid 
   * @param {*} rid 
   */
  postVideoReport(obj = {
    uid: '',
    vid: '',
    reason: {
      id: '',
      value: ''
    }
  }) {
    return request.post('/reports/postReport', obj)
  },
  /**
   * 提交一个视频反馈
   * @param {*} uid 
   * @param {*} vid 
   * @param {*} rid 
   */
  postVideoFeedback(obj = {
    uid: '',
    vid: '',
    reason: {
      id: '',
      value: ''
    }
  }) {
    return request.post('/reports/postFeedback', obj)
  },

  /**
   * 处理一个视频举报
   * @param {*} uid 
   * @param {*} rid 
   * @param {*} handleCode 
   */
  handleVideoReport(uid, rid, handleCode) {
    return request.post('/reports/handleReport', {
      uid,
      rid,
      handleCode
    })
  },

  /**
   * 处理一个视频反馈
   * @param {*} uid 
   * @param {*} rid 
   * @param {*} handleCode 
   */
  handleVideoFeedback(uid, rid, handleCode) {
    return request.post('/reports/handleFeedback', {
      uid,
      rid,
      handleCode
    })
  },
}
export {
  reportsApi
}