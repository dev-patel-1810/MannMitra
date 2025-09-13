import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { stringify } from 'postcss'

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
        type:String,
        required:true,
        minlength:10,
        maxlength:10,
        trim:true,
        unique:true,
    },
    counselor_specialization:{
        type:String,
        required:true
    },
    counselor_exp:{
        type:String,
        required:true
    },
    counselor_pincode:{
        type:String,
        required:true
    },
    counselor_qualification:{
        type:String,
        required:true
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

counselor_schema.pre('save', async function(next){
    if(!this.isModified('counselor_password')){
        return next()
    }
    this.counselor_password= await bcrypt.hash(this.counselor_password, 10)
    next()
})

counselor_schema.methods.comparePassword= async function(password){
    return await bcrypt.compare(password, this.counselor_password)
}

// Generate Access Token
counselor_schema.methods.generate_access_token = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.counselor_email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '10d'
        }
    )
}

// Generate Refresh Token
counselor_schema.methods.generate_refresh_token = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.counselor_email,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '60d'
        }
    )
}


export const counselor_user=mongoose.model('counselor_user',counselor_schema)