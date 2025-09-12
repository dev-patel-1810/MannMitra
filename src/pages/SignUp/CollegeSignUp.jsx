import { useState } from 'react';
import './SignUp.css';

const CollegeSignUp = () => {
  const [formData, setFormData] = useState({
    collegeName: '',
    collegeType: '',
    state: '',
    pinCode: '',
    adminName: '',
    adminDesignation: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

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
    
    // Required field validations
    if (!formData.collegeName.trim()) newErrors.collegeName = 'College name is required';
    if (!formData.collegeType.trim()) newErrors.collegeType = 'College type is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pinCode.trim()) newErrors.pinCode = 'Pin code is required';
    if (!formData.adminName.trim()) newErrors.adminName = 'Admin name is required';
    if (!formData.adminDesignation.trim()) newErrors.adminDesignation = 'Designation is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    
    // Password validations
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must contain at least 8 characters, 1 uppercase, 1 lowercase, and 1 number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log(formData);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <div className="signup-image">
          <h1>Welcome</h1>
          <p>to a little corner of calm and care made for you.....</p>
        </div>
        
        <div className="signup-form">
          <h2>Create A College Account</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="collegeName"
              placeholder="College Name *"
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
                <option value="">Institute Type *</option>
                <option value="university">University</option>
                <option value="college">College</option>
                <option value="institute">Institute</option>
              </select>

              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className={`dropdown-select ${errors.state ? 'error' : ''}`}
              >
                <option value="">State *</option>
                <option value="delhi">Delhi</option>
                <option value="punjab">Punjab</option>
                <option value="haryana">Haryana</option>
                <option value="himachal_pradesh">Himachal Pradesh</option>
                <option value="madhya_pradesh">Madhya Pradesh</option>
                <option value="uttar_pradesh">Uttar Pradesh</option>
                <option value="rajasthan">Rajasthan</option>
                <option value="gujarat">Gujarat</option>
                <option value="maharashtra">Maharashtra</option>
                <option value="karnataka">Karnataka</option>
                <option value="tamil_nadu">Tamil Nadu</option>
              </select>
            </div>

            <input
              type="text"
              name="pinCode"
              placeholder="Pin Code *"
              value={formData.pinCode}
              onChange={handleInputChange}
              className={errors.pinCode ? 'error' : ''}
            />
            {errors.pinCode && <span className="error-message">{errors.pinCode}</span>}

            <input
              type="text"
              name="adminName"
              placeholder="Admin Name *"
              value={formData.adminName}
              onChange={handleInputChange}
              className={errors.adminName ? 'error' : ''}
            />
            {errors.adminName && <span className="error-message">{errors.adminName}</span>}

            <input
              type="text"
              name="adminDesignation"
              placeholder="Admin Designation *"
              value={formData.adminDesignation}
              onChange={handleInputChange}
              className={errors.adminDesignation ? 'error' : ''}
            />
            {errors.adminDesignation && <span className="error-message">{errors.adminDesignation}</span>}

            <input
              type="email"
              name="email"
              placeholder="Email *"
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
                placeholder="Phone Number *"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={errors.phoneNumber ? 'error' : ''}
              />
            </div>
            {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}

            <input
              type="password"
              name="password"
              placeholder="Password *"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}

            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter Password *"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}

            <div className="terms">
              <p>By creating an account, you agree to the Terms of use and Privacy Policy.</p>
            </div>

            <button type="submit" className="signup-button">Sign Up</button>

            <div className="login-link">
              Already have an account? <a href="/login">Log in</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CollegeSignUp;