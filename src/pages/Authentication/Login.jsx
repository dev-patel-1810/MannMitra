import { useState } from 'react';
import Modal from '../../components/Modal/Modal';
import AlertModal from '../../components/AlertModal/AlertModal'; 
import './Authentication.css';
import { useNavigate } from 'react-router-dom';
import { t } from 'i18next'; 

const Login = () => {
  const navigate = useNavigate();
  
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: '',
    instituteName: ''
  });

  const [errors, setErrors] = useState({});

  const openAlertModal = (message) => {
    setAlertMessage(message);
    setIsAlertModalOpen(true);
  };

  const closeAlertModal = () => {
    setIsAlertModalOpen(false);
    setAlertMessage('');
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      userType: '',
      instituteName: ''
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = t('common.email');
    if (!formData.password.trim()) newErrors.password = t('common.password_req');
    if (!formData.userType) newErrors.userType = t('login.user_type');
    if (formData.password.length < 8) newErrors.password = t('login.invalid_pass');
    
    if (formData.userType.toLowerCase() === 'institute' && !formData.instituteName.trim()) {
      newErrors.instituteName = t('login.institute_name_req');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const payload = {
          email: formData.email,
          password: formData.password,
          userType: formData.userType
        };
        if (formData.userType.toLowerCase() === 'institute') {
          payload.instituteName = formData.instituteName;
        }

        const response = await fetch('https://mannmitra-v141.onrender.com/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include', // This is crucial for cookies to be sent and received
          body: JSON.stringify(payload)
        });

        let data = null;
        try {
            data = await response.json();
        } catch (jsonError) {
            if (!response.ok) {
              openAlertModal('Login failed! Server error response was unreadable. Status: ' + response.status);
              return;
            }
            throw new Error('Login successful but failed to parse response data.');
        }
        if (!response.ok) {
          setIsSignupModalOpen(false);           
          openAlertModal(data.message || `Login failed with status: ${response.status}. Please check your credentials.`);
          return;
        }

        // --- SUCCESS LOGIC ---
        // Store user data in localStorage (cookies are already set by the server)
        // Note: We're storing tokens in localStorage as a fallback, but the cookies will be used primarily
        const userData = data.data;
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Also store tokens in localStorage as a backup mechanism
        if (userData.accessToken) {
          localStorage.setItem('accessToken', userData.accessToken);
        }
        if (userData.refreshToken) {
          localStorage.setItem('refreshToken', userData.refreshToken);
        }
        
        // Redirect to the appropriate dashboard based on user type
        const userType = data.data.userType.toLowerCase();
        if (userType === 'student') {
          navigate('/dashboard/student');
        } else if (userType === 'counsellor') {
          navigate('/dashboard/counsellor');
        } else if (userType === 'institute') {
          navigate('/dashboard/institute');
        } else {
          openAlertModal('Unknown user type. Please contact support.');
        }
      } catch (error) {
        
        console.error('Login error (Network Failure/Unexpected):', error);
        
        setIsSignupModalOpen(false); 
        openAlertModal(error.message || 'Network error! Could not connect to the server.');
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <div className="signup-image">
          <h1>{t('login.welcome')}</h1>
          <p>{t('login.welcome2')}</p>
        </div>
        
        <div className="signup-form">
          <h2>{t('login.welcome')}</h2>
          <form onSubmit={handleSubmit}>
            <div className="user-type-selector">
              <select
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                className={`dropdown-select ${errors.userType ? 'error' : ''}`}
              >
                <option value="">{t('login.user_type')}</option>
                <option value="student">{t('login.student')}</option>
                <option value="counsellor">{t('login.counsellor')}</option>
                <option value="institute">{t('login.institute')}</option>
              </select>
              {errors.userType && <span className="error-message">{errors.userType}</span>}
            </div>

            {/* Conditionally render the institute name input */}
            {formData.userType.toLowerCase() === 'institute' && (
              <div className="login-field">
                <input
                  type="text"
                  name="instituteName"
                  placeholder={t('login.institute_name')}
                  value={formData.instituteName}
                  onChange={handleInputChange}
                  className={errors.instituteName ? 'error' : ''}
                />
                {errors.instituteName && <span className="error-message">{errors.instituteName}</span>}
              </div>
            )}

            <div className="login-field">
              <input
                type="email"
                name="email"
                placeholder={t('login.email')}
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="login-field">
              <input
                type="password"
                name="password"
                placeholder={t('login.password')}
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="forgot-password-link">
              <a href="/forgot-password">{t('login.forgot_password')}</a>
            </div>

            <button type="submit" className="signup-button">{t('login.login')}</button>

            <div className="alternate-action">
              {t('login.no_account')} <h6 onClick={() => setIsSignupModalOpen(true)}>{t('common.signup')}</h6>
            </div>
          </form>
        </div>
      </div>

      {/* Existing Modal for Signup */}
      <Modal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
      />

      {/* New Modal for Alerts/Errors using AlertModal component */}
      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={closeAlertModal}
        message={alertMessage}
        title="Login Error" // Static English Title
        buttonText="Close"   // Static English Button Text
      />
    </div>
  );
};

export default Login;