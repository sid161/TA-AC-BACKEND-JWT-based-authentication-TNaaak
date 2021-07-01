var express = require('express');
var moongoose = require('mongoose');
var auth = require('../middleware/auth');
var jwt = require('jsonwebtoken');
var Article = require('../models/Article');
var User = require('../models/User');
var Comment = require('../models/Comment');
var Profile = require('../models/Profile');
var router = express.Router();

router.post('/',auth.verifyToken, async (req,res,next) => {
   req.body.author = req.user;
   var createdArticle = await Article.create(req.body);
   var updatedUser = await User.findOneAndUpdate({username:createdArticle.author.username},{
       $push : {articles: createdArticle.id}})
       res.json({article: createdArticle})
})


router.get('/:slug',auth.verifyToken, async (req,res,next) => {
    var slug = req.params.slug;
    try {
        var articles = await Article.find({slug})
        console.log(slug);
        res.json({articles})
    } catch (error) {
        next(error);
    }
})

// article update
router.put('/:slug',auth.verifyToken, async (req,res,next) => {
    var slug = req.params.slug;
    try {
        var article = await Article.findOneAndUpdate({slug:slug});
        res.json({article:article})
        } catch (error) {
        next(error);
    }
})

// delete article
router.delete("/:slug", async (req,res,next) => {
    var slug = req.params.slug;

   try {
    var article = await Article.findOneAndDelete({slug:slug});
    var updatedUser = await User.findOneAndUpdate({username:article.author.username},{$pull: {articles:article.id}});
    res.json({article:article});
   } catch (error) {
       next(error);
   }
    
})

// create comment
router.post("/:slug/comments",auth.verifyToken, async (req,res,next) => {
    var slug = req.params.slug;
    req.body.author = req.user;
    var article = await Article.findOne({slug});
    req.body.article = article;
    var comment = await Comment.create(req.body);
    var loggedUser = await User.findOne({username:req.user.username})
    var updatedUser = await User.findByIdAndUpdate(loggedUser.id,{$push : {comment:comment.id}})
    var updatedArticle = await Article.findByIdAndUpdate(article.id,{$push:{comments:comment.id}})
    res.json({comment});
})

router.get('/feed', auth.verifyToken, async (req,res,next) => {
    var loggedInUser = req.user.userId;
    try {
        
    } catch (error) {
        
    }
})

// delete article
router.delete('/:slug', auth.verifyToken,async (req,res,next) => {
    var slug = req.params.slug;
    var userId = req.user.userId;
    try {
        var article = await Article.findOne({slug:slug});
        if(userId = req.body.author){
            var deletedArticle = await Article.findOneAndDelete({slug:slug}),
            var comments = Comment.deleteMany({articleId:article._id});
        } else{
            return res.status(400).json({error: "you are not authorised"})
        }

    } catch (error) {
        next(error);
    }
})

// get comments on article
router.get("/:slug/comments", async (req,res,next) => {
    var slug = req.params.slug;
    try {
        var article = Article.findOne({slug:slug}).populate('comments');
        res.json({comments: article.comments});
    } catch (error) {
        next(error);
    }
})

// delete comment
router.delete("/:slug/comments/:id", auth.verifyToken, async (req,res,next) => {
    var slug = req.params.slug;
    var commentId = req.params.id;
    var deletedComment = await Comment.findByIdAndDelete(commentId);
    var updatedUser = await User.findOneAndUpdate({username: deletedComment.author.username}, {$pull: {comments:deletedComment.id}})

    var updatedArticle = await Article.findOneAndUpdate({slug},{$pull:{comments:deletedComment.id}})
    res.json({deletedComment});
})

module.exports = router;

