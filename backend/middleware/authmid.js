const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Authentication: who is making this request?
exports.protect = async (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    let user;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id);
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (!user) {
        return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = user;
    next();
};

// Authorization: is this user allowed to do this? Use after protect.
// Example: router.delete("/:id", protect, authorize("admin"), handler)
exports.authorize = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "You do not have permission to do this" });
    }
    next();
};