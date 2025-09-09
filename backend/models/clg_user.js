import mongoose from 'mongoose'
const clg_user_schema=new mongoose({
    clg_name:{
        type:String,
        required:true,
        trim:true
    },
    clg_type:{
        type:String,
        required:true
    },
    clg_state:{
        type:String,
        required:true
    },
    clg_pin_code:{
        type:Number,
        required:true,
        trim:true
    },
    clg_admin_name:{
        type:String,
        required:true,
        trim:true
    },
    clg_admin_designation:{
        type:String,
        required:true,
        trim:true
    },
    clg_admin_contact:{
        type:Number,
        required:true,
        minlength:10,
        maxlength:10,
        trim:true,
        unique:true
    },
    clg_admin_email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true
    },
    clg_password:{
        type:String,
        required:true,
        trim:true,
        minlength:6,
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&]{6,}$/,
            "Password must contain at least one uppercase, one lowercase, one number, and one special character and more than 6 characters"
        ]
    },
    // clg_confirm_password:{
    //     type:String,
    //     required:true,
    //     validate:{
    //         validator:function(value){
    //             return value==this.clg_password
    //         },
    //     message:"Password does not match \n Please Try Again!"
    //     }
    // },
},{timestamps:true, strict:true})
export const clg_user=mongoose.model('clg_user',clg_user_schema)