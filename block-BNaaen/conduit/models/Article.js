var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var slugger = require('slugger');
var Comment = require('../models/Comment');
var User = require('../models/User');



var Schema = mongoose.Schema;

var articleSchema = new Schema({
    slug: {type:String,require:true,unique:true},
    title:{type:String,require:true},
    description:{type:String},
    body:String,
    tagList:[String],
    favourited:{type:Schema.Types.ObjectId,ref:"User"},
    favouritesCount:{type:Number,default:0},
    author:Object,
    comments:{type:Schema.Types.ObjectId,ref:"Comment"}
},{timestamps:true})

articleSchema.pre('save',async function(next){
    this.slug = slugger(this.title);
    next();
})

var Article = mongoose.model('Article',articleSchema)
module.exports = Article;