const express = require("express");
const mongoose = require("mongoose");
const Trip = require("../models/Trip");
const Booking = require("../models/Booking");
const { protect } = require("../middleware/authmid");

// mergeParams lets this router see :tripId from the path it is mounted on
const router = express.Router({ mergeParams: true });

router.use(protect);

// Only these fields can be set from the request. user, trip and _id can never be.
const ALLOWED_FIELDS = [
    "type", "title", "provider", "confirmationNumber",
    "startDate", "endDate", "cost", "currency", "status", "notes",
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
    throw error;
}

// The trip must belong to the logged-in user. Someone else's trip looks the same as a missing one.
async function findOwnTrip(req) {
    if (!mongoose.isValidObjectId(req.params.tripId)) return null;
    return Trip.findOne({ _id: req.params.tripId, user: req.user._id }).select("_id");
}

async function findOwnBooking(req, trip) {
    if (!mongoose.isValidObjectId(req.params.bookingId)) return null;
    return Booking.findOne({ _id: req.params.bookingId, trip: trip._id, user: req.user._id });
}

// GET /api/trips/:tripId/bookings  -> all bookings of this trip, earliest first
router.get("/", async (req, res) => {
    const trip = await findOwnTrip(req);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const bookings = await Booking.find({ trip: trip._id, user: req.user._id }).sort({ startDate: 1, createdAt: 1 });
    res.json({ bookings });
});

// POST /api/trips/:tripId/bookings  -> add a booking
router.post("/", async (req, res) => {
    const trip = await findOwnTrip(req);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    try {
        const booking = await Booking.create({ ...pickAllowed(req.body), user: req.user._id, trip: trip._id });
        res.status(201).json({ booking });
    } catch (error) {
        handleError(error, res);
    }
});

// PUT /api/trips/:tripId/bookings/:bookingId  -> change a booking
router.put("/:bookingId", async (req, res) => {
    const trip = await findOwnTrip(req);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const booking = await findOwnBooking(req, trip);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    try {
        booking.set(pickAllowed(req.body));
        await booking.save();
        res.json({ booking });
    } catch (error) {
        handleError(error, res);
    }
});

// DELETE /api/trips/:tripId/bookings/:bookingId  -> remove a booking
router.delete("/:bookingId", async (req, res) => {
    const trip = await findOwnTrip(req);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const booking = await findOwnBooking(req, trip);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await booking.deleteOne();
    res.json({ message: "Booking deleted" });
});

module.exports = router;