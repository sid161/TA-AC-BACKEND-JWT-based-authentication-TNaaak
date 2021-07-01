var jwt  = require('jsonwebtoken');

module.exports = {
    verifyToken: async (req,res,next) => {
        var token = req.headers.authorization;
        try {
            if(token){
                var profileData = await jwt.verify(token,"secret")
                req.user = profileData;
                next();
            } else{
                res.status(400).json({error:"token required"})
            }
        } catch (error) {
          next(error); 
        }
    },
};