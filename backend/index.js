const express = require("express");
const mongoose = require("mongoose");

const app = express();

const PORT = 5000;

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/offwego")
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
    });

// Test Route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to OffWeGo API"
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`OffWeGo server running on http://localhost:${PORT}`);
});