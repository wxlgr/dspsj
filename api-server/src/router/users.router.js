const userRouter = new require("express").Router();
const { isValidObjectId } = require("../mongoose/db");
const { usersModel } = require("../mongoose/models/index");
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
  const user = await usersModel.create(req.body);
  res.send({
    code: 0,
    result: user,
    msg: "注册成功",
  });
});

// 登录
userRouter.post("/login", async function (req, res) {
  let { username = "", nickname = "", password } = req.body;

  const user = await usersModel.findOne({
    // 通过用户名或者昵称
    $or: [{ username }, { nickname }],
    password: password,
  });
  if (user) {
    // 登录成功，返回token
    // 注意默认情况 Token 必须以 Bearer+空格 开头
    const token =
      "Bearer " +
      jwt.sign(
        {
          data: { username, _id: user._id },
        },
        "key",
        {
          // 30分钟内有效
          expiresIn: "30m",
        }
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
      msg: "登录失败",
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

// 修改用户信息
userRouter.post("/update", async function (req, res) {
  // 新的用户信息对象
  let newUserInfo = req.body;

  // 删除旧头像文件
  let { removeFilePath } = req.body;
  console.log(removeFilePath);
  if (removeFilePath) {
    removeFile(removeFilePath);
  }
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

module.exports = userRouter;
