import { useState } from 'react';
import './SignUp.css';

const CounsellorSignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    pinCode: '',
    qualification: '',
    specialization: '',
    experience: '',
    password: '',
    confirmPassword: '',
    collegeId: ''
  });

  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      phoneNumber: '',
      pinCode: '',
      qualification: '',
      specialization: '',
      experience: '',
      password: '',
      confirmPassword: '',
      collegeId: ''
    });
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.pinCode.trim()) newErrors.pinCode = 'Pin code is required';
    if (!formData.qualification.trim()) newErrors.qualification = 'Qualification is required';
    if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required';
    if (!formData.experience.trim()) newErrors.experience = 'Experience is required';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:5000/counsellor-signup/', {
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

        resetForm();
        alert('Counsellor account created successfully!');
      } catch (error) {
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
          <h2>Create A Counsellor Account</h2>
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
              type="text"
              name="qualification"
              placeholder="Qualification *"
              value={formData.qualification}
              onChange={handleInputChange}
              className={errors.qualification ? 'error' : ''}
            />
            {errors.qualification && <span className="error-message">{errors.qualification}</span>}

            <input
              type="text"
              name="specialization"
              placeholder="Specialization *"
              value={formData.specialization}
              onChange={handleInputChange}
              className={errors.specialization ? 'error' : ''}
            />
            {errors.specialization && <span className="error-message">{errors.specialization}</span>}

            <input
              type="text"
              name="experience"
              placeholder="Years of Experience *"
              value={formData.experience}
              onChange={handleInputChange}
              className={errors.experience ? 'error' : ''}
            />
            {errors.experience && <span className="error-message">{errors.experience}</span>}

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
          </form>
        </div>
      </div>
    </div>
  );
};

export default CounsellorSignUp;