var express = require('express');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var bookSchema = new Schema({
    name:String,
    description:String,
    author:String,
    price:Number,
    page:Number,
    comments:[{type:Schema.Types.ObjectId,ref:"Comment"}],
    category:[String],
    tags:[String]
},{timestamps:true})

var Book = mongoose.model('Book',bookSchema);
module.exports = Book;