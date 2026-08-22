


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

// ==========================================
// LOAD SAVED TRIPS
// ==========================================

const tripGrid = document.getElementById("tripGrid");

const trips =
    JSON.parse(localStorage.getItem("offwegoTrips")) || [];


// GENERATING THE CARDS FOR TRIPS CREATED

trips.forEach(function (trip) {

    const card = document.createElement("a");

    card.classList.add("trip-card");

    card.href = "#";

    card.innerHTML = `
        <div class="trip-image">

            <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=700&q=85"
                alt="${trip.destination}"
            >

            <span class="trip-status">
                Upcoming
            </span>

        </div>

        <div class="trip-info">

            <h3>${trip.destination}</h3>

            <p class="trip-date">
                ${trip.startDate} - ${trip.endDate}
            </p>

            <div class="trip-bottom">

                <span>
                ♟ ${trip.adults} Adults · ${trip.children} Children
                </span>

                <strong>
                    ${trip.budget || "Budget not set"}
                </strong>

            </div>

        </div>
    `;

    tripGrid.appendChild(card);

});

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

        localStorage.removeItem("offwegoLoggedInUser");

        window.location.href = "login.html";

    });

}