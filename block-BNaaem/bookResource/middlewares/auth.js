var jwt = require('jsonwebtoken');

module.exports = {
    verifyToken: async (req,res,next) => {
        var token = req.header.authorization;
        try {
            if(token){
                var payload = await jwt.verify(token,"this is secret");
                req.user = payload;
                next();
            }
            res.status(400).json({error:"token required"})
        } catch (error) {
            next(error);
        }
        }
    }