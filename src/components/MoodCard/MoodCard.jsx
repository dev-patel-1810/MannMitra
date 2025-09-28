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
    const userId = JSON.parse(localStorage.getItem('user'))?.['\_id']

    const fetchCurrentMood = async () => {
        if (!userId) {
            console.error("User ID not found in localStorage.");
            return;
        }
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

            // Logic to set mood from fetched data
            if (todayMoodEntry) {
                const moodValue = todayMoodEntry.mood_value;
                const moodEntry = MOOD_DATA.find(m => m.name === moodValue);

                if (moodEntry) {
                    setCurrentMood(moodEntry.name);
                    setPointerRotation(moodEntry.rotation);
                }
            } else {
                // Set default to Neutral if no entry is found
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
        fetchCurrentMood();
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

    // 3. FIND THE CURRENT MOOD DATA OBJECT
    const displayMood = MOOD_DATA.find(m => m.name === currentMood) || MOOD_DATA.find(m => m.name === 'Neutral');

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

                {/* 4. USE THE CORRECT IMAGE PATH FROM THE displayMood OBJECT */}
                <div className='emoji'>
                    <img src={displayMood.image} alt={`${displayMood.name} Emotion`} />
                    <h3>I Feel {displayMood.name}</h3>
                </div>
            </div>
        </div>
    );
};

export default MoodCard;