import React, { useState, useEffect } from 'react';
import './Dash_Institute.css';
import { FaUserGraduate, FaUserTie, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';


const ProfileCard = ({ user }) => {
  const { t, i18n } = useTranslation(); 
  const isStudent = user.user_name !== undefined;

  return (
    <div className="profile-card">
      {isStudent ? (
        <div className="profile-content student-profile">
          <div className="profile-header">
            <FaUserGraduate className="profile-icon" />
            <h3 className="profile-title">{t('dashboard.stud_profile')}</h3>
          </div>
          <p className="profile-name">{user.user_name}</p>
          <div className="profile-details">
            <p><span className="detail-label">{t('dashboard.email')}</span> {user.user_email}</p>
            <p><span className="detail-label">{t('dashboard.contact')}:</span> {user.user_contact}</p>
            <p><span className="detail-label">{t('dashboard.user_guardian1')}</span> {user.user_guardian_1_name} ({user.user_guardian_1_contact})</p>
            <p><span className="detail-label">{t('dashboard.user_guardian2')}</span> {user.user_guardian_2_name} ({user.user_guardian_2_contact})</p>
          </div>
        </div>
      ) : (
        <div className="profile-content counsellor-profile">
          <div className="profile-header">
            <FaUserTie className="profile-icon" />
            <h3 className="profile-title">{t('dashboard.counsellor_profile')}</h3>
          </div>
          <p className="profile-name">{user.counselor_name}</p>
          <div className="profile-details">
            <p><span className="detail-label">{t('dashboard.counsellor_specialization')}</span> {user.counselor_specialization}</p>
            <p><span className="detail-label">{t('dashboard.counsellor_experience')}</span> {user.counselor_exp} years</p>
            <p><span className="detail-label">{t('dashboard.counsellor_qualification')}</span> {user.counselor_qualification}</p>
            <p><span className="detail-label">{t('dashboard.email')}</span> {user.counselor_email}</p>
            <p><span className="detail-label">{t('dashboard.contact')}</span> {user.counselor_contact}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const Dash_Institute = () => {
  const { t, i18n } = useTranslation();
  const [students, setStudents] = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clgName, setClgName] = useState('');
  const [userName, setUserName] = useState(''); // Add state for user name
  const [userEmail, setUserEmail] = useState(''); // Add state for user email

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('user'));
        if (!userInfo || !userInfo._id) {
          throw new Error(t('dashboard.user_error'));
        }

        const clgId = userInfo._id;
        setClgName(userInfo.clg_name);
        setUserName(userInfo.name);
        setUserEmail(userInfo.email); // Set the admin's email

        const response = await fetch(`http://localhost:5000/admin/studentAndUser/${clgId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        setStudents(data.data.users); 
        setCounsellors(data.data.counsellors); 

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
        <p>{t('dashboard.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <FaExclamationTriangle className="error-icon" />
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Language dropdown at the true top right of dashboard */}
      <div className="dashboard-lang-select">
        <select
          className="language-select"
          value={typeof window !== 'undefined' ? localStorage.getItem('appLanguage') || 'en' : 'en'}
          onChange={e => {
            const lang = e.target.value;
            if (typeof window !== 'undefined') localStorage.setItem('appLanguage', lang);
            if (i18n.language !== lang) i18n.changeLanguage(lang);
          }}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="doi">Dogri</option>
        </select>
      </div>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">{t('dashboard.dashboard')}</h1>
          <p className="dashboard-subtitle">
            {t('dashboard.welcome1')}<span className="college-name">{clgName}</span>{t('dashboard.welcome2')}
          </p>
          <div className="admin-info">
            <p className="admin-detail"><span className="detail-label">{t('dashboard.admin_name')}</span> {userName}</p>
            <p className="admin-detail"><span className="detail-label">{t('dashboard.admin_email')}</span> {userEmail}</p>
          </div>
        </div>

        <section className="dashboard-section">
          <h2 className="section-title">{t('dashboard.Students')} ({students.length})</h2>
          {students.length > 0 ? (
            <div className="grid-container">
              {students.map((student, index) => (
                <ProfileCard key={index} user={student} />
              ))}
            </div>
          ) : (
            <p className="no-data-message">{t('dashboard.no_stud')}</p>
          )}
        </section>

        <section className="dashboard-section">
          <h2 className="section-title">{t('modal.counsellorTitle')} ({counsellors.length})</h2>
          {counsellors.length > 0 ? (
            <div className="grid-container">
              {counsellors.map((counsellor, index) => (
                <ProfileCard key={index} user={counsellor} />
              ))}
            </div>
          ) : (
            <p className="no-data-message">{t('dashboard.no_counsellor')}</p>
          )}
        </section>
      </div>
    </>
  );
}
export default Dash_Institute;