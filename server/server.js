const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

const PORT = process.env.PORT || 5000;

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CityPulse API is running",
  });
});

// Server
app.listen(PORT, () => {
  console.log(`CityPulse server running on http://localhost:${PORT}`);
});
