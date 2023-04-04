const mongoose = require('../mongoose');
const videoSchema = require('./videoSchema');

let  userSchema = new mongoose.Schema({
    username: {type:String,require:true},
    password: {type:String,require:true},
    nickname: {type:String,default:''},
    
    avatarUrl: {type:String,default:''},
    gender: {type:String,default:''},

    fans: {type:Number,default:0},
    follows:[
        {type:mongoose.SchemaTypes.ObjectId,ref:'User'}
    ]
    
 

}, { timestamps: true }
)

module.exports = userSchema
