const mongoose = require("mongoose");

// "Hill Station" -> "hill-station" (used in web addresses like /api/destinations/hill-station)
function slugify(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// One suggested thing to do
const activitySchema = new mongoose.Schema(
    {
        icon: { type: String, trim: true, maxlength: 16, default: "📍" },
        name: { type: String, required: true, trim: true, maxlength: 100 },
        description: { type: String, trim: true, maxlength: 300, default: "" },
        interests: { type: [String], default: [] }, // e.g. ["Nature", "Food"]; used to match a traveller's interests
    },
    { _id: false }
);

// One suggested day
const dayPlanSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true, maxlength: 100 },
        activities: { type: [activitySchema], default: [] },
    },
    { _id: false }
);

const destinationSchema = new mongoose.Schema(
    {
        slug: { type: String, unique: true, lowercase: true, trim: true, index: true },
        name: { type: String, required: [true, "Name is required"], unique: true, trim: true, maxlength: 100 },
        country: { type: String, required: [true, "Country is required"], trim: true, maxlength: 100 },
        region: { type: String, trim: true, maxlength: 100, default: "" }, // state, emirate, island...
        currency: { type: String, trim: true, uppercase: true, maxlength: 3, default: "INR" }, // local currency
        bestSeason: { type: String, trim: true, maxlength: 200, default: "" }, // general guidance only
        description: { type: String, trim: true, maxlength: 500, default: "" },
        tags: { type: [String], default: [] }, // interests this destination suits
        dayPlans: { type: [dayPlanSchema], default: [] }, // suggested day-by-day plans used to build itineraries
    },
    { timestamps: true }
);

destinationSchema.pre("validate", function () {
    if (!this.slug && this.name) {
        this.slug = slugify(this.name);
    }
});

const Destination = mongoose.model("Destination", destinationSchema);

module.exports = Destination;
module.exports.slugify = slugify;