import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import AddressInput from "../../components/AddressInput";
import "../AuthForm.css"; // Shared CSS

const PatientSignIn = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "", // Added email
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
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const { signIn } = useContext(AuthContext);

  const { name, email, password, confirmPassword } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!gender) {
      setError("Please select a gender");
      return;
    }
    try {
      await signIn({ name, email, password, address, gender }, "patient");
    } catch (err) {
      setError(err.response?.data?.message || "Sign-in failed");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={onSubmit}>
        <h2>Patient Sign In (Register)</h2>
        {error && <p className="error">{error}</p>}
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
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
        <div>
          <label>Gender</label>
          <select
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <AddressInput address={address} setAddress={setAddress} />
        <button type="submit">Sign In</button>
        <p>
          Already have an account? <Link to="/patient/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default PatientSignIn;