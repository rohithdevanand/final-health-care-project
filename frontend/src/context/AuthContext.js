// Add 'useCallback' to the import
import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userType, setUserType] = useState(
    localStorage.getItem("userType") || null
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- FIX 1: Wrap 'logout' in useCallback ---
  // This function depends on 'navigate', so we add it to the array.
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    setToken(null);
    setUser(null);
    setUserType(null);
    navigate("/");
  }, [navigate]);
  // --- END FIX 1 ---

  useEffect(() => {
    // Try to load user info from token on app load
    const loadUser = async () => {
      if (token) {
        try {
          let profileEndpoint = "";
          if (userType === "patient") {
            profileEndpoint = "/patient/profile";
          } else if (userType === "hospital") {
            profileEndpoint = "/hospital/profile";
          }

          if (profileEndpoint) {
            const res = await api.get(profileEndpoint);
            setUser(res.data);
          }
        } catch (error) {
          console.error("Failed to load user profile", error);
          logout(); // This call requires 'logout' in the dependency array
        }
      }
      setLoading(false);
    };

    loadUser();
    // --- FIX 2: Add 'logout' to the dependency array ---
  }, [token, userType, logout]);
  // --- END FIX 2 ---

  const login = async (credentials, type) => {
    try {
      const endpoint = `/${type}/login`;
      const res = await api.post(endpoint, credentials);

      const { token: newToken, patient, hospital } = res.data;
      const currentUser = patient || hospital;

      localStorage.setItem("token", newToken);
      localStorage.setItem("userType", type);

      setToken(newToken);
      setUserType(type);
      setUser(currentUser);

      // Redirect to the correct dashboard
      navigate(`/${type}/dashboard`);
    } catch (error) {
      console.error("Login failed:", error.response.data.message);
      throw error; // Re-throw to be caught in the component
    }
  };

  const signIn = async (data, type) => {
    try {
      const endpoint = `/${type}/signin`;
      const res = await api.post(endpoint, data);

      const { token: newToken, patient, hospital } = res.data;
      const currentUser = patient || hospital;

      localStorage.setItem("token", newToken);
      localStorage.setItem("userType", type);

      setToken(newToken);
      setUserType(type);
      setUser(currentUser);

      // Redirect to the correct dashboard
      navigate(`/${type}/dashboard`);
    } catch (error) {
      console.error("Sign-in failed:", error.response.data.message);
      throw error; // Re-throw to be caught in the component
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        userType,
        loading,
        login,
        signIn,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
