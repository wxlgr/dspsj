  import api from '../api/index'
  /**
   * 选择一张图片并完成上传
   * 默认完成bg图上传，传入field = 'avatar'也可以完成头像上传
   * @param {*} field 
   * @return Promise:result {url,path}
   */
  async function chooseAndUploadPic(field = 'photo') {
    try {
      const images = await wx.chooseMedia({
        mediaType: 'image',
        count: 1,
      })
      const image = images.tempFiles[0]
      if (image.fileType !== 'image') {
        return wx.showToast({
          title: '请选择图片文件',
          icon: 'error'
        })
      }
      // 编辑后的照片
      let editPath = ''
      wx.editImage({
        src: image.tempFilePath,
        success: res => {
          editPath = res.tempFilePath
        },
      })
      // 不支持编辑就用原本的文件
      const {
        result
      } = await api.uploadFile(editPath ? editPath : image.tempFilePath, field)
      console.log(result);
      return result
    } catch (error) {
      console.log(error);
    }
  }

  export default {
    chooseAndUploadPic
  }