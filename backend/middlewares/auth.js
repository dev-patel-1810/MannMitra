import { async_handler } from "../utils/async_handler.js";
import { ApiError } from "../utils/api_error.js";
import {stud_user} from "../models/stud_user.js";
import {counselor_user} from "../models/counselor_user.js";
import { clg_user } from "../models/clg_user.js";
import jwt from 'jsonwebtoken';


export const verify_jwt = async_handler(async(req,res,next)=>{
    try{
        // Check for token in cookies first (both naming conventions), then in Authorization header
        const access_token = req.cookies?.accessToken || req.cookies?.access_token || 
                            req.header("Authorization")?.replace("Bearer ","")
        if(!access_token){
            throw new ApiError (401,"Unauthorized Request")
        }
        const decoded_token=jwt.verify(access_token,process.env.ACCESS_TOKEN_SECRET)
        if(!decoded_token){
            throw new ApiError (401,"Invalid Access Token")
        }
        const Stud_User= await stud_user.findById(decoded_token._id)
        const Counsellor_User= await counselor_user.findById(decoded_token._id)
        const Clg_User = await clg_user.findById(decoded_token._id)
        if(!(Stud_User || Counsellor_User || Clg_User)){
            throw new ApiError (401,"User not found")
        }
        
        // Refresh the cookie to extend session
        const user = Stud_User || Counsellor_User || Clg_User;
        res.cookie('accessToken', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: '/',
            maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
            expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        });
        
        req.user = user;
        next()
    }
    catch(error){
        throw new ApiError (401,error.message || "Invalid Access Token")
    }
})

export const validate_token = async_handler(async(req, res) => {
    try {
        // Check for token in cookies first, then in Authorization header
        const access_token = req.cookies?.accessToken || req.cookies?.access_token || 
                            req.header("Authorization")?.replace("Bearer ", "");
        
        if (!access_token) {
            return res.status(401).json({
                success: false,
                message: "No access token found"
            });
        }
        
        const decoded_token = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);
        
        if (!decoded_token) {
            return res.status(401).json({
                success: false,
                message: "Invalid access token"
            });
        }
        
        const Stud_User = await stud_user.findById(decoded_token._id).select("-password -user_refresh_token");
        const Counsellor_User = await counselor_user.findById(decoded_token._id).select("-password -counselor_refresh_token");
        const Clg_User = await clg_user.findById(decoded_token._id).select("-password -clg_refresh_token");
        
        const user = Stud_User || Counsellor_User || Clg_User;
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }
        
        // Refresh the cookie to extend session
        res.cookie('accessToken', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: '/',
            maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
            expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        });
        
        // If there's a refresh token in cookies, refresh that too
        if (req.cookies?.refreshToken) {
            res.cookie('refreshToken', req.cookies.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                path: '/',
                maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
                expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            });
        }
        
        // Determine user type
        let userType = "";
        if (Stud_User) userType = "student";
        else if (Counsellor_User) userType = "counsellor";
        else if (Clg_User) userType = "institute";
        
        // Include tokens in response for client-side storage backup
        const responseUser = {
            _id: user._id,
            name: user.user_name || user.counselor_name || user.clg_admin_name,
            email: user.user_email || user.counselor_email || user.clg_admin_email,
            userType: userType,
            accessToken: access_token,
            ...(userType === 'institute' && { clg_name: user.clg_name })
        };
        
        // Return user data
        return res.status(200).json({
            success: true,
            message: "Token is valid",
            user: responseUser
        });
    } catch (error) {
        console.error("Token validation error:", error);
        return res.status(401).json({
            success: false,
            message: error.message || "Invalid access token"
        });
    }
});