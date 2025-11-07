import React, { useState, useEffect } from "react";
import api from "../../services/api";
import DoctorCard from "../../components/DoctorCard";
import "./BookAppointment.css"; // We'll create this file

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [rating, setRating] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []); // Fetch all on initial load

  const fetchDoctors = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (rating) params.rating = rating;
      if (location) params.location = location;

      const res = await api.get("/doctor", { params });
      setDoctors(res.data);
    } catch (err) {
      setError("Failed to fetch doctors.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRating("");
    setLocation("");
    // Re-fetch all doctors
    fetchDoctors();
  };


  return (
    <div className="book-appointment-container">
      <h2>Book an Appointment</h2>
      
      <form onSubmit={handleFilterSubmit} className="filter-form">
        <input
          type="text"
          placeholder="Search by doctor's name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by city or pincode..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value="">Any Rating</option>
          <option value="4.5">4.5+ Stars</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
        </select>
        <button type="submit">Search</button>
        <button type="button" onClick={clearFilters}>Clear Filters</button>
      </form>

      <div className="doctor-list">
        {loading && <p>Loading doctors...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && doctors.length === 0 && (
          <p>No doctors found matching your criteria.</p>
        )}
        {doctors.map((doctor) => (
          <DoctorCard key={doctor._id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
};

export default BookAppointment;