const express = require("express");
const Destination = require("../models/Destination");
const { slugify } = require("../models/Destination");
const { protect, authorize } = require("../middleware/authmid");

const router = express.Router();

const ALLOWED_FIELDS = [
    "name", "country", "region", "currency", "bestSeason", "description", "tags", "dayPlans",
];

function pickAllowed(body) {
    const data = {};
    for (const field of ALLOWED_FIELDS) {
        if (body[field] !== undefined) data[field] = body[field];
    }
    return data;
}

// Turns database problems into clear messages instead of a generic 500
function handleError(error, res) {
    if (error.code === 11000) {
        return res.status(409).json({ message: "A destination with this name already exists" });
    }
    if (error.name === "ValidationError") {
        const message = Object.values(error.errors).map((e) => e.message).join(". ");
        return res.status(400).json({ message });
    }
    if (error.name === "CastError") {
        return res.status(400).json({ message: `Invalid value for ${error.path}` });
    }
    throw error;
}

// ---------- Anyone can read the catalog ----------

// GET /api/destinations  -> every destination, without the long day plans
router.get("/", async (req, res) => {
    const destinations = await Destination.find().select("-dayPlans").sort({ name: 1 });
    res.json({ destinations });
});

// GET /api/destinations/:slug  -> one destination, with its day plans
router.get("/:slug", async (req, res) => {
    const destination = await Destination.findOne({ slug: slugify(req.params.slug) });
    if (!destination) return res.status(404).json({ message: "Destination not found" });
    res.json({ destination });
});

// ---------- Only admins can change it ----------

// POST /api/destinations
router.post("/", protect, authorize("admin"), async (req, res) => {
    try {
        const destination = await Destination.create(pickAllowed(req.body));
        res.status(201).json({ destination });
    } catch (error) {
        handleError(error, res);
    }
});

// PUT /api/destinations/:slug
router.put("/:slug", protect, authorize("admin"), async (req, res) => {
    const destination = await Destination.findOne({ slug: slugify(req.params.slug) });
    if (!destination) return res.status(404).json({ message: "Destination not found" });

    try {
        destination.set(pickAllowed(req.body)); // the slug stays the same even if the name changes
        await destination.save();
        res.json({ destination });
    } catch (error) {
        handleError(error, res);
    }
});

// DELETE /api/destinations/:slug
router.delete("/:slug", protect, authorize("admin"), async (req, res) => {
    const destination = await Destination.findOne({ slug: slugify(req.params.slug) });
    if (!destination) return res.status(404).json({ message: "Destination not found" });

    await destination.deleteOne();
    res.json({ message: "Destination deleted" });
});

module.exports = router;