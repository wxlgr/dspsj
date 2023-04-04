import apiUrls from '../../apiUrls/index'
Page({
  data: {
    userInfo: {},
    tempFilePath: '', //视频暂存地址
    size: '', //视频大小,
    // 数据双向绑定
    dataList: {
      vtitle: '',
      vdesc: ''
    }
  },
  onLoad(params) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
  },
  //选择视频
  chooseVideo() {
    const that = this;
    // 选择视频
    wx.chooseMedia({
      mediaType: 'video',
      count: 1,
      success: chooseResult => {
        const {
          tempFilePath,
          size
        } = chooseResult.tempFiles[0]
        console.log(chooseResult.tempFiles[0]);

        that.setData({
          tempFilePath,
          size: (size / 1024 / 1024).toFixed(2) + "MB"
        })
      }
    })
  },
  //上传视频
  doUploadVideo(event) {
    const that = this;
    // console.log(event);
    const {
      username,
      _id
    } = that.data.userInfo
    const {tempFilePath} = this.data
    let {
      vtitle,
      vdesc
    } = event.detail.value;
    // console.log(event.detail);

    // console.log(that.data);
    vtitle = vtitle || Date.now(); //没有给名字就用时间戳
    // wx.showLoading({
    //   title: '上传中',
    // })
    wx.uploadFile({
      url: apiUrls.uploadVideo,
      filePath: tempFilePath, 
      name: 'file',
      formData: {
        username,_id,vtitle
      }, //上传额外携带的参数
      success(f) {
        // data传过来是string类型
        const fileData = JSON.parse(f.data)
       console.log(fileData);
        wx.showToast({
          title: '视频上传成功'
        })
        //数据库添加
      }
    })




  },


  // bindInput
  // 数据实现双向绑定
  bindInput(e) {
    // console.log(e);
    let name = e.target.dataset.name
    let key = 'dataList.' + name
    let value = e.detail.value
    this.setData({
      [key]: value
    })
  }
})