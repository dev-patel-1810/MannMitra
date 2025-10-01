import mongoose from "mongoose";
import { async_handler } from "../utils/async_handler.js";
import{ApiError} from "../utils/api_error.js"
import {clg_user} from "../models/clg_user.js"
import { ApiResponse }  from "../utils/api_response.js";
import {stud_user} from "../models/stud_user.js"
import {counselor_user} from "../models/counselor_user.js"
import {Appointment} from "../models/appointment.js"

const generate_access_and_refresh_token_counsellor = async(counselor_user_id)=>{
    try{
        const Counselor_User = await counselor_user.findById(counselor_user_id);
        if(!Counselor_User){
            throw new ApiError(404,"User not found")
        }
        const access_token = Counselor_User.generate_access_token()
        const refresh_token = Counselor_User.generate_refresh_token()
        Counselor_User.counselor_refresh_token = refresh_token
        await Counselor_User.save({validateBeforeSave:false})
        return {access_token, refresh_token}
    }
    catch{
        throw new ApiError(500,"Something went wrong with access and refresh token generation")
    }
}

const register_counselor_user = async_handler(async(req,res)=>{

    const {
        collegeId,
        username,
        email,
        password,
        phoneNumber,
        pinCode,
        experience,
        qualification,
        specialization
    } = req.body;

    if (
        [username, email, password, phoneNumber].some((field) =>
            !field || typeof field !== "string" || field.trim() === ""
        )
    ) {
        throw new ApiError(400, "Username, email, password, and phone number are necessary fields.");
    }

    if (!email.includes('@')) {
        throw new ApiError(400, 'Please enter a correct email format.');
    }

    const validClg = await clg_user.findOne({clg_counsellor_id: collegeId});
    if (!validClg) {
        throw new ApiError(400, 'Invalid College ID.');
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

    if (exists.some(user => user)) {
        throw new ApiError(409, "Email already registered.");
    }

    if (exist.some(user => user)) {
        throw new ApiError(409, "Phone Number already registered.");
    }

    const new_counselor_user = await counselor_user.create({
        counselor_name: username,
        counselor_clg_id: validClg._id,
        counselor_clg_name: validClg.clg_name,
        counselor_specialization: specialization,
        counselor_exp: experience,
        counselor_pincode: pinCode,
        counselor_contact: phoneNumber,
        counselor_email: email,
        counselor_qualification: qualification,
        counselor_password: password,
    });
    const check_counselor_user = await counselor_user.findById(new_counselor_user._id).select(
        "-counselor_password"
    );
   
    if(!check_counselor_user){
        throw new ApiError(500, "Something went wrong with user creation on the backend.");
    }

    await clg_user.updateOne(
        { _id: validClg._id },
        { $inc: { clg_counsellor_count: 1 } } 
    );

    return res.status(201).json(
        new ApiResponse(200, check_counselor_user, "Counselor registered successfully")
    );
});


const addInstitute = async_handler(async (req, res) => {
    const { counselorId, collegeId } = req.body;

    if (!counselorId || !collegeId) {
        throw new ApiError(400, "Counselor ID and College ID are required.");
    }
   
    const counselor = await counselor_user.findById(counselorId);
    if (!counselor) {
        throw new ApiError(404, "Counsellor not found.");
    }

    const college = await clg_user.findOne({ clg_counsellor_id: collegeId });
    if (!college) {
        throw new ApiError(400, "Invalid College ID.");
    }
    // 4. If the counselor is already associated with a college
    if (counselor.counselor_clg_id) {
        // If they are, decrement the count of the old college
        await clg_user.updateOne(
            { _id: counselor.counselor_clg_id },
            { $inc: { clg_counsellor_count: -1 } }
        );
    }
    
    counselor.counselor_clg_id = college._id;
    counselor.counselor_clg_name = college.clg_name;
    await counselor.save();

    await clg_user.updateOne(
        { _id: college._id },
        { $inc: { clg_counsellor_count: 1 } }
    );
    
    const updatedCounselor = await counselor_user.findById(counselorId).select("-counselor_password");

    return res.status(200).json(
        new ApiResponse(200, updatedCounselor, "Institute added successfully.")
    );
});


const getCounsellors = async_handler(async (req, res) => {
    const counsellors = await counselor_user.find()
        .select('counselor_name counselor_specialization counselor_exp counselor_clg_id counselor_clg_name')
        .lean();

    return res.status(200).json(
        new ApiResponse(200, counsellors, "Counsellors fetched successfully")
    );
});

const getCounsellorAppointments = async_handler(async (req, res) => {
    const {counselorId} = req.params;
    if (!counselorId) {
        throw new ApiError(401, "Counsellor not authenticated");
    }

    const appointments = await Appointment.find({ counsellor: new mongoose.Types.ObjectId(counselorId) })
                                    .populate({
                                        path: 'student',
                                        model: 'stud_user',
                                        select: 'user_name user_email user_clg_id user_clg_name user_mood user_tests'
                                    }).lean();

    return res.status(200).json(
        new ApiResponse(200, appointments, "Counsellor appointments fetched successfully")
    );
});

const getCounsellorInfo = async_handler(async (req, res) => {
    const { counselorId } = req.params;
    if (!counselorId) {
        throw new ApiError(401, "Counsellor ID is required");
    }
    const counselor = await counselor_user.findById(counselorId).select('-counselor_password').lean();
    if (!counselor) {
        throw new ApiError(404, "Counsellor not found");
    }
    return res.status(200).json(
        new ApiResponse(200, counselor, "Counsellor info fetched successfully")
    );
})

export {register_counselor_user, getCounsellors,generate_access_and_refresh_token_counsellor, getCounsellorAppointments, getCounsellorInfo, addInstitute}
