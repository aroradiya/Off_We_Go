// ===============================
// HERO BUTTONS
// ===============================

const planTripButton = document.querySelector(".primary-btn");
const exploreButton = document.querySelector(".secondary-btn");


// Plan Your Trip
planTripButton.addEventListener("click", function () {

    window.location.href = "pages/plan-trip.html";

});


// Explore Destinations
exploreButton.addEventListener("click", function () {

    document
        .getElementById("destinations")
        .scrollIntoView({
            behavior: "smooth"
        });

});