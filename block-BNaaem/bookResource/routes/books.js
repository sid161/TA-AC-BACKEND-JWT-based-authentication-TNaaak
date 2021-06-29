var express = require('express');
var router = express.Router();
var Book = require('../models/book');
var Comment = require('../models/comment');
var auth = require('../middlewares/auth');

router.get('/',(req,res,next) => {
    Book.find({})
    .populate('comments')
    .exec((err,book) => {
        if(err) return next(err)
        res.json({book});
    })
})

router.post('/new', auth.verifyToken,(req,res,next) => {
    Book.create(req.body,(err,book) => {
        if(err) return next(err)
        res.json({book});
    })
})

router.get('/category',(req,res,next) => {
    Book.distinct('category').exec((err,result) => {
        if(err) return next(err)
        res.json(result);
    })
})

router.get('/category/books',(req,res,next) => {
    Book.aggregate([
        {
            $unwind: '$category',
        },
        {
            $group: {
                _id:'$category',
                count:{$sum:1}
            }
        }
    ])
})

router.get('/:author',(req,res,next) => {
    var author = req.params.author;
    Book.find({author:author},(err,book) => {
        if(err) return next(err)
        res.json({books});
    })
})

router.get('/:id', (req, res, next) => {
    let id = req.params.id;
    Book.findById(id, (err, book) => {
      if (err) return next(err);
  
      res.json(book);
    });
  });

  router.put('/:id', auth.verifyToken,(req, res, next) => {
    let id = req.params.id;
    Book.findByIdAndUpdate(id, req.body, (err, book) => {
      if (err) return next(err);
  
      res.json(book);
    });
  });


  router.delete('/:id',auth.verifyToken,(req,res,next) => {
      var id = req.params.id;
      Book.findByIdAndDelete(id,(err,book) => {
          if(err) return next(err)
          Comment.deleteMany({bookId:book.id},(err,comment) => {
              if(err) return next(err)
              res.json(book);
          })
      })
  })

  router.get('/tags', (req,res,next) => {
      Book.find({})
      .populate('tags')
      .exec((err,result) => {
          if(err) return next (err)
          res.status(200).json(result);
      }) 
  })


  router.get('/tags/count',(req,res,next) => {
      Book.aggregate([
          {
              $unwind:'$tags'
          },
          {
            $group: {
                _id:'$tags',
                count:{$sum:1}
            }
        }
      ])
  })

  router.get('/tags/order', (req,res,next) => {
     Book.aggregate([
         {
             $sort: {tags:1}
         }
     ])

  })

  //filter tags by name
  router.get('/tag/:name',(req,res,next) => {
      var name = req.params.name;
      Book.find({tags:name},(err,books) => {
          if(err) return next(err)
          res.json(books);
      })
  })

  router.post('/:id/comments',(req,res,next) => {
    var id = req.params.id;
    Comment.create(req.body,(err,comment) => {
      if(err) return next(err)
      Book.findByIdAndUpdate(id, {$push: {comments: comment.id}},(err,updatedBook) => {
        if(err) return next(err);
        res.json({comment,updatedBook});
      })
    })
  })

module.exports = router;