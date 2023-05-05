const videosRouter = new require("express").Router();

const { videosModel, usersModel } = require("../mongoose/models/index");
const { createVideoGgmFFTask } = require("../ff/videoBgm");
const { createAlbumFFTask } = require("../ff/album");
const { FFCreatorCenter, startFFTask } = require("../ff/index");
const path = require("path");

const { baseUrl } = require("../config/app.config");

const ffoutPath = "static/ffout/";

const wss = require("../router/ws");

// 推送
function sendTaskProgress(ws, taskId) {
  let timer = setInterval(() => {
    const percent = (FFCreatorCenter.getProgress(taskId) * 100) >> 0;
    ws.send(
      JSON.stringify({
        type: "progress",
        data: percent,
      })
    );
  }, 1000);

  // 制作完成
  FFCreatorCenter.onTaskComplete(taskId, (result) => {
    ws.send(
      JSON.stringify({
        type: "progress",
        data: 100,
      })
    );

    const baseName = path.parse(result.file).base;
    const url = baseUrl + "/" + ffoutPath + baseName;
    const filePath = ffoutPath + baseName;
    ws.send(
      JSON.stringify({
        type: "complete",
        data: {
          url,
          path: filePath,
        },
      })
    );
    clearInterval(timer);
    ws.close();
  });
}

// 获取视频制作进度
wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    // 返回发来的消息
    const obj = JSON.parse(data.toString());

    // ws.send(data.toString());
    if (obj.type === "progress") {
      // 推送任务状态
      sendTaskProgress(ws, obj.taskId);
    }
  });
});

// 视频加工,添加任务
videosRouter.post("/makeVideo", async (req, res) => {
  const { videoUrl, bgmUrl } = req.body;
  const taskId = startFFTask(() =>
    createVideoGgmFFTask({
      videoPath: videoUrl,
      bgmPath: bgmUrl,
    })
  );
  res.send({
    code: 0,
    msg: "任务执行中",
    taskId,
  });
});

// 制作图册
videosRouter.post("/makeAlbums", async (req, res) => {
  let { bgmUrl, photoUrls, addText = "" } = req.body;

  const taskId = startFFTask(() =>
    createAlbumFFTask({
      imgs: photoUrls,
      bgm: bgmUrl,
      txt: {
        title: addText,
      },
    })
  );
  res.send({
    code: 0,
    msg: "任务执行中",
    taskId,
  });
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
  try {
    // 视频id
    let _id = req.body._id;
    const video = await videosModel.findByIdAndDelete(_id);
    res.send({
      code: 0,
      result: video,
      msg: video ? "删除成功" : "视频不存在，删除失败",
    });
  } catch (error) {
    console.log(error);
  }
});

// 获取用户的公开作品
videosRouter.get("/findUserWorks/:uid", async function (req, res) {
  try {
    const uid = req.params.uid;

    const videos = await videosModel
      .find({
        author: uid,
        isPublic: true,
      })
      .populate("author", "username nickname avatarPath");
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

// 获得视频总数
videosRouter.get("/totalCount", async function (req, res) {
  const totalCount = await videosModel.count();
  res.send({
    code: 0,
    result: totalCount,
    msg: "查询成功",
  });
});

// video分页查询，所有公开视频
videosRouter.get("/findByPage", async function (req, res) {
  try {
    let { pageIndex = 1, pageSize = 5 } = req.query;

    // 转为数字
    pageIndex = +pageIndex;
    pageSize *= 1;

    const list = await videosModel
      .find({
        isPublic: true,
      })
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize)
      .sort({
        createdAt: "desc",
      })
      .populate("author", "username nickname avatarPath fans fansCount");

    res.send({
      code: 0,
      result: list,
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
// video分页查询,包括私有视频
videosRouter.get("/findAllByPage", async function (req, res) {
  try {
    let { pageIndex = 1, pageSize = 5 } = req.query;

    // 转为数字
    pageIndex = +pageIndex;
    pageSize *= 1;

    const list = await videosModel
      .find({
      })
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize)
      .sort({
        createdAt: "desc",
      })
      .populate("author", "nickname avatarPath");

    res.send({
      code: 0,
      result: list,
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

// 标题和描述的模糊查询
videosRouter.get("/search", async function (req, res) {
  try {
    const { searchText } = req.query;
    const regex = new RegExp(searchText, "i");
    const videos = await videosModel.find({
      $or: [{ title: regex }, { desc: regex }],
    }).populate('author','nickname avatarPath');
    res.send({
      code: 0,
      result: videos,
      msg: "模糊查询成功",
    });
  } catch (error) {
    console.log(error);
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

// video禁止公开
videosRouter.post("/toggleIsPublic", async function (req, res) {
  try {
    const vid = req.body.vid;
    const video = await videosModel.findById(vid);
    if (video) {
      video.isPublic = !video.isPublic;
      video.save();
      res.send({
        code: 0,
        msg: video.isPublic?"视频已恢复公开":"视频禁止公开成功",
        result: video,
      });
    } else {
      res.send({
        code: 1,
        msg: "video不存在",
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

// 返回视频举报原因列表数据
videosRouter.get("/reportReasons", function (req, res) {
  const { reportReasons } = require("./data/reportReasons");
  res.send({
    code: 0,
    msg: "查询成功",
    result: reportReasons,
  });
});

// 返回视频播放反馈原因列表数据
videosRouter.get("/playQuestions", function (req, res) {
  const { videoPlayQuestions } = require("./data/videoPlayQuestions");
  res.send({
    code: 0,
    msg: "查询成功",
    result: videoPlayQuestions,
  });
});

module.exports = videosRouter;
