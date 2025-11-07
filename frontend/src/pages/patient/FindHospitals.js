import React, { useEffect, useState } from "react";
import socket from "../../services/socket";
import api from "../../services/api";
import "./FindHospitals.css"; // We will create this CSS file next

const FindHospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // 1. Connect to the socket server
    socket.connect();

    // 2. Fetch initial list of hospitals
    const fetchHospitals = async () => {
      try {
        const res = await api.get("/hospital/all");
        setHospitals(res.data);
      } catch (err) {
        setError("Failed to fetch hospitals.");
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();

    // 3. Set up the listener
    const onInventoryUpdate = (updatedHospital) => {
      console.log("Received real-time update!", updatedHospital);
      // Find and update the hospital in the local list
      setHospitals((prevHospitals) =>
        prevHospitals.map((h) =>
          h._id === updatedHospital._id ? updatedHospital : h
        )
      );
    };

    socket.on("inventoryUpdated", onInventoryUpdate);

    // 4. Clean up on component unmount
    return () => {
      socket.off("inventoryUpdated", onInventoryUpdate);
      socket.disconnect();
    };
  }, []);

  const renderBloodBank = (bloodBank) => {
    // Get all blood types that have more than 0 packets
    const availableTypes = Object.entries(bloodBank)
      .filter(([type, quantity]) => quantity > 0);

    if (availableTypes.length === 0) {
      return <p>No blood packets reported.</p>;
    }

    return (
      <ul className="blood-list">
        {availableTypes.map(([type, quantity]) => (
          <li key={type}>
            <span className="blood-type">{type}:</span> {quantity} packets
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="find-hospitals-container">
      <h2>Hospitals & Live Inventory</h2>
      {loading && <p>Loading hospital data...</p>}
      {error && <p className="error">{error}</p>}
      
      <div className="hospital-list-grid">
        {hospitals.map((h) => (
          <div key={h._id} className="hospital-inventory-card">
            <h3>{h.hospitalName}</h3>
            <p className="hospital-location">
              {h.address.city}, {h.address.pincode}
            </p>
            
            <hr />

            <div className="inventory-section">
              <h4>Oxygen Status</h4>
              <p 
                className={`oxygen-status ${h.oxygen.status === 'Available' ? 'available' : 'unavailable'}`}
              >
                {h.oxygen.status}
              </p>
            </div>

            <div className="inventory-section">
              <h4>Blood Bank</h4>
              {renderBloodBank(h.bloodBank)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindHospitals;