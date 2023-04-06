const mongoose = require('../mongoose');

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    //作者 关联User: usersModel
    author: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
    //描述
    desc: { type: String, default: '' },
    // 视频背景音乐
    bgm: { type: mongoose.SchemaTypes.ObjectId, ref: 'Bgm' },

    // 可见权限
    // 默认私密
    visible: { type: Boolean, default: 'private' },

    //链接
    videoUrl: { type: String, default: '' },
    // 获赞数
    star: { type: Number, default: 0 },
    // 被收藏数
    collect: { type: Number, default: 0 },

    //   留言评论
    // 关联Comment: commentsModel
    comments: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Comment'
    }]
}, { timestamps: true })

module.exports = videoSchema