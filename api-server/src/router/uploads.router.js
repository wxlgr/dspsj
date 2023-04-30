const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { linkUrls, uniqueSuffix, removeFile } = require("../utils");
const moment = require("moment");
const {
  baseUrl,
  tempUploadFolder,
  videosUploadFolder,
  avatarsUploadFolder,
  photosUploadFolder,
  bgmsUploadFolder,
} = require("../config/app.config");

const uploadRouter = new require("express").Router();

// 创建文件夹
function createFolder(folder) {
  try {
    fs.accessSync(folder);
  } catch (e) {
    fs.mkdirSync(folder, {
      // 递归创建
      recursive: true,
    });
  }
}

// 创建文件
function initFolders() {
  createFolder(tempUploadFolder);
  createFolder(videosUploadFolder);
  createFolder(avatarsUploadFolder);
  createFolder(photosUploadFolder);
  createFolder(bgmsUploadFolder);
}

// 创建必要文件夹
initFolders();

// 返回一个multerStorage
function createMulterStorage(uploadFolder) {
  return multer.diskStorage({
    // 设置目的地
    destination: function (req, file, cb) {
      // 子目录 按天
      let subDir = moment().format("YYYYMMDD");
      // 创建子目录，使用linkUrls 以/拼接
      const dest = linkUrls(uploadFolder, subDir);
      createFolder(dest); //例如：videos/20230405
      cb(null, dest);
    },
    filename: function (req, file, cb) {
      // 随机尾数字符串
      const suffix = uniqueSuffix(8);
      //文件, 后缀
      const { ext } = path.parse(file.originalname);
      let dateStr = moment().format("YYYYMMDDHHmm_");
      // 文件名
      let fname = dateStr + suffix + ext;
      cb(null, fname);
    },
  });
}

/**
 * 视频，头像，bgm单文件上传
 */
let singleFileUploads = [
  // 临时文件夹
  {
    url: "/temp",
    upload: multer({ storage: createMulterStorage(tempUploadFolder) }),
    field: "temp",
  },
  // 存放视频作品
  {
    url: "/video",
    upload: multer({ storage: createMulterStorage(videosUploadFolder) }),
    field: "video",
  },

  {
    url: "/avatar",
    upload: multer({ storage: createMulterStorage(avatarsUploadFolder) }),
    field: "avatar",
  },
  // 背景图,封面图
  {
    url: "/photo",
    upload: multer({ storage: createMulterStorage(photosUploadFolder) }),
    field: "photo",
  },
  {
    url: "/bgm",
    upload: multer({ storage: createMulterStorage(bgmsUploadFolder) }),
    field: "bgm",
  },
];
/**
 * 单文件上传
 */
singleFileUploads.forEach((item) => {
  uploadRouter.post(
    item.url,
    item.upload.single(item.field),
    function (req, res, next) {
      req.acceptsCharsets = "utf8";
      res.charset = "utf8";
      const file = req.file;

      // 完整地址
      const fUrl = linkUrls(baseUrl, file.destination, file.filename);
      // 相对
      const rPath = linkUrls(file.destination, file.filename);
      res.send({
        code: 0,
        result: {
          url: fUrl,
          path: rPath,
        },
        msg: `${item.field} upload success`,
      });
    }
  );
});

//图册临时多照片上传

let tempPhotosUpload = multer({
  storage: createMulterStorage(tempUploadFolder),
});
uploadRouter.post(
  "/photos",
  tempPhotosUpload.array("photos", 6),
  function (req, res, next) {
    req.acceptsCharsets = "utf8";
    res.charset = "utf8";
    const files = req.files;

    // 整理图片地址
    const photos = files.map((file) => {
      return linkUrls(baseUrl, file.destination, file.filename);
    });

    const photosPath = files.map((file) => {
      return linkUrls(file.destination, file.filename);
    });
    res.send({
      code: 0,
      result: {
        photos,
        photosPath,
      },
      msg: "photos upload success",
    });
  }
);

// 删除文件

uploadRouter.post("/delete", async function (req, res) {
  const { filePath } = req.body;
  try {
    const result = await removeFile(filePath);
    res.send({
      code: 0,
      result,
      msg: "delete success",
    });
  } catch (error) {
    console.log(error.message);
    res.send({
      code: 1,
      result: null,
      msg: error.message,
    });
  }
});

module.exports = uploadRouter;
