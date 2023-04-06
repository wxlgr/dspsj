const { model } = require("mongoose");
const { commentSchema, userSchema, videoSchema, bgm } = require('../schemas/index')

const usersModel = model('User', userSchema, 'users')
const videosModel = model('Video', videoSchema, 'videos')
const commentsModel = model('Comment', commentSchema, 'comments')
const bgmsModel = model('Bgm', commentSchema, 'bgms')



module.exports = {
    usersModel,
    videosModel,
    commentsModel,
    bgmsModel
}