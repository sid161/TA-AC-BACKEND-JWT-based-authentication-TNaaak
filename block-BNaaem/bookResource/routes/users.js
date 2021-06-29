var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', async function(){
try {
  var user = await User.create(req.body);
  console.log(user);
  res.status(201).json({user});

} catch (error) {
  next(error);
}
})

router.post('/login', async function(){
  var {email , password} = req.body;
  if(!email || !user){
    res.status(400).json("email/password required");
  }
 try {
   var user = User.findOne({email})
   if(!user){
     return res.status(400).json("user not found")
   }
   var result = user.verifyPassword(password)
   if(!result){
     return res.status(400).json("password not matched")
   }
   var token = await user.signToken();
   res.json({user,json});
 } catch (error) {
   next (error);
 }

})



module.exports = router;
