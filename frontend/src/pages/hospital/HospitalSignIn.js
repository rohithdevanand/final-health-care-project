import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import AddressInput from "../../components/AddressInput";
import "../AuthForm.css"; // Shared CSS

const HospitalSignIn = () => {
  const [formData, setFormData] = useState({
    hospitalName: "",
    password: "",
    confirmPassword: "",
  });
  const [address, setAddress] = useState({
    doorNumber: "",
    mainAddress: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [error, setError] = useState("");
  const { signIn } = useContext(AuthContext);

  const { hospitalName, password, confirmPassword } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await signIn({ hospitalName, password, address }, "hospital");
    } catch (err) {
      setError(err.response.data.message || "Sign-in failed");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={onSubmit}>
        <h2>Hospital Sign In (Register)</h2>
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
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            required
          />
        </div>
        <AddressInput address={address} setAddress={setAddress} />
        <button type="submit">Sign In</button>
        <p>
          Already have an account? <Link to="/hospital/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default HospitalSignIn;