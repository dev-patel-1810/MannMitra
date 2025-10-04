import React, { useState, useEffect } from 'react';
import './AppointmentList.css'; 
import { useTranslation } from 'react-i18next';
import MoodCalendar from '../MoodCalendar/MoodCalendar'; // Assuming MoodCalendar is in the same directory or adjust the path

// --- Mood Data (Kept for reference, but imported components should use it) ---
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
    { name : 'NotSet', rotation: 90, image: undefined }
];
// ----------------------------------------------------------------------------


// New Component to display Test Data (for better separation)
const StudentTestSummary = ({ tests }) => {
    const { t } = useTranslation();
    if (!tests || tests.length === 0) {
        return <p className="test-summary no-data"><strong>{t('dashboard.test_data')}:</strong> {t('dashboard.no_tests_recorded')}</p>;
    }

    // Get the most recent test
    const sortedTests = [...tests].sort((a, b) => new Date(b.test_date) - new Date(a.test_date));
    const latestTest = sortedTests[0];

    return (
        <div className="test-summary">
            <h4>{t('dashboard.latest_test_results')}</h4>
            <p><strong>{t('dashboard.test_name')}:</strong> {latestTest.test_name}</p>
            <p><strong>{t('dashboard.test_score')}:</strong> {latestTest.test_score}</p>
            <p><strong>{t('dashboard.test_date')}:</strong> {new Date(latestTest.test_date).toLocaleDateString()}</p>
            <p><strong>{t('dashboard.risk_status')}:</strong> 
                <span className={`risk-badge ${latestTest.test_riskStatus.toLowerCase()}`}>
                    {t(latestTest.test_riskStatus)}
                </span>
            </p>
            {latestTest.test_result_description && (
                <p className="test-description"><strong>{t('dashboard.description')}:</strong> {latestTest.test_result_description}</p>
            )}
        </div>
    );
};


