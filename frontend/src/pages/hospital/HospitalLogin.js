import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "../AuthForm.css"; // Shared CSS

const HospitalLogin = () => {
  const [formData, setFormData] = useState({
    hospitalName: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  const { hospitalName, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ hospitalName, password }, "hospital");
    } catch (err) {
      setError(err.response.data.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={onSubmit}>
        <h2>Hospital Login</h2>
        {error && <p className="error">{error}</p>}
        <div>
          <label>Hospital Name</label>
          <input
            type="text"
            name="hospitalName"
            value={hospitalName}
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
          Don't have an account? <Link to="/hospital/signin">Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default HospitalLogin;