import { async_handler } from "../utils/async_handler.js";
import{ApiError} from "../utils/api_error.js" 
import {clg_user} from "../models/clg_user.js"
import { ApiResponse }  from "../utils/api_response.js";
import {stud_user} from "../models/stud_user.js"
import {counselor_user} from "../models/counselor_user.js"

const generate_access_and_refresh_token_clg = async(clg_user_id)=>{
    try{
        const Clg_User = await clg_user.findById(clg_user_id);
        if(!Clg_User){
            throw new ApiError(404,"User not found")
        }
        const access_token = Clg_User.generate_access_token()       
        const refresh_token = Clg_User.generate_refresh_token()
        Clg_User.clg_refresh_token = refresh_token
        await Clg_User.save({validateBeforeSave:false})
        return {access_token, refresh_token}
    }
    catch{
        throw new ApiError(500,"Something went wrong with access and refresh token generation")
    }
}

const register_clg_user = async_handler(async(req,res)=>{
    
    const {
        adminDesignation,
        adminName,
        collegeName,
        collegeType,
        email,
        password,
        phoneNumber,
        pinCode,
        state,
        studentId,
        counsellorId,
    }= req.body

    if (
        [adminName , collegeName , email , password , phoneNumber, studentId, counsellorId ].some((field) =>
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

    if (exists[0] || exists[1] || exists [2]) {
        throw new Error("Email already registered");
    }

    if (exist[0] || exist[1] || exist [2]) {
        throw new Error("Phone Number already registered");
    }


    const new_clg_user= await clg_user.create({
        clg_admin_name:adminName,
        clg_name:collegeName,
        clg_type: collegeType,
        clg_state: state,
        clg_pincode:pinCode,
        clg_admin_contact:phoneNumber,
        clg_admin_email: email,
        clg_admin_designation: adminDesignation,
        clg_password:password,
        clg_student_id:studentId,
        clg_counsellor_id:counsellorId,
    })

    const check_clg_user = await clg_user.findById(new_clg_user._id).select(
            "-user_password"
        )
    
    
    if(!check_clg_user){
        throw new ApiError(500 , "Something went wrong");
    }
    
    return res.status(201).json(
        new ApiResponse(200 , check_clg_user , "User registered successfully")
    )
    

})

const getUserAndCounsellor = async_handler(async(req,res)=>{

    const {clgId}=req.params;

    const users = await stud_user.find({user_clg_id:clgId})
        .select('user_name user_email user_contact user_guardian_1_name user_guardian_1_contact user_guardian_2_name user_guardian_2_contact')
        .lean();

    const counsellors = await counselor_user.find({counselor_clg_id:clgId})
        .select('counselor_name counselor_specialization counselor_exp counselor_qualification counselor_contact counselor_email')
        .lean();

    return res.status(200).json(
        new ApiResponse(200, {users, counsellors}, "Users and Counsellors fetched successfully")
    );
});

export {register_clg_user, getUserAndCounsellor, generate_access_and_refresh_token_clg }