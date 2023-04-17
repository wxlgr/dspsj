const mongoose = require("../db");
const userSchema = require("./userSchema");

// 用户数据库模型
let bgmSchema = new mongoose.Schema(
  {
    // 作者
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // 名称
    title: {
      type: String,
      required: true,
    },
    // 音乐链接
    bgmPath: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = bgmSchema;
