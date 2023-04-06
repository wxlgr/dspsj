const multer = require("multer")
const fs = require("fs")
const path = require('path')
const { linkUrls, uniqueSuffix } = require('../utils')
const moment = require('moment')
const {
  baseUrl,
  videosUploadFolder,
  avatarsUploadFolder,
  photosUploadFolder,
  bgmsUploadFolder
} = require('../config/app.config')

const uploadRouter = new require('express').Router()

// 创建文件夹
function createFolder(folder) {
  try {
    fs.accessSync(folder);
  } catch (e) {
    fs.mkdirSync(folder, {
      // 递归创建
      recursive: true
    });
  }
}

// 创建文件
function initFolders() {
  createFolder(videosUploadFolder)
  createFolder(avatarsUploadFolder)
  createFolder(photosUploadFolder)
  createFolder(bgmsUploadFolder)
}

// 创建必要文件夹
initFolders()


// 返回一个multerStorage
function createMulterStorage(uploadFolder) {
  return multer.diskStorage({
    // 设置目的地
    destination: function (req, file, cb) {
      // 子目录 按天
      let subDir = moment().format('YYYYMMDD')
      // 创建子目录，使用linkUrls 以/拼接
      const dest = linkUrls(uploadFolder, subDir)
      createFolder(dest)  //例如：videos/20230405
      cb(null, dest)
    },
    filename: function (req, file, cb) {

      // 随机尾数字符串
      const suffix_ = uniqueSuffix(9) + '_'
      //文件, 后缀
      const { name, ext } = path.parse(file.originalname)
      let dateStr = moment().format('YYYYMMDD_hhmmss_')
      // 文件名
      let fname = dateStr + suffix_ + name.substring(0, 10) + ext
      cb(null, fname)
    }
  })
}


/**
 * 视频，头像，bgm单文件上传
 */
let singleFileUploads = [{
  url: '/video',
  upload: multer({ storage: createMulterStorage(videosUploadFolder) }),
  field: 'video'
},
{
  url: '/avatar',
  upload: multer({ storage: createMulterStorage(avatarsUploadFolder) }),
  field: 'avatar'
},
{
  url: '/bgm',
  upload: multer({ storage: createMulterStorage(bgmsUploadFolder) }),
  field: 'bgm'
}
]
/**
 * 单文件上传
 */
singleFileUploads.forEach(item => {
  uploadRouter.post(item.url, item.upload.single(item.field), function (req, res, next) {
    req.acceptsCharsets = "utf8"
    res.charset = "utf8"
    const file = req.file;
    let fileUrl = item.field + 'Url'
    const fUrl = linkUrls(baseUrl, file.destination, file.filename)
    res.send({ code: 0, [fileUrl]: fUrl, msg: `${item.field} upload success` });
  })
})

//图册

let photosUpload = multer({ storage: createMulterStorage(photosUploadFolder) })
uploadRouter.post('/photos', photosUpload.array('photos', 6), function (req, res, next) {

  req.acceptsCharsets = "utf8"
  res.charset = "utf8"
  const files = req.files;

  // 整理图片地址
  const photoUrls = files.map(file => {
    return linkUrls(baseUrl, file.destination, file.filename)
  })
  res.send({ code: 0, photoUrls, msg: 'photos upload success' });

});

module.exports = uploadRouter
