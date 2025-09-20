import { useState, useEffect } from 'react';
import './AppointmentBooking.css';
import AppointmentList from '../../components/AppointmentList/AppointmentList'
import { toast } from 'react-toastify';

const AppointmentBooking = () => {
    const [counsellors, setCounsellors] = useState([]);
    const [userCollege, setUserCollege] = useState(null);
    const [selectedCounsellor, setSelectedCounsellor] = useState(null);
    const [userName, setUserName] = useState('');

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
            toast.error('Error fetching user details');
        }
    };

    const fetchCounsellors = async () => {
        try {
            const response = await fetch('http://localhost:5000/counsellors');
            const data = await response.json();
            setCounsellors(data.data);
        } catch (error) {
            toast.error('Error fetching counsellors');
        }
    };

    const handleCounsellorSelect = (counsellor) => {
        setSelectedCounsellor(counsellor);
        setFormData(prev => ({
            ...prev,
            counsellorId: counsellor._id
        }));
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
                toast.error(data.message || 'Failed to book appointment');
                return;
            }

            toast.success('Appointment booked successfully');
            setFormData({
                counsellorId: '',
                appointmentDate: '',
                startTime: '',
                endTime: '',
                notes: ''
            });
            setSelectedCounsellor(null);
        } catch (error) {
            toast.error('Error booking appointment');
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
                <h2 className="section-title">Book a New Appointment</h2>
                
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
                                    <span className="same-college-badge">Your Institute</span>
                                )}
                            </div>
                            <div className="counsellor-details">
                                <p><strong>Specialization:</strong> {counsellor.counselor_specialization}</p>
                                <p><strong>Experience:</strong> {counsellor.counselor_exp} years</p>
                                <p><strong>Institute:</strong> {counsellor.counselor_clg_name || 'Independent'}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedCounsellor && (
                    <div className="booking-form-container">
                        <h3 className="form-title">Book an Appointment with {selectedCounsellor.counselor_name}</h3>
                        <form onSubmit={handleSubmit} className="appointment-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date:</label>
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
                                    <label>Start Time:</label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>End Time:</label>
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
                                <label>Notes:</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    placeholder="Add any notes or concerns..."
                                    rows="4"
                                />
                            </div>
                            <button type="submit" className="book-button">Book Appointment</button>
                        </form>
                    </div>
                )}
            </div>
            
            <div className="appointments-list-section">
                <AppointmentList userType="student" />
            </div>
        </div>
    );
};

export default AppointmentBooking;