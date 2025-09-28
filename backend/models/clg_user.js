import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const clg_user_schema=new mongoose.Schema({
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
    clg_pincode:{
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
        type:String,
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
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&_])[A-Za-z\d@$!#%*?&_]{6,}$/,
            "Password must contain at least one uppercase, one lowercase, one number, and one special character and more than 6 characters"
        ]
        
    },
    clg_student_id: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    clg_counsellor_id: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    clg_student_count:{
        type:Number,
        default:0
    },
    clg_counsellor_count:{ 
        type:Number,
        default:0
    },
    clg_refresh_token:{
        type:String
    }

},{timestamps:true, strict:true})

clg_user_schema.pre('save', async function(next){
    if(!this.isModified('clg_password')){
        return next()
    }
    this.clg_password= await bcrypt.hash(this.clg_password, 10)
    next()
})

clg_user_schema.methods.comparePassword= async function(password){
    return await bcrypt.compare(password, this.clg_password)
}
// Generate Access Token
clg_user_schema.methods.generate_access_token = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.clg_admin_email,
            name: this.clg_admin_name,
            userType: 'institute'
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '10d'
        }
    )
}

// Generate Refresh Token
clg_user_schema.methods.generate_refresh_token = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.clg_admin_email,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '60d'
        }
    )
}


export const clg_user=mongoose.model('clg_user',clg_user_schema)