import mongoose from 'mongoose';
import { async_handler } from "../utils/async_handler.js";
import{ApiError} from "../utils/api_error.js" 
import {stud_user} from "../models/stud_user.js"
import { ApiResponse }  from "../utils/api_response.js";
import {clg_user} from "../models/clg_user.js"
import {counselor_user} from "../models/counselor_user.js"
import {Appointment} from "../models/appointment.js"

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

    // Fetch the college document first
    const college = await clg_user.findOne({ clg_student_id: collegeId });
    if (!college) {
        throw new ApiError(400, 'Invalid College ID.');
    }

    // Check for existing users with the same email or phone number across all user types
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
        counselor_user.findOne({ counselor_contact: phoneNumber })
    ]);

    if (exist.some(user => user)) {
        throw new ApiError(409, "Phone Number already registered.");
    }

    // Create the new student user
    const newUser = await stud_user.create({
        user_name: username,
        user_email: email,
        user_pincode: pinCode,
        user_contact: phoneNumber,
        user_password: password,
        user_guardian_1_name: guardian1Name || "",
        user_guardian_1_contact: guardian1Contact || "",
        user_guardian_2_name: guardian2Name || "",
        user_guardian_2_contact: guardian2Contact || "",
        user_clg_id: college._id, // Use the fetched college's ObjectId
        user_clg_name: college.clg_name, // Populate the college name directly
    });

    // Check if user was created successfully
    const check_stud_user = await stud_user.findById(newUser._id).select("-user_password");
    if (!check_stud_user) {
        throw new ApiError(500, "Something went wrong with user creation.");
    }
    
    // Now, update the college's student count. This happens after a successful student creation.
    await clg_user.updateOne(
        { _id: college._id },
        { $inc: { clg_student_count: 1 } }
    );

    return res.status(201).json(
        new ApiResponse(200, check_stud_user, "User registered successfully.")
    );
});



const getUserInfo = async_handler(async (req, res) => {
    const { userId } = req.params;
    
    const user = await stud_user.findById(userId)
        .select('user_name user_email user_phone collegeId user_clg_id')
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