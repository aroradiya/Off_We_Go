// Fills (or updates) the destinations catalog in MongoDB.
// Run from the backend folder:   node seed/seedDestinations.js

// Same DNS workaround as index.js. Remove these two lines if your connection works without them.
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();

const mongoose = require("mongoose");
const Destination = require("../models/Destination");
const destinations = require("./destinationData");

async function seed() {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not set in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    for (const data of destinations) {
        // upsert: update the destination if it exists, create it if it does not
        await Destination.findOneAndUpdate({ slug: data.slug }, data, {
            upsert: true,
            returnDocument: "after",
            runValidators: true,
            setDefaultsOnInsert: true,
        });
        console.log("Saved:", data.name);
    }

    console.log(`Done. ${destinations.length} destinations are in the catalog.`);
    await mongoose.disconnect();
}

seed().catch((error) => {
    console.error("Seeding failed:", error.message);
    process.exit(1);
});