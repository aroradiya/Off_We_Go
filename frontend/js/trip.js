// =====================================================
// OFFWEGO - PLAN TRIP JAVASCRIPT
// =====================================================


// =====================================================
// DESTINATION SELECTION
// =====================================================

const destinationInput =
    document.getElementById("destination");

const destinationCards =
    document.querySelectorAll(".destination-card");


destinationCards.forEach(function (card) {

    card.addEventListener("click", function () {

        // Remove selection from all cards

        destinationCards.forEach(function (item) {

            item.classList.remove("selected");

        });


        // Select clicked card

        card.classList.add("selected");


        // Put destination in input

        destinationInput.value =
            card.dataset.destination;

    });

});


// =====================================================
// NUMBER OF TRAVELLERS
// =====================================================

let people = 2;


const peopleCount =
    document.getElementById("peopleCount");


const increasePeople =
    document.getElementById("increasePeople");


const decreasePeople =
    document.getElementById("decreasePeople");


increasePeople.addEventListener("click", function () {

    if (people < 20) {

        people++;

        peopleCount.textContent = people;

    }

});


decreasePeople.addEventListener("click", function () {

    if (people > 1) {

        people--;

        peopleCount.textContent = people;

    }

});


// =====================================================
// DATE VALIDATION
// =====================================================

const startDate =
    document.getElementById("startDate");

const endDate =
    document.getElementById("endDate");


startDate.addEventListener("change", function () {

    endDate.min = startDate.value;

});


// =====================================================
// FORM SUBMISSION
// =====================================================

const tripForm =
    document.getElementById("tripForm");


tripForm.addEventListener("submit", function (event) {

    event.preventDefault();


    // -----------------------------------------
    // Get values
    // -----------------------------------------

    const destination =
        destinationInput.value.trim();


    const start =
        startDate.value;


    const end =
        endDate.value;


    const budget =
        document.getElementById("budget").value;


    const interests =
        Array.from(
            document.querySelectorAll(
                'input[name="interest"]:checked'
            )
        ).map(function (item) {

            return item.value;

        });


    const travelStyle =
        document.querySelector(
            'input[name="travelStyle"]:checked'
        );


    // -----------------------------------------
    // Validation
    // -----------------------------------------

    if (!destination) {

        alert("Please select a destination.");

        return;

    }


    if (!start || !end) {

        alert("Please select your travel dates.");

        return;

    }


    if (new Date(end) < new Date(start)) {

        alert("End date cannot be before start date.");

        return;

    }


    if (!budget || budget <= 0) {

        alert("Please enter your budget.");

        return;

    }


    if (!travelStyle) {

        alert("Please select your travel style.");

        return;

    }


    // -----------------------------------------
    // Create trip object
    // -----------------------------------------

    const trip = {

        destination: destination,

        startDate: start,

        endDate: end,

        people: people,

        budget: Number(budget),

        interests: interests,

        travelStyle: travelStyle.value

    };


    // -----------------------------------------
    // Save temporarily
    // -----------------------------------------

    localStorage.setItem(
        "offwegoCurrentTrip",
        JSON.stringify(trip)
    );


    // -----------------------------------------
    // Go to itinerary
    // -----------------------------------------

    window.location.href =
        "itinerary.html";

});