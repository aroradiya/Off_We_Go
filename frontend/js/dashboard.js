


// AUTHENTICATION CHECK 

const loggedInUser =
    JSON.parse(localStorage.getItem("offwegoLoggedInUser"));

if (!loggedInUser) {

    window.location.href = "login.html";

}

const userName = document.getElementById("userName");

if (userName) {

    userName.textContent = loggedInUser.name;

}

const profileAvatar = document.getElementById("profileAvatar");

if (profileAvatar) {

    profileAvatar.textContent =
        loggedInUser.name.charAt(0).toUpperCase();

}

// NEW TRIP BUTTON

const newTripBtn = document.getElementById("newTripBtn");

if (newTripBtn) {

    newTripBtn.addEventListener("click", function () {

        window.location.href = "create-trip.html";

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

        localStorage.removeItem("offwegoLoggedInUser");

        window.location.href = "login.html";

    });

}