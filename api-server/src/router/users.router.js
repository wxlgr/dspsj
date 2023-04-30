const userRouter = new require("express").Router();
const { usersModel, videosModel } = require("../mongoose/models/index");
const jwt = require("jsonwebtoken");
const { removeFile } = require("../utils");

// 注册
userRouter.post("/register", async function (req, res) {
  const { username } = req.body;
  let hasData = await usersModel.findOne({ username });

  // 检测用户名是否已存在
  if (hasData) {
    return res.send({
      code: 1,
      result: null,
      msg: "用户名已存在",
    });
  }
  // 初次注册
  const user = await usersModel.create({
    ...req.body,
    nickname: username,
  });
  res.send({
    code: 0,
    result: user,
    msg: "注册成功",
  });
});

// 登录
userRouter.post("/login", async function (req, res) {
  let { username = "", password = "" } = req.body;

  const user = await usersModel.findOne({
    // 通过用户名或者昵称
    username,
    password,
  });
  if (user) {
    // 登录成功，返回token
    const token = jwt.sign(
      {
        data: { username, _id: user._id },
      },
      "key"
      // {
      //   // 30分钟内有效
      //   expiresIn: "30m",
      // }
    );
    res.send({
      code: 0,
      token,
      result: user,
      msg: "登录成功",
    });
  } else {
    // 登录失败
    res.send({
      code: 1,
      result: user,
      msg: "用户名密码错误",
    });
  }
});

// 根据条件查询用户信息
userRouter.get("/findById/:uid", async function (req, res) {
  try {
    const uid = req.params.uid;
    const user = await usersModel.findById(uid);
    res.send({
      code: 0,
      result: user,
      msg: "查询完成",
    });
  } catch (error) {
    console.log(error.message);

    res.send({
      code: 1,
      result: null,
      msg: "查询失败",
    });
  }
});
// 获取其他用户基本信息
userRouter.get("/hisInfo/:uid", async function (req, res) {
  try {
    const uid = req.params.uid;
    const user = await usersModel
      .findById(uid)
      .select("username nickname gender avatarPath bgPath birthday star fansCount followsCount")
    res.send({
      code: 0,
      result: user,
      msg: "查询完成",
    });
  } catch (error) {
    console.log(error.message);

    res.send({
      code: 1,
      result: null,
      msg: "查询失败",
    });
  }
});

// 修改用户信息
userRouter.post("/update", async function (req, res) {
  // 新的用户信息对象
  let newUserInfo = req.body;

  // 用户id
  let _id = req.body._id;

  const data = await usersModel.findByIdAndUpdate(_id, newUserInfo, {
    // 返回更新后的文档
    returnDocument: "after",
  });
  if (data) {
    res.send({
      code: 0,
      result: data,
      msg: "修改成功",
    });
  } else {
    res.send({
      code: 1,
      result: null,
      msg: "修改失败",
    });
  }
});
// 删除用户
userRouter.post("/delete", async (req, res) => {
  try {
    // 用户id
    const _id = req.body._id;

    const user = await usersModel.findByIdAndDelete(_id);
    res.send({
      code: 0,
      result: user,
      msg: user ? "删除成功" : "用户不存在，删除失败",
    });
  } catch (error) {
    console.log(error.message);

    res.send({
      code: 1,
      result: null,
      msg: error.message || "未知错误",
    });
  }
});

