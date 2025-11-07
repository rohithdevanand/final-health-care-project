import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({ children, userType }) => {
  const { isAuthenticated, userType: authUserType, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!isAuthenticated) {
    // Redirect to the home page or a relevant login page
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (isAuthenticated && authUserType !== userType) {
    // If logged in but wrong user type (e.g., patient trying hospital route)
    // Redirect to their own dashboard
    return <Navigate to={`/${authUserType}/dashboard`} replace />;
  }

  return children;
};

export default ProtectedRoute;