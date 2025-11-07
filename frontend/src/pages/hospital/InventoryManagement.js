import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import AuthContext from "../../context/AuthContext";
import "../AuthForm.css"; // Reusing styles

const InventoryManagement = () => {
  const { user } = useContext(AuthContext);
  const [bloodBank, setBloodBank] = useState(null);
  const [oxygenStatus, setOxygenStatus] = useState("Not Available");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch current profile to get inventory
    const fetchProfile = async () => {
      try {
        const res = await api.get("/hospital/profile");
        setBloodBank(res.data.bloodBank || {});
        setOxygenStatus(res.data.oxygen?.status || "Not Available");
      } catch (error) {
        setMessage("Failed to load inventory data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleBloodChange = (e) => {
    const { name, value } = e.target;
    setBloodBank((prev) => ({
      ...prev,
      [name]: Number(value) >= 0 ? Number(value) : 0, // Ensure non-negative
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Updating...");
    try {
      await api.put("/hospital/profile", {
        bloodBank,
        oxygenStatus,
      });
      setMessage("Inventory updated successfully!");
    } catch (error) {
      setMessage("Failed to update inventory.");
    }
  };

  if (loading) return <div>Loading inventory...</div>;

  return (
    <div className="auth-container" style={{ alignItems: 'flex-start' }}>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Manage Inventory</h2>
        {message && <p>{message}</p>}

        <div className="address-group">
          <h4>Blood Bank (Packets Available)</h4>
          {bloodBank &&
            Object.keys(bloodBank).map((type) => (
              <div key={type}>
                <label>{type}</label>
                <input
                  type="number"
                  name={type}
                  value={bloodBank[type]}
                  onChange={handleBloodChange}
                  min="0"
                />
              </div>
            ))}
        </div>

        <div>
          <h4>Oxygen Status</h4>
          <select
            value={oxygenStatus}
            onChange={(e) => setOxygenStatus(e.target.value)}
          >
            <option value="Not Available">Not Available</option>
            <option value="Available">Available</option>
          </select>
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default InventoryManagement;