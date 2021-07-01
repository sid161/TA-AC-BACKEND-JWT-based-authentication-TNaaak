var express = require('express');
var User = require('../models/User');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', async (req,res,next) => {
  try {
    var user = await User.find({username:req.body.username});
    if(user){
      return res.status(400).json({error: "user already exist"})
    }
    var newUser = User.create(req.body);
    return res.json({user:newUser});
  } catch (error) {
    
  }
});

router.post('/login',async (req,res,next) => {
  var {email,password} = req.body;
  if(!email||!password){
    return res.status(400).json({error:"both fields required"})
  }
  try {
    var user = await User.findOne({email})
    if(!user){
      return res.status(400).json({error:"user not found"})
    }
    var result = await user.verifyPassword(password);
    if(!result){
      return res.status(400).json({error: "password did not match"})
    }

    var token = await user.signToken();
    res.json({token,user})
  } catch (error) {
    next(error);
  }
})



module.exports = router;



