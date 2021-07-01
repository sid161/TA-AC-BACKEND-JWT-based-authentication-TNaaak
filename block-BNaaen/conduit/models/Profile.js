
var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

var profileSchema = new Schema({
    username:String,
    bio:String,
    image:String,
    following:[{type:Schema.Types.ObjectId,ref:"User"}],
    followers:[{type:Schema.Types.ObjectId,ref:"User"}],
    user:{type:Schema.Types.ObjectId,ref:"User"}
},{timestamps:true})

profileSchema.pre('save',function(next){
    next();
})

var Profile = mongoose.model('Profile',profileSchema);
module.exports = Profile;





// "username": "jake",
// "bio": "I work at statefarm",
// "image": "https://static.productionready.io/images/smiley-cyrus.jpg",
// "following": false














