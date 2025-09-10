import mongoose from 'mongoose'
const counselor_schema=new mongoose.Schema({
    counselor_name:{
        type:String,
        required:true
    },
    // institution:{
    //     type:String,
    //     required:true,
    //     default:"Private"
    // },
    counselor_email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    counselor_contact:{
        type:Number,
        required:true,
        minlength:10,
        maxlength:10,
        trim:true,
        unique:true,
    },
    counselor_password:{
        type:String,
        required:true,
        trim:true,
        minlength:6,
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&]{6,}$/,
            "Password must contain at least one uppercase, one lowercase, one number, and one special character and more than 6 characters"
        ],
        select:false
    },
    // counselor_confirm_password:{
    //     type:String,
    //     required:true,
    //     validate:{
    //         validator:function(value){
    //             return value==this.clg_password
    //         },
    //     message:"Password does not match \n Please Try Again!"
    //     }
    // },
    counselor_clg_id:{
        type:String,
        required:false,
        trim:true,
        default:"N/A"
    }
},{timestamps:true, strict:true})

export const CounselorUser=mongoose.model('counselor_user',counselor_schema)