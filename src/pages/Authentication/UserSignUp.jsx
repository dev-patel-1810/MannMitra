import { useState } from 'react';
import GuardianConfirmModal from '../../components/GuardianConfirmModal/GuardianConfirmModal';
import pic from '../../assets/signup.png';
import './Authentication.css';
import { useTranslation } from 'react-i18next';
import { FaCreativeCommons } from 'react-icons/fa';

const UserSignUp = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    pinCode: '',
    guardian1Name: '',
    guardian1Contact: '',
    guardian2Name: '',
    guardian2Contact: '',
    noGuardianInfo: false,
    password: '',
    confirmPassword: '',
    collegeId: ''
  });

  const [errors, setErrors] = useState({});
  const [showGuardianModal, setShowGuardianModal] = useState(false);
  const [guardianChoice, setGuardianChoice] = useState('');
  const [showGuardianFields, setShowGuardianFields] = useState(false);

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      phoneNumber: '',
      pinCode: '',
      guardian1Name: '',
      guardian1Contact: '',
      guardian2Name: '',
      guardian2Contact: '',
      noGuardianInfo: false,
      password: '',
      confirmPassword: '',
      collegeId: ''
    });
    setGuardianChoice('');
    setShowGuardianFields(false);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleGuardianChange = (e) => {
    const value = e.target.value;
    setGuardianChoice(value);
    
    if (value === 'none') {
      setShowGuardianModal(true);
      setShowGuardianFields(false);
      // Reset noGuardianInfo to false until modal is confirmed
      setFormData(prev => ({ ...prev, noGuardianInfo: false }));
    } else if (value === 'show') {
      setShowGuardianFields(true);
      setShowGuardianModal(false);
      setFormData(prev => ({ ...prev, noGuardianInfo: false }));
    } else {
      setShowGuardianFields(false);
      setFormData(prev => ({ ...prev, noGuardianInfo: false }));
    }

    // Clear guardian related errors
    setErrors(prev => ({
      ...prev,
      guardian: '',
      guardian1: ''
    }));
  };

  const handleGuardianModalConfirm = () => {
    setShowGuardianModal(false);
    setFormData(prev => ({ ...prev, noGuardianInfo: true }));
  };

  const handleGuardianModalClose = () => {
    setShowGuardianModal(false);
    setGuardianChoice('');
    setFormData(prev => ({ ...prev, noGuardianInfo: false }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validations
    if (!formData.username.trim()) newErrors.username = t('common.username');
    if (!formData.email.trim()) newErrors.email = t('common.email');
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = t('common.phonenumber');
    if (!formData.pinCode.trim()) newErrors.pinCode = t('common.pincode');
    
    // Password validations
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!formData.password) {
      newErrors.password = t('common.pass_req');
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = t('common.pass_condition');
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('common.confirm_pass');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('common.pass_mismatch');
    }

    // Guardian validation
    if (!guardianChoice) {
      newErrors.guardian = t('user.guardian');
    }

    if (guardianChoice === 'show') {
      if (!formData.guardian1Name.trim() || !formData.guardian1Contact.trim()) {
        newErrors.guardian1 = t('user.guardian_permission');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    console.log("User Signup : \n");
    console.log(formData);
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:5000/user-signup/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.message || t('common.signup_fail'));
          return;
        }

        // Reset form after successful submission
        
        resetForm();
        alert(t('common.user_success'));
      } catch (error) {
        // console.log(error);
        alert(t('common.error'));
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <div className="signup-image">
          <h1>{t('common.welcome')}</h1>
          <p>{('common.welcome2')}</p>
        </div>
        
        <div className="signup-form">
          <h2>{t('user.create_acc')}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username *"
              value={formData.username}
              onChange={handleInputChange}
              className={errors.username ? 'error' : ''}
            />
            {errors.username && <span className="error-message">{errors.username}</span>}

            <input
              type="email"
              name="email"
              placeholder={t('user.email')}
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}

            <div className="phone-input">
              <select>
                <option value="+91">+91</option>
              </select>
              <input
                type="tel"
                name="phoneNumber"
                placeholder={t('user.phonenumber')}
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={errors.phoneNumber ? 'error' : ''}
              />
            </div>
            {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}

            <input
              type="text"
              name="pinCode"
              placeholder={t('user.pincode')}
              value={formData.pinCode}
              onChange={handleInputChange}
              className={errors.pinCode ? 'error' : ''}
            />
            {errors.pinCode && <span className="error-message">{errors.pinCode}</span>}

            <div className="guardian-section">
              <select 
                onChange={handleGuardianChange}
                className={`guardian-dropdown ${errors.guardian ? 'error' : ''}`}
                value={guardianChoice}
              >
                <option value="">{t('user.guardian_detail')}</option>
                <option value="show">{t('user.guardian_info')}</option>
                <option value="none">{t('user.no_guardian')}</option>
              </select>
              {errors.guardian && <span className="error-message">{errors.guardian}</span>}

              {showGuardianFields && (
                <div className="guardian-fields">
                  <div className="guardian-row">
                    <input
                      type="text"
                      name="guardian1Name"
                      placeholder={t('user.guardian1name')}
                      value={formData.guardian1Name}
                      onChange={handleInputChange}
                      className={errors.guardian1 ? 'error' : ''}
                    />
                    <input
                      type="text"
                      name="guardian1Contact"
                      placeholder={t('user.guardian1Contact')}
                      value={formData.guardian1Contact}
                      onChange={handleInputChange}
                      className={errors.guardian1 ? 'error' : ''}
                    />
                  </div>
                  {errors.guardian1 && <span className="error-message">{errors.guardian1}</span>}
                  <div className="guardian-row">
                    <input
                      type="text"
                      name="guardian2Name"
                      placeholder={t('user.guardian2name')}
                      value={formData.guardian2Name}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="guardian2Contact"
                      placeholder={t('user.guardian2contact')}
                      value={formData.guardian2Contact}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}
            </div>

            <input
              type="password"
              name="password"
              placeholder={t('user.password')}
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}

            <input
              type="password"
              name="confirmPassword"
              placeholder={t('user.confirm_password')}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}

            <input
              type="text"
              name="collegeId"
              placeholder={t('user.clg_id')}
              value={formData.collegeId}
              onChange={handleInputChange}
            />

            <div className="terms">
              <p>{t('common.privacypolicy')}</p>
            </div>

            <button type="submit" className="signup-button">{t('common.signup')}</button>

            <div className="login-link">
              {t('common.have_account')} <a href="/login">{t('common.login')}</a>
            </div>
            
            <GuardianConfirmModal
              isOpen={showGuardianModal}
              onClose={handleGuardianModalClose}
              onConfirm={handleGuardianModalConfirm}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserSignUp;