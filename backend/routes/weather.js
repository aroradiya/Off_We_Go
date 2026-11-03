
const express = require("express");
const { protect } = require("../middleware/authmid");
const Destination = require("../models/Destination");

const router = express.Router();

router.use(protect);

// WeatherAPI configuration
const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = "https://api.weatherapi.com/v1";

const cache = new Map();

const CACHE_MS = 30 * 60 * 1000; // 30 minutes
const REQUEST_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;

// Convert WeatherAPI condition codes into approximate
// Open-Meteo / WMO weather codes to maintain frontend compatibility.
function convertWeatherCode(code) {
    const codeMap = {
        1000: 0,
        1003: 2,
        1006: 3,
        1009: 3,
        1030: 45,
        1063: 61,
        1066: 71,
        1069: 68,
        1072: 56,
        1087: 95,
        1114: 73,
        1117: 75,
        1135: 45,
        1147: 48,
        1150: 51,
        1153: 53,
        1168: 56,
        1171: 57,
        1180: 61,
        1183: 61,
        1186: 63,
        1189: 63,
        1192: 65,
        1195: 65,
        1198: 66,
        1201: 67,
        1204: 68,
        1207: 69,
        1210: 71,
        1213: 71,
        1216: 73,
        1219: 73,
        1222: 75,
        1225: 75,
        1237: 77,
        1240: 80,
        1243: 81,
        1246: 82,
        1249: 85,
        1252: 86,
        1255: 85,
        1258: 86,
        1261: 85,
        1264: 86,
        1273: 95,
        1276: 95,
        1279: 96,
        1282: 99
    };

    return codeMap[code] ?? 0;
}


// Fetch JSON with retries and timeout
async function fetchWithRetry(url, maxRetries = MAX_RETRIES) {

    const retryableStatuses = [429, 500, 502, 503, 504];

    for (let attempt = 0; attempt <= maxRetries; attempt++) {

        const controller = new AbortController();

        const timeout = setTimeout(() => {
            controller.abort();
        }, REQUEST_TIMEOUT);

        try {

            const response = await fetch(url, {
                signal: controller.signal
            });

            clearTimeout(timeout);

            const data = await response.json();

            if (!response.ok || data.error) {

                const status = response.status;

                const errorMessage =
                    data.error?.message ||
                    `Weather API error: ${status}`;

                const error = new Error(errorMessage);
                error.status = status;
                error.apiCode = data.error?.code;

                // Retry temporary errors only
                if (
                    retryableStatuses.includes(status) &&
                    attempt < maxRetries
                ) {

                    const delay =
                        Math.min(
                            1000 * Math.pow(2, attempt) +
                            Math.random() * 500,
                            10000
                        );

                    console.log(
                        `WeatherAPI error ${status}. Retrying in ${Math.round(delay)}ms`
                    );

                    await new Promise(resolve =>
                        setTimeout(resolve, delay)
                    );

                    continue;
                }

                throw error;
            }

            return data;

        } catch (error) {

            clearTimeout(timeout);

            // Don't retry permanent API errors
            if (error.status) {
                throw error;
            }

            if (attempt === maxRetries) {
                throw error;
            }

            const delay =
                Math.min(
                    1000 * Math.pow(2, attempt) +
                    Math.random() * 500,
                    10000
                );

            console.log(
                "WeatherAPI network/timeout error. Retrying...",
                error.message
            );

            await new Promise(resolve =>
                setTimeout(resolve, delay)
            );
        }
    }

    throw new Error("WeatherAPI request failed");
}


// GET weather by destination
router.get("/", async (req, res) => {

    const destination = String(
        req.query.destination || ""
    ).trim();

    if (!destination) {
        return res.status(400).json({
            message: "Destination is required"
        });
    }

    if (!API_KEY) {
        return res.status(500).json({
            message: "WEATHER_API_KEY is missing from environment variables"
        });
    }

    const key = destination.toLowerCase();

    // Check cache
    const cached = cache.get(key);

    if (cached && Date.now() - cached.time < CACHE_MS) {

        console.log(`Weather cache hit: ${destination}`);

        return res.json({
            ...cached.data,
            cached: true
        });
    }

    try {

        // Find destination in catalog
        const catalogEntry = await Destination.findOne({
            slug: Destination.slugify(destination)
        });

        // Search destination using WeatherAPI
        const searchParams = new URLSearchParams({
            key: API_KEY,
            q: destination
        });

        const geoUrl =
            `${BASE_URL}/search.json?${searchParams.toString()}`;

        const geoData = await fetchWithRetry(geoUrl);

        if (!Array.isArray(geoData) || geoData.length === 0) {

            return res.status(404).json({
                message: "Destination not found"
            });
        }

        // Match result with catalog region/country
        let match = geoData[0];

        if (catalogEntry) {

            const sameRegion = geoData.find(function (place) {

                return (
                    place.region &&
                    catalogEntry.region &&
                    place.region.toLowerCase() ===
                    catalogEntry.region.toLowerCase()
                );
            });

            const sameCountry = geoData.find(function (place) {

                return (
                    place.country &&
                    catalogEntry.country &&
                    place.country.toLowerCase() ===
                    catalogEntry.country.toLowerCase()
                );
            });

            match = sameRegion || sameCountry || match;
        }

        const { lat, lon } = match;

        console.log(
            `Fetching WeatherAPI data for ${match.name}`
        );

        // Fetch 3-day forecast
        const forecastParams = new URLSearchParams({
            key: API_KEY,
            q: `${lat},${lon}`,
            days: "3",
            aqi: "no",
            alerts: "no"
        });

        const weatherUrl =
            `${BASE_URL}/forecast.json?${forecastParams.toString()}`;

        const weatherData = await fetchWithRetry(weatherUrl);

        // Validate response
        if (
            !weatherData.current ||
            !weatherData.current.condition ||
            !weatherData.forecast ||
            !Array.isArray(weatherData.forecast.forecastday)
        ) {
            throw new Error(
                "Invalid weather data received from WeatherAPI"
            );
        }

        // Format daily forecast
        const daily = weatherData.forecast.forecastday.map(
            function (day) {

                return {
                    date: day.date,

                    min: Math.round(
                        day.day.mintemp_c
                    ),

                    max: Math.round(
                        day.day.maxtemp_c
                    ),

                    code: convertWeatherCode(
                        day.day.condition.code
                    )
                };
            }
        );

        // Final response - compatible with existing frontend
        const data = {

            temp: Math.round(
                weatherData.current.temp_c
            ),

            code: convertWeatherCode(
                weatherData.current.condition.code
            ),

            daily: daily
        };

        // Save successful response
        cache.set(key, {
            time: Date.now(),
            data: data
        });

        console.log(
            `Weather successfully fetched: ${destination}`
        );

        return res.json(data);

    } catch (error) {

        console.error(
            "WeatherAPI error:",
            error.message
        );

        // Return stale cache if API is unavailable
        if (cached) {

            console.log(
                `Returning stale cached weather for ${destination}`
            );

            return res.json({
                ...cached.data,
                cached: true,
                stale: true,
                message: "Showing previously fetched weather data"
            });
        }

        return res.status(502).json({

            message: "Weather service temporarily unavailable",

            reason: error.message
        });
    }
});

module.exports = router;
