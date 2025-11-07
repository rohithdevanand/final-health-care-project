import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http"; // Import http
import { Server } from "socket.io"; // Import Server

import patientRoutes from "../routes/patientRoutes.js";
import hospitalRoutes from "../routes/hospitalRoutes.js";
import doctorRoutes from "../routes/doctorRoutes.js";
import appointmentRoutes from "../routes/appointmentRoutes.js";

dotenv.config();

const app = express();
const httpServer = http.createServer(app); // Create HTTP server

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(express.json());
app.use(cors());

// Middleware to attach io to every request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/patient", patientRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/appointment", appointmentRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({ message: "✅ Healthcare Portal Backend is running (no DB yet)" });
});

// Socket.io connection (optional: for logging connections)
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/healthcare-portal", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("⚠️ MongoDB connection error:", err.message));

const PORT = process.env.PORT || 5000;

// Listen using the httpServer, not the app
httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));