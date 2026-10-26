const mongoose = require("mongoose");

const BOOKING_TYPES = ["flight", "stay", "transport", "activity", "other"];
const BOOKING_STATUSES = ["planned", "booked", "cancelled"];

const bookingSchema = new mongoose.Schema(
    {
        // Who owns it and which trip it belongs to. Both are set by the server, never by the request body.
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true, index: true },

        type: { type: String, enum: { values: BOOKING_TYPES, message: "Unknown booking type" }, required: [true, "Booking type is required"] },
        title: { type: String, required: [true, "Title is required"], trim: true, maxlength: 100 }, // e.g. "Delhi to Kullu flight"
        provider: { type: String, trim: true, maxlength: 100, default: "" }, // airline, hotel, website...
        confirmationNumber: { type: String, trim: true, maxlength: 50, default: "" }, // PNR or booking reference

        startDate: { type: Date, required: [true, "Start date is required"], cast: "Start date is not a valid date" }, // departure or check-in
        endDate: { type: Date, cast: "End date is not a valid date" }, // arrival or check-out, optional

        cost: { type: Number, cast: "Cost must be a number", min: [0, "Cost cannot be negative"], max: 100000000, default: 0 },
        currency: { type: String, trim: true, uppercase: true, maxlength: 3, default: "INR" },

        // planned = still deciding or not paid yet, booked = confirmed, cancelled = no longer happening
        status: { type: String, enum: { values: BOOKING_STATUSES, message: "Unknown booking status" }, default: "booked" },

        notes: { type: String, trim: true, maxlength: 500, default: "" },
    },
    { timestamps: true }
);

bookingSchema.pre("validate", function () {
    if (this.startDate && this.endDate && this.endDate < this.startDate) {
        this.invalidate("endDate", "End date must be on or after the start date");
    }
});

module.exports = mongoose.model("Booking", bookingSchema);