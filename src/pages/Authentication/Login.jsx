import { useState } from 'react';
import Modal from '../../components/Modal/Modal';
import './Authentication.css';
import {useNavigate} from 'react-router-dom';
import { t } from 'i18next';

const Login = () => {
  const navigate=useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: ''
  });

  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      userType: ''
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:5000/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || t('login.login_fail'));
          return;
        }

        // Store user data and redirect
        localStorage.setItem('user', JSON.stringify(data.data));
        
        // Redirect based on userType
        switch(formData.userType.toLowerCase()) {
          case 'student':
            navigate('/dashboard/student');
            break;
          case 'counsellor':
            navigate('/dashboard/counsellor');
            break;
          case 'institute':
            navigate('/dashboard/institute');
            break;
          default:
            window.location.href = '/';
        }

      } catch (error) {
        console.error('Login error:', error);
        alert('Network error!');
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
                <option value="" >{t('login.user_type')}</option>
                <option value="student">{t('login.student')}</option>
                <option value="counsellor">{t('login.counsellor')}</option>
                <option value="institute">{t('login.institute')}</option>
              </select>
              {errors.userType && <span className="error-message">{errors.userType}</span>}
            </div>

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
              {t('login.no_account')} <h6 onClick={() => setIsModalOpen(true)}>{t('common.signup')}</h6>
            </div>
          </form>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Login;