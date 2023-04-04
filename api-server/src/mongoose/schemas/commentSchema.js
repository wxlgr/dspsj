const mongoose = require('../mongoose');
const commentSchema = new mongoose.Schema({
    body:{type:String,default:''},
    //作者
    who: {type:String,require:true},

},{ timestamps: true })
module.exports = commentSchema