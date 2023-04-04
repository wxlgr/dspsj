
const multer = require("multer")

const fs = require("fs")
const path = require('path')

const moment = require('moment')
const { STATIC_PATH } = require('../config/app.config')
const staticUploadsPath = STATIC_PATH + '/uploads'

const uploadRouter = new require('express').Router()


let videosUploadFolder = 'static/uploads/videos'
let avatarsUploadFolder = 'static/uploads/avatars'
let photosUploadFolder = 'static/uploads/photos'

let videosStorage = createMulterStorage(videosUploadFolder, multer)
let avatarsStorage = createMulterStorage(avatarsUploadFolder, multer)
let photosStorage = createMulterStorage(photosUploadFolder, multer)

// 创建文件夹
function createFolder(folder) {
  try {
    fs.accessSync(folder);
  } catch (e) {
    fs.mkdirSync(folder);
  }
}
createFolder(videosUploadFolder)
createFolder(avatarsUploadFolder)
createFolder(photosUploadFolder)


// 返回一个multerStorage
function createMulterStorage(uploadFolder) {
  return multer.diskStorage({
    // 设置目的地
    destination: function (req, file, cb) {
      cb(null, uploadFolder)
    },

    filename: function (req, file, cb) {
      const uniqueSuffix = Math.round(Math.random() * 1E9)
      // 后缀
      const ext = path.parse(file.originalname).ext
      const savePath = moment().format('YYYYMMDD_HHmmss_') + uniqueSuffix + ext
      cb(null, savePath)
    },
    fileFilter: function (req, file, cb) {
      console.log(file)
      cb(null, true)
    },
  })
}


let videoUpload = multer({ storage: createMulterStorage(videosUploadFolder) })
let avatarUpload = multer({ storage: createMulterStorage(avatarsUploadFolder) })
let photosUpload = multer({ storage: createMulterStorage(photosUploadFolder) })


// 任何文件
uploadRouter.post('/video', videoUpload.single('video'), function (req, res, next) {
  req.acceptsCharsets = "utf8"
  res.charset = "utf8"
  const file = req.file;
  const formData = req.body
  const videoUrl = staticUploadsPath + '/videos/' + file.filename
  res.send({
    code: 0,
    formData,
    file,
    videoUrl,
    msg: 'video upload success'
  });
});
// 头像
uploadRouter.post('/avatar', avatarUpload.single('avatar'), function (req, res, next) {

  req.acceptsCharsets = "utf8"
  res.charset = "utf8"
  const file = req.file;
  const formData = req.body
  const avatarUrl = staticUploadsPath + '/avatars/' + file.filename
  res.send({ code: 0, formData, avatarUrl, msg: 'avatar upload success' });

});

// 头像
uploadRouter.post('/photos', photosUpload.array('photos', 6), function (req, res, next) {

  req.acceptsCharsets = "utf8"
  res.charset = "utf8"
  const files = req.files;

  // 整理图片地址
  const photoUrls = files.map(photo => {
    return staticUploadsPath + '/photos/' + photo.filename
  })
  res.send({ code: 0, photoUrls, msg: 'photos upload success' });

});

module.exports = uploadRouter
