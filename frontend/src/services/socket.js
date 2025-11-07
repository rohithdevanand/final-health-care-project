import { io } from "socket.io-client";

// Connect to the backend server
const URL = "http://localhost:5000";
const socket = io(URL, {
  autoConnect: false, // Only connect when needed
});

// Optional: for debugging
socket.onAny((event, ...args) => {
  console.log("Socket Event:", event, args);
});

export default socket;