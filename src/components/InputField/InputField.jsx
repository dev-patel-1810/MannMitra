import React from 'react';
import './InputField.css';

const InputField = ({ label, type = "text", placeholder, value, onChange, name }) => {
  return (
    <div className="input-field">
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}         // <-- must be connected to state
        onChange={onChange}   // <-- must be connected to state
        name={name}           // <-- key for state update
      />
    </div>
  );
};

export default InputField;
