var express = require('express');
var mongoose = require('mongoose');

var Schema = mongoose.Schema

var commentSchema = new Schema({
    comment:String,
    author:String,
    bookId:{type:Schema.Types.ObjectId,ref:'Book'}
},{timestamps:true})

var Comment = mongoose.model('Comment',commentSchema);
module.exports = Comment;