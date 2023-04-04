const commentSchema = require('./commentSchema');
const userSchema = require('./userSchema');
const videoSchema = require('./videoSchema');
const mongoose =require('../mongoose');
module.exports = {
    commentSchema,
    userSchema,
    videoSchema
}