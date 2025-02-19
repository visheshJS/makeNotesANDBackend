import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const verifyJWT= asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiError(401, "Unauthorized request")
    
        }
        //if token exists, then verify them

    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        // console.log(decodedToken)
        const user = await User.findById(decodedToken?.id)
        .select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401, "invalid Acess Token")
    
        }
        req.user = user;
        next();
    } 
    catch (error) {
        throw new ApiError(401, "Invalid token")
        
        
    }
    

})

export {verifyJWT};