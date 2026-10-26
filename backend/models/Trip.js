const mongoose = require("mongoose");

const MAX_TRIP_DAYS = 60;

// One thing to do on a day
const activitySchema = new mongoose.Schema(
    {
        icon: { type: String, trim: true, maxlength: 16, default: "📍" },
        name: { type: String, required: true, trim: true, maxlength: 100 },
        description: { type: String, trim: true, maxlength: 300, default: "" },
        time: { type: String, trim: true, maxlength: 5, default: "" }, // "09:30", optional
    },
    { _id: false }
);

// One day of the itinerary
const daySchema = new mongoose.Schema(
    {
        title: { type: String, trim: true, maxlength: 100, default: "" },
        activities: { type: [activitySchema], default: [] },
    },
    { _id: false }
);

const tripSchema = new mongoose.Schema(
    {
        // Owner of the trip. Set by the server from the login token, never from the request body.
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

        title: { type: String, trim: true, maxlength: 100 },
        destination: { type: String, required: [true, "Destination is required"], trim: true, maxlength: 100 },
        origin: { type: String, trim: true, maxlength: 100 }, // "from" city, optional for now
        startDate: { type: Date, required: [true, "Start date is required"], cast: "Start date is not a valid date" },
        endDate: { type: Date, required: [true, "End date is required"], cast: "End date is not a valid date" },
        adults: { type: Number, min: 1, max: 50, default: 1 },
        children: { type: Number, min: 0, max: 50, default: 0 },

        budgetRange: { type: String, trim: true, maxlength: 100 }, // the budget option chosen in the trip form

        budget: {
            amount: { type: Number, cast: "Budget must be a number", min: [0, "Budget cannot be negative"], max: [1000000000, "Budget is too large"], default: 0 },
            currency: { type: String, default: "INR", trim: true, uppercase: true, maxlength: 3 },
        },

        interests: { type: [String], default: [] },
        notes: { type: String, trim: true, maxlength: 1000 },

        // The day-by-day plan. Empty until the website generates and saves one.
        itinerary: {
            type: [daySchema],
            default: [],
            validate: [
                (days) => days.length <= MAX_TRIP_DAYS,
                `An itinerary can have at most ${MAX_TRIP_DAYS} days`,
            ],
        },

        // "ongoing" and "completed" are worked out from the dates, so they are not stored
        status: { type: String, enum: ["idea", "planning", "booked"], default: "planning" },
    },
    { timestamps: true }
);

// Rules that involve more than one field
tripSchema.pre("validate", function () {
    if (!this.startDate || !this.endDate) return;

    if (this.endDate < this.startDate) {
        this.invalidate("endDate", "End date must be on or after the start date");
        return;
    }
    const days = (this.endDate - this.startDate) / (1000 * 60 * 60 * 24) + 1;
    if (days > MAX_TRIP_DAYS) {
        this.invalidate("endDate", `A trip can be at most ${MAX_TRIP_DAYS} days long`);
    }
});

// Default title if none is given
tripSchema.pre("save", function () {
    if (!this.title && this.destination) {
        this.title = `Trip to ${this.destination}`;
    }
});

module.exports = mongoose.model("Trip", tripSchema);