import { stud_user } from '../models/stud_user.js'; 
import { async_handler } from '../utils/async_handler.js';
import { ApiError } from '../utils/api_error.js';
import { ApiResponse } from '../utils/api_response.js';

const getTodayStart = () => {
    const now = new Date();
    const year = parseInt(now.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', year: 'numeric' }));
    const monthIndex = parseInt(now.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', month: 'numeric' })) - 1; 
    
    const day = parseInt(now.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', day: 'numeric' }));
    
    return new Date(Date.UTC(year, monthIndex, day, 0, 0, 0, 0));
};

const updateMood= async_handler(async (req, res) => {
    console.log("Received request to update mood:", req.body);
    const {userId, moodValue} = req.body;
    
    let message="";
    const todayStart = getTodayStart();
    console.log(`Updating mood for user ${userId} to ${moodValue} for date ${todayStart.toISOString()}`);
    
    const updateResult = await stud_user.findOneAndUpdate(
        { 
            _id: userId, 
            "user_mood.mood_date": todayStart,
        },
        { 
            $set: { "user_mood.$.mood_value": moodValue } 
        },
        { new: true } 
    );

    if (updateResult) {
        message = "Mood updated successfully";
    } else {
        throw new ApiError(500, 'Failed to update mood. Ensure a default mood entry exists for today.');
    }
    return res.status(200).json(new ApiResponse(200, null, message));
});

const getMoodHistory = async_handler(async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        throw new ApiError(400, 'User ID is required');
    }
    const user = await stud_user.findById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    return res.status(200).json(new ApiResponse(200, user.user_mood, 'Mood history retrieved successfully'));
});

export { updateMood, getMoodHistory };