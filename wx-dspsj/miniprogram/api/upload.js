  import {
    baseApiUrl
  } from './base'
  import {
    request
  } from './request'

  // 上传 这里基于wx.uploadFile发送form-data请求，并进行Promise封装
  // 这里不使用我们封装过的request函数，所以需要单独处理
  const uploadUrls = {
    uploadTemp: baseApiUrl + '/upload/temp',
    uploadAvatar: baseApiUrl + "/upload/avatar",
    uploadVideo: baseApiUrl + "/upload/video",
    uploadBgm: baseApiUrl + "/upload/bgm",
    // 上传封面或者背景图
    uploadPhoto: baseApiUrl + "/upload/photo",
    uploadPhotos: baseApiUrl + "/upload/photos",
  }

  const uploadApi = {
    // 上传文件  路径，字段
    uploadFile(filePath, field) {
      return new Promise((resolve, reject) => {
        // 确定是走那个上传路径
        const uploadField = 'upload' + field[0].toUpperCase() + field.slice(1)
        console.log(uploadField);
        wx.uploadFile({
          filePath: filePath,
          name: 'file',
          // 携带token 其中token已是'Bearer '开头
          header: {
            "Authorization": "Bearer " + wx.getStorageSync('token')
          },
          url: uploadUrls[uploadField],
          success(res) {
            resolve(JSON.parse(res.data))
          },
          fail(err) {
            reject(err)
          }
        })
      })
    },
    deleteFile(filePath) {
      return request.post('/upload/delete', {
        filePath
      })
    }
  }
  export {
    uploadApi
  }