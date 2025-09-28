import React from 'react';
import './MoodCard.css';
import moodMeter from '../../assets/mood_meter_base.png';
import pointer from '../../assets/pointer_vector.svg';
import { t } from 'i18next';

// ⚠️ ENSURE THESE IMPORTS ARE CORRECT
import emotionAngry from '../../assets/angry.png';
import emotionSad from '../../assets/sad.png';
import emotionNeutral from '../../assets/neutral.png';
import emotionHappy from '../../assets/happy.png';
import emotionExcited from '../../assets/excited.png';

// Import the new Calendar Modal component
import MoodCalendar from '../MoodCalendar/MoodCalendar'; 

const CalendarIcon = () => (
    // Simple SVG for a calendar icon
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h2v2H7v-2zm-4 4h2v2H3v-2zm16 0h-2v2h2v-2z"/>
    </svg>
);


const MOOD_DATA = [
    { name: 'Angry', rotation: -65, image: emotionAngry },
    { name: 'Sad', rotation: -40, image: emotionSad },
    { name: 'Neutral', rotation: 0, image: emotionNeutral },
    { name: 'Happy', rotation: 40, image: emotionHappy },
    { name: 'Excited', rotation: 65, image: emotionExcited },
];

const MoodCard = () => {
    const [currentMood, setCurrentMood] = React.useState('Neutral');
    const [pointerRotation, setPointerRotation] = React.useState(0);
    const [isCalendarOpen, setIsCalendarOpen] = React.useState(false); 
    
    // 💡 NEW STATE: To hold all mood history data
    const [userMoodHistory, setUserMoodHistory] = React.useState([]); 
    
    const userId = JSON.parse(localStorage.getItem('user'))?.['\_id']

    // 💡 MODIFIED: Fetching function now also updates the userMoodHistory state
    const fetchCurrentAndHistoryMood = async () => {
        if (!userId) {
            console.error("User ID not found in localStorage.");
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/mood/${userId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const responseData = await response.json();
            const moodHistoryArray = responseData.data || [];
            
            // Set the full history array
            setUserMoodHistory(moodHistoryArray); 

            // Logic to set CURRENT mood from fetched data
            const todayMoodEntry = moodHistoryArray.at(-1);

            if (todayMoodEntry) {
                const moodValue = todayMoodEntry.mood_value;
                const moodEntry = MOOD_DATA.find(m => m.name === moodValue);

                if (moodEntry) {
                    setCurrentMood(moodEntry.name);
                    setPointerRotation(moodEntry.rotation);
                }
            } else {
                const defaultEntry = MOOD_DATA.find(m => m.name === 'Neutral');
                if (defaultEntry) {
                    setCurrentMood(defaultEntry.name);
                    setPointerRotation(defaultEntry.rotation);
                }
            }
        } catch (error) {
            console.error("Could not fetch today's mood, setting to Neutral default.", error);
        }
    };

    React.useEffect(() => {
        fetchCurrentAndHistoryMood();
    }, []);

    const saveMoodToBackend = async (mood) => {
        if (!userId) {
            console.error("Cannot save mood: User ID is missing.");
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/mood/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    moodValue: mood,
                    userId: userId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save mood on the server.');
            }
            
            // 💡 REFRESH HISTORY after saving a new mood
            fetchCurrentAndHistoryMood(); 

            console.log(`Mood ${mood} saved successfully.`);
        } catch (error) {
            console.error("Error saving mood:", error);
        }
    };

    const handleMoodSelection = (moodName, rotationAngle) => {
        setCurrentMood(moodName);
        setPointerRotation(rotationAngle);
        saveMoodToBackend(moodName);
    };

    const displayMood = MOOD_DATA.find(m => m.name === currentMood) || MOOD_DATA.find(m => m.name === 'Neutral');

    return (
        <>
            <div className="mood-card">
                <div className="mood-card-header"> 
                    <h2>{t("dashboard.mood")}</h2>
                    {/* 💡 CALENDAR ICON */}
                    <button className="calendar-icon-button" onClick={() => setIsCalendarOpen(true)} title={t("view_mood_history")}>
                        <CalendarIcon />
                    </button>
                </div>
                
                <div className="mood-content">
                    <div className="mood-meter-container">
                        <img src={moodMeter} alt="Mood Meter Base" className="mood-meter-img" />
                        <img
                            src={pointer}
                            alt="Mood Pointer"
                            className="mood-pointer"
                            style={{ transform: `translateX(-50%) rotate(${pointerRotation}deg)` }}
                        />

                        {MOOD_DATA.map((mood, index) => (
                            <div
                                key={mood.name}
                                className={`mood-zone mood-zone-${index + 1}`}
                                onClick={() => handleMoodSelection(mood.name, mood.rotation)}
                                title={`Select ${mood.name}`}
                            >
                                {currentMood === mood.name && <div className="mood-zone-selected"></div>}
                            </div>
                        ))}
                    </div>

                    <div className='emoji'>
                        <img src={displayMood.image} alt={`${displayMood.name} Emotion`} />
                        <h3>I Feel {displayMood.name}</h3>
                    </div>
                </div>
            </div>

            {/* 💡 CALENDAR MODAL COMPONENT */}
            {isCalendarOpen && (
                <MoodCalendar 
                    isOpen={isCalendarOpen} 
                    onClose={() => setIsCalendarOpen(false)} 
                    MOOD_DATA={MOOD_DATA} 
                    UserMoodHistory={userMoodHistory} // PASS THE FETCHED DATA
                />
            )}
        </>
    );
};

export default MoodCard;