import { async_handler } from "../utils/async_handler.js";
import{ApiError} from "../utils/api_error.js" 
import {clg_user} from "../models/clg_user.js"
import { ApiResponse }  from "../utils/api_response.js";
import {stud_user} from "../models/stud_user.js"
import {counselor_user} from "../models/counselor_user.js"

const register_clg_user = async_handler(async(req,res)=>{
    //OBJECTIVES---- 
    // tpye - adminDesignation , adminName , collegeName , collegeType , email , password ,phoneNumber , pinCode , state

    const {
        adminDesignation,
        adminName,
        collegeName,
        collegeType,
        email,
        password,
        phoneNumber,
        pinCode,
        state
    }= req.body

    console.log("inputs:" , req.body)

    if (
        [adminName , collegeName , email , password , phoneNumber ].some((field) =>
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

    // const user_exists = await clg_user.findOne({
    //     $or: [{email}, {phoneNumber}]
    // })

    // const user_exist = await stud_user.findOne({
    //     $or: [{user_contact:phoneNumber}, {user_email:email}]
    // })

    // if(user_exist){
    //     throw new ApiError(409, 'User already exists for this number or email')
    // }

    // if(user_exists){
    //     throw new ApiError(409, 'User already exists for this number or email')
    // }
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
    })

    const check_clg_user = await clg_user.findById(new_clg_user._id).select(
            "-user_password"
        )
    
    
    if(!check_clg_user){
        throw new ApiError(500 , "Something wrong with backend")
    }
    
    return res.status(201).json(
        new ApiResponse(200 , check_clg_user , "User registered successfully")
    )
    

})

export {register_clg_user}