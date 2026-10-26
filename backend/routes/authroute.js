const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/authmid");

const router = express.Router();

function signToken(user) {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    // typeof checks also block NoSQL injection like { "email": { "$gt": "" } }
    if (![name, email, password].every((v) => typeof v === "string" && v.trim())) {
        return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
        return res.status(409).json({ message: "An account with this email already exists" });
    }

    // role is never taken from the request body: everyone registers as "user"
    const user = await User.create({ name, email, password });
    res.status(201).json({ token: signToken(user), user });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    const valid = user && (await user.comparePassword(password));
    if (!valid) {
        // same message for both cases so attackers can't tell which emails exist
        return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ token: signToken(user), user });
});

// GET /api/auth/me  (needs header: Authorization: Bearer <token>)
router.get("/me", protect, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;