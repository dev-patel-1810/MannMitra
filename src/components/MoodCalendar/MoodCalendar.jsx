import React, { useEffect, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import './MoodCalendar.css'; 
import { t } from 'i18next';

// 💡 Assuming you moved these to a utility file like '../../utils/dateUtils'
// If not, put the helper functions back here for now:
const getSafeUTCDateKey = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null; 
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
const getCalendarDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
// END OF HELPER INCLUSION

// Define color mapping (using subtle pastels)
const MOOD_COLORS = {
    'Angry': '#ffcccb4d',   // Light Red
    'Sad': '#add8e64d',     // Light Blue
    'Neutral': '#fdfd964d', // Light Yellow
    'Happy': '#90ee904d',   // Light Green
    'Excited': '#ffb3ff4d', // Light Pink/Purple
    'default': 'transparent'
};


const MoodCalendar = ({ isOpen, onClose, MOOD_DATA, UserMoodHistory }) => {
    
    const today = new Date();
    // Normalize 'today' to the start of the day for consistent filtering
    today.setHours(0, 0, 0, 0); 
    
    const thirtyDaysAgo = new Date(today.getTime());
    thirtyDaysAgo.setDate(today.getDate() - 29); // 30 days including today


    const moodHistoryMap = useMemo(() => {
        if (!UserMoodHistory || UserMoodHistory.length === 0) return {};

        return UserMoodHistory.reduce((acc, entry) => {
            const entryDate = new Date(entry.mood_date); 
            // Normalize entryDate to start of day for accurate comparison
            entryDate.setHours(0, 0, 0, 0); 
            
            const dateKey = getSafeUTCDateKey(entry.mood_date); 

            // Filter by 30 days AND ensure we have a valid key
            if (entryDate >= thirtyDaysAgo && entryDate <= today && dateKey) {
                acc[dateKey] = entry.mood_value;
            }
            return acc;
        }, {});
    }, [UserMoodHistory, isOpen]);


    // Close modal on Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);


    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateKey = getCalendarDateKey(date); 
            const mood = moodHistoryMap[dateKey];

            if (mood) {
                const moodEntry = MOOD_DATA.find(m => m.name === mood);
                
                return (
                    // The emoji overlay
                    <div className="mood-calendar-tile" title={`${t('mood')}: ${t(mood)}`}>
                        <img 
                            src={moodEntry.image} 
                            alt={moodEntry.name} 
                            className="mood-emoji-small" 
                        />
                    </div>
                );
            }
        }
        return null;
    };

    // 💡 NEW: Apply background color based on mood
    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const dateKey = getCalendarDateKey(date);
            const mood = moodHistoryMap[dateKey];
            
            // Check if the date is outside the 30-day range
            const normalizedDate = new Date(date.getTime());
            normalizedDate.setHours(0, 0, 0, 0);

            if (normalizedDate < thirtyDaysAgo || normalizedDate > today) {
                 // Return class to hide dates outside the 30-day view
                 return 'date-out-of-range';
            }

            if (mood) {
                // Return a class name that uses the mood name for styling
                return `mood-bg-${mood.toLowerCase()}`;
            }
        }
        return null;
    };


    if (!isOpen) return null;

    return (
        <div className="mood-calendar-modal-overlay" onClick={onClose}>
            <div className="mood-calendar-modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose}>&times;</button>
                <h2>{t("dashboard.mood_history")} (Last 30 Days)</h2>
                {UserMoodHistory.length === 0 && Object.keys(moodHistoryMap).length === 0 ? (
                    <div className="empty-state">No mood entries found for the last 30 days.</div>
                ) : (
                    <Calendar
                        // 💡 DISABLE NAVIGATION
                        showNavigation={false} 
                        
                        tileContent={tileContent}
                        tileClassName={tileClassName} // Apply mood background class
                        
                        // Set the range for navigation restriction
                        maxDate={today}
                        minDate={thirtyDaysAgo} 
                        
                        // Force the calendar to display the month containing the current date
                        value={today} 
                        
                        className="mood-calendar"
                    />
                )}
            </div>
        </div>
    );
};

export default MoodCalendar;