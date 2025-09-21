import { useState } from 'react';
import './Authentication.css';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

function About() {
  const { t } = useTranslation();
}
const CollegeSignUp = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    collegeName: '',
    collegeType: '',
    state: '',
    pinCode: '',
    adminName: '',
    adminDesignation: '',
    email: '',
    phoneNumber: '',
    studentId: '',
    counsellorId: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setFormData({
      collegeName: '',
      collegeType: '',
      state: '',
      pinCode: '',
      adminName: '',
      adminDesignation: '',
      email: '',
      phoneNumber: '',
      studentId: '',
      counsellorId: '',
      password: '',
      confirmPassword: ''
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
    if (!formData.collegeName.trim()) newErrors.collegeName = t('clg_signup.clg_name');
    if (!formData.collegeType.trim()) newErrors.collegeType = t('clg_signup.clg_type');
    if (!formData.state.trim()) newErrors.state = t('common.state');
    if (!formData.pinCode.trim()) newErrors.pinCode = t('common.pincode');
    if (!formData.adminName.trim()) newErrors.adminName = t('clg_signup.name');
    if (!formData.adminDesignation.trim()) newErrors.adminDesignation = t('clg_signup');
    if (!formData.email.trim()) newErrors.email = t('common.email');
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = t('common.phonenumber');
    if (!formData.studentId.trim()) newErrors.studentId = "Student ID is required";
    if (!formData.counsellorId.trim()) newErrors.counsellorId = "Counsellor ID is required";

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    console.log("College Signup : \n");
    console.log(formData);
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:5000/college-signup/', {
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

        resetForm();
        alert(t('common.success'));
      } catch (error) {
        alert(t('common.error'));
      }
    }
  };
  return (
    <div className="signup-container">
      <div className="signup-content">
        <div className="signup-image">
          <h1>{t('common.welcome')}</h1>
          <p>{t('common.welcome2')}</p>
        </div>
        
        <div className="signup-form">
          <h2>{t('clg_signup.signup')}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="collegeName"
              placeholder={t('clg_signup.college_name_placeholder')}
              value={formData.collegeName}
              onChange={handleInputChange}
              className={errors.collegeName ? 'error' : ''}
            />
            {errors.collegeName && <span className="error-message">{errors.collegeName}</span>}

            <div className="form-row">
              <select
                name="collegeType"
                value={formData.collegeType}
                onChange={handleInputChange}
                className={`dropdown-select ${errors.collegeType ? 'error' : ''}`}
              >
                <option value="">{t('clg_signup.institute_type')} *</option>
                <option value="university">{t('clg_signup.university')}</option>
                <option value="college">{t('clg_signup.college')}</option>
                <option value="institute">{t('clg_signup.institute')}</option>
              </select>

              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className={`dropdown-select ${errors.state ? 'error' : ''}`}
              >
                <option value="">{t('clg_signup.state')} *</option>
                <option value="delhi">{t('states.delhi')}</option>
                <option value="punjab">{t('states.punjab')}</option>
                <option value="haryana">{t('states.haryana')}</option>
                <option value="himachal_pradesh">{t('states.himachal_pradesh')}</option>
                <option value="madhya_pradesh">{t('states.madhya_pradesh')}</option>
                <option value="uttar_pradesh">{t('states.uttar_pradesh')}</option>
                <option value="rajasthan">{t('states.rajasthan')}</option>
                <option value="gujarat">{t('states.gujarat')}</option>
                <option value="jammu_and_kashmir">{t('states.jammu_and_kashmir')}</option>
                <option value="maharashtra">{t('states.maharashtra')}</option>
                <option value="karnataka">{t('states.karnataka')}</option>
                <option value="tamil_nadu">{t('states.tamil_nadu')}</option>

              </select>
            </div>

            <input
              type="text"
              name="pinCode"
              placeholder={t('common.pincode_placeholder')}
              value={formData.pinCode}
              onChange={handleInputChange}
              className={errors.pinCode ? 'error' : ''}
            />
            {errors.pinCode && <span className="error-message">{errors.pinCode}</span>}

            <input
              type="text"
              name="adminName"
              placeholder={t('clg_signup.admin_name_placeholder')}
              value={formData.adminName}
              onChange={handleInputChange}
              className={errors.adminName ? 'error' : ''}
            />
            {errors.adminName && <span className="error-message">{errors.adminName}</span>}

            <input
              type="text"
              name="adminDesignation"
              placeholder={t('clg_signup.admin_designation_placeholder')}
              value={formData.adminDesignation}
              onChange={handleInputChange}
              className={errors.adminDesignation ? 'error' : ''}
            />
            {errors.adminDesignation && <span className="error-message">{errors.adminDesignation}</span>}

            <input
              type="email"
              name="email"
              placeholder={t('common.email_placeholder')}
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
                placeholder={t('common.phone_placeholder')}
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={errors.phoneNumber ? 'error' : ''}
              />
            </div>
            {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
            
            
            <input
              type="text"
              name="studentId"
              placeholder="Create Student Id *"
              value={formData.studentId}
              onChange={handleInputChange}
              className={errors.studentId ? 'error' : ''}
            />
            {errors.studentId && <span className="error-message">{errors.studentId}</span>}

            
            <input
              type="text"
              name="counsellorId"
              placeholder="Create Counsellor Id *"
              value={formData.counsellorId}
              onChange={handleInputChange}
              className={errors.counsellorId ? 'error' : ''}
            />
            {errors.counsellorId && <span className="error-message">{errors.counsellorId}</span>}

            <input
              type="password"
              name="password"
              placeholder={t('common.password_placeholder')}
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}

            <input
              type="password"
              name="confirmPassword"
              placeholder={t('common.confirm_password_placeholder')}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}

            <div className="terms">
              <p>{t('common.privacypolicy')}</p>
            </div>

            <button type="submit" className="signup-button">{t('common.signup')}</button>

            <div className="login-link">
              {t('common.have_account') }<a href="/login">{t('common.login')}</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CollegeSignUp;