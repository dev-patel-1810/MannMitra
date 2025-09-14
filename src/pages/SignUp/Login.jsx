import { useState } from 'react';
import './Authentication.css';

const Login = () => {
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
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.userType) newErrors.userType = 'Please select your role';
    if (formData.password.length < 8) newErrors.password = 'Invalid Password';
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

        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.message || 'Login failed!');
          return;
        }

        resetForm();
        alert('Logged in successfully!');
      } catch (error) {
        alert('Network error!');
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <div className="signup-image">
          <h1>Welcome Back</h1>
          <p>to a little corner of calm and care made for you.....</p>
        </div>
        
        <div className="signup-form">
          <h2>Welcome Back</h2>
          <form onSubmit={handleSubmit}>
            <div className="user-type-selector">
              <select
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                className={`dropdown-select ${errors.userType ? 'error' : ''}`}
              >
                <option value="">Select Role *</option>
                <option value="student">Student</option>
                <option value="counsellor">Counsellor</option>
                <option value="institute">Institute</option>
              </select>
              {errors.userType && <span className="error-message">{errors.userType}</span>}
            </div>

            <div className="login-field">
              <input
                type="email"
                name="email"
                placeholder="Email *"
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
                placeholder="Password *"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="forgot-password-link">
              <a href="/forgot-password">Forgot Password?</a>
            </div>

            <button type="submit" className="signup-button">Log In</button>

            <div className="alternate-action">
              Don't have an account? <a href="/signup">Sign up</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;