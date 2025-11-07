import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// import { connectDB } from "./config/db.js"; // Commented since Mongo not connected yet

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// connectDB(); // Commented for now

app.get("/", (req, res) => {
  res.send("✅ Backend server running successfully!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
