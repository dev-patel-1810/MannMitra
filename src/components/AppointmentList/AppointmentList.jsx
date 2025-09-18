import React, { useState, useEffect } from 'react';
import './AppointmentList.css'; // Import the new CSS file

const AppointmentsList = ({ userType }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [userName, setUserName] = useState('');
    
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('user'));
                if (!userInfo || !userInfo._id) {
                    throw new Error('User ID not found in local storage.');
                }
                
                const userId = userInfo._id;
                setUserName(userInfo.name);
                let apiUrl = '';
                if (userType === 'student') {
                    apiUrl = `http://localhost:5000/user/appointments/${userId}`;
                } else if (userType === 'counsellor') {
                    apiUrl = `http://localhost:5000/counsellor/appointments/${userId}`;
                } else {
                    throw new Error('Invalid user type.');
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
    }, [userType]);

    const handleStatusChange = async (appointmentId, newStatus) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('user'));
            const response = await fetch(`http://localhost:5000/counsellor/appointments/status/${appointmentId}`, {
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
            setSuccessMessage('Appointment status updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Failed to update appointment status:', err);
            setError(err.message);
        }
    };

    if (loading) {
        return <p className="loading-message">Loading appointments...</p>;
    }

    if (error) {
        return <p className="error-message">Error: {error}</p>;
    }

    return (
        <div className="appointment-list-container">
            <h2 className="section-title">Your Appointments</h2>
            {successMessage && <div className="success-popup">{successMessage}</div>}
            
            {appointments.length > 0 ? (
                <ul className="appointment-items">
                    {appointments.map(appointment => (
                        <li key={appointment._id} className="appointment-item-card">
                            <div className="appointment-header">
                                {userType === 'student' ? (
                                    <p><strong>Counsellor:</strong> {appointment.counsellor ? appointment.counsellor.counselor_name : 'N/A'}</p>
                                ) : (
                                    <p><strong>Student:</strong> {appointment.student ? appointment.student.user_name : 'N/A'}</p>
                                )}
                                <span className={`status-badge ${appointment.status.toLowerCase()}`}>{appointment.status}</span>
                            </div>
                            <div className="appointment-details-grid">
                                <p><strong>Email:</strong> {userType === 'student' ? (appointment.counsellor ? appointment.counsellor.counselor_email : 'N/A') : (appointment.student ? appointment.student.user_email : 'N/A')}</p>
                                <p><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                                <p><strong>Start Time:</strong> {appointment.startTime}</p>
                                <p><strong>End Time:</strong> {appointment.endTime}</p>
                            </div>
                            
                            {userType === 'counsellor' && (
                                <div className="status-update-section">
                                    <label htmlFor={`status-${appointment._id}`}>Change Status:</label>
                                    <select
                                        id={`status-${appointment._id}`}
                                        value={appointment.status}
                                        onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            )}

                            <div className="appointment-notes">
                                <p><strong>Notes:</strong> {appointment.notes || 'N/A'}</p>
                                <p className="booked-on"><strong>Booked On:</strong> {new Date(appointment.createdAt).toLocaleString()}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You have no appointments scheduled.</p>
            )}
        </div>
    );
};

export default AppointmentsList;