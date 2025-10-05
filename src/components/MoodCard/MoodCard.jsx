import React from 'react';
import './MoodCard.css';
import moodMeter from '../../assets/mood_meter_base.png';
import pointer from '../../assets/pointer_vector.svg';
import { t } from 'i18next';

import emotionAngry from '../../assets/angry.png';
import emotionSad from '../../assets/sad.png';
import emotionNeutral from '../../assets/neutral.png';
import emotionHappy from '../../assets/happy.png';
import emotionExcited from '../../assets/excited.png';
import emotionDefault from '../../assets/default.jpg';

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
    // Database value from CRON job
    { name : 'N/A', rotation: 90, image: emotionDefault }, 
    // UI initial state and error fallback
    { name : 'NotSet', rotation: 90, image: emotionDefault },
    { name : 'default', rotation: 90, image: emotionDefault } 
];

const MoodCard = () => {
    // Initial state is 'NotSet'
    const [currentMood, setCurrentMood] = React.useState('NotSet');
    const [pointerRotation, setPointerRotation] = React.useState(90);
    const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

    const [userMoodHistory, setUserMoodHistory] = React.useState([]);

    const userId = JSON.parse(localStorage.getItem('user'))?.['_id']
    
    // Find the 'NotSet' entry for error handling/initial state, guaranteed to exist now.
    const notSetMoodEntry = React.useMemo(() => MOOD_DATA.find(m => m.name === 'NotSet'), []);

    const fetchCurrentAndHistoryMood = async () => {
        if (!userId) {
            console.error("User ID not found in localStorage.");
            return;
        }
        try {
            const response = await fetch(`https://mannmitra-v141.onrender.com/mood/${userId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const responseData = await response.json();
            const moodHistoryArray = responseData.data || [];

            setUserMoodHistory(moodHistoryArray);

            const todayMoodEntry = moodHistoryArray.at(-1);

            if (todayMoodEntry) {
                const moodValue = todayMoodEntry.mood_value;
                const moodEntry = MOOD_DATA.find(m => m.name === moodValue);

                if (moodEntry) {
                    setCurrentMood(moodEntry.name);
                    setPointerRotation(moodEntry.rotation);
                } else {
                    // Handle case where moodValue is in DB but not in MOOD_DATA (safety fallback)
                    setCurrentMood(notSetMoodEntry.name);
                    setPointerRotation(notSetMoodEntry.rotation);
                }
            } else {
                // Handle case where there is no mood history at all
                setCurrentMood(notSetMoodEntry.name);
                setPointerRotation(notSetMoodEntry.rotation);
            }
        } catch (error) {
            console.error("Could not fetch today's mood, setting to NotSet default.", error);
            // Ensure the pointer is set to 'NotSet' rotation on error
            setCurrentMood(notSetMoodEntry.name);
            setPointerRotation(notSetMoodEntry.rotation);
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
        // Prevent saving 'N/A' or 'NotSet' to the backend from a selection.
        if (mood === 'NotSet' || mood === 'N/A') {
             console.warn(`Attempted to save system state mood: ${mood}. Aborting save.`);
             return;
        }
        try {
            const response = await fetch('https://mannmitra-v141.onrender.com/mood/update', {
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

            // REFRESH HISTORY after saving a new mood
            fetchCurrentAndHistoryMood();

            console.log(`Mood ${mood} saved successfully.`);
        } catch (error) {
            console.error("Error saving mood:", error);
        }
    };

    const handleMoodSelection = (moodName, rotationAngle) => {
        setCurrentMood(moodName);
        setPointerRotation(rotationAngle);
        // Only save if it's a selectable mood (not N/A or NotSet)
        if (moodName !== 'NotSet' && moodName !== 'N/A') {
            saveMoodToBackend(moodName);
        }
    };

    // Find the display mood based on currentMood, with a final fallback to prevent 'undefined'.
    const displayMood = MOOD_DATA.find(m => m.name === currentMood) || notSetMoodEntry;

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

                        {MOOD_DATA
                            // FILTER OUT 'N/A' and 'NotSet' from the clickable zones
                            .filter(mood => mood.name !== 'NotSet' && mood.name !== 'N/A')
                            .map((mood, index) => (
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
                        {/* CONDITIONAL RENDERING for the image and text */}
                        {displayMood.image ? (
                            <>
                                <img src={displayMood.image} alt={`${displayMood.name} Emotion`} />
                                <h3>
                                    {t("I Feel", { ns: 'mood' })} 
                                    {/* Display 'N/A' or 'NotSet' message based on the status */}
                                    {displayMood.name === 'N/A' || displayMood.name === 'NotSet' 
                                        ? t("No mood set for today") 
                                        : displayMood.name
                                    }
                                </h3>
                            </>
                        ) : (
                            // Fallback in case of a serious logic error
                            <h3 className="no-mood-set-text">
                                {t("No mood set for today")}
                            </h3>
                        )}
                    </div>
                </div>
            </div>

            {/* CALENDAR MODAL COMPONENT */}
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