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

        const isFormData = options.body instanceof FormData;
        const headers = isFormData ? {} : { "Content-Type": "application/json" };
        const token = this.getToken();
        if (token) {
            headers.Authorization = "Bearer " + token;
        }

        let response;
        try {
            response = await fetch(API_BASE + path, {
                method: method,
                headers: headers,
                body: options.body ? (isFormData ? options.body : JSON.stringify(options.body)) : undefined,
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

    async getMe() {
        const data = await this.request("/auth/me");
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return data.user;
    },
    async uploadAvatar(file) {
        const formData = new FormData();
        formData.append("avatar", file);
        const data = await this.request("/auth/me/avatar", { method: "PUT", body: formData });
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return data.user;
    },

    async deleteAvatar() {
        const data = await this.request("/auth/me/avatar", { method: "DELETE" });
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return data.user;
    },

    login(email, password) {
        return this.request("/auth/login", { method: "POST", body: { email: email, password: password } });
    },

    register(name, email, password) {
        return this.request("/auth/register", { method: "POST", body: { name: name, email: email, password: password } });
    },
    getWeather(destination) {
        return this.request("/weather?destination=" + encodeURIComponent(destination));
    },

    // ---------- Destinations (the catalog) ----------

    // Every destination, without the long day plans. Fetched once per page.
    getDestinations() {
        if (!this._destinationsPromise) {
            this._destinationsPromise = this.request("/destinations")
                .then(function (data) {
                    return data.destinations;
                })
                .catch(function (error) {
                    OffWeGoAPI._destinationsPromise = null; // try again next time
                    throw error;
                });
        }
        return this._destinationsPromise;
    },

    // One destination with its day plans. Fails with status 404 if it is not in the catalog.
    async getDestination(name) {
        const data = await this.request("/destinations/" + encodeURIComponent(slugify(name)));
        return data.destination;
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
    async uploadBookingDocument(tripId, bookingId, file) {
        const formData = new FormData();
        formData.append("document", file);
        const data = await this.request(
            "/trips/" + encodeURIComponent(tripId) + "/bookings/" + encodeURIComponent(bookingId) + "/document",
            { method: "PUT", body: formData }
        );
        return toWebsiteBooking(data.booking);
    },
    async deleteBookingDocument(tripId, bookingId) {
        const data = await this.request(
            "/trips/" + encodeURIComponent(tripId) + "/bookings/" + encodeURIComponent(bookingId) + "/document",
            { method: "DELETE" }
        );
        return toWebsiteBooking(data.booking);
    },

    deleteBooking(tripId, bookingId) {
        return this.request(
            "/trips/" + encodeURIComponent(tripId) + "/bookings/" + encodeURIComponent(bookingId),
            { method: "DELETE" }
        );
    },

    async uploadTripCover(id, file) {
        const formData = new FormData();
        formData.append("cover", file);
        const data = await this.request("/trips/" + encodeURIComponent(id) + "/cover", { method: "PUT", body: formData });
        return toWebsiteTrip(data.trip);
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
        coverUrl: (trip.coverImage && trip.coverImage.url) || "",
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
        documentUrl: (booking.document && booking.document.url) || "",
        documentName: (booking.document && booking.document.originalName) || "",
    };
    };

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

// "Hill Station" -> "hill-station": how a destination name becomes its web address
function slugify(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function showMessage(text) {
    let box = document.getElementById("toast-box");
    if (!box) {
        box = document.createElement("div");
        box.id = "toast-box";
        document.body.appendChild(box);
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = text;
    box.appendChild(toast);

    setTimeout(function () {
        toast.remove();
    }, 3500);
}

function flashMessage(text) {
    sessionStorage.setItem("offwegoFlash", text);
}

document.addEventListener("DOMContentLoaded", function () {
    const flash = sessionStorage.getItem("offwegoFlash");
    if (flash) {
        sessionStorage.removeItem("offwegoFlash");
        showMessage(flash);
    }
});

const toastStyle = document.createElement("style");
toastStyle.textContent = `
    #toast-box {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 99999;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        pointer-events: none;
    }

    .toast {
        background: rgba(255, 255, 255, 0.75);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        color: #17233c;
        padding: 12px 24px;
        border-radius: 50px;
        border: 1px solid rgba(255, 255, 255, 0.6);
        font-family: Arial, Helvetica, sans-serif;
        font-size: 14px;
        font-weight: 600;
        text-align: center;
        max-width: 90vw;
        box-shadow: 0 6px 20px rgba(18, 59, 120, 0.15);
        animation: toast-in 0.3s ease, toast-out 0.3s ease 3.2s forwards;
    }

    @keyframes toast-in {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes toast-out {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(toastStyle);

function askConfirm(text) {
    return new Promise(function (resolve) {
        const overlay = document.createElement("div");
        overlay.className = "confirm-overlay";
        overlay.innerHTML = `
            <div class="confirm-box">
                <p></p>
                <div class="confirm-buttons">
                    <button type="button" class="confirm-cancel">Cancel</button>
                    <button type="button" class="confirm-ok">Yes, continue</button>
                </div>
            </div>
        `;
        overlay.querySelector("p").textContent = text;
        document.body.appendChild(overlay);

        function close(answer) {
            overlay.remove();
            resolve(answer);
        }

        overlay.querySelector(".confirm-ok").addEventListener("click", function () {
            close(true);
        });
        overlay.querySelector(".confirm-cancel").addEventListener("click", function () {
            close(false);
        });
        overlay.addEventListener("click", function (event) {
            if (event.target === overlay) {
                close(false);
            }
        });
    });
}

const confirmStyle = document.createElement("style");
confirmStyle.textContent = `
    .confirm-overlay {
        position: fixed;
        inset: 0;
        background: rgba(23, 35, 60, 0.35);
        backdrop-filter: blur(3px);
        -webkit-backdrop-filter: blur(3px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100000;
    }

    .confirm-box {
        background: rgba(255, 255, 255, 0.92);
        padding: 26px 28px;
        border-radius: 14px;
        max-width: 380px;
        width: 90%;
        font-family: Arial, Helvetica, sans-serif;
        box-shadow: 0 12px 36px rgba(18, 59, 120, 0.25);
        text-align: center;
    }

    .confirm-box p {
        margin: 0 0 22px;
        font-size: 15px;
        font-weight: 600;
        color: #17233c;
        line-height: 1.5;
    }

    .confirm-buttons {
        display: flex;
        gap: 12px;
        justify-content: center;
    }

    .confirm-buttons button {
        padding: 10px 22px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
    }

    .confirm-cancel {
        background: #edf0f4;
        color: #17233c;
    }

    .confirm-ok {
        background: #123b78;
        color: white;
    }

    .confirm-ok:hover {
        background: #0c2d60;
    }
`;
document.head.appendChild(confirmStyle);