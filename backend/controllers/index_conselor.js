import mongoose from "mongoose";
import { async_handler } from "../utils/async_handler.js";
import{ApiError} from "../utils/api_error.js" 
import {clg_user} from "../models/clg_user.js"
import { ApiResponse }  from "../utils/api_response.js";
import {stud_user} from "../models/stud_user.js"
import {counselor_user} from "../models/counselor_user.js"
import {Appointment} from "../models/appointment.js"

const register_counselor_user = async_handler(async(req,res)=>{
    //OBJECTIVES---- 
    // tpye - collegeId , username , exp , email , password ,phoneNumber , pinCode , qualification , specialization

    const {
        collegeId ,
        username ,
        email ,
        password ,
        phoneNumber ,
        pinCode ,
        experience,
        qualification ,
        specialization
    }= req.body

    console.log("inputs:" , req.body)

    if (
        [username , email , password , phoneNumber ].some((field) =>
            !field || typeof field !== "string" || field.trim() === "")
    ) {
        throw new ApiError(400 , "These fields are necessary")
    }

    if (!email || typeof email !== "string" || email.trim() === "") {
        throw new ApiError(400, 'Email is required');
    }
    if(!email.includes('@')){
        throw new ApiError(400 , 'Enter correct email')
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


    const new_counselor_user= await counselor_user.create({
        counselor_name:username,
        counselor_clg_id:collegeId,
        counselor_specialization: specialization ,
        counselor_exp: experience,
        counselor_pincode:pinCode,
        counselor_contact:phoneNumber,
        counselor_email: email,
        counselor_qualification: qualification,
        counselor_password:password,
    })

    const check_counselor_user = await counselor_user.findById(new_counselor_user._id).select(
            "-user_password"
        )
    
    
    if(!check_counselor_user){
        throw new ApiError(500 , "Something wrong with backend")
    }
    
    return res.status(201).json(
        new ApiResponse(200 , check_counselor_user , "User registered successfully")
    )
    

})

const getCounsellors = async_handler(async (req, res) => {
    const counsellors = await counselor_user.find()
        .select('counselor_name counselor_specialization counselor_exp counselor_clg_id')
        .lean();

    return res.status(200).json(
        new ApiResponse(200, counsellors, "Counsellors fetched successfully")
    );
});

const getCounsellorAppointments = async_handler(async (req, res) => {
    // The counsellor ID can be retrieved from the authenticated request object
    const {counselorId} = req.params;
    console.log(counselorId);
    if (!counselorId) {
        throw new ApiError(401, "Counsellor not authenticated");
    }

    const appointments = await Appointment.find({ counsellor: new mongoose.Types.ObjectId(counselorId) })
                                                    .populate({
                                                        path: 'student',
                                                        model: 'stud_user',
                                                        select: 'user_name user_email'
                                                    }).lean();
    console.log(appointments);
    return res.status(200).json(
        new ApiResponse(200, appointments, "Counsellor appointments fetched successfully")
    );
});

export {register_counselor_user, getCounsellors, getCounsellorAppointments}