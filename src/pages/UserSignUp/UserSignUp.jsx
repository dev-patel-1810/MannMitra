import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import InputField from '../../components/InputField/InputField';
import './UserSignUp.css';

const UserSignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    institute: '',
    pin: '',
    contact: '',
    email: '',
    guardian1Name: '',
    guardian1Phone: '',
    guardian2Name: '',
    guardian2Phone: '',
    password: '',
    confirmPassword: '',
    collegeId: '',
    optOut: false
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Sign Up Submitted!");
  };

  return (
    <div className="user-signup-page">
      <Navbar />
      <div className="signup-container">
        <h2>College Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            name="name"
          />

          <InputField
            label="Institute Name"
            placeholder="Enter your institute name"
            value={formData.institute}
            onChange={handleChange}
            name="institute"
          />
          <InputField
            label="Pin Code"
            placeholder="Enter your pin code"
            value={formData.pin}
            onChange={handleChange}
            name="pin"
          />
          <InputField
            label="User Contact"
            placeholder="Enter your contact number"
            value={formData.contact}
            onChange={handleChange}
            name="contact"
          />
          <InputField
            label="Email ID"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            name="email"
            type="email"
          />

          <h3>Guardian Details</h3>
          <InputField
            label="Guardian 1 Name"
            placeholder="Enter guardian 1 name"
            value={formData.guardian1Name}
            onChange={handleChange}
            name="guardian1Name"
          />
          <InputField
            label="Guardian 1 Phone"
            placeholder="Enter guardian 1 phone"
            value={formData.guardian1Phone}
            onChange={handleChange}
            name="guardian1Phone"
          />
          <InputField
            label="Guardian 2 Name"
            placeholder="Enter guardian 2 name"
            value={formData.guardian2Name}
            onChange={handleChange}
            name="guardian2Name"
          />
          <InputField
            label="Guardian 2 Phone"
            placeholder="Enter guardian 2 phone"
            value={formData.guardian2Phone}
            onChange={handleChange}
            name="guardian2Phone"
          />

          <div className="checkbox-container">
            <input
              type="checkbox"
              id="optOut"
              name="optOut"
              checked={formData.optOut}
              onChange={handleChange}
            />
            <label htmlFor="optOut">
              I opt to not choose one (I understand the disclaimer)
            </label>
          </div>

          <InputField
            label="Password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            name="password"
            type="password"
          />
          <InputField
            label="Re-enter Password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            name="confirmPassword"
            type="password"
          />
          <InputField
            label="College ID (if applicable)"
            placeholder="Enter your college ID"
            value={formData.collegeId}
            onChange={handleChange}
            name="collegeId"
          />

          <p className="signin-link">
            Already have an account? <a href="/signin">Sign In</a>
          </p>

          <p className="privacy">
            By signing up, you agree to our <a href="/privacy">Privacy Policy</a>.
          </p>

          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default UserSignUp;
