import { io } from "socket.io-client";

// Connect to the backend server
// --- THIS IS THE FIX ---
const URL = "https://final-health-care-project.onrender.com";
const socket = io(URL, {
  autoConnect: false, // Only connect when needed
});

// Optional: for debugging
socket.onAny((event, ...args) => {
  console.log("Socket Event:", event, args);
});

export default socket;
