import {
  baseApiUrl
} from './base'


// 封装Promise request方法
// 这里统一在relativeUrl前拼接上baseApiUrl
function request(relativeUrl, method='get', data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseApiUrl + relativeUrl,
      // 携带token 
      header: {
        'Authorization': "Bearer "+wx.getStorageSync('token')
      },
      method,
      data,
      success: (res) => {
        // 只返回data
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
// 扩展
(['get', 'post']).forEach(itemMethod => {
  request[itemMethod] = function (url, data) {
    return request(url, itemMethod, data)
  }
})

export {
  request
}