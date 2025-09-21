import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { clg_user } from './clg_user.js'

const stud_user_schema = new mongoose.Schema({
    user_name:{
        type:String,
        required: true,
        trim:true,
        minlength:2,
    },
    user_institute_name:{
        type:String,
        trim:true
    },
    user_pincode:{
        type:Number,
        required:true,
        trim:true
    },
    user_contact:{
        type:String,
        required:true,
        minlength:10,
        maxlength:10,
        trim:true
    },
    user_email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    user_guardian_1_name:{
        type:String,
        trim:true,
    },
    user_guardian_1_contact:{
        type:String,
        maxlength:10,
        trim:true
    },
    user_guardian_2_name:{
        type:String,
        trim:true
    },
    user_guardian_2_contact:{
        type:String,
        maxlength:10,
        trim:true
    },
    user_password:{
        type:String,
        required:true,
        minlength:6,
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{6,}$/,
            "Password must contain at least one uppercase, one lowercase, one number, and one special character and more than 6 characters"
        ]
    },
    user_clg_id: {
        type: mongoose.Schema.Types.ObjectId, // Use ObjectId for references
        ref: 'clg_user', // Reference the 'clg_user' model
        required: false,
        trim: true
    },
    user_clg_name: {
        type: String,
        required: false,
        default: "N/A"
    }

},{timestamps:true , strict:true})

stud_user_schema.pre('save', async function(next){
    const user = this;

    if(user.isModified('user_password')){
        user.user_password = await bcrypt.hash(user.user_password, 10);
    }

    next();
})


stud_user_schema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.user_password)
}

// Generate Access Token
stud_user_schema.methods.generate_access_token = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.user_email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '10d'
        }
    )
}

// Generate Refresh Token
stud_user_schema.methods.generate_refresh_token = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.user_email,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '60d'
        }
    )
}

export const stud_user = mongoose.model('stud_user', stud_user_schema)