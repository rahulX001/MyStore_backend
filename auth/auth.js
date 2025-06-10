const jwt =require('jsonwebtoken');
require('dotenv').config();
const jwtAuthMiddlware=(req,res,next)=>{
    const authorization=req.headers.authorization;
    if(!authorization)
    {
        return res.status(401).send({message:"unauthorized"});
    }
    const token=authorization.split(' ')[1];
    if(!token)
    {
        return res.status(401).send({message:"token not founnd"});
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.user=decoded;
        next();
    }
    catch(err)
    {
        return res.status(401).send({message:"invalid token"});
    }
}
const generateToken=(user)=>{
    return jwt.sign(user,process.env.JWT_SECRET_KEY,{expiresIn:"1h"});
}
module.exports={jwtAuthMiddlware,generateToken};