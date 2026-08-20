document.addEventListener("DOMContentLoaded", function () {

    console.log("Manali Itinerary JS loaded");


    /* =====================================================
       FULL ITINERARY DROPDOWN
    ===================================================== */

    const button = document.getElementById("fullItineraryBtn");

    const extraDays = document.getElementById("extraDays");

    const icon = document.getElementById("expandIcon");

    const text = document.getElementById("expandText");


    console.log("Button:", button);
    console.log("Extra days:", extraDays);


    if (!button) {

        console.error(
            "ERROR: fullItineraryBtn was not found."
        );

        return;

    }


    if (!extraDays) {

        console.error(
            "ERROR: extraDays was not found."
        );

        return;

    }


    /* =====================================================
       BUTTON CLICK
    ===================================================== */

    button.addEventListener("click", function () {

        console.log("Itinerary button clicked");


        const isOpen =
            extraDays.classList.contains("show");


        if (!isOpen) {

            /* =============================================
               OPEN
            ============================================= */

            extraDays.classList.add("show");

            button.classList.add("open");


            if (icon) {
                icon.textContent = "−";
            }


            if (text) {
                text.textContent =
                    "Hide Full Itinerary";
            }


        } else {

            /* =============================================
               CLOSE
            ============================================= */

            extraDays.classList.remove("show");

            button.classList.remove("open");


            if (icon) {
                icon.textContent = "+";
            }


            if (text) {
                text.textContent =
                    "View Full Itinerary (4 Days)";
            }

        }

    });


    /* =====================================================
       SAVE TRIP
    ===================================================== */

    const saveButton =
        document.getElementById("saveTripBtn");


    if (saveButton) {

        saveButton.addEventListener(
            "click",
            function () {

                localStorage.setItem(
                    "offwegoSavedManaliTrip",
                    "true"
                );


                const saveIcon =
                    document.getElementById("saveIcon");


                const saveText =
                    document.getElementById("saveText");


                if (saveIcon) {
                    saveIcon.textContent = "♥";
                }


                if (saveText) {
                    saveText.textContent = "Saved";
                }

            }
        );

    }


    /* =====================================================
       TABS
    ===================================================== */

    const tabs =
        document.querySelectorAll(".tab");


    const contents =
        document.querySelectorAll(".tab-content");


    tabs.forEach(function (tab) {

        tab.addEventListener(
            "click",
            function () {

                tabs.forEach(function (item) {

                    item.classList.remove("active");

                });


                contents.forEach(function (content) {

                    content.classList.remove("active");

                });


                tab.classList.add("active");


                const target =
                    document.getElementById(
                        tab.dataset.tab
                    );


                if (target) {

                    target.classList.add("active");

                }

            }
        );

    });


    /* =====================================================
       DASHBOARD
    ===================================================== */

    const dashboardButton =
        document.getElementById("dashboardBtn");


    if (dashboardButton) {

        dashboardButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "dashboard.html";

            }
        );

    }


    /* =====================================================
       PAGE LOADED
    ===================================================== */

    console.log(
        "✓ Manali itinerary is ready."
    );

});