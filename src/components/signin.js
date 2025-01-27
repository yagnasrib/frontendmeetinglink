import React, { useState } from "react";
import axios from "axios";
import "../styles/signin.css";
 
function SignIn() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // Declare error state
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/signin", formData);
      alert(response.data.message); // Display success message
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
  };
 
  const handleForgotPassword = () => {
    alert("Redirecting to Forgot Password page...");
    // Example: Uncomment this line if you want to redirect
    // window.location.href = "/forgot-password";
  };
 
  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2>Sign In</h2>
 
        {/* Display error message */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
 
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
 
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
 
        {/* Fix for accessibility warning */}
       
          <p className="forgot-password">
  <button type="button" className="link-button" onClick={handleForgotPassword}>
    Forgot Password?
  </button>
</p>
 
 
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}
 
export default SignIn;
 