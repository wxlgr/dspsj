const videosRouter = new require('express').Router()

const { videosModel, usersModel } = require('../mongoose/models/index')
const { createBlurFFTask } = require('../ff/blur')
const { createAlbumFFTask } = require('../ff/album')
const { startFFTask, FFCreatorCenter } = require('../ff/index')
const path = require('path')
const bgms = require('./data/bgmUrls')


const { STATIC_PATH } = require('../config/app.config')

const ffoutPath = STATIC_PATH + '/ffout/'

// 视频加工
videosRouter.post('/processing', async (req, res) => {

  let { uid, bgmUrl, videoUrl, blur = 0 } = req.body


  if (!bgmUrl) {
    // 可选的随机bgm
    let randomIndex = Math.floor(Math.random() * bgms.length)
    bgmUrl = bgms[randomIndex].bgmUrl
  }

  // res.send({
  //   code: 0,
  //   msg: "加工完成",
  //   // 
  //   bgm: bgmUrl,
  //   videoUrl
  // })

  const taskId = startFFTask(() => createBlurFFTask({
    videoPath: videoUrl,
    bgm: bgmUrl,
    // 模糊度
    blur
  }))

  FFCreatorCenter.onTaskComplete(taskId, result => {
    const ffFileUrl = ffoutPath + path.parse(result.file).base
    res.send({
      code: 0,
      msg: "视频加工完成",
      uid,
      result: ffFileUrl
    })


  });

  // 错误
  FFCreatorCenter.onTaskError(taskId, error => {
    res.send({
      code: 1,
      msg: '未知错误！',
      result: null
    })
  })

})

// 制作图册
videosRouter.post('/makeAlums', async (req, res) => {


  const photoUrls = JSON.parse(req.body.photoUrls)

  let { uid, bgmUrl, bgColor, textTitle, textColor, textFontSize, textBgColor } = req.body

  if (!bgmUrl) {
    // 可选的随机bgm
    let randomIndex = Math.floor(Math.random() * bgms.length)
    bgmUrl = bgms[randomIndex].bgmUrl
  }


  // 有值的属性才会保留
  let txt = JSON.stringify({
    title: textTitle,
    color: textColor,
    fontSize: textFontSize * 1,
    bgColor: textBgColor,
  })
  txt = JSON.parse(txt)


  const taskId = startFFTask(() => createAlbumFFTask({
    imgs: photoUrls,
    bgm: bgmUrl,
    bgColor,
    txt
  }))

  FFCreatorCenter.onTaskComplete(taskId, result => {
    const ffFileUrl = ffoutPath + path.parse(result.file).base
    res.send({
      code: 0,
      msg: "制作图册完成",
      uid,
      result: ffFileUrl
    })
  });

  // 错误
  FFCreatorCenter.onTaskError(taskId, error => {
    res.send({
      code: 1,
      msg: '未知错误！',
      result: null
    })
  })
})


// 视频新增
videosRouter.post('/add', async (req, res) => {

  const { title = '', author = '', videoUrl = '', desc = '' } = req.body



  videosModel.create({
    title,
    author,
    videoUrl,
    desc
  }).then(video => {
    res.send({
      code: 0,
      msg: "视频新增成功",
      result: video
    })
  }).catch(error => {
    res.send({
      code: 1,
      msg: error.message,
      result: null
    })
  })

})


// 视频修改
videosRouter.post('/update', async (req, res) => {

  // 新的视频信息对象
  let newVideoInfo = req.body
  // 视频id
  let _id = req.body._id



  videosModel.findByIdAndUpdate({
    _id
  }, newVideoInfo, {
    returnDocument: 'after'
  }).then(video => {
    res.send({
      code: 0,
      msg: "视频修改成功",
      result: video
    })
  }).catch(error => {
    res.send({
      code: 1,
      msg: error.message,
      result: null
    })
  })

})

// 视频删除
videosRouter.post('/delete', async (req, res) => {

  // 视频id
  let _id = req.body._id



  videosModel.findByIdAndDelete(
    _id
  ).then(video => {
    res.send({
      code: 0,
      msg: "视频删除成功",
      result: {
        deleteVideo: video
      }
    })

  }).catch(err => {
    res.send({
      code: 1,
      msg: "视频不存在,删除失败",
      result: null
    })
  })
})




module.exports = videosRouter