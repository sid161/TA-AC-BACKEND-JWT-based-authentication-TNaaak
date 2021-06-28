var express = require('express');
var router = express.Router();
var User = require('../models/User');
var jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', async (req,res,next) => {
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
   console.log(token);
   res.json({user,token});

 } catch (error) {
   next(error);
 }
})

module.exports = router;
