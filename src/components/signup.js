import React, { useState } from "react";
import axios from "axios";
import "../styles/signup.css";
 
function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    mobilenumber: "",
    password: "",
    confirmpassword: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // Added state for error messages
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (formData.password !== formData.confirmpassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
 
    try {
      const response = await axios.post("http://localhost:5000/api/signup", formData);
      alert(response.data.message);
      setErrorMessage(""); // Clear error message on success
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };
 
  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="mobilenumber">Mobile Number</label>
          <input
            type="tel"
            id="mobilenumber"
            placeholder="Enter your mobile number"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmpassword">Confirm Password</label>
          <input
            type="password"
            id="confirmpassword"
            placeholder="Confirm your password"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
    </div>
  );
}
 
export default SignUp;