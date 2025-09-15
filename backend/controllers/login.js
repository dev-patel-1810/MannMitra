import { async_handler } from "../utils/async_handler.js";
import{ApiError} from "../utils/api_error.js" 
import {stud_user} from "../models/stud_user.js"
import { ApiResponse }  from "../utils/api_response.js";
import {clg_user} from "../models/clg_user.js"
import {counselor_user} from "../models/counselor_user.js"
import bcrypt from 'bcrypt';  // Add this import

const login_user = async_handler(async (req, res) => {
    const { role, email, password } = req.body;

    if ([role, email, password].some((field) => !field || typeof field !== "string" || field.trim() === "")) {
        throw new ApiError(400, 'All fields are required');
    }

    if (!email.includes('@')) {
        throw new ApiError(400, 'Enter correct email id');
    }

    let user;
    let userData;

    if (role.toLowerCase() === "student") {
        user = await stud_user.findOne({ user_email: email }).select('+user_password');
        if (!user) throw new ApiError(404, "Email not found");
        
        const match = await bcrypt.compare(password, user.user_password);
        if (!match) throw new ApiError(401, "Invalid password");
        
        userData = {
            name: user.user_name,
            email: user.user_email,
            role: "student"
        };
    }

    else if (role.toLowerCase() === "institute") {
        user = await clg_user.findOne({ clg_admin_email: email }).select('+clg_password');;
        if (!user) throw new ApiError(404, "Email not found");
        
        const match = await bcrypt.compare(password, user.clg_password);
        if (!match) throw new ApiError(401, "Invalid password");
        
        userData = {
            name: user.clg_admin_name,
            email: user.clg_admin_email,
            role: "institute"
        };
    }

    else if (role.toLowerCase() === "counsellor") {
        user = await counselor_user.findOne({ counselor_email: email }).select('+counselor_password');;
        if (!user) throw new ApiError(404, "Email not found");
        
        const match = await bcrypt.compare(password, user.counselor_password);
        if (!match) throw new ApiError(401, "Invalid password");
        
        userData = {
            name: user.counselor_name,
            email: user.counselor_email,
            role: "counsellor"
        };
    }
    else {
        throw new ApiError(400, "Invalid role specified");
    }

    return res.status(200).json(
        new ApiResponse(200, userData, "Login successful")
    );
});


export {login_user}