const mongoose = require("../db");

// 视频举报、反馈数据库模型
let reportSchema = new mongoose.Schema(
  {
    // 是不是反馈 默认false 代表是举报
    isFeedBack: {
      type: Boolean,
      default: false,
    },
    // 被举报的视频
    video: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Video",
    },
    // 谁反馈的
    from: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    // 举报原因
    reason: {
      // 举报类型的id 如seqing cannotplay
      id: {
        type: String,
      },
      // 举报的说明
      value: {
        type: String,
      },
    },
    // true 处理中 false 已处理
    active: {
      type: Boolean,
      default: true,
    },
    // 处理人
    handler: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    //处理结果/ 举报结果
    //  1暂无违规  2禁止公开 3 删除惩罚 4封号处理
    // 0 已修复
    hanldeCode: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = reportSchema;
