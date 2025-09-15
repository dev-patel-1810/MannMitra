import { async_handler } from "../utils/async_handler.js";
import{ApiError} from "../utils/api_error.js" 
import {stud_user} from "../models/stud_user.js"
import { ApiResponse }  from "../utils/api_response.js";
import {clg_user} from "../models/clg_user.js"
import {counselor_user} from "../models/counselor_user.js"
import bcrypt from 'bcrypt'

const login_user = async_handler(async (req, res) => {
    const { userType, email, password } = req.body;

    if ([userType, email, password].some((field) => !field || typeof field !== "string" || field.trim() === "")) {
    throw new ApiError(400, 'All fields are required');
    }

    if (!email.includes('@')) {
        throw new ApiError(400, 'Enter correct email id');
    }

    if (userType === "student") {
        const user = await stud_user.findOne({ user_email: email })
        if (!user) {
            throw new ApiError(404, "Email not found")
        }

        const match = await bcrypt.compare(req.body.password, user.user_password)
        if (!match) {
            throw new ApiError(401, "Invalid password")
        }

        console.log("Successfully logged in:", user.user_name);
        console.log("[BACKEND] Login Successful response sent for:", user.user_email);
        return res.status(200).json({message:"Login Successful",
            data: {
                _id: user._id,
                name: user.user_name, 
                userType: userType,
                email: user.user_email
            }
        })
    }

    if (userType === "institute") {
        const user = await clg_user.findOne({clg_admin_email : email})
    
        if(!user){
            throw new ApiError(404, "Email not found")
        }
        const match = await bcrypt.compare(password , user.clg_password)
        if(!match){
            throw new ApiError(401, 'Incorrect password')
        }
        console.log("Successfully logged in:", user.clg_admin_name);
        console.log("[BACKEND] Login Successful response sent for:", user.clg_admin_email);
        return res.status(200).json({message:"Login Successful",
            data: {
                _id: user._id,
                name: user.clg_admin_name, 
                userType: userType,
                email: user.clg_admin_email
            }
        })
    }

    if(userType==="counsellor"){
        const user = await counselor_user.findOne({counselor_email : email})

        if(!user){
            throw new ApiError(404,"Email not found")
        }
        const match = await bcrypt.compare(password , user.counselor_password)
        if(!match){
            throw new ApiError(401,'Incorrect password')
        }
        console.log("Successfully logged in:" ,user.counselor_name);
        console.log("[BACKEND] Login Successful response sent for:", user.counselor_email);
        return res.status(200).json({message:"Login Successful",
            data: {
                _id: user._id,
                name: user.counselor_name,
                userType: userType,
                email: user.counselor_email
            }
         })
    }    

});


export {login_user}