const AppointmentsList = ({ userType }) => {
    const { t } = useTranslation();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [counsellorCollegeId, setCounsellorCollegeId] = useState('');
    
    // 👇 NEW STATE for Mood Calendar Modal
    const [isMoodCalendarOpen, setIsMoodCalendarOpen] = useState(false);
    const [selectedStudentMoodHistory, setSelectedStudentMoodHistory] = useState([]);


    // 💡 Function to open the Mood Calendar Modal
    const openMoodCalendar = (moodHistory) => {
        setSelectedStudentMoodHistory(moodHistory);
        setIsMoodCalendarOpen(true);
    };

    // 💡 Function to close the Mood Calendar Modal
    const closeMoodCalendar = () => {
        setIsMoodCalendarOpen(false);
        setSelectedStudentMoodHistory([]);
    };


    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('user'));
                
                if (!userInfo || !userInfo._id) {
                    throw new Error(t('dashboard.user_error'));
                }

                const userId = userInfo._id;
                
                if (userType === 'counsellor') {
                    const counselorResponse = await fetch(`https://mannmitra-v141.onrender.com/counsellor/${userId}`);
                    if (!counselorResponse.ok) {
                        throw new Error(`HTTP error! status: ${counselorResponse.status}`);
                    }
                    const counselorData = await counselorResponse.json();
                    setCounsellorCollegeId(counselorData.data.counselor_clg_id);
                }

                let apiUrl = '';
                if (userType === 'student') {
                    apiUrl = `https://mannmitra-v141.onrender.com/user/appointments/${userId}`;
                } else if (userType === 'counsellor') {
                    // API endpoint already fetches student data with mood and tests
                    apiUrl = `https://mannmitra-v141.onrender.com/counsellor/appointments/${userId}`; 
                } else {
                    throw new Error(t('dashboard.invalid_user_type'));
                }

                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setAppointments(data.data);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [userType, t]); // Added 't' to dependency array

    const handleStatusChange = async (appointmentId, newStatus) => {
        // ... (Status change logic remains the same)
        try {
            const userInfo = JSON.parse(localStorage.getItem('user'));
            const response = await fetch(`https://mannmitra-v141.onrender.com/counsellor/appointments/status/${appointmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus, userId: userInfo._id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setAppointments(prevAppointments =>
                prevAppointments.map(app => 
                    app._id === appointmentId ? { ...app, status: newStatus } : app
                )
            );
            setSuccessMessage(t('dashboard.appointment_status_updated'));
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error(t('dashboard.failed_update_appointment_status'), err);
            setError(err.message);
        }
    };

    if (loading) {
        return <p className="loading-message">{(t('dashboard.loading'))}</p>;
    }

    if (error) {
        return <p className="error-message">{(t('dashboard.error'))}: {error}</p>;
    }

    return (
        <>
            <div className="appointment-list-container">
                <h2 className="section-title">{(t('dashboard.appointments'))}</h2>
                {successMessage && <div className="success-popup">{successMessage}</div>}
                
                {appointments.length > 0 ? (
                    <ul className="appointment-items">
                        {appointments.map(appointment => (
                            <li 
                                key={appointment._id} 
                                className={`appointment-item-card ${userType === 'counsellor' && appointment.student && counsellorCollegeId === appointment.student.user_clg_id ? 'same-college' : ''}`}
                            >
                                <div className="appointment-header">
                                    {userType === 'student' ? (
                                        <p><strong>{(t('dashboard.counsellor'))}:</strong> {appointment.counsellor ? appointment.counsellor.counselor_name : 'N/A'}</p>
                                    ) : (
                                        <p>
                                            <span className="student-header">
                                                <strong>{(t('dashboard.student'))}:</strong> 
                                                <span>{appointment.student ? appointment.student.user_name : 'N/A'}</span>
                                                {counsellorCollegeId && appointment.student && counsellorCollegeId === appointment.student.user_clg_id && (
                                                    <span className="same-college-badge">{(t('dashboard.same_college'))}</span>
                                                )}
                                            </span>
                                        </p>
                                    )}
                                    <span className={`status-badge ${appointment.status.toLowerCase()}`}>{appointment.status}</span>
                                </div>
                                <div className="appointment-details-grid">
                                    <p><strong>{(t('dashboard.email'))}:</strong> {userType === 'student' ? (appointment.counsellor ? appointment.counsellor.counselor_email : 'N/A') : (appointment.student ? appointment.student.user_email : 'N/A')}</p>
                                    {userType === 'counsellor' && appointment.student && appointment.student.user_clg_name && (
                                        <p><strong>{(t('dashboard.college'))}:</strong> {appointment.student.user_clg_name}</p>
                                    )}
                                    <p><strong>{(t('dashboard.date'))}:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                                    <p><strong>{(t('dashboard.start_time'))}:</strong> {appointment.startTime}</p>
                                    <p><strong>{(t('dashboard.end_time'))}:</strong> {appointment.endTime}</p> 
                                </div>
                                
                                {userType === 'counsellor' && appointment.student && (
                                    <div className="counsellor-tools-section">
                                        
                                        {/* 👇 MOOD HISTORY BUTTON */}
                                        <button 
                                            className="view-mood-btn"
                                            onClick={() => openMoodCalendar(appointment.student.user_mood)}
                                            title={t('dashboard.view_student_mood_history')}
                                        >
                                            <span role="img" aria-label="calendar">📅</span> {t('dashboard.view_mood_history')}
                                        </button>

                                        {/* 👇 STUDENT TEST DATA */}
                                        <StudentTestSummary tests={appointment.student.user_tests} />
                                    </div>
                                )}


                                {userType === 'counsellor' && (
                                    <div className="status-update-section">
                                        <label htmlFor={`status-${appointment._id}`}>{(t('dashboard.change_status'))}:</label>
                                        <select
                                            id={`status-${appointment._id}`}
                                            value={appointment.status}
                                            onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                                        >
                                            <option value="pending">{(t('dashboard.pending'))}</option>
                                            <option value="confirmed">{(t('dashboard.confirmed'))}</option>
                                            <option value="cancelled">{(t('dashboard.cancelled'))}</option>
                                            <option value="completed">{(t('dashboard.completed'))}</option>
                                        </select>
                                    </div>
                                )}

                                <div className="appointment-notes">
                                    <p><strong>{(t('dashboard.notes'))}:</strong> {appointment.notes || 'N/A'}</p>
                                    <p className="booked-on"><strong>{(t('dashboard.booked_on'))}:</strong> {new Date(appointment.createdAt).toLocaleString()}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>{(t('dashboard.no_appointments'))}</p>
                )}
            </div>
            
            {/* 👇 MOOD CALENDAR MODAL */}
            <MoodCalendar 
                isOpen={isMoodCalendarOpen} 
                onClose={closeMoodCalendar} 
                MOOD_DATA={MOOD_DATA} 
                UserMoodHistory={selectedStudentMoodHistory} 
            />
        </>
    );
};

export default AppointmentsList;