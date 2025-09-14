import { useState } from 'react';
import GuardianConfirmModal from '../../components/GuardianConfirmModal/GuardianConfirmModal';
import pic from '../../assets/signup.png'
import './Authentication.css';

const UserSignUp = () => {
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
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.pinCode.trim()) newErrors.pinCode = 'Pin code is required';
    
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

    // Guardian validation
    if (!guardianChoice) {
      newErrors.guardian = 'Please select guardian information option';
    }

    if (guardianChoice === 'show') {
      if (!formData.guardian1Name.trim() || !formData.guardian1Contact.trim()) {
        newErrors.guardian1 = 'At least one guardian information is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
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

        console.log(formData)

        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.message || 'Signup failed!');
          return;
        }

        // Reset form after successful submission
        
        resetForm();
        alert('Account created successfully!');
      } catch (error) {
        // console.log(error);
        alert('Network error!');
      }
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
          <h2>Create A User Account</h2>
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
              placeholder="E-mail *"
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
              type="text"
              name="pinCode"
              placeholder="Pin Code *"
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
                <option value="">Enter Guardian's Detail *</option>
                <option value="show">Enter Guardian Information</option>
                <option value="none">I opt not to choose one</option>
              </select>
              {errors.guardian && <span className="error-message">{errors.guardian}</span>}

              {showGuardianFields && (
                <div className="guardian-fields">
                  <div className="guardian-row">
                    <input
                      type="text"
                      name="guardian1Name"
                      placeholder="Name of Guardian 1 *"
                      value={formData.guardian1Name}
                      onChange={handleInputChange}
                      className={errors.guardian1 ? 'error' : ''}
                    />
                    <input
                      type="text"
                      name="guardian1Contact"
                      placeholder="Contact of Guardian 1 *"
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
                      placeholder="Name of Guardian 2"
                      value={formData.guardian2Name}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="guardian2Contact"
                      placeholder="Contact of Guardian 2"
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

            <input
              type="text"
              name="collegeId"
              placeholder="Enter College Id if applicable"
              value={formData.collegeId}
              onChange={handleInputChange}
            />

            <div className="terms">
              <p>By creating an account, you agree to the Terms of use and Privacy Policy.</p>
            </div>

            <button type="submit" className="signup-button">Sign Up</button>

            <div className="login-link">
              Already have an account? <a href="/login">Log in</a>
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