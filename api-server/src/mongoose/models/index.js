const { default: mongoose, model } = require("mongoose");
const { commentSchema, userSchema, videoSchema } = require('../schemas/index')

const usersModel = model('User', userSchema, 'users')
const videosModel = model('Video', videoSchema, 'videos')
const commentsModel = model('Comment', commentSchema, 'comments')



module.exports = {
    usersModel,
    videosModel,
    commentsModel
}