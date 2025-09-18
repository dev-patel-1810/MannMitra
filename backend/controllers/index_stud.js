import mongoose from 'mongoose';
import { async_handler } from "../utils/async_handler.js";
import{ApiError} from "../utils/api_error.js" 
import {stud_user} from "../models/stud_user.js"
import { ApiResponse }  from "../utils/api_response.js";
import {clg_user} from "../models/clg_user.js"
import {counselor_user} from "../models/counselor_user.js"
import {Appointment} from "../models/appointment.js"

const register_stud_user= async_handler( async(req,res) => {
    //OBJECTIVES
    //GET THESE DETAILS - USERNAME, EMAIL, PHON NO, PIN , GAURDIAN DET , PASS , PASS-CHECK , CLG ID
    //CHECK FOR MAIL PHONE NO EXISTANCE
    //ENTER IN DB 
    // CHECK USER CREATION AND REMOVE PASS AND REFRESH TOKENS

    const {
        username,
        email,
        pinCode,
        phoneNumber,
        password,
        guardian1Name = "",
        guardian1Contact = "",
        guardian2Name = "",
        guardian2Contact = "",
        collegeId = ""
        } = req.body;


    if (
        [username, email, pinCode, phoneNumber, password].some(
            (field) => !field || typeof field !== "string" || field.trim() === ""
        )
    ) {
        throw new ApiError(400, 'All fields are required');
    }
    if (!email || typeof email !== "string" || email.trim() === "") {
        throw new ApiError(400, 'Email is required');
    }
    
    if(!email.includes('@')){
        throw new ApiError(400, 'Invalid email')
    }
    
    const exists = await Promise.all([
        stud_user.findOne({ user_email: email }),
        clg_user.findOne({ clg_admin_email: email }),
        counselor_user.findOne({counselor_email:email})
        ]);
    
        const exist = await Promise.all([
        stud_user.findOne({ user_contact: phoneNumber }),
        clg_user.findOne({ clg_admin_contact: phoneNumber }),
        counselor_user.findOne({counselor_contact: phoneNumber})
        ]);

        if (exists[0] || exists[1] || exists[2]) {
        throw new Error("Email already registered");
        }

        if (exist[0] || exist[1] || exist[2]) {
            throw new Error("Phone Number already registered");
        }

    console.log("req.body:", req.body);


    const newUser = await stud_user.create({
        user_name:username,
        user_email:email,
        user_pincode:pinCode,
        user_contact: phoneNumber,
        user_password: password,
        user_guardian_1_name: guardian1Name || "",
        user_guardian_1_contact: guardian1Contact || "",
        user_guardian_2_name:guardian2Name || "",
        user_guardian_2_contact: guardian2Contact || "",
        user_college_id: collegeId || "",
});


    const check_stud_user = await stud_user.findById(newUser._id).select(
        "-user_password"
    )

    if(!check_stud_user){
        throw new ApiError(500 , "Something wrong with backend")
    }

    return res.status(201).json(
        new ApiResponse(200 , check_stud_user , "User registered successfully")
    )

})


const getUserInfo = async_handler(async (req, res) => {
    const { userId } = req.params;
    
    const user = await stud_user.findById(userId)
        .select('user_name user_email user_phone collegeId')
        .lean();

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, user, "User details fetched successfully")
    );
});


const getUserAppointments = async_handler(async (req, res) => {
    // The user ID can be retrieved from the authenticated request object (e.g., req.user._id)
    const {userId} = req.params;

    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const appointments = await Appointment.find({ student: new mongoose.Types.ObjectId(userId) })
                                                    .populate({
                                                        path: 'counsellor',
                                                        model: 'counselor_user',
                                                        select: 'counselor_name counselor_email'
                                                    }).lean();
    
    return res.status(200).json(
        new ApiResponse(200, appointments, "User appointments fetched successfully")
    );
});

export {register_stud_user, getUserInfo, getUserAppointments}