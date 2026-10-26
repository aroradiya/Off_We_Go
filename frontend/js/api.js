// Shared helper for talking to the OffWeGo backend.
// Every page that needs the backend loads this file BEFORE its own script.

const API_BASE = "http://localhost:5000/api";

const TOKEN_KEY = "offwegoToken";
const USER_KEY = "offwegoLoggedInUser"; // same key the dashboard already reads

const OffWeGoAPI = {

    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    saveSession(token, user) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    clearSession() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    // Sends a request to the backend. Returns the JSON reply, or throws an Error with a readable message.
    async request(path, options = {}) {
        const method = options.method || "GET";

        const headers = { "Content-Type": "application/json" };
        const token = this.getToken();
        if (token) {
            headers.Authorization = "Bearer " + token;
        }

        let response;
        try {
            response = await fetch(API_BASE + path, {
                method: method,
                headers: headers,
                body: options.body ? JSON.stringify(options.body) : undefined,
            });
        } catch (error) {
            throw new Error("Unable to connect to the server. Is the backend running?");
        }

        const data = await response.json().catch(function () {
            return {};
        });

        // Token missing, expired or invalid: log out and go to the login page
        // (login/register failures are normal errors, so they are excluded)
        if (response.status === 401 && token && !path.startsWith("/auth/login") && !path.startsWith("/auth/register")) {
            this.clearSession();
            window.location.href = "login.html";
        }

        if (!response.ok) {
            const error = new Error(data.message || "Something went wrong");
            error.status = response.status;
            throw error;
        }

        return data;
    },

    login(email, password) {
        return this.request("/auth/login", { method: "POST", body: { email: email, password: password } });
    },

    register(name, email, password) {
        return this.request("/auth/register", { method: "POST", body: { name: name, email: email, password: password } });
    },

    // ---------- Trips ----------

    async listTrips() {
        const data = await this.request("/trips");
        return data.trips.map(toWebsiteTrip);
    },

    async getTrip(id) {
        const data = await this.request("/trips/" + encodeURIComponent(id));
        return toWebsiteTrip(data.trip);
    },

    // trip = { destination, startDate, endDate, adults, children, budget, interests, notes }
    async createTrip(trip) {
        const data = await this.request("/trips", { method: "POST", body: toApiTrip(trip) });
        return toWebsiteTrip(data.trip);
    },

    async updateTrip(id, trip) {
        const data = await this.request("/trips/" + encodeURIComponent(id), { method: "PUT", body: toApiTrip(trip) });
        return toWebsiteTrip(data.trip);
    },

    // days = [{ title, activities: [{ icon, name, description, time }] }]
    async saveItinerary(id, days) {
        const data = await this.request("/trips/" + encodeURIComponent(id) + "/itinerary", {
            method: "PUT",
            body: { itinerary: days },
        });
        return toWebsiteTrip(data.trip);
    },

    // ---------- Bookings (flights, stays, transport, activities) ----------

    async listBookings(tripId) {
        const data = await this.request("/trips/" + encodeURIComponent(tripId) + "/bookings");
        return data.bookings.map(toWebsiteBooking);
    },

    async createBooking(tripId, booking) {
        const data = await this.request("/trips/" + encodeURIComponent(tripId) + "/bookings", {
            method: "POST",
            body: toApiBooking(booking),
        });
        return toWebsiteBooking(data.booking);
    },

    async updateBooking(tripId, bookingId, booking) {
        const data = await this.request(
            "/trips/" + encodeURIComponent(tripId) + "/bookings/" + encodeURIComponent(bookingId),
            { method: "PUT", body: toApiBooking(booking) }
        );
        return toWebsiteBooking(data.booking);
    },

    deleteBooking(tripId, bookingId) {
        return this.request(
            "/trips/" + encodeURIComponent(tripId) + "/bookings/" + encodeURIComponent(bookingId),
            { method: "DELETE" }
        );
    },

    deleteTrip(id) {
        return this.request("/trips/" + encodeURIComponent(id), { method: "DELETE" });
    },
};

// Converts a trip from the website's shape to what the backend expects
function toApiTrip(trip) {
    return {
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
        adults: trip.adults,
        children: trip.children,
        budget: { amount: trip.budgetAmount, currency: "INR" },
        interests: trip.interests,
        notes: trip.notes,
    };
}

// The database stores a trip one way; the website pages expect it another way.
// This converts it, so the pages that show trips barely need to change.
function toWebsiteTrip(trip) {
    const budgetAmount = trip.budget && trip.budget.amount > 0 ? trip.budget.amount : 0;
    const currency = (trip.budget && trip.budget.currency) || "INR";

    return {
        id: trip._id,
        destination: trip.destination,
        startDate: String(trip.startDate).slice(0, 10), // "2026-12-20"
        endDate: String(trip.endDate).slice(0, 10),
        adults: trip.adults != null ? trip.adults : 1,
        children: trip.children != null ? trip.children : 0,
        budgetAmount: budgetAmount,
        currency: currency,
        // Shown on cards and pages: the amount if there is one, otherwise the old range text
        budget: budgetAmount > 0 ? formatMoney(budgetAmount, currency) : (trip.budgetRange || ""),
        interests: trip.interests || [],
        notes: trip.notes || "",
        itinerary: trip.itinerary || [],
    };
}

// Same idea for bookings: database shape <-> website shape
function toWebsiteBooking(booking) {
    return {
        id: booking._id,
        type: booking.type,
        title: booking.title,
        provider: booking.provider || "",
        confirmationNumber: booking.confirmationNumber || "",
        startDate: String(booking.startDate).slice(0, 10),
        endDate: booking.endDate ? String(booking.endDate).slice(0, 10) : "",
        cost: booking.cost || 0,
        currency: booking.currency || "INR",
        status: booking.status,
        notes: booking.notes || "",
    };
}

function toApiBooking(booking) {
    return {
        type: booking.type,
        title: booking.title,
        provider: booking.provider,
        confirmationNumber: booking.confirmationNumber,
        startDate: booking.startDate,
        endDate: booking.endDate || null, // null clears the end date
        cost: booking.cost,
        currency: booking.currency,
        status: booking.status,
        notes: booking.notes,
    };
}

// 50000 -> "₹50,000"
function formatMoney(amount, currency) {
    try {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: currency,
            maximumFractionDigits: 0,
        }).format(amount);
    } catch (error) {
        return currency + " " + amount;
    }
}