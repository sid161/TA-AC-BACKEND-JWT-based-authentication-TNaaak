var jwt = require('jsonwebtoken');
var User = require('../models/User');

module.exports = {
    verifyToken: (req,res,next) => {
        console.log(req.headers);
        var token = req.headers.authorisation;
        try {
            if(token){
                var payload = await jwt.verify(token,process.env.SECRET);
                req.user = payload
                next()
            } else{
                res.status(400).json({error: "token req"})
            }
            
        } catch (error) {
            next(error);
        }
    }
}