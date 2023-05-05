const reportsRouter = new require("express").Router();
const { reportsModel } = require("../mongoose/models/index");

// 提交一个举报
reportsRouter.post("/postReport", async (req, res) => {
  const { vid, uid, reason } = req.body;

  const hasReported = await reportsModel.findOne({
    from: uid,
    video: vid,
    // 是举报
    isFeedBack: false,
  });
  if (hasReported) {
    return res.send({
      code: 1,
      msg: "您已经举报过该视频啦~",
    });
  }
  await reportsModel.create({
    video: vid,
    from: uid,
    reason,
  });
  res.send({
    code: 0,
    msg: "提交成功，我们会尽快核实",
  });
});

// 提交一个视频播放反馈
reportsRouter.post("/postFeedback", async (req, res) => {
  const { vid, uid, reason } = req.body;

  const hasReported = await reportsModel.findOne({
    from: uid,
    video: vid,
    // 是反馈
    isFeedBack: true,
  });
  if (hasReported) {
    return res.send({
      code: 1,
      msg: "您已经反馈过该视频啦~",
    });
  }
  await reportsModel.create({
    isFeedBack: true,
    video: vid,
    from: uid,
    reason,
  });
  res.send({
    code: 0,
    msg: "提交成功，我们会尽快处理",
  });
});
// 处理一个举报
reportsRouter.post("/handleReport", async (req, res) => {
  // 举报记录的id  handleCode
  const { rid, uid, handleCode } = req.body;
  if (![1, 2, 3, 4].includes(handleCode)) {
    return res.send({
      code: 1,
      msg: "handleCode invalid",
      handleCodeLike: {
        1: "暂无违规",
        2: "禁止公开",
        3: "删除惩罚",
        4: "封号处理",
      },
    });
  }

  const report = await reportsModel.findById(rid);
  if (!report.active) {
    return res.send({
      code: 1,
      msg: "举报已经被处理",
    });
  }

  //处理人
  report.handler = uid;
  // 处理结果
  report.hanldeCode = handleCode;
  // 处理状态
  report.active = false;

  // 保存更改
  await report.save();

  res.send({
    code: 0,
    msg: "已处理,感谢您的举报",
  });
});

// 处理一个反馈
reportsRouter.post("/handleFeedback", async (req, res) => {
  // 举报记录的id  handleCode
  const { rid, uid, handleCode } = req.body;
  if (![0].includes(handleCode)) {
    return res.send({
      code: 1,
      msg: "handleCode invalid",
      handleCodeLike: {
        0: "已修复",
      },
    });
  }

  const report = await reportsModel.findById(rid);
  if (!report.active) {
    return res.send({
      code: 1,
      msg: "反馈已经被处理",
    });
  }

  //处理人
  report.handler = uid;
  // 处理结果
  report.hanldeCode = handleCode;
  // 处理状态
  report.active = false;

  // 保存更改
  await report.save();

  res.send({
    code: 0,
    msg: "已处理，感谢您的反馈",
  });
});

// 获得视频内容举报总数
reportsRouter.get("/reportsCount", async function (req, res) {
  const totalCount = await reportsModel
    .find({
      isFeedBack: false,
    })
    .count();
  res.send({
    code: 0,
    result: totalCount,
    msg: "查询成功",
  });
});
// 获得视频播放反馈总数
reportsRouter.get("/feedbacksCount", async function (req, res) {
  const totalCount = await reportsModel
    .find({
      isFeedBack: true,
    })
    .count();
  res.send({
    code: 0,
    result: totalCount,
    msg: "查询成功",
  });
});
// 视频内容举报分页查询
reportsRouter.get("/findReportsByPage", async function (req, res) {
  let { pageIndex = 1, pageSize = 5 } = req.query;

  // 转为数字
  pageIndex = +pageIndex;
  pageSize *= 1;

  const list = await reportsModel
    .find({
      isFeedBack: false,
    })
    .skip((pageIndex - 1) * pageSize)
    .limit(pageSize)
    .populate("from", "nickname avatarPath")
    .populate("video", "title videoPath coverPath isPublic")
    .sort({
      createdAt: -1,
    });

  res.send({
    code: 0,
    result: list,
    msg: "查询成功",
  });
});
// 视频内容举报分页查询
reportsRouter.get("/findFeedbacksByPage", async function (req, res) {
  let { pageIndex = 1, pageSize = 5 } = req.query;

  // 转为数字
  pageIndex = +pageIndex;
  pageSize *= 1;

  const list = await reportsModel
    .find({
      isFeedBack: true,
    })
    .skip((pageIndex - 1) * pageSize)
    .limit(pageSize)
    .populate("from", "nickname avatarPath")
    .populate("video", "title videoPath coverPath isPublic")
    .sort({
      createdAt: -1,
    });

  res.send({
    code: 0,
    result: list,
    msg: "查询成功",
  });
});

// 举报模糊查询
reportsRouter.get("/searchReports", async function (req, res) {
  try {
    const { searchText } = req.query;
    const regex = new RegExp(searchText, "i");

    const reports = await reportsModel
      .find({
        isFeedBack: false,
      })
      .populate("from", "nickname avatarPath")
      .populate("video", "title videoPath coverPath isPublic")
      .sort({
        createdAt: -1,
      });
    // 填充后过滤
    const results = reports.filter((r) => {
      return (
        regex.test(r.reason.value) ||
        regex.test(r.from.nickname) ||
        regex.test(r.video.title)
      );
    });

    res.send({
      code: 0,
      result: results,
      msg: "模糊查询成功",
    });
  } catch (error) {
    console.log(error);
  }
});
// 反馈模糊查询
reportsRouter.get("/searchFeedbacks", async function (req, res) {
  try {
    const { searchText } = req.query;
    const regex = new RegExp(searchText, "i");
    const reports = await reportsModel
      .find({
        isFeedBack: true,
      })
      .populate("from", "nickname avatarPath")
      .populate("video", "title videoPath coverPath isPublic")
      .sort({
        createdAt: -1,
      });

    // 填充后过滤
    const results = reports.filter((r) => {
      return (
        regex.test(r.reason.value) ||
        regex.test(r.from.nickname) ||
        regex.test(r.video.title)
      );
    });
    res.send({
      code: 0,
      result: results,
      msg: "模糊查询成功",
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = reportsRouter;
