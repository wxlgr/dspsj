const { Router } = require("express");
const router = new Router();
const usersRouter = require("./users.router");
const videosRouter = require("./videos.router");
const uploadsRouter = require("./uploads.router");
const bgmsRouter = require("./bgms.router");
const reportsRouter = require("./reports.router");

router.use("/users", usersRouter);
router.use("/videos", videosRouter);
router.use("/upload", uploadsRouter);
router.use("/bgms", bgmsRouter);
router.use("/reports", reportsRouter);

const {
  usersModel,
  bgmsModel,
  videosModel,
  reportsModel, 
} = require("../mongoose/models/index");

// 获取卡片信息图标
router.get("/getCardList", async (req, res) => {
  const usersCount = await usersModel.count();
  const videosCount = await videosModel.count();
  const bgmsCount = await bgmsModel.count();
  const cardList = [
    {
      title: "用户总数",
      count: usersCount,
      // 本周新增
      weeklyAddedCount: Math.floor(Math.random() * usersCount),
    },
    {
      title: "视频总数",
      count: videosCount,
      // 本周新增
      weeklyAddedCount: Math.floor(Math.random() * videosCount),
    },
    {
      title: "bgm总数",
      count: bgmsCount,
      // 本周新增
      weeklyAddedCount: Math.floor(Math.random() * bgmsCount),
    },
  ];
  res.send({
    code: 0,
    msg: "获取卡片信息列表成功",
    result: cardList,
  });
});

module.exports = router;
