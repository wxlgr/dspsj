const bgmsRouter = new require("express").Router();
const { isObjectIdOrHexString } = require("../mongoose/db");
const { bgmsModel, usersModel } = require("../mongoose/models/index");

// bgm新增
bgmsRouter.post("/add", async function (req, res) {
  const { uid, bgmPath, title } = req.body;

  const bgm = await bgmsModel.create({
    author: uid,
    bgmPath,
    title,
  });
  res.send({
    code: 0,
    result: bgm,
    msg: "新增成功",
  });
});

// 查找所有 并填充 author：根据uid返回具体User
bgmsRouter.get("/findAll", async function (req, res) {
  const bgms = await bgmsModel
    .find()
    .populate("author", ["username", "nickname", "avatarPath"])
    .sort({
      updatedAt: -1,
    });
  res.send({
    code: 0,
    result: bgms,
    msg: "查询成功",
  });
});

// 获取用户的bgm
bgmsRouter.get("/findUserBgms/:uid", async function (req, res) {
  try {
    const uid = req.params.uid;

    const videos = await bgmsModel
      .find({
        author: uid,
      })
      .populate("author", "username nickname avatarPath")
      .sort({
        updatedAt: -1,
      });
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

// 获得bgm总数
bgmsRouter.get("/totalCount", async function (req, res) {
  const totalCount = await bgmsModel.count();
  res.send({
    code: 0,
    result: totalCount,
    msg: "查询成功",
  });
});
// bgm分页查询
bgmsRouter.get("/findByPage", async function (req, res) {
  let { pageIndex = 1, pageSize = 5 } = req.query;

  // 转为数字
  pageIndex = +pageIndex;
  pageSize *= 1;

  const list = await bgmsModel
    .find()
    .skip((pageIndex - 1) * pageSize)
    .limit(pageSize)
    .populate("author", "nickname avatarPath")
    .sort({
      createdAt: -1,
    });

  res.send({
    code: 0,
    result: list,
    msg: "查询成功",
  });
});
// 标题模糊查询
bgmsRouter.get("/search", async function (req, res) {
  try {
    const { searchText } = req.query;
    const regex = new RegExp(searchText, "i");
    const bgms = await bgmsModel
      .find({
        $or: [{ title: regex }],
      })
      .populate("author", "nickname avatarPath");
    res.send({
      code: 0,
      result: bgms,
      msg: "模糊查询成功",
    });
  } catch (error) {
    console.log(error);
  }
});

// bgm修改

bgmsRouter.post("/update", async function (req, res) {
  const bgmObj = req.body;
  const _id = bgmObj._id;

  // 返回修改之后的文档
  const bgm = await bgmsModel.findByIdAndUpdate(_id, bgmObj, {
    returnDocument: "after",
  });

  if (bgm) {
    res.send({
      code: 0,
      msg: "bgm修改成功",
      result: bgm,
    });
  } else {
    res.send({
      code: 1,
      msg: "bgm不存在,修改失败",
      result: null,
    });
  }
});

// 删除bgm
bgmsRouter.post("/delete", async (req, res) => {
  // bgmid
  const id = req.body.id;
  const bgm = await bgmsModel.findByIdAndDelete(id);
  res.send({
    code: 0,
    result: bgm,
    msg: bgm ? "删除成功" : "bgm不存在，删除失败",
  });
});

module["exports"] = bgmsRouter;
