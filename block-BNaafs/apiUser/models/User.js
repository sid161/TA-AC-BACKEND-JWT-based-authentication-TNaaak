var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name:String,
    email:String,
    password:String
},{timestamps:true})


userSchema.pre('save', async function(next){
    if(this.password && this.isModified('password')){
        this.password = bcrypt.hash(this.password,10);
    }

    next();
})

userSchema.methods.verifyPassword = async function(password){
    try {
        var result = await bcrypt.compare(password,this.password)
        return result;
        
    } catch (error) {
        return error;
    }
   
}

userSchema.methods.signToken = async function(){
    console.log(this);
    try {
        var payload = {userId:this.id,email:this.email};
        var token = await jwt.sign(payload, process.env.SECRET)
        return token;
    } catch (error) {
        return error;
    }
}

userSchema.methods.userJSON = function(token){
    return {
        name:this.name,
        email:this.email,
        token:token
    }
}

var User = mongoose.model('User',userSchema);
module.exports = User;