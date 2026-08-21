// ==========================================
// DASHBOARD JAVASCRIPT
// ==========================================


// NEW TRIP BUTTON

const newTripBtn = document.getElementById("newTripBtn");

if (newTripBtn) {

    newTripBtn.addEventListener("click", function () {

        window.location.href = "trip.html";

    });

}


// ==========================================
// SURPRISE ME
// ==========================================

const surpriseBtn = document.getElementById("surpriseBtn");

const destinations = [
    "Manali",
    "Goa",
    "Dubai",
    "Paris",
    "Bali",
    "Kerala"
];

if (surpriseBtn) {

    surpriseBtn.addEventListener("click", function () {

        const randomIndex =
            Math.floor(Math.random() * destinations.length);

        const destination =
            destinations[randomIndex];

        alert(
            "✨ OffWeGo suggests: " + destination
        );

    });

}


// ==========================================
// LOGOUT
// ==========================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        localStorage.removeItem("offwegoUser");

        window.location.href = "login.html";

    });

}