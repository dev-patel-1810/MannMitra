import mongoose from 'mongoose'

const stud_user_schema = new mongoose.Schema({
    user_name:{
        type:String,
        required: true,
        trim:true,
        minlength:2,
    },
    user_institute_name:{
        type:String,
        required:true,
        default:"N/A",
        trim:true
    },
    user_pincode:{
        type:Number,
        required:true,
        trim:true
    },
    user_contact:{
        type:Number,
        required:true,
        minlength:10,
        maxlength:10,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true
    },
    user_gaurdian_1_name:{
        type:String,
        required:function(){
            return ! this.have_gaurdian;
        },
        trim:true,
    },
    user_gaurdian_1_contact:{
        type:Number,
        required:function(){
            return ! this.have_gaurdian;
        },
        maxlength:10,
        minlength:10,
        trim:true
    },
    user_gaurdian_2_name:{
        type:String,
        required:function(){
            return ! this.have_gaurdian;
        },
        trim:true
    },
    user_gaurdian_2_contact:{
        type:Number,
        required:function(){
            return ! this.have_gaurdian;
        },
        maxlength:10,
        minlength:10,
        trim:true
    },
    user_password:{
        type:String,
        required:true,
        minlength:6,
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&]{6,}$/,
            "Password must contain at least one uppercase, one lowercase, one number, and one special character and more than 6 characters"
        ]
    },
    user_confirm_password:{
        type:String,
        required:true,
        validate:{
            validator:function(value){
                return value==this.user_password
            },
        message:"Password does not match \n Please Try Again!"
        }
    },
    user_college_id:{
        type:String,
        default:"N/A"
    }

},{timestamps:true , strict:true})

export const stud_user = mongoose.model('stud_user', stud_user_schema)
