document.addEventListener("DOMContentLoaded", function () {

    console.log("OffWeGo Itenerary JS loaded");


    /* =====================================================
       FULL ITENERARY DROPDOWN
    ===================================================== */

    const button =
        document.getElementById("expandBtn");

    const extraDays =
        document.querySelectorAll(".extra-days");

    const icon =
        document.getElementById("expandIcon");

    const text =
        document.getElementById("expandText");


    console.log("Expand button:", button);

    console.log(
        "Extra days found:",
        extraDays.length
    );


    if (button) {

        button.addEventListener(
            "click",
            function () {

                const isOpen =
                    button.classList.contains("open");


                if (!isOpen) {

                    /* =========================
                       OPEN
                    ========================= */

                    extraDays.forEach(
                        function (day) {

                            day.classList.add("show");

                        }
                    );


                    button.classList.add("open");


                    if (icon) {

                        icon.textContent = "−";

                    }


                    if (text) {

                        text.textContent =
                            "Hide Full Itinerary";

                    }


                } else {

                    /* =========================
                       CLOSE
                    ========================= */

                    extraDays.forEach(
                        function (day) {

                            day.classList.remove("show");

                        }
                    );


                    button.classList.remove("open");


                    if (icon) {

                        icon.textContent = "+";

                    }


                    if (text) {

                        const totalDays =
                            document.querySelectorAll(
                                ".day-card"
                            ).length;


                        text.textContent =
                            "View Full Itinerary (" +
                            totalDays +
                            " Days)";

                    }

                }

            }
        );

    }


    /* =====================================================
       SAVE TRIP
    ===================================================== */

    const saveButton =
        document.getElementById("saveTripBtn");


    if (saveButton) {

        saveButton.addEventListener(
            "click",
            function () {

                const saved =
                    saveButton.classList.toggle(
                        "saved"
                    );


                const saveIcon =
                    document.getElementById(
                        "saveIcon"
                    );


                const saveText =
                    document.getElementById(
                        "saveText"
                    );


                if (saved) {

                    localStorage.setItem(
                        "offwegoSavedTrip",
                        "true"
                    );


                    if (saveIcon) {
                        saveIcon.textContent =
                            "♥";
                    }


                    if (saveText) {
                        saveText.textContent =
                            "Saved";
                    }


                    if (
                        !saveIcon &&
                        !saveText
                    ) {

                        saveButton.textContent =
                            "♥ Saved";

                    }

                } else {

                    localStorage.removeItem(
                        "offwegoSavedTrip"
                    );


                    if (saveIcon) {
                        saveIcon.textContent =
                            "♡";
                    }


                    if (saveText) {
                        saveText.textContent =
                            "Save Trip";
                    }


                    if (
                        !saveIcon &&
                        !saveText
                    ) {

                        saveButton.textContent =
                            "♡ Save Trip";

                    }

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
        document.querySelectorAll(
            ".tab-content"
        );


    tabs.forEach(
        function (tab) {

            tab.addEventListener(
                "click",
                function () {


                    /* Remove active
                       from all tabs */

                    tabs.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    /* Hide all content */

                    contents.forEach(
                        function (content) {

                            content.classList.remove(
                                "active"
                            );

                        }
                    );


                    /* Activate clicked tab */

                    tab.classList.add(
                        "active"
                    );


                    const target =
                        document.getElementById(
                            tab.dataset.tab
                        );


                    if (target) {

                        target.classList.add(
                            "active"
                        );

                    }

                }
            );

        }
    );


    /* =====================================================
       DASHBOARD BUTTON
    ===================================================== */

    const dashboardButton =
        document.getElementById(
            "dashboardBtn"
        );


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
        "✓ OffWeGo Itenerary ready"
    );

});