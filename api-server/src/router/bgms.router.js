const bgmsRouter = new require("express").Router();
const { bgmsModel } = require("../mongoose/models/index");

// bgm新增
bgmsRouter.post("/add", async function (req, res) {
  const { author = "", bgmPath, title = "" } = req.body;
  const bgm = await bgmsModel.create({
    author,
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
    .populate("author", ["username", "nickname"]);
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
      .populate("author", "username");
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

// bgm分页查询
bgmsRouter.get("/findByPage", async function (req, res) {
  let { pageIndex = 1, pageSize = 5 } = req.query;

  // 转为数字
  pageIndex = +pageIndex;
  pageSize *= 1;

  const totalCount = await bgmsModel.count();
  const list = await bgmsModel
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
});

// bgm修改

bgmsRouter.post("/update", async function (req, res) {
  const bgmObj = req.body;
  const _id = req.body._id;

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
  const gid = req.body.gid;
  const bgm = await bgmsModel.findByIdAndDelete(gid);
  res.send({
    code: 0,
    result: bgm,
    msg: bgm ? "删除成功" : "bgm不存在，删除失败",
  });
});

module["exports"] = bgmsRouter;
