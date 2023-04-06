const mongoose = require('../mongoose');


// 用户数据库模型
let userSchema = new mongoose.Schema({
    username: { type: String, require: true },
    password: { type: String, require: true },
    nickname: { type: String, default: '' },

    avatarUrl: { type: String, default: '' },
    gender: { type: String, default: '' },

    // 角色 
    // 默认普通用户 user
    // 管理员 admin
    role: {
        type: String,
        default: 'user'
    },

    // 获赞数
    star: {
        type: Number,
        default: 0
    },

    // 关注列表
    follows: [
        { type: mongoose.SchemaTypes.ObjectId, ref: 'User' }
    ],

    // 粉丝列表
    fans: [
        { type: mongoose.SchemaTypes.ObjectId, ref: 'User' }
    ],

    // 关注数
    followsCount: { type: Number, default: 0 },


    // 粉丝数
    fansCount: { type: Number, default: 0 },


}, { timestamps: true }
)

module.exports = userSchema
