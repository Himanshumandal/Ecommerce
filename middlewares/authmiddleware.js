import jwt from 'jsonwebtoken'
import usermodel from '../models/usermodel.js';

//user middleware
export const isauth=async(req,res,next)=>{
    const {token}=req.cookies
    //validation
    if(!token)
    {
        return res.status(401).send({
            success:false,
            message:'Unauthorized user'
        });
    }
    const decodedata=jwt.verify(token,process.env.jwt_secret);
    req.user=await usermodel.findById(decodedata._id);
    next();
};

//admin middleware
export const isadmin=async(req,res,next)=>{
    if(req.user.role!=="admin")
    {
        return res.status(401).send({
            success:false,
            message:"admin only",
        });
    }
    next();
};