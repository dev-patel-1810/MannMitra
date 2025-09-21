import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { clg_user } from './clg_user.js' // Make sure the path is correct

const counselor_schema=new mongoose.Schema({
    counselor_name:{
        type:String,
        required:true
    },
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
        ]
    },
    counselor_clg_id: {
        type: mongoose.Schema.Types.ObjectId, // Use ObjectId for references
        ref: 'clg_user', // Reference the 'clg_user' model
        required: false,
        trim: true
    },
    counselor_clg_name: {
        type: String,
        required: false,
        default: "N/A"
    }
},{timestamps:true, strict:true})

counselor_schema.pre('save', async function(next){
    // Use `this` to refer to the document being saved
    const counselor = this;

    // Password Hashing Logic
    if(counselor.isModified('counselor_password')){
        counselor.counselor_password = await bcrypt.hash(counselor.counselor_password, 10)
    }

    next();
});

counselor_schema.methods.comparePassword = async function(password){
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

export const counselor_user = mongoose.model('counselor_user', counselor_schema)