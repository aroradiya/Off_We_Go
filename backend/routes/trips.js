const express = require("express");
const mongoose = require("mongoose");
const Trip = require("../models/Trip");
const Booking = require("../models/Booking");

const { protect } = require("../middleware/authmid");
const { uploadImage } = require("../middleware/upload");
const { uploadBuffer, deleteFile } = require("../config/cloudinary");

const router = express.Router();

const MAX_TRIP_DAYS = 60;
const MAX_ACTIVITIES_PER_DAY = 20;

// Every trip route needs a logged-in user
router.use(protect);

// Only these fields can be set from the request. user and _id can never be.
const ALLOWED_FIELDS = [
    "title", "destination", "origin", "startDate", "endDate",
    "adults", "children", "budgetRange", "budget", "interests", "notes", "status",
];

function pickAllowed(body) {
    const data = {};
    for (const field of ALLOWED_FIELDS) {
        if (body[field] !== undefined) data[field] = body[field];
    }
    return data;
}

// Turns Mongoose validation problems into a clear 400 instead of a generic 500
function handleError(error, res) {
    if (error.name === "ValidationError") {
        const message = Object.values(error.errors).map((e) => e.message).join(". ");
        return res.status(400).json({ message });
    }
    if (error.name === "CastError") {
        return res.status(400).json({ message: `Invalid value for ${error.path}` });
    }
    throw error; // anything else goes to the central error handler
}

// Looks up a trip that belongs to the logged-in user. Someone else's trip looks the same as a missing one.
async function findOwnTrip(req) {
    if (!mongoose.isValidObjectId(req.params.id)) return null;
    return Trip.findOne({ _id: req.params.id, user: req.user._id });
}

// GET /api/trips  -> all my trips, soonest first
router.get("/", async (req, res) => {
    // The list does not need the (large) itineraries
    const trips = await Trip.find({ user: req.user._id }).select("-itinerary").sort({ startDate: 1 });
    res.json({ trips });
});

// POST /api/trips  -> create a trip
router.post("/", async (req, res) => {
    try {
        const trip = await Trip.create({ ...pickAllowed(req.body), user: req.user._id });
        res.status(201).json({ trip });
    } catch (error) {
        handleError(error, res);
    }
});

// GET /api/trips/:id  -> one of my trips
router.get("/:id", async (req, res) => {
    const trip = await findOwnTrip(req);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json({ trip });
});

// PUT /api/trips/:id  -> update one of my trips
router.put("/:id", async (req, res) => {
    const trip = await findOwnTrip(req);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    try {
        const changes = pickAllowed(req.body);

        // If the title was the automatic one and the destination changes, keep the title in step
        if (changes.destination && !changes.title && trip.title === `Trip to ${trip.destination}`) {
            changes.title = `Trip to ${String(changes.destination).trim()}`;
        }

        trip.set(changes);

        // A different place or different dates means the saved plan no longer fits,
        // so it is cleared and the website generates a fresh one
        if (trip.isModified("destination") || trip.isModified("startDate") || trip.isModified("endDate")) {
            trip.itinerary = [];
        }

        await trip.save();
        res.json({ trip });
    } catch (error) {
        handleError(error, res);
    }
});

// Itinerary input is cleaned before it is saved: text only, trimmed and length-limited
function cleanText(value, max) {
    return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function cleanDay(day) {
    const activities = Array.isArray(day && day.activities) ? day.activities : [];
    return {
        title: cleanText(day && day.title, 100),
        activities: activities
            .slice(0, MAX_ACTIVITIES_PER_DAY)
            .map((activity) => ({
                icon: cleanText(activity && activity.icon, 16) || "📍",
                name: cleanText(activity && activity.name, 100),
                description: cleanText(activity && activity.description, 300),
                time: cleanText(activity && activity.time, 5),
            }))
            .filter((activity) => activity.name), // an activity needs a name
    };
}

// PUT /api/trips/:id/itinerary  -> replace the whole itinerary of one of my trips
router.put("/:id/itinerary", async (req, res) => {
    const trip = await findOwnTrip(req);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const days = req.body.itinerary;
    if (!Array.isArray(days) || days.length > MAX_TRIP_DAYS) {
        return res.status(400).json({ message: `Itinerary must be a list of at most ${MAX_TRIP_DAYS} days` });
    }

    try {
        trip.itinerary = days.map(cleanDay);
        await trip.save();
        res.json({ trip });
    } catch (error) {
        handleError(error, res);
    }
});

// PUT /api/trips/:id/cover  -> upload or replace the cover photo of one of my trips
router.put("/:id/cover", uploadImage("cover"), async (req, res) => {
    try {
        const trip = await findOwnTrip(req);

        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Please select a cover image" });
        }

        const result = await uploadBuffer(req.file.buffer, {
            folder: "trip-covers",
        });

        const oldPublicId = trip.coverImage && trip.coverImage.publicId;

        trip.coverImage = { url: result.secure_url, publicId: result.public_id };
        await trip.save();

        if (oldPublicId) {
            try {
                await deleteFile(oldPublicId);
            } catch (deleteError) {
                console.error("Could not delete old cover:", deleteError);
            }
        }

        return res.json({
            message: "Cover image uploaded successfully",
            trip,
        });
    } catch (error) {
        console.error("Cover upload error:", error);
        return res.status(500).json({ message: "Failed to upload cover image" });
    }
});

// DELETE /api/trips/:id  -> delete one of my trips
router.delete("/:id", async (req, res) => {
    const trip = await findOwnTrip(req);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const coverPublicId = trip.coverImage && trip.coverImage.publicId;

    // Bookings belong to the trip, so they go with it
    await Booking.deleteMany({ trip: trip._id, user: req.user._id });
    await trip.deleteOne();

    if (coverPublicId) {
        try {
            await deleteFile(coverPublicId);
        } catch (deleteError) {
            console.error("Could not delete cover of deleted trip:", deleteError);
        }
    }

    res.json({ message: "Trip deleted" });
});

module.exports = router;