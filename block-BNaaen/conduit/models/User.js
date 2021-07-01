var express = require('express');
var mongoose = require('mongoose');
var Comment = require('../models/Comment');
var Article = require('../models/Article');
var Profile = require('../models/Profile');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema

var userSchema = new Schema({
 email:{type:String,unique:true},
 username:{type:String,unique:true},
 token:String,
 bio:String,
 image:String,
 password:{type:String,require:true},
 profile:{type:Schema.Types.ObjectId,ref:'Profile'},
 articles:[{type:Schema.Types.ObjectId,ref:"Article"}],
 comments:[{type:Schema.Types.ObjectId,ref:"Comment"}]

},{timestamps:true});

userSchema.pre('save',function(next){
    try {
        this.password = bcrypt.hash(password,10);
        var profileData = {
            username:this.username,
            bio:this.bio,
            image:this.image,
        };

        var profile = await Profile.create(profileData);
        this.profile = profile.id;
        next();
    } catch (error) {
        next(error);
    }
})

userSchema.methods.verifyPassword = async function(password){
    try {
        var result = bcrypt.compare(password, this.password)
        return result;
    } catch (error) {
        return error;
    }
};

userSchema.methods.signToken = async function(){
    
    try {
        var profileData = await Profile.findById(this.profile);
        var payload = {username:profileData.username,bio:profile.bio,image:profileData.image}
        var token = await jwt.sign(payload,'secret');
        return token;
    } catch (error) {
        return error;
    }
}



var User = mongoose.model('User',userSchema);
module.exports = User;