const videosRouter = new require("express").Router();

const { videosModel, usersModel } = require("../mongoose/models/index");
const { createVideoGgmFFTask } = require("../ff/videoBgm");
const { createAlbumFFTask } = require("../ff/album");
const { startFFTask, FFCreatorCenter } = require("../ff/index");
const path = require("path");

const { baseUrl } = require("../config/app.config");

const ffoutPath = baseUrl + "/static/ffout/";
const { removeFile } = require("../utils/index");

// 视频加工
videosRouter.post("/makeVideo", async (req, res) => {
  try {
    const { videoUrl, bgmUrl } = req.body;

    const taskId = startFFTask(() =>
      createVideoGgmFFTask({
        videoPath: videoUrl,
        bgmPath: bgmUrl,
      })
    );

    FFCreatorCenter.onTaskComplete(taskId, (result) => {
      const ffFileUrl = ffoutPath + path.parse(result.file).base;
      res.send({
        code: 0,
        msg: "视频加工完成",
        result: ffFileUrl,
      });
    });

    // 错误
    FFCreatorCenter.onTaskError(taskId, (error) => {
      res.send({
        code: 1,
        msg: "未知错误！",
        result: null,
      });
    });
  } catch (error) {
    console.log(error.message);

    res.send({
      code: 1,
      msg: "未知错误！",
      result: null,
    });
  }
});

// 制作图册
videosRouter.post("/makeAlbums", async (req, res) => {
  try {
    let { bgmUrl, photoUrls } = req.body;

    photoUrls = JSON.parse(photoUrls);

    const taskId = startFFTask(() =>
      createAlbumFFTask({
        imgs: photoUrls,
        bgm: bgmUrl,
      })
    );

    FFCreatorCenter.onTaskComplete(taskId, (result) => {
      const ffFileUrl = ffoutPath + path.parse(result.file).base;
      res.send({
        code: 0,
        msg: "制作图册完成",
        result: ffFileUrl,
      });
    });

    // 错误
    FFCreatorCenter.onTaskError(taskId, (error) => {
      res.send({
        code: 1,
        msg: "未知错误！",
        result: null,
      });
    });
  } catch (error) {
    console.log(error.message);
    request.send({
      code: 1,
      msg: "未知错误！",
      result: null,
    });
  }
});

// 视频新增
videosRouter.post("/add", async (req, res) => {
  const newVideoObj = req.body;
  const video = await videosModel.create(newVideoObj);
  res.send({
    code: 0,
    msg: "新增成功",
    result: video,
  });
});

