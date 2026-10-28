import jwt from "jsonwebtoken";
import asyncHandler from "../utilis/asyncHandler.js";
import { User } from "../models/user.models.js";


const VerifyUserJWT = async (req, res, next)=>{
    try{
        const token  = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if(!token){
            return res.status(401).json({message: "Access Denied"});
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id);

        if(!user){
            return res.status(401).json({message: "Invalid Access Token"});
        }

        req.user = user;
        next();
    }catch(err){
        return res.status(401).json({message: "Invalid Token"});
    }
}


const verifyAdminJWT = async (req, res, next)=>{
    try{
        const token  = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if(!token){
            return res.status(401).json({message: "Unauthorised Access"});
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findOne({_id: decodedToken._id, role: "admin"});

        if(!user){
            return res.status(401).json({message: "Unauthorised Access"});
        }

        req.user = user;
        next();
    }catch(err){
        console.log("Error while verifying admin JWT", err);
        return res.status(401).json({message: "Invalid Token"});
    }
}

export {VerifyUserJWT, verifyAdminJWT};