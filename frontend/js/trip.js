// Only logged-in users can create trips
if (!OffWeGoAPI.getToken()) {
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", function () {


    /* =========================================
       STEP NAVIGATION
    ========================================== */

    const stepButtons =
        document.querySelectorAll(".step-button");

    const sections = [
        "destination-section",
        "dates-section",
        "travellers-section",
        "preferences-section"
    ];


    function scrollToSection(sectionId) {

        const section =
            document.getElementById(sectionId);

        if (!section) {
            return;
        }

        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    function updateSteps(currentSection) {

        const currentIndex =
            sections.indexOf(currentSection);


        stepButtons.forEach(function (button) {

            const buttonStep =
                Number(button.dataset.step);

            button.classList.remove("active");
            button.classList.remove("completed");


            if (buttonStep - 1 < currentIndex) {

                button.classList.add(
                    "completed"
                );

            }


            if (buttonStep - 1 === currentIndex) {

                button.classList.add(
                    "active"
                );

            }

        });

    }


    stepButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const target =
                    button.dataset.target;

                scrollToSection(target);

                updateSteps(target);

            }
        );

    });


    /* =========================================
       NEXT BUTTONS
    ========================================== */

    const nextButtons =
        document.querySelectorAll(
            ".next-button"
        );


    nextButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const target =
                    button.dataset.next;


                if (
                    target ===
                    "dates-section"
                ) {

                    if (!validateDestination()) {
                        return;
                    }

                }


                if (
                    target ===
                    "travellers-section"
                ) {

                    if (!validateDates()) {
                        return;
                    }

                }


                scrollToSection(target);

                updateSteps(target);

                updateReview();

            }
        );

    });


    /* =========================================
       BACK BUTTONS
    ========================================== */

    const backButtons =
        document.querySelectorAll(
            ".back-button"
        );


    backButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const target =
                    button.dataset.back;

                scrollToSection(target);

                updateSteps(target);

            }
        );

    });


    /* =========================================
       DESTINATION
    ========================================== */

    const destinationCards =
        document.querySelectorAll(
            ".destination-card"
        );


    const selectedDestination =
        document.getElementById(
            "selectedDestination"
        );


    const destinationSearch =
        document.getElementById(
            "destinationSearch"
        );


    let destination = "";


    destinationCards.forEach(function (card) {

        card.addEventListener(
            "click",
            function () {

                destination =
                    card.dataset.destination;


                destinationCards.forEach(
                    function (item) {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                card.classList.add(
                    "selected"
                );


                selectedDestination.textContent =
                    destination;


                destinationSearch.value =
                    destination;

            }
        );

    });


    function validateDestination() {

        if (destination === "") {

            alert(
                "Please select a destination first."
            );

            scrollToSection(
                "destination-section"
            );

            updateSteps(
                "destination-section"
            );

            return false;
        }


        return true;

    }


    /* =========================================
       DESTINATION SEARCH
    ========================================== */

    // Starts with a short built-in list, then switches to the full catalog once it loads
    let destinations = [
        "Manali",
        "Goa",
        "Dubai",
        "Paris",
        "Bali",
        "Kerala",
        "Jaipur",
        "London"
    ];

    OffWeGoAPI.getDestinations()
        .then(function (catalog) {

            if (catalog.length > 0) {
                destinations = catalog.map(function (item) {
                    return item.name;
                });
            }

        })
        .catch(function () {
            // keep the built-in list if the catalog cannot be loaded
        });


    const suggestions =
        document.getElementById(
            "destinationSuggestions"
        );


    destinationSearch.addEventListener(
        "input",
        function () {

            const value =
                destinationSearch.value
                    .trim()
                    .toLowerCase();


            suggestions.innerHTML = "";


            if (value === "") {
                return;
            }


            const matches =
                destinations.filter(
                    function (item) {

                        return item
                            .toLowerCase()
                            .includes(value);

                    }
                );


            matches.forEach(
                function (item) {

                    const suggestion =
                        document.createElement(
                            "button"
                        );


                    suggestion.type =
                        "button";


                    suggestion.className =
                        "suggestion-item";


                    suggestion.textContent =
                        item;


                    suggestion.style.display =
                        "block";

                    suggestion.style.width =
                        "100%";

                    suggestion.style.textAlign =
                        "left";

                    suggestion.style.padding =
                        "12px 15px";

                    suggestion.style.border =
                        "1px solid #dce4ef";

                    suggestion.style.background =
                        "#ffffff";

                    suggestion.style.cursor =
                        "pointer";


                    suggestion.addEventListener(
                        "click",
                        function () {

                            destination =
                                item;

                            destinationSearch.value =
                                item;

                            selectedDestination.textContent =
                                item;

                            suggestions.innerHTML =
                                "";

                        }
                    );


                    suggestions.appendChild(
                        suggestion
                    );

                }
            );

        }
    );


    /* =========================================
       DATES
    ========================================== */

    const startDate =
        document.getElementById(
            "startDate"
        );


    const endDate =
        document.getElementById(
            "endDate"
        );


    const dateMessage =
        document.getElementById(
            "dateMessage"
        );


    function validateDates() {

        if (
            startDate.value === "" ||
            endDate.value === ""
        ) {

            dateMessage.textContent =
                "Please select both start and end dates.";

            scrollToSection(
                "dates-section"
            );

            updateSteps(
                "dates-section"
            );

            return false;

        }


        const start =
            new Date(
                startDate.value
            );


        const end =
            new Date(
                endDate.value
            );


        if (end < start) {

            dateMessage.textContent =
                "End date cannot be before start date.";

            return false;

        }


        dateMessage.textContent = "";

        return true;

    }


    startDate.addEventListener(
        "change",
        function () {

            if (
                endDate.value &&
                endDate.value < startDate.value
            ) {

                endDate.value =
                    startDate.value;

            }

        }
    );


    /* =========================================
       TRAVELLERS
    ========================================== */

    const adultMinus =
        document.getElementById(
            "adultMinus"
        );


    const adultPlus =
        document.getElementById(
            "adultPlus"
        );


    const childMinus =
        document.getElementById(
            "childMinus"
        );


    const childPlus =
        document.getElementById(
            "childPlus"
        );


    const adultCount =
        document.getElementById(
            "adultCount"
        );


    const childCount =
        document.getElementById(
            "childCount"
        );


    const totalTravellers =
        document.getElementById(
            "totalTravellers"
        );


    let adults = 1;

    let children = 0;


    function updateTravellerCount() {

        adultCount.textContent =
            adults;

        childCount.textContent =
            children;

        totalTravellers.textContent =
            adults + children;

    }


    adultPlus.addEventListener(
        "click",
        function () {

            adults++;

            updateTravellerCount();

            updateReview();

        }
    );


    adultMinus.addEventListener(
        "click",
        function () {

            if (adults > 1) {

                adults--;

                updateTravellerCount();

                updateReview();

            }

        }
    );


    childPlus.addEventListener(
        "click",
        function () {

            children++;

            updateTravellerCount();

            updateReview();

        }
    );


    childMinus.addEventListener(
        "click",
        function () {

            if (children > 0) {

                children--;

                updateTravellerCount();

                updateReview();

            }

        }
    );


    /* =========================================
       INTERESTS
    ========================================== */

    const interestButtons =
        document.querySelectorAll(
            ".interest-button"
        );


    let selectedInterests = [];


    interestButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const interest =
                        button.dataset.interest;


                    if (
                        selectedInterests.includes(
                            interest
                        )
                    ) {

                        selectedInterests =
                            selectedInterests.filter(
                                function (item) {

                                    return item !==
                                        interest;

                                }
                            );


                        button.classList.remove(
                            "selected"
                        );

                    } else {

                        selectedInterests.push(
                            interest
                        );


                        button.classList.add(
                            "selected"
                        );

                    }


                    updateReview();

                }
            );

        }
    );


    /* =========================================
       BUDGET
    ========================================== */

    const budget =
        document.getElementById(
            "budget"
        );


    budget.addEventListener(
        "input",
        updateReview
    );


    /* =========================================
       REVIEW
    ========================================== */

    function formatDates() {

        if (
            startDate.value === "" ||
            endDate.value === ""
        ) {

            return "-";

        }


        const start =
            new Date(
                startDate.value
            );


        const end =
            new Date(
                endDate.value
            );


        return (
            start.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            )
            +
            " - "
            +
            end.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            )
        );

    }


    function updateReview() {

        const reviewDestination =
            document.getElementById(
                "reviewDestination"
            );


        const reviewDates =
            document.getElementById(
                "reviewDates"
            );


        const reviewTravellers =
            document.getElementById(
                "reviewTravellers"
            );


        const reviewBudget =
            document.getElementById(
                "reviewBudget"
            );


        const reviewInterests =
            document.getElementById(
                "reviewInterests"
            );


        // trip.html has no review panel yet, so there is nothing to update
        if (!reviewDestination) {
            return;
        }


        reviewDestination.textContent =
            destination || "-";


        reviewDates.textContent =
            formatDates();


        reviewTravellers.textContent =
            adults + children;


        reviewBudget.textContent =
            budget.value ? "₹" + budget.value : "-";


        reviewInterests.textContent =
            selectedInterests.length > 0
                ? selectedInterests.join(
                    ", "
                )
                : "None";

    }


    /* =========================================
       CREATE TRIP
    ========================================== */

    const createTripButton =
        document.getElementById(
            "createTripButton"
        );


    // When the page is opened as trip.html?edit=<trip id>, it edits that trip instead of creating a new one
    const editId =
        new URLSearchParams(window.location.search).get("edit");


    createTripButton.addEventListener(
        "click",
        async function () {


            if (!validateDestination()) {
                return;
            }


            if (!validateDates()) {
                return;
            }


            if (!(Number(budget.value) > 0)) {

                alert(
                    "Please enter your total budget as a number greater than 0."
                );

                scrollToSection(
                    "preferences-section"
                );

                return;

            }


            const tripData = {

                destination:
                    destination,

                startDate:
                    startDate.value,

                endDate:
                    endDate.value,

                adults:
                    adults,

                children:
                    children,

                budgetAmount:
                    Number(budget.value),

                interests:
                    selectedInterests,

                notes:
                    document.getElementById(
                        "notes"
                    ).value

            };


            /* Save trip to the backend */

            createTripButton.disabled = true;

            try {

                if (editId) {

                    await OffWeGoAPI.updateTrip(editId, tripData);

                    alert(
                        "Your trip has been updated successfully! ✔"
                    );

                    window.location.href =
                        "itinerary.html?id=" + encodeURIComponent(editId);

                } else {

                    await OffWeGoAPI.createTrip(tripData);

                    alert(
                        "Your trip has been created successfully! ✈"
                    );

                    window.location.href =
                        "dashboard.html";

                }

            } catch (error) {

                alert(error.message);

                createTripButton.disabled = false;

            }

        }
    );


    /* =========================================
       SCROLL-BASED ACTIVE STEP
    ========================================== */

    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            updateSteps(
                                entry.target.id
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.35
            }
        );


    sections.forEach(
        function (sectionId) {

            const section =
                document.getElementById(
                    sectionId
                );


            if (section) {

                observer.observe(
                    section
                );

            }

        }
    );


    /* Initial state */

    updateTravellerCount();

    updateReview();


    /* =========================================
       EDIT MODE: fill the form with the saved trip
    ========================================== */

    async function loadTripForEditing() {

        createTripButton.disabled = true;

        try {

            const trip = await OffWeGoAPI.getTrip(editId);

            destination = trip.destination;
            destinationSearch.value = trip.destination;
            selectedDestination.textContent = trip.destination;

            destinationCards.forEach(function (card) {
                card.classList.toggle(
                    "selected",
                    card.dataset.destination === trip.destination
                );
            });

            startDate.value = trip.startDate;
            endDate.value = trip.endDate;

            adults = trip.adults;
            children = trip.children;
            updateTravellerCount();

            budget.value = trip.budgetAmount > 0 ? trip.budgetAmount : "";

            selectedInterests = trip.interests.slice();
            interestButtons.forEach(function (button) {
                button.classList.toggle(
                    "selected",
                    selectedInterests.includes(button.dataset.interest)
                );
            });

            document.getElementById("notes").value = trip.notes;

            createTripButton.textContent = "Save Changes ✔";
            document.title = "Edit Trip - OffWeGo";

            const heading = document.querySelector(".page-heading h1");
            if (heading) {
                heading.textContent = "Edit Your Trip";
            }

            updateReview();

            createTripButton.disabled = false;

        } catch (error) {

            if (error.status !== 401) {
                alert(error.message);
                window.location.href = "dashboard.html";
            }

        }

    }

    if (editId) {
        loadTripForEditing();
    }

});