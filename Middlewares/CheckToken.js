const jwt = require("jsonwebtoken");

exports.verifyToken = (req,res,next) =>{
    const auth = req.headers.authorization;
    if(!auth){
       return res.status(401).send({message:"unauthorized"})
    }
    jwt.verify(req.query.Token, 'This is a secret key',(err,decoded)=>{
        if(err){
            res.status(401).send({message:"unauthorized"})
        }
        req.decoded = decoded;
        next();
    });
}