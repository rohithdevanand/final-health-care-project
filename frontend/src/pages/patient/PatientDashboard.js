import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "./PatientDashboard.css";

// Mocked component for reviews
const HospitalReviewCard = ({ name, image, review }) => (
  <div className="review-card">
    <img src={image} alt={name} />
    <h4>{name}</h4>
    <p>"{review}"</p>
  </div>
);

const PatientDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user?.name}!</h2>
      <p>What would you like to do today?</p>

      <div className="dashboard-nav">
        <Link to="/patient/ai-consult" className="nav-card">
          <h3>AI Consultation</h3>
          <p>Get a preliminary diagnosis.</p>
        </Link>
        <Link to="/patient/book-appointment" className="nav-card">
          <h3>Book an Appointment</h3>
          <p>Find and book doctors.</p>
        </Link>
      </div>

      <div className="reviews-section">
        <h3>Hospital Reviews</h3>
        <div className="reviews-grid">
          {/* Mocked Data as your backend doesn't have this */}
          <HospitalReviewCard
            name="Apollo Hospital"
            image="https://via.placeholder.com/300x150.png?text=Apollo+Hospital" // Placeholder image
            review="Great service and very professional staff. Highly recommend!"
          />
          <HospitalReviewCard
            name="Manipal Hospital"
            image="https://via.placeholder.com/300x150.png?text=Manipal+Hospital" // Placeholder image
            review="The booking process was smooth and the doctor was excellent."
          />
          <HospitalReviewCard
            name="Fortis Hospital"
            image="https://via.placeholder.com/300x150.png?text=Fortis+Hospital" // Placeholder image
            review="Clean facilities and helpful team."
          />
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;