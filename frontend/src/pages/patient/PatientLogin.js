import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "../AuthForm.css"; // Shared CSS

const PatientLogin = () => {
  const [formData, setFormData] = useState({
    email: "", // Changed from 'name'
    password: "",
  });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  const { email, password } = formData; // Changed from 'name'

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password }, "patient"); // Send email
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={onSubmit}>
        <h2>Patient Login</h2>
        {error && <p className="error">{error}</p>}
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit">Login</button>
        <p>
          Don't have an account? <Link to="/patient/signin">Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default PatientLogin;