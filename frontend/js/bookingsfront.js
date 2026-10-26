// Bookings tab on the trip page: flights, stays, transport, activities.
// Needs api.js loaded first. Reads the trip id from the page address (?id=...).

(function () {

    const tripId = new URLSearchParams(window.location.search).get("id");
    const bookingsPanel = document.getElementById("bookingsPanel");

    if (!tripId || !bookingsPanel || !OffWeGoAPI.getToken()) {
        return;
    }

    const itineraryPanel = document.getElementById("itineraryPanel");
    const tabItinerary = document.getElementById("tabItinerary");
    const tabBookings = document.getElementById("tabBookings");
    const bookingCount = document.getElementById("bookingCount");
    const addBookingButton = document.getElementById("addBookingButton");
    const summaryArea = document.getElementById("bookingSummary");
    const formArea = document.getElementById("bookingFormArea");
    const listArea = document.getElementById("bookingList");

    // What each booking type looks like and what its fields are called
    const TYPES = {
        flight:    { icon: "✈️", label: "Flight",    titleHint: "e.g. Delhi to Kullu flight", startLabel: "Departure date", endLabel: "Arrival date (optional)" },
        stay:      { icon: "🏨", label: "Stay",      titleHint: "e.g. Snow Valley Resort",   startLabel: "Check-in date",  endLabel: "Check-out date" },
        transport: { icon: "🚆", label: "Transport", titleHint: "e.g. Train to Chandigarh",  startLabel: "Start date",     endLabel: "End date (optional)" },
        activity:  { icon: "🎟️", label: "Activity",  titleHint: "e.g. Paragliding tickets",  startLabel: "Date",           endLabel: "End date (optional)" },
        other:     { icon: "📌", label: "Other",     titleHint: "e.g. Travel insurance",     startLabel: "Start date",     endLabel: "End date (optional)" }
    };

    const STATUS_LABELS = {
        booked: "Booked",
        planned: "Planned",
        cancelled: "Cancelled"
    };

    let bookings = [];

    // The trip's total budget (loaded separately); amount 0 means none was set
    let tripBudget = { amount: 0, currency: "INR" };


    /* ---------- small helpers ---------- */

    function el(tag, className, text) {

        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined) {
            element.textContent = text;
        }

        return element;
    }


    function formatDate(isoDate) {

        // "2026-12-20" -> "20 Dec 2026" (UTC so the date never shifts)
        const parts = isoDate.split("-").map(Number);
        const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));

        return date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
            timeZone: "UTC"
        });
    }


    function formatMoney(amount, currency) {

        try {

            return new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: currency,
                maximumFractionDigits: 0
            }).format(amount);

        } catch (error) {

            return currency + " " + amount;

        }
    }


    function showError(error) {

        // 401 sends the user to the login page and 404 is handled by the itinerary script
        if (error.status !== 401 && error.status !== 404) {
            alert(error.message);
        }
    }


    /* ---------- tabs ---------- */

    function showTab(name) {

        const showBookings = name === "bookings";

        itineraryPanel.hidden = showBookings;
        bookingsPanel.hidden = !showBookings;

        tabItinerary.classList.toggle("active", !showBookings);
        tabBookings.classList.toggle("active", showBookings);
    }

    tabItinerary.addEventListener("click", function () {
        showTab("itinerary");
    });

    tabBookings.addEventListener("click", function () {
        showTab("bookings");
    });


    /* ---------- summary and list ---------- */

    // Budget card: how much of the trip budget the bookings use.
    // Only bookings in the budget's own currency are counted.
    function renderBudget() {

        const card = el("div", "budget-card");

        if (!(tripBudget.amount > 0)) {

            const hint = el("p", "budget-hint", "No budget set for this trip. ");

            const link = el("a", "", "Edit the trip");
            link.href = "trip.html?edit=" + encodeURIComponent(tripId);

            hint.appendChild(link);
            hint.appendChild(document.createTextNode(" to add one and see how much is left."));

            card.appendChild(hint);

            return card;
        }

        let booked = 0;
        let planned = 0;
        let otherCurrency = false;

        bookings.forEach(function (booking) {

            if (booking.status === "cancelled") {
                return;
            }

            if (booking.currency !== tripBudget.currency) {
                otherCurrency = true;
                return;
            }

            if (booking.status === "booked") {
                booked += booking.cost;
            } else {
                planned += booking.cost;
            }

        });

        const budget = tripBudget.amount;
        const money = function (amount) {
            return formatMoney(amount, tripBudget.currency);
        };

        const top = el("div", "budget-top");
        top.appendChild(el("span", "budget-label", "Trip budget"));
        top.appendChild(el("strong", "budget-total", money(budget)));
        card.appendChild(top);

        const bookedPercent = Math.min(100, (booked / budget) * 100);
        const plannedPercent = Math.min(100 - bookedPercent, (planned / budget) * 100);

        const bar = el("div", "budget-bar");

        const bookedFill = el("div", "budget-fill booked" + (booked > budget ? " over" : ""));
        bookedFill.style.width = bookedPercent + "%";

        const plannedFill = el("div", "budget-fill planned");
        plannedFill.style.width = plannedPercent + "%";

        bar.appendChild(bookedFill);
        bar.appendChild(plannedFill);
        card.appendChild(bar);

        const remaining = budget - booked;

        card.appendChild(el(
            "p",
            "budget-line" + (remaining < 0 ? " over" : ""),
            "Booked " + money(booked) + " · " +
            (remaining >= 0 ? "Remaining " + money(remaining) : "Over budget by " + money(-remaining))
        ));

        if (planned > 0) {

            const afterPlanned = budget - booked - planned;

            card.appendChild(el(
                "p",
                "budget-line" + (afterPlanned < 0 ? " over" : ""),
                "If your planned bookings go ahead: " +
                (afterPlanned >= 0 ? money(afterPlanned) + " left" : "over budget by " + money(-afterPlanned))
            ));
        }

        if (otherCurrency) {
            card.appendChild(el(
                "p",
                "budget-note",
                "Bookings in other currencies are not counted against this budget."
            ));
        }

        return card;
    }


    function renderSummary() {

        summaryArea.replaceChildren();

        summaryArea.appendChild(renderBudget());

        // Cancelled bookings do not count. Totals are kept per currency.
        const totals = {};

        bookings.forEach(function (booking) {

            if (booking.status === "cancelled") {
                return;
            }

            if (!totals[booking.currency]) {
                totals[booking.currency] = { booked: 0, planned: 0 };
            }

            totals[booking.currency][booking.status] += booking.cost;

        });

        Object.keys(totals).forEach(function (currency) {

            const row = el("div", "summary-row");

            row.appendChild(el("span", "summary-chip booked",
                "Booked: " + formatMoney(totals[currency].booked, currency)));

            if (totals[currency].planned > 0) {
                row.appendChild(el("span", "summary-chip planned",
                    "Planned: " + formatMoney(totals[currency].planned, currency)));
            }

            summaryArea.appendChild(row);

        });
    }


    function renderBooking(booking) {

        const info = TYPES[booking.type] || TYPES.other;

        const card = el("div", "booking-card" + (booking.status === "cancelled" ? " cancelled" : ""));

        card.appendChild(el("span", "booking-icon", info.icon));

        const main = el("div", "booking-main");

        main.appendChild(el("strong", "", booking.title));

        const details = [];

        details.push(info.label);

        if (booking.provider) {
            details.push(booking.provider);
        }

        details.push(
            booking.endDate && booking.endDate !== booking.startDate
                ? formatDate(booking.startDate) + " → " + formatDate(booking.endDate)
                : formatDate(booking.startDate)
        );

        main.appendChild(el("p", "booking-meta", details.join(" · ")));

        if (booking.confirmationNumber) {
            main.appendChild(el("p", "booking-ref", "Ref: " + booking.confirmationNumber));
        }

        if (booking.notes) {
            main.appendChild(el("p", "booking-notes", booking.notes));
        }

        card.appendChild(main);

        const side = el("div", "booking-side");

        side.appendChild(el("span", "status-badge " + booking.status, STATUS_LABELS[booking.status] || booking.status));

        if (booking.cost > 0) {
            side.appendChild(el("span", "booking-cost", formatMoney(booking.cost, booking.currency)));
        }

        const actions = el("div", "activity-actions");

        const editButton = el("button", "icon-btn", "✎");
        editButton.type = "button";
        editButton.title = "Edit";
        editButton.addEventListener("click", function () {
            openForm(booking);
        });

        const deleteButton = el("button", "icon-btn", "✕");
        deleteButton.type = "button";
        deleteButton.title = "Delete";
        deleteButton.addEventListener("click", async function () {

            if (!confirm("Delete the booking \"" + booking.title + "\"?")) {
                return;
            }

            deleteButton.disabled = true;

            try {

                await OffWeGoAPI.deleteBooking(tripId, booking.id);

                bookings = bookings.filter(function (item) {
                    return item.id !== booking.id;
                });

                render();

            } catch (error) {

                showError(error);
                deleteButton.disabled = false;

            }

        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);
        side.appendChild(actions);

        card.appendChild(side);

        return card;
    }


    function render() {

        bookingCount.textContent = bookings.length > 0 ? "(" + bookings.length + ")" : "";

        renderSummary();

        listArea.replaceChildren();

        if (bookings.length === 0) {

            listArea.appendChild(el(
                "p",
                "empty-bookings",
                "No bookings yet. Add your flights, stays and other bookings to keep everything for this trip in one place."
            ));

            return;
        }

        bookings.forEach(function (booking) {
            listArea.appendChild(renderBooking(booking));
        });
    }


    /* ---------- add / edit form ---------- */

    function field(labelText, input) {

        const wrapper = el("label", "booking-field");

        wrapper.appendChild(el("span", "", labelText));
        wrapper.appendChild(input);

        return { wrapper: wrapper, label: wrapper.firstChild };
    }


    function openForm(existing) {

        const form = el("div", "booking-form");

        form.appendChild(el("h3", "", existing ? "Edit booking" : "Add a booking"));

        const grid = el("div", "booking-form-grid");

        const typeSelect = el("select", "activity-input");
        Object.keys(TYPES).forEach(function (key) {
            const option = el("option", "", TYPES[key].icon + " " + TYPES[key].label);
            option.value = key;
            typeSelect.appendChild(option);
        });

        const titleInput = el("input", "activity-input");
        titleInput.type = "text";
        titleInput.maxLength = 100;

        const providerInput = el("input", "activity-input");
        providerInput.type = "text";
        providerInput.maxLength = 100;
        providerInput.placeholder = "Airline, hotel or website";

        const referenceInput = el("input", "activity-input");
        referenceInput.type = "text";
        referenceInput.maxLength = 50;
        referenceInput.placeholder = "PNR or booking reference";

        const startInput = el("input", "activity-input");
        startInput.type = "date";

        const endInput = el("input", "activity-input");
        endInput.type = "date";

        const costInput = el("input", "activity-input");
        costInput.type = "number";
        costInput.min = "0";
        costInput.step = "any";
        costInput.placeholder = "0";

        const currencyInput = el("input", "activity-input");
        currencyInput.type = "text";
        currencyInput.maxLength = 3;
        currencyInput.value = "INR";
        currencyInput.setAttribute("list", "currencyOptions");

        const currencyList = el("datalist");
        currencyList.id = "currencyOptions";
        ["INR", "USD", "EUR", "GBP", "AED"].forEach(function (code) {
            const option = el("option");
            option.value = code;
            currencyList.appendChild(option);
        });

        const statusSelect = el("select", "activity-input");
        Object.keys(STATUS_LABELS).forEach(function (key) {
            const option = el("option", "", STATUS_LABELS[key]);
            option.value = key;
            statusSelect.appendChild(option);
        });

        const notesInput = el("textarea", "activity-input");
        notesInput.maxLength = 500;
        notesInput.rows = 2;
        notesInput.placeholder = "Anything worth remembering (optional)";

        const typeField = field("Type", typeSelect);
        const titleField = field("What is it?", titleInput);
        const providerField = field("Provider", providerInput);
        const referenceField = field("Confirmation / reference", referenceInput);
        const startField = field("Start date", startInput);
        const endField = field("End date", endInput);
        const costField = field("Cost", costInput);
        const currencyField = field("Currency", currencyInput);
        const statusField = field("Status", statusSelect);
        const notesField = field("Notes", notesInput);
        notesField.wrapper.classList.add("wide");

        [typeField, titleField, providerField, referenceField, startField, endField,
            costField, currencyField, statusField, notesField].forEach(function (item) {
            grid.appendChild(item.wrapper);
        });

        grid.appendChild(currencyList);

        // Labels and hints change with the type (flight: departure/arrival, stay: check-in/check-out)
        function applyType() {

            const info = TYPES[typeSelect.value];

            titleInput.placeholder = info.titleHint;
            startField.label.textContent = info.startLabel;
            endField.label.textContent = info.endLabel;
        }

        typeSelect.addEventListener("change", applyType);

        if (existing) {

            typeSelect.value = existing.type;
            titleInput.value = existing.title;
            providerInput.value = existing.provider;
            referenceInput.value = existing.confirmationNumber;
            startInput.value = existing.startDate;
            endInput.value = existing.endDate;
            costInput.value = existing.cost > 0 ? existing.cost : "";
            currencyInput.value = existing.currency;
            statusSelect.value = existing.status;
            notesInput.value = existing.notes;

        }

        applyType();

        form.appendChild(grid);

        const buttons = el("div", "activity-form-buttons");

        const saveButton = el("button", "small-btn primary", existing ? "Save changes" : "Add booking");
        saveButton.type = "button";

        const cancelButton = el("button", "small-btn", "Cancel");
        cancelButton.type = "button";

        cancelButton.addEventListener("click", function () {
            formArea.replaceChildren();
        });

        saveButton.addEventListener("click", async function () {

            const data = {
                type: typeSelect.value,
                title: titleInput.value.trim(),
                provider: providerInput.value.trim(),
                confirmationNumber: referenceInput.value.trim(),
                startDate: startInput.value,
                endDate: endInput.value,
                cost: costInput.value === "" ? 0 : Number(costInput.value),
                currency: (currencyInput.value.trim() || "INR").toUpperCase(),
                status: statusSelect.value,
                notes: notesInput.value.trim()
            };

            if (!data.title) {
                alert("Please say what this booking is.");
                titleInput.focus();
                return;
            }

            if (!data.startDate) {
                alert("Please choose a date.");
                startInput.focus();
                return;
            }

            if (data.endDate && data.endDate < data.startDate) {
                alert("The end date cannot be before the start date.");
                endInput.focus();
                return;
            }

            if (!(data.cost >= 0)) {
                alert("Cost must be a number that is zero or more.");
                costInput.focus();
                return;
            }

            if (!/^[A-Z]{3}$/.test(data.currency)) {
                alert("Currency should be a 3-letter code like INR or USD.");
                currencyInput.focus();
                return;
            }

            saveButton.disabled = true;

            try {

                if (existing) {

                    const updated = await OffWeGoAPI.updateBooking(tripId, existing.id, data);

                    bookings = bookings.map(function (item) {
                        return item.id === existing.id ? updated : item;
                    });

                } else {

                    bookings.push(await OffWeGoAPI.createBooking(tripId, data));

                }

                sortBookings();

                formArea.replaceChildren();

                render();

            } catch (error) {

                showError(error);
                saveButton.disabled = false;

            }

        });

        buttons.appendChild(saveButton);
        buttons.appendChild(cancelButton);
        form.appendChild(buttons);

        formArea.replaceChildren(form);

        if (form.scrollIntoView) {
            form.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }

        titleInput.focus();
    }


    function sortBookings() {

        bookings.sort(function (a, b) {

            if (a.startDate !== b.startDate) {
                return a.startDate < b.startDate ? -1 : 1;
            }

            return a.title.localeCompare(b.title);

        });
    }


    addBookingButton.addEventListener("click", function () {
        openForm(null);
    });


    /* ---------- load ---------- */

    OffWeGoAPI.getTrip(tripId)
        .then(function (trip) {

            tripBudget = { amount: trip.budgetAmount, currency: trip.currency };

            render();

        })
        .catch(showError);

    OffWeGoAPI.listBookings(tripId)
        .then(function (list) {

            bookings = list;

            sortBookings();

            render();

        })
        .catch(showError);

})();