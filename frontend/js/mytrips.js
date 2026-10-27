// ==========================================
// AUTHENTICATION CHECK
// ==========================================

const loggedInUser =
    JSON.parse(localStorage.getItem("offwegoLoggedInUser"));

if (!loggedInUser || !OffWeGoAPI.getToken()) {

    window.location.href = "login.html";

}


// ==========================================
// LOAD SAVED TRIPS
// ==========================================

const upcomingGrid =
    document.getElementById("upcomingGrid");

const completedGrid =
    document.getElementById("completedGrid");

// Trips now come from the backend, so everything that uses them runs inside this function
async function loadMyTrips() {

const trips = await OffWeGoAPI.listTrips();


// ==========================================
// EMPTY STATE
// ==========================================

if (trips.length === 0) {

    upcomingGrid.innerHTML = `
        <div class="empty-trips">

            <h2>No trips yet</h2>

            <p>
                You haven't planned any trips yet.
                Start planning your next adventure!
            </p>

            <a href="trip.html">
                + Create a Trip
            </a>

        </div>
    `;
}


// ==========================================
// SEPARATE UPCOMING AND COMPLETED TRIPS
// ==========================================

const today = new Date();
today.setHours(0, 0, 0, 0);


const upcomingTrips = trips.filter(function (trip) {

    const endDate = new Date(trip.endDate);

    return endDate >= today;

});


const completedTrips = trips.filter(function (trip) {

    const endDate = new Date(trip.endDate);

    return endDate < today;

});


// ==========================================
// GENERATE TRIP CARDS
// ==========================================


function createTripCard(trip, status) {

    const card =
        document.createElement("a");

    card.classList.add("trip-card");

    card.href =
        "itinerary.html?id=" + trip.id;

 
    const coverSrc = trip.coverUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=700&q=85";
    card.innerHTML = `
        <div class="trip-image">

            <img
                src="${coverSrc}"
                alt="${trip.destination}"
            >

            <span class="trip-status">
            ${status}
            </span>

        </div>

        <div class="trip-info">

            <h3>
                ${trip.destination}
            </h3>

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

    return card;
}

// ==========================================
// DISPLAY UPCOMING TRIPS
// ==========================================

upcomingTrips.forEach(function (trip) {

    const card = createTripCard(trip, "Upcoming");

    upcomingGrid.appendChild(card);

});

// ==========================================
// DISPLAY COMPLETED TRIPS
// ==========================================

completedTrips.forEach(function (trip) {

    const card = createTripCard(trip, "Completed");
    completedGrid.appendChild(card);

});

}

loadMyTrips().catch(function (error) {
    console.error(error);
    if (error.status !== 401) alert(error.message);
});