// 视频修改
videosRouter.post("/update", async (req, res) => {
  try {
    // 新的视频信息对象
    let updateVideoObj = req.body;
    // 视频id
    let _id = req.body._id;

    const video = await videosModel.findByIdAndUpdate(_id, updateVideoObj, {
      returnDocument: "after",
    });
    if (video) {
      res.send({
        code: 0,
        msg: "视频修改成功",
        result: video,
      });
    } else {
      res.send({
        code: 1,
        msg: "视频不存在,修改失败",
        result: null,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.send({
      code: 1,
      msg: "未知错误！",
      result: null,
    });
  }
});

// 视频删除
videosRouter.post("/delete", async (req, res) => {
  // 视频id
  let _id = req.body._id;

  // 删除视频文件
  let { removeFilePath } = req.body;
  if (removeFilePath) {
    removeFile(removeFilePath);
  }

  const video = await videosModel.findByIdAndDelete(_id);

  res.send({
    code: 0,
    result: video,
    msg: video ? "删除成功" : "视频不存在，删除失败",
  });
});

// 获取所有公开的视频
//  并填充 author：根据uid返回具体User 要select username，不要_id
videosRouter.get("/findAllPublic", async function (req, res) {
  try {
    const videos = await videosModel
      .find({
        isPublic: true,
      })
      .populate("author", "username avatarPath");
    res.send({
      code: 0,
      result: videos,
      msg: "查询成功",
    });
  } catch (error) {
    console.log(error.message);
    res.send({
      code: 1,
      msg: "未知错误！",
      result: null,
    });
  }
});
// 获取用户的作品
videosRouter.get("/findUserWorks/:uid", async function (req, res) {
  try {
    const uid = req.params.uid;

    const videos = await videosModel
      .find({
        author: uid,
      })
      .populate("author", "username avatarPath");
    res.send({
      code: 0,
      result: videos,
      msg: "查询成功",
    });
  } catch (error) {
    console.log(error.message);
    res.send({
      code: 1,
      msg: "未知错误！",
      result: null,
    });
  }
});
// 获取用户的私密作品
videosRouter.get("/findUserSecretWorks/:uid", async function (req, res) {
  try {
    const uid = req.params.uid;

    const videos = await videosModel
      .find({
        author: uid,
        isPublic: false,
      })
      .populate("author", "username avatarPath");
    res.send({
      code: 0,
      result: videos,
      msg: "查询成功",
    });
  } catch (error) {
    console.log(error.message);
    res.send({
      code: 1,
      msg: "未知错误！",
      result: null,
    });
  }
});
// 获取用户的喜爱视频
videosRouter.get("/findUserLikes/:uid", async function (req, res) {
  try {
    const uid = req.params.uid;
    const user = await usersModel.findById(uid);

    const videos = await videosModel
      .find({
        _id: {
          $in: [...user.likes],
        },
      })
      .populate("author", "username avatarPath");
    res.send({
      code: 0,
      result: videos,
      msg: "查询成功",
    });
  } catch (error) {
    console.log(error.message);
    res.send({
      code: 1,
      msg: "未知错误！",
      result: null,
    });
  }
});
// 获取用户的收藏视频
videosRouter.get("/findUserCollects/:uid", async function (req, res) {
  try {
    const uid = req.params.uid;
    const user = await usersModel.findById(uid);

    const videos = await videosModel
      .find({
        _id: {
          $in: [...user.collects],
        },
      })
      .populate("author", "username avatarPath");
    res.send({
      code: 0,
      result: videos,
      msg: "查询成功",
    });
  } catch (error) {
    console.log(error.message);
    res.send({
      code: 1,
      msg: "未知错误！",
      result: null,
    });
  }
});

// 根据条件查询
videosRouter.post("/find", async function (req, res) {
  try {
    let conditions = req.body;

    const videos = await videosModel
      .find(conditions)
      .populate("author", "username _id");
    res.send({
      code: 0,
      result: videos,
      msg: "查询成功",
    });
  } catch (error) {
    console.log(error.message);
    res.send({
      code: 1,
      msg: "未知错误！",
      result: null,
    });
  }
});

// video分页查询
videosRouter.get("/findByPage", async function (req, res) {
  try {
    let { pageIndex = 1, pageSize = 5 } = req.query;

    // 转为数字
    pageIndex = +pageIndex;
    pageSize *= 1;

    const totalCount = await videosModel.count();
    const list = await videosModel
      .find()
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize);

    res.send({
      code: 0,
      result: {
        // 总数
        totalCount,
        // 总页数
        totolSize: Math.ceil(totalCount / pageSize),
        // 当前返回列表项数目
        listCount: list.length,
        // 第几页
        pageIndex,
        // 每页显示条数
        pageSize,
        // 列表数据
        list: list,
      },
      msg: "查询成功",
    });
  } catch (error) {
    console.log(error.message);
    res.send({
      code: 1,
      msg: "未知错误！",
      result: null,
    });
  }
});

// video修改

videosRouter.post("/update", async function (req, res) {
  try {
    const videoObj = req.body;
    const _id = req.body._id;

    // 返回修改之后的文档
    const video = await videosModel.findByIdAndUpdate(_id, videoObj, {
      returnDocument: "after",
    });

    if (video) {
      res.send({
        code: 0,
        msg: "video修改成功",
        result: video,
      });
    } else {
      res.send({
        code: 1,
        msg: "video不存在,修改失败",
        result: null,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.send({
      code: 1,
      msg: "未知错误！",
      result: null,
    });
  }
});

module.exports = videosRouter;
