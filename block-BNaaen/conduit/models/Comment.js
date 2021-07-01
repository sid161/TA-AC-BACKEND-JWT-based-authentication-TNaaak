var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Article = require('../models/Article');
var Profile = require('../models/Profile');
var User = require('../models/User');

var Schema = mongoose.Schema

var commentSchema = new Schema({
    author:{type:Object, require:true},
    body:{type:String,require:true},
    article:{type:Schema.Types.ObjectId,ref:"Article"}
},{timestamps:true});

commentSchema.pre('save',function(next){
    next();
})


var Comment = mongoose.model('Comment',commentSchema);
module.exports = Comment;