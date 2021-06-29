var express = require('express');
var router = express.Router();
var User = require('../models/User');
var auth = require('../middlewares/auth');

/* GET users listing. */
router.get('/protected', auth.verifyToken, function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', async (req,res,next) => {
  try {
    var user = await User.create(req.body)
     res.status(200).json({user});
  } catch (error) {
    next(error);
  }
  
})

router.post('/login', async (req,res,next) => {
  var {email , password} = req.body
  if(!email || !password){
  return res.status(400).json({error: "email/password required"})
  }
 try {
   var user = await User.findOne({email});
   if(!user){
     return res.status(400).json({error: "email/password required"})
   }
   var result = await user.verifyPassword(password);
   if(!result){
     return res.status(400).json({error: "invalid password"});
   }
   var token = await user.signToken();
   res.json({user,token});

 } catch (error) {
   next(error);
 }
});

module.exports = router;
