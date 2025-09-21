import { async_handler } from "../utils/async_handler.js";
import { ApiError } from "../utils/api_error.js";
import { stud_user } from "../models/stud_user.js";
import { clg_user } from "../models/clg_user.js";
import { counselor_user } from "../models/counselor_user.js";
import bcrypt from 'bcrypt';

const login_user = async_handler(async (req, res) => {
    const { userType, email, password, instituteName } = req.body;

    // Validate required fields
    if ([userType, email, password].some(field => !field || typeof field !== "string" || field.trim() === "")) {
        throw new ApiError(400, 'All fields are required');
    }

    if (!email.includes('@')) {
        throw new ApiError(400, 'Enter a valid email id');
    }

    let user = null;
    let userFound = false;
    let nameKey, emailKey, passwordKey;

    // Determine model and field keys based on userType
    switch (userType.toLowerCase()) {
        case "student":
            user = await stud_user.findOne({ user_email: email });
            userFound = !!user;
            nameKey = "user_name";
            emailKey = "user_email";
            passwordKey = "user_password";
            break;
        case "institute":
            user = await clg_user.findOne({ clg_admin_email: email });
            userFound = !!user;
            // Additional check for institute name
            if (user && user.clg_name.toLowerCase() !== instituteName.toLowerCase()) {
                throw new ApiError(401, "Invalid institute name");
            }
            nameKey = "clg_admin_name";
            emailKey = "clg_admin_email";
            passwordKey = "clg_password";
            break;
        case "counsellor":
            user = await counselor_user.findOne({ counselor_email: email });
            userFound = !!user;
            nameKey = "counselor_name";
            emailKey = "counselor_email";
            passwordKey = "counselor_password";
            break;
        default:
            throw new ApiError(400, "Invalid user type");
    }

    // Handle user not found
    if (!userFound) {
        throw new ApiError(404, "Email not found");
    }

    // Compare passwords using bcrypt
    const match = await bcrypt.compare(password, user[passwordKey]);
    if (!match) {
        throw new ApiError(401, "Incorrect password");
    }

    // Successful login response
    console.log(`Successfully logged in: ${user[nameKey]}`);
    console.log(`[BACKEND] Login Successful for: ${user[emailKey]}`);

    return res.status(200).json({
        message: "Login Successful",
        data: {
            _id: user._id,
            name: user[nameKey],
            userType: userType,
            email: user[emailKey],
            // Include clg_name for institute user type
            ...(userType.toLowerCase() === 'institute' && { clg_name: user.clg_name })
        }
    });
});

export { login_user };