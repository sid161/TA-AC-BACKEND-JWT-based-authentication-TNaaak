var express = require('express');
var moongoose = require('mongoose');
var auth = require('../middleware/auth');
var jwt = require('jsonwebtoken');
var Article = require('../models/Article');
var User = require('../models/User');
var Comment = require('../models/Comment');
const Profile = require('../models/Profile');
var router = express.Router();

router.get('/:username', async (req,res,next) => {
    var username = req.params.username;
    try {
        var profile = await Profile.findOne({username})
        if(!profile){
            return res.status(400).json({error: "not found"})
        }
        
        return res.json({profile})
    } catch (error) {
        next(error);
    }
})

// follow
router.post("/:username/follow",auth.verifyToken, async (req,res,next) => {
    var username = req.params.username;
    loggedUser = req.user;
    try {
        var followProfile = await Profile.findOne({username});
        if(!followProfile){
            return res.json({error:"invalid profile username"})
        }

        var currentUser = await Profile.findOneAndUpdate({username: loggedUser.username},{$push:{following:followProfile.id}})
    } catch (error) {
        next(error);
    }
})

//unfollow 
router.delete("/:username/follow",auth.verifyToken, async (req,res,next) => {
    var username = req.params.username;
    loggedUser = req.user;
    try {
        var followProfile = await Profile.findOne({username});
        if(!followProfile){
            return res.json({error:"profile not found"})
        }

        var currentUser = await Profile.findOneAndUpdate({username:loggedUser.username},{$push: {following: followProfile.id}})
        
    } catch (error) {
        next(error)
    }
})


module.exports = router;