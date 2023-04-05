const mongoose = require('../mongoose');
const commentSchema = new mongoose.Schema({
    // 留言内容
    content: { type: String, default: '' },
    //作者
    who: { type: String, require: true },
    // 时间
    when: { type: String, default: Date.now() }

}, { timestamps: true })
module.exports = commentSchema