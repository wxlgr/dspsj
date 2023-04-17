// 导入基于Promise 封装过的网络请求函数
import {
  request
} from './request'

const bgmsApi = {
  addBGM(bgmObj) {
    return request.post('/bgms/add', bgmObj)
  },
  findAllBGMs() {
    return request.get('/bgms/findAll')
  },
  findUserBgms(uid) {
    return request.get('/bgms/findUserBgms/' + uid)
  },
  deleteBgm(gid) {
    return request.post("/bgms/delete",{gid})
  }
}
export {
  bgmsApi
}