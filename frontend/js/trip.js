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

    const destinations = [
        "Manali",
        "Goa",
        "Dubai",
        "Paris",
        "Bali",
        "Kerala",
        "Jaipur",
        "London"
    ];


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
        "change",
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


        reviewDestination.textContent =
            destination || "-";


        reviewDates.textContent =
            formatDates();


        reviewTravellers.textContent =
            adults + children;


        reviewBudget.textContent =
            budget.value || "-";


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


    createTripButton.addEventListener(
        "click",
        function () {


            if (!validateDestination()) {
                return;
            }


            if (!validateDates()) {
                return;
            }


            if (!budget.value) {

                alert(
                    "Please select your budget."
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

                totalTravellers:
                    adults + children,

                budget:
                    budget.value,

                interests:
                    selectedInterests,

                notes:
                    document.getElementById(
                        "notes"
                    ).value

            };


            /* Save trip */

            localStorage.setItem(
                "offwegoCurrentTrip",
                JSON.stringify(
                    tripData
                )
            );


            alert(
                "Your trip has been created successfully! ✈"
            );


            /*
                For now go back to dashboard.

                Later we can change this to:
                itinerary.html
            */

            window.location.href =
                "dashboard.html";

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

});