import { async_handler } from "../utils/async_handler.js";
import { ApiError } from "../utils/api_error.js";
import { ApiResponse } from "../utils/api_response.js";
import { stud_user } from "../models/stud_user.js";
import { clg_user } from "../models/clg_user.js";
import {generate_access_and_refresh_token_stud} from "../controllers/index_stud.js"
import { counselor_user } from "../models/counselor_user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 
import { generate_access_and_refresh_token_clg } from "./index_clg.js";
import { generate_access_and_refresh_token_counsellor } from '../controllers/index_conselor.js';

const login_user = async_handler(async (req, res) => {
    const { userType, email, password, instituteName } = req.body;
    console.log(req.body)

    if ([userType, email, password].some(field => !field || typeof field !== "string" || field.trim() === "")) {
        throw new ApiError(400, 'All fields are required');
    }

    if (!email.includes('@')) {
        throw new ApiError(400, 'Enter a valid email id');
    }

    let user = null;
    let userFound = false;
    let nameKey, emailKey, passwordKey, UserModel;

    // Determine model and field keys based on userType
    switch (userType.toLowerCase()) {
        case "student":
            UserModel = stud_user;
            user = await UserModel.findOne({ user_email: email });
            userFound = !!user;
            nameKey = "user_name";
            emailKey = "user_email";
            passwordKey = "user_password";
            break;
        case "institute":
            UserModel = clg_user;
            user = await UserModel.findOne({ clg_admin_email: email });
            userFound = !!user;
            if (user && user.clg_name.toLowerCase() !== instituteName.toLowerCase()) {
                throw new ApiError(401, "Invalid institute name");
            }
            nameKey = "clg_admin_name";
            emailKey = "clg_admin_email";
            passwordKey = "clg_password";
            break;
        case "counsellor":
            UserModel = counselor_user;
            user = await UserModel.findOne({ counselor_email: email });
            userFound = !!user;
            nameKey = "counselor_name";
            emailKey = "counselor_email";
            passwordKey = "counselor_password";
            break;
        default:
            throw new ApiError(400, "Invalid user type");
    }
    if (!userFound) {
        throw new ApiError(404, "Email not found");
    }

    const match = await bcrypt.compare(password, user[passwordKey]);
    if (!match) {
        throw new ApiError(401, "Incorrect password");
    }

    let tokens;

    // Determine token generation based on userType instead of user.role
    if (userType.toLowerCase() === "student") {
        tokens = await generate_access_and_refresh_token_stud(user._id);
    } else if (userType.toLowerCase() === "counsellor") {
        tokens = await generate_access_and_refresh_token_counsellor(user._id);
    } else if (userType.toLowerCase() === "institute") {
        tokens = await generate_access_and_refresh_token_clg(user._id);
    } else {
        throw new ApiError(400, "Invalid user type for token generation");
    }

    const { access_token, refresh_token } = tokens;
    const isProd = process.env.NODE_ENV === "production";

    const cookieOptions = {
        httpOnly: true,
        sameSite: isProd ? "none" : "lax",
        secure: isProd,
        path: '/',
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year expiration
    };
    console.log(tokens);
    
    // Set cookies and send a single response
    console.log(`Successfully logged in: ${user[nameKey]}`);
    console.log(`[BACKEND] Login Successful for: ${user[emailKey]}`);
    
    return res
        .cookie('refreshToken', refresh_token, cookieOptions)
        .cookie('accessToken', access_token, cookieOptions)
        .status(200)
        .json({
            message: "Login Successful",
            data: {
                _id: user._id,
                name: user[nameKey],
                userType: userType,
                email: user[emailKey],
                accessToken: access_token, 
                refreshToken: refresh_token,
                ...(userType.toLowerCase() === 'institute' && { clg_name: user.clg_name })
            }
        });
        
});

export { login_user };
