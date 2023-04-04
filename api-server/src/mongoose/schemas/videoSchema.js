const mongoose = require('../mongoose');
const commentSchema = require('./commentSchema');
const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    //作者 关联User: usersModel
    author: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
    state: { type: String, defaultValue: '审核中' },
    //描述
    desc: { type: String, default: '' },
    //链接
    videoUrl: { type: String, default: '' },
    // 被点赞数
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