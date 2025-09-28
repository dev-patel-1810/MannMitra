import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const testDetailsSchema = new mongoose.Schema({
    test_name: {
        type: String,
        required: true,
        trim: true,
    },
    test_score: {
        type: Number,
        required: true,
    },test_date: {
        type: String,
        required: true,
    },test_riskStatus:{
        type: String,
        required: true,
        enum: ['low', 'medium', 'high','N/A'],
        default: 'N/A'
    },
    test_result_description:{
        type: String,
        required: false,
    }
},{_id: false});

const moodSchema = new mongoose.Schema({
    mood_date: {
        type: Date,
        required: true
    },
    mood_value: {
        type: String,
        required: true,
        enum: ['Angry', 'Sad', 'Neutral', 'Happy', 'Excited','N/A'],
        default: 'N/A',
    },
},{_id: false})

const stud_user_schema = new mongoose.Schema({
    user_name:{
        type:String,
        required: true,
        trim:true,
        minlength:2,
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
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&_])[A-Za-z\d@$!#%*?&_]{6,}$/,
            "Password must contain at least one uppercase, one lowercase, one number, and one special character and more than 6 characters"
        ]
    },
    user_clg_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'clg_user',
        required: false,
        trim: true
    },
    user_clg_name: {
        type: String,
        required: false,
        default: "N/A"
    },
    user_tests: {
        type: [testDetailsSchema],
        default: []
    },
    user_mood: {
        type: [moodSchema],
        default: []
    },
    user_refresh_token: {
        type: String
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
            name: this.user_name,
            userType: "student",
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