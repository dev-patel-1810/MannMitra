import { async_handler } from "../utils/async_handler.js";
import{ApiError} from "../utils/api_error.js" 
import {clg_user} from "../models/clg_user.js"
import { ApiResponse }  from "../utils/api_response.js";
import {stud_user} from "../models/stud_user.js"
import {counselor_user} from "../models/counselor_user.js"


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

export {register_counselor_user}