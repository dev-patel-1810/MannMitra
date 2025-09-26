import { useState, useEffect } from 'react';
import './AppointmentBooking.css';
import AppointmentList from '../../components/AppointmentList/AppointmentList'
import AlertModal from '../../components/AlertModal/AlertModal'; // Import the AlertModal
import { toast } from 'react-toastify';
import { useTranslation} from 'react-i18next';
import { t } from 'i18next';

function About() {
  const { t } = useTranslation();
}

const AppointmentBooking = () => {
    const [counsellors, setCounsellors] = useState([]);
    const [userCollege, setUserCollege] = useState(null);
    const [selectedCounsellor, setSelectedCounsellor] = useState(null);
    const [userName, setUserName] = useState('');
    
    // AlertModal state
    const [alertModal, setAlertModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        buttonText: 'Close'
    });

    const [formData, setFormData] = useState({
        counsellorId: '',
        appointmentDate: '',
        startTime: '',
        endTime: '',
        notes: ''
    });

    useEffect(() => {
        fetchUserDetails();
        fetchCounsellors();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                setUserName(user.name);
            }
            const response = await fetch(`http://localhost:5000/user/${user._id}`);
            const userData = await response.json();
            // Assuming the user data has a collegeId string
            if (userData.data.user_clg_id) {
                setUserCollege(userData.data.user_clg_id);
            }
            
        } catch (error) {
            toast.error(t('appointment.fetch_user_error'));
        }
    };

    const fetchCounsellors = async () => {
        try {
            const response = await fetch('http://localhost:5000/counsellors');
            const data = await response.json();
            setCounsellors(data.data);
        } catch (error) {
            toast.error('appointment.fetch_counsellor_error');
        }
    };

    const handleCounsellorSelect = (counsellor) => {
        setSelectedCounsellor(counsellor);
        setFormData(prev => ({
            ...prev,
            counsellorId: counsellor._id
        }));
    };

    // Function to show alert modal
    const showAlertModal = (title, message, buttonText = 'Close') => {
        setAlertModal({
            isOpen: true,
            title,
            message,
            buttonText
        });
    };

    // Function to close alert modal
    const closeAlertModal = () => {
        setAlertModal({
            isOpen: false,
            title: '',
            message: '',
            buttonText: 'Close'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await fetch('http://localhost:5000/appointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userId: user._id
                })
            });
            const data = await response.json();

            if (!response.ok) {
                // Use AlertModal instead of toast for errors
                showAlertModal(
                    t('appointment.booking_failed') || 'Booking Failed',
                    data.message || t('appointment.fail') || 'Failed to book appointment. Please try again.',
                    t('common.ok') || 'OK'
                );
                return;
            }

            toast.success(t('appointment.success'));
            setFormData({
                counsellorId: '',
                appointmentDate: '',
                startTime: '',
                endTime: '',
                notes: ''
            });
            setSelectedCounsellor(null);
        } catch (error) {
            // You can also use AlertModal for network errors if preferred
            showAlertModal(
                t('appointment.error_title') || 'Network Error',
                t('appointment.error') || 'Unable to process your request. Please check your connection and try again.',
                t('common.retry') || 'Retry'
            );
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="main-appointment-page-container">
            <div className="booking-section">
                <h1 className="welcome-heading">Hello, {userName}!</h1>
                <h2 className="section-title">{t('appointment.book_appointment')}</h2>
                
                <div className="counsellors-grid">
                    {counsellors.map(counsellor => (
                        <div 
                            key={counsellor._id} 
                            className={`counsellor-card ${
                                userCollege && counsellor.counselor_clg_id === userCollege ? 'same-college' : ''
                            } ${selectedCounsellor?._id === counsellor._id ? 'selected' : ''}`}
                            onClick={() => handleCounsellorSelect(counsellor)}
                        >
                            <div className="counsellor-header">
                                <h3>{counsellor.counselor_name}</h3>
                                {userCollege && counsellor.counselor_clg_id === userCollege && (
                                    <span className="same-college-badge">{t('appointment.your_institute')}</span>
                                )}
                            </div>
                            <div className="counsellor-details">
                                <p><strong>{t('dashboard.counsellor_specialization')}</strong> {counsellor.counselor_specialization}</p>
                                <p><strong>{t('dashboard.counsellor_experience')}</strong> {counsellor.counselor_exp} years</p>
                                <p><strong>{t('appointment.institute')}</strong> {counsellor.counselor_clg_name || 'Independent'}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedCounsellor && (
                    <div className="booking-form-container">
                        <h3 className="form-title">{t('appointment.appointment_with')} {selectedCounsellor.counselor_name}</h3>
                        <form onSubmit={handleSubmit} className="appointment-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>{t('appointment.date')}:</label>
                                    <input
                                        type="date"
                                        name="appointmentDate"
                                        value={formData.appointmentDate}
                                        onChange={handleInputChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('appointment.start')}</label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('appointment.end')}</label>
                                    <input
                                        type="time"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>{t('appointment.notes')}:</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    placeholder={t('appointment.note')}
                                    rows="4"
                                />
                            </div>
                            <button type="submit" className="book-button">{t('appointment.book')}</button>
                        </form>
                    </div>
                )}
            </div>
            
            <div className="appointments-list-section">
                <AppointmentList userType="student" />
            </div>

            {/* AlertModal for error handling */}
            <AlertModal
                isOpen={alertModal.isOpen}
                onClose={closeAlertModal}
                title="Appointment Error"
                message={alertModal.message}
                buttonText={alertModal.buttonText}
            />
        </div>
    );
};

export default AppointmentBooking;