// 分页查询
userRouter.get("/findByPage", async function (req, res) {
  try {
    let { pageIndex = 1, pageSize = 5 } = req.query;

    // 转为数字
    pageIndex = +pageIndex;
    pageSize *= 1;

    const totalCount = await usersModel.count();
    const list = await usersModel
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

// 获取用户的关注列表数据
userRouter.get("/follows", async function (req, res) {
  const uid = req.query.uid;
  const user = await usersModel
    .findOne({
      _id: uid,
    })
    .populate("follows", "username nickname avatarPath fansCount fans");

  res.send({
    code: 0,
    msg: "获取关注列表成功",
    result: user.follows,
  });
});
// 获取用户的粉丝列表数据
userRouter.get("/fans", async function (req, res) {
  const uid = req.query.uid;
  const user = await usersModel
    .findOne({
      _id: uid,
    })
    .populate("fans", "username nickname avatarPath followsCount follows");
  res.send({
    code: 0,
    msg: "获取粉丝列表成功",
    result: user.fans,
  });
});

// 关注他 操作
userRouter.post("/follow", async (req, res) => {
  // 用户id 目标偶像id
  const { uid, tid } = req.body;

  const user = await usersModel.findById(uid);
  const idol = await usersModel.findById(tid);

  if (user.follows.includes(tid)) {
    return res.send({
      code: 1,
      msg: "你已关注过对方啦",
    });
  }

  user.follows.push(tid);
  user.followsCount = user.follows.length;

  idol.fans.push(uid);
  idol.fansCount = idol.fans.length;

  // 保存修改
  await user.save();
  await idol.save();

  res.send({
    code: 0,
    msg: "你关注了：" + idol.username,
  });
});

// 取关他 操作
userRouter.post("/unfollow", async (req, res) => {
  // 用户id 目标偶像id
  let { uid, tid } = req.body;

  const user = await usersModel.findById(uid);
  const idol = await usersModel.findById(tid);

  // 这里自动转为字符串比对
  if (!user.follows.includes(tid)) {
    return res.send({
      code: 1,
      msg: "您并未关注对方哦",
    });
  }

  // 找到偶像在用户关注列表的位置
  // 这里不能使用===，只能使用==或者equals方法，因为id是ObjectId,tid为普通字符串
  let followIndex = user.follows.findIndex((id) => id.equals(tid));

  user.follows.splice(followIndex, 1);
  user.followsCount = user.follows.length;

  // 找到用户在偶像粉丝列表的位置
  // 这里不能使用===，只能使用==，因为id是ObjectId,tid为普通字符串
  let fanIndex = idol.fans.findIndex((id) => id == uid);
  idol.fans.splice(fanIndex, 1);
  idol.fansCount = idol.fans.length;

  // 保存修改
  await user.save();
  await idol.save();

  res.send({
    code: 0,
    msg: "您取关了：" + idol.username,
    result: user.follows,
  });
});

// 移除粉丝
userRouter.post("/removeFan", async (req, res) => {
  // 用户id 目标粉丝id
  const { uid, tid } = req.body;

  const user = await usersModel.findById(uid);
  const fan = await usersModel.findById(tid);

  if (!user.fans.includes(tid)) {
    return res.send({
      code: 1,
      msg: "对方还不是您的粉丝哦",
    });
  }

  // 找到粉丝在用户粉丝列表的位置
  let fanIndex = user.fans.findIndex((id) => id.equals(tid));
  user.fans.splice(fanIndex, 1);
  user.fansCount = user.fans.length;

  // 找到用户在粉丝的关注列表的位置
  let followIndex = fan.follows.findIndex((id) => id.equals(uid));
  fan.follows.splice(followIndex, 1);
  fan.followsCount = fan.follows.length;

  // 保存修改
  await user.save();
  await fan.save();

  res.send({
    code: 0,
    msg: "您移除了粉丝：" + fan.username,
  });
});

// 用户给某个视频点赞，添加喜欢
userRouter.post("/likeVideo", async function (req, res) {
  const { uid, vid } = req.body;
  const user = await usersModel.findById(uid);
  const video = await videosModel.findById(vid);
  const vauthor = await usersModel.findById(video.author);

  if (user.likes.includes(vid)) {
    return res.send({
      code: 1,
      msg: "您已经点赞过该视频啦",
    });
  }

  user.likes.push(vid);
  video.star = video.star + 1;

  // 作者获赞总数加一
  vauthor.star += 1;

  // 保存
  await user.save();
  await video.save();
  await vauthor.save();

  res.send({
    code: 0,
    msg: "点赞成功，已添加到喜欢",
    star: video.star,
    likes: user.likes,
  });
});
// 用户给某个视频取赞，移除喜欢
userRouter.post("/unLikeVideo", async function (req, res) {
  const { uid, vid } = req.body;
  const user = await usersModel.findById(uid);
  const video = await videosModel.findById(vid);
  const vauthor = await usersModel.findById(video.author);

  if (!user.likes.includes(vid)) {
    return res.send({
      code: 1,
      msg: "您还没有点赞过该视频啦",
    });
  }

  // 找到用户喜欢列表中的视频位置
  let likesIndex = user.likes.findIndex((id) => id.equals(vid));
  user.likes.splice(likesIndex, 1);
  video.star -= 1;

  // 作者获赞总数减1
  vauthor.star -= 1;

  // 保存
  await user.save();
  await video.save();
  await vauthor.save();

  res.send({
    code: 0,
    msg: "移除喜欢成功",
    star: video.star,
    likes: user.likes,
  });
});

// 用户收藏某个视频
userRouter.post("/collectVideo", async function (req, res) {
  const { uid, vid } = req.body;
  const user = await usersModel.findById(uid);
  const video = await videosModel.findById(vid);

  if (user.collects.includes(vid)) {
    return res.send({
      code: 1,
      msg: "您已经收藏过该视频啦",
    });
  }

  user.collects.push(vid);
  video.collect += 1;

  // 保存
  await user.save();
  await video.save();

  res.send({
    code: 0,
    msg: "添加收藏成功",
    // 视频被收藏数目
    collect: video.collect,
    collects: user.collects,
  });
});
// 用户取消收藏某个视频
userRouter.post("/unCollectVideo", async function (req, res) {
  const { uid, vid } = req.body;
  const user = await usersModel.findById(uid);
  const video = await videosModel.findById(vid);

  if (!user.collects.includes(vid)) {
    return res.send({
      code: 1,
      msg: "您还没有收藏过该视频啦",
    });
  }

  // 找到用户收藏列表中的视频位置
  let collectsIndex = user.collects.findIndex((id) => id.equals(vid));
  user.collects.splice(collectsIndex, 1);
  video.collect -= 1;

  // 保存
  await user.save();
  await video.save();

  res.send({
    code: 0,
    msg: "取消收藏成功",
    // 视频被收藏数目
    collect: video.collect,
    collects: user.collects,
  });
});
module.exports = userRouter;
