import mongoose from 'mongoose';
import { async_handler } from "../utils/async_handler.js";
import{ApiError} from "../utils/api_error.js";
import {stud_user} from "../models/stud_user.js";
import { ApiResponse }  from "../utils/api_response.js";
import {clg_user} from "../models/clg_user.js";
import {counselor_user} from "../models/counselor_user.js";
import {Appointment} from "../models/appointment.js";
import jwt from 'jsonwebtoken'

const generate_access_and_refresh_token_stud = async(stud_user_id)=>{
    try{
        const Stud_User = await stud_user.findById(stud_user_id);
        if(!Stud_User){
            throw new ApiError(404,"User not found")
        }
        const access_token = Stud_User.generate_access_token()
        const refresh_token = Stud_User.generate_refresh_token()
        Stud_User.user_refresh_token = refresh_token
        await Stud_User.save({validateBeforeSave:false})
        return {access_token, refresh_token}
    }
    catch{
        throw new ApiError(500,"Something went wrong with access and refresh token generation")
    }
}

const getTodayStart = () => {
    const now = new Date();
    const year = parseInt(now.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', year: 'numeric' }));
    const monthIndex = parseInt(now.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', month: 'numeric' })) - 1; 
    
    const day = parseInt(now.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', day: 'numeric' }));
    return new Date(Date.UTC(year, monthIndex, day, 0, 0, 0, 0));
};

const register_stud_user = async_handler(async (req, res) => {
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
        throw new ApiError(400, 'All required fields are missing or invalid.');
    }
    
    if (!email.includes('@')) {
        throw new ApiError(400, 'Invalid email format.');
    }

    let college = null;

    if (collegeId) {
        college = await clg_user.findOne({ clg_student_id: collegeId });
        if (!college) {
            throw new ApiError(400, 'Invalid College ID.');
        }
    }
    
    const exists = await Promise.all([
        stud_user.findOne({ user_email: email }),
        clg_user.findOne({ clg_admin_email: email }),
        counselor_user.findOne({ counselor_email: email })
    ]);

    if (exists.some(user => user)) {
        throw new ApiError(409, "Email already registered.");
    }

    const exist = await Promise.all([
        stud_user.findOne({ user_contact: phoneNumber }),
        clg_user.findOne({ clg_admin_contact: phoneNumber }),
        counselor_user.findOne({ user_contact: phoneNumber })
    ]);

    if (exist.some(user => user)) {
        throw new ApiError(409, "Phone Number already registered.");
    }
    const todayStart=getTodayStart();

    const userData = {
        user_name: username,
        user_email: email,
        user_pincode: pinCode,
        user_contact: phoneNumber,
        user_password: password,
        user_guardian_1_name: guardian1Name || "",
        user_guardian_1_contact: guardian1Contact || "",
        user_guardian_2_name: guardian2Name || "",
        user_guardian_2_contact: guardian2Contact || "",
        user_mood: {
            mood_date: todayStart,
            mood_value: 'N/A'
        }
    };

    if (college) {
        userData.user_clg_id = college._id;
        userData.user_clg_name = college.clg_name;
    }

    const newUser = await stud_user.create(userData);

    const check_stud_user = await stud_user.findById(newUser._id).select("-user_password");
    if (!check_stud_user) {
        throw new ApiError(500, "Something went wrong with user creation.");
    }
    
    // update college student count
    if (college) {
        await clg_user.updateOne(
            { _id: college._id },
            { $inc: { clg_student_count: 1 } }
        );
    }

    return res.status(201).json(
        new ApiResponse(200, check_stud_user, "User registered successfully.")
    );
});


const addInstitute = async_handler(async (req, res) => {
    const { userId, collegeId } = req.body;

    if (!userId || !collegeId) {
        throw new ApiError(400, "User ID and College ID are required.");
    }
    
    const user = await stud_user.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found.");
    }
    const college = await clg_user.findOne({ clg_student_id: collegeId });
    if (!college) {
        throw new ApiError(400, "Invalid College ID.");
    }

    // if user already associated with some college
    if (user.user_clg_id) {
        await clg_user.updateOne(
            { _id: user.user_clg_id },
            { $inc: { clg_student_count: -1 } }
        );
    }

    user.user_clg_id = college._id;
    user.user_clg_name = college.clg_name;
    await user.save();

    await clg_user.updateOne(
        { _id: college._id },
        { $inc: { clg_student_count: 1 } }
    );
    
    const updatedUser = await stud_user.findById(userId).select("-user_password");

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "Institute added successfully.")
    );
});


const getUserInfo = async_handler(async (req, res) => {
    const { userId } = req.params;
    
    const user = await stud_user.findById(userId)
        .select('-user_password')
        .lean();

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, user, "User details fetched successfully")
    );
});

const updateUserInfo = async_handler(async (req, res) => {
    const { userId } = req.params;
    const newTestDetail = req.body; 
    
    const updatedUser = await stud_user.findByIdAndUpdate(
        userId, 
        { 
            $push: { 
                user_tests: newTestDetail 
            } 
        },
        { 
            new: true, 
            runValidators: true,
        }
    ).select('-user_password'); 

    if (!updatedUser) {
        throw new ApiError(404, "User not found with the provided ID");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedUser.user_tests, "New test detail added successfully")
    );
});

const getUserAppointments = async_handler(async (req, res) => {
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


export {register_stud_user, getUserInfo, getUserAppointments, addInstitute, updateUserInfo, generate_access_and_refresh_token_stud}