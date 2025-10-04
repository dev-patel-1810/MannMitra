import cron from 'node-cron';
import { stud_user } from '../models/stud_user.js'; 

const getTodayStart = () => {
    const now = new Date();
    const year = parseInt(now.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', year: 'numeric' }));
    const monthIndex = parseInt(now.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', month: 'numeric' })) - 1; 
    
    const day = parseInt(now.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', day: 'numeric' }));
    return new Date(Date.UTC(year, monthIndex, day, 0, 0, 0, 0));
};

const setStartOfDayDefaultMood = async () => {
    console.log('Running start-of-day task: Pushing N/A mood for all users...');
    const todayStart = getTodayStart(); 
    
    try {
        const filter = {}; 
        
        const updateOperation = {
            $push: {
                user_mood: {
                    mood_date: todayStart, 
                    mood_value: 'N/A' 
                }
            }
        };

        const result = await stud_user.updateMany(filter, updateOperation);
        console.log(`Start-of-day default mood set for: ${result.modifiedCount} users at ${todayStart.toISOString()}.`);
    } catch (error) {
        console.error('CRON ERROR: Failed to set start-of-day default mood:', error);
    }
};

export default function startMoodScheduler() {
    console.log("Scheduling daily mood default job for 02:41 PM IST...");
    cron.schedule('47 14 * * *', async () => {
        await setStartOfDayDefaultMood();
    }, {
        timezone: "Asia/Kolkata" 
    });
};