// MoodCard.js
import React from 'react';
import './MoodCard.css';
import moodMeter from '../../assets/mood_meter_base.png'; 
import pointer from '../../assets/pointer_vector.svg';
import emotionImg from '../../assets/Emotion.png'; 
import { t } from 'i18next';

const MOOD_DATA = [
    { name: 'Angry', rotation: -65 },
    { name: 'Sad', rotation: -40 },
    { name: 'Neutral', rotation: 0 },
    { name: 'Happy', rotation: 40 },
    { name: 'Excited', rotation: 65 },
];

const MoodCard = () => {
    const [currentMood, setCurrentMood] = React.useState('Neutral');
    const [pointerRotation, setPointerRotation] = React.useState(0); 
    const userId = JSON.parse(localStorage.getItem('user'))._id; 

    const fetchCurrentMood = async () => {
        try {
            const response = await fetch(`http://localhost:5000/mood/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const responseData = await response.json();
            const moodHistoryArray = responseData.data || []; 
            const todayMoodEntry = moodHistoryArray.at(-1); 
            if (todayMoodEntry) {
                const moodValue = todayMoodEntry.mood_value; 

                if (moodValue && moodValue !== 'N/A') {
                    const moodEntry = MOOD_DATA.find(m => m.name === moodValue);
                    if (moodEntry) {
                        setCurrentMood(moodEntry.name);
                        setPointerRotation(moodEntry.rotation);
                    }
                } else {
                    const defaultEntry = MOOD_DATA.find(m => m.name === 'Neutral');
                    if(defaultEntry) {
                        setCurrentMood(defaultEntry.name);
                        setPointerRotation(defaultEntry.rotation);
                    }
                }
            }
        } catch (error) {
            console.error("Could not fetch today's mood, setting to Neutral default.", error);
        }
    };
    
    React.useEffect(() => {
        fetchCurrentMood();
    }, []);

    const saveMoodToBackend = async (mood) => {
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
                // Handle non-2xx status codes
                throw new Error('Failed to save mood on the server.');
            }
            
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

    const displayMood = MOOD_DATA.find(m => m.name === currentMood);

    return (
        <div className="mood-card">
            <h2>{t("dashboard.mood")}</h2>
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
                    <img src={emotionImg} alt="Emotion" />
                    <h3>I Feel {displayMood ? displayMood.name : 'Neutral'}</h3>
                </div>
            </div>
        </div>
    );
};

export default MoodCard;

// ... CSS styles below (omitted for brevity)