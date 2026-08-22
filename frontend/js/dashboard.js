


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

const viewAllContainer =
    document.getElementById("viewAllContainer");

const trips =
    JSON.parse(localStorage.getItem("offwegoTrips")) || [];


// ==========================================
// SORT TRIPS BY UPCOMING DATE
// ==========================================

const today = new Date();
today.setHours(0, 0, 0, 0);

const upcomingTrips = trips
    .filter(function (trip) {

        const tripDate = new Date(trip.startDate);

        return tripDate >= today;

    })
    .sort(function (a, b) {

        return new Date(a.startDate) -
               new Date(b.startDate);

    });


// ==========================================
// SHOW ONLY 3 TRIPS ON DASHBOARD
// ==========================================

const dashboardTrips =
    upcomingTrips.slice(0, 3);


// ==========================================
// GENERATE TRIP CARDS
// ==========================================

dashboardTrips.forEach(function (trip) {

    const card = document.createElement("a");

    card.classList.add("trip-card");

    card.href = "itinerary.html?id=" + trip.id;

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
                    ♟ ${trip.adults} Adults ·
                    ${trip.children} Children
                </span>

                <strong>
                    ${trip.budget || "Budget not set"}
                </strong>

            </div>

        </div>
    `;

    tripGrid.appendChild(card);

});


// ==========================================
// VIEW ALL TRIPS BUTTON
// ==========================================

if (viewAllContainer) {

    if (trips.length > 3) {

        viewAllContainer.style.display = "block";

    } else {

        viewAllContainer.style.display = "none";

    }

}

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