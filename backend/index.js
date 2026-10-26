
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authroute");
const tripRoutes = require("./routes/trips");
const bookingRoutes = require("./routes/bookings");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // open for development; restrict to your frontend origin before deploying
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.json({ message: "Welcome to OffWeGo API" });
});

app.get("/api/health", (req, res) => {
    const states = ["disconnected", "connected", "connecting", "disconnecting"];
    res.json({ status: "ok", database: states[mongoose.connection.readyState] });
});

app.use("/api/auth", authRoutes);

app.use("/api/trips", tripRoutes);

app.use("/api/trips/:tripId/bookings", bookingRoutes);

// 404 + central error handler (Express 5 forwards async errors here automatically)
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({
        message: status < 500 ? err.message : "Something went wrong on the server",
    });
});

// Start the server only after the database is connected
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`OffWeGo server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    });