const mongoose = require("../db");

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    //作者 关联User: usersModel
    author: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    //描述
    desc: { type: String, default: "" },
    // 视频封面
    coverPath: { type: String, default: "" },
    // 视频背景音乐
    bgm: { type: mongoose.SchemaTypes.ObjectId, ref: "Bgm" },

    // 可见权限
    // 默认私密
    isPublic: { type: Boolean, default: false },
    //链接
    videoPath: { type: String, default: "" },
    // 获赞数
    star: { type: Number, default: 0 },
    // 被收藏数
    collect: { type: Number, default: 0 },

    //   留言评论
    comments: [
      {
        who: {
          type: Object,
          default: {
            nickname: "",
            avatarPath: "",
            _id: "",
          },
        },
        when: {
          type: String,
          default: "",
        },
        say: {
          type: String,
          default: "",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = videoSchema;
