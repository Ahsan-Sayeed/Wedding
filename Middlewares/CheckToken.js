const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.verifyToken = (req,res,next) =>{
    const auth = req.headers.authorization;

    if(!auth){
       return res.status(401).send({message:"unauthorized"})
    }
    jwt.verify(auth.split(" ")[1], process.env.SECRET_TOKEN ,(err,decoded)=>{
        if(err){
            res.status(401).send({message:"unauthorized"})
        }
        req.decoded = decoded;
        next();
    });
}