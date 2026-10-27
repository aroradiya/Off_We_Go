// ==========================================
// GET TRIP INDEX FROM URL
// ==========================================

const params = new URLSearchParams(window.location.search);

const tripId = params.get("id");


// ==========================================
// GET ALL SAVED TRIPS
// ==========================================




// ==========================================
// GET SELECTED TRIP
// ==========================================

// Everything below runs inside this function, because the trip is loaded from the backend first
(async function () {

if (!OffWeGoAPI.getToken()) {
    window.location.href = "login.html";
    return;
}

let trip;

try {
    trip = await OffWeGoAPI.getTrip(tripId);
} catch (error) {
    if (error.status !== 401) {
        alert(error.message);
        window.location.href = "dashboard.html";
    }
    return;
}

// Edit and delete buttons
const editTripButton = document.getElementById("editTripButton");
if (editTripButton) {
    editTripButton.href = "trip.html?edit=" + encodeURIComponent(trip.id);
}

const deleteTripButton = document.getElementById("deleteTripButton");
if (deleteTripButton) {
    deleteTripButton.addEventListener("click", async function () {

        const sure = confirm(
            "Delete your trip to " + trip.destination + "? This cannot be undone."
        );
        if (!sure) {
            return;
        }

        deleteTripButton.disabled = true;

        try {
            await OffWeGoAPI.deleteTrip(trip.id);
            window.location.href = "dashboard.html";
        } catch (error) {
            if (error.status !== 401) alert(error.message);
            deleteTripButton.disabled = false;
        }

    });
}


const coverTripButton = document.getElementById("coverTripButton");
const coverFileInput = document.getElementById("coverFileInput");
const coverStatus = document.getElementById("coverStatus");

if (coverTripButton && coverFileInput) {

    coverTripButton.addEventListener("click", function () {
        coverFileInput.click();
    });

    coverFileInput.addEventListener("change", async function () {
        const file = coverFileInput.files[0];

        if (!file) {
            return;
        }

        coverTripButton.disabled = true;
        coverStatus.textContent = "Uploading...";

        try {
            await OffWeGoAPI.uploadTripCover(trip.id, file);
            coverStatus.textContent = "Cover photo updated";
        } catch (error) {
            if (error.status !== 401) {
                coverStatus.textContent = error.message;
            }
        } finally {
            coverTripButton.disabled = false;
            coverFileInput.value = "";
        }
    });
}


// ==========================================
// CHECK IF TRIP EXISTS
// ==========================================




// ==========================================
// DISPLAY TRIP DATA
// ==========================================

document.getElementById("tripDestination").textContent =
    trip.destination;

document.getElementById("tripDates").textContent =
    trip.startDate + " - " + trip.endDate;

document.getElementById("tripTravellers").textContent =
    trip.adults + " Adults · " +
    trip.children + " Children";

document.getElementById("tripBudget").textContent =
    trip.budget || "Not specified";

document.getElementById("tripInterests").textContent =
    trip.interests && trip.interests.length > 0
        ? trip.interests.join(", ")
        : "None";

document.getElementById("tripNotes").textContent =
    trip.notes || "None";


// ==========================================
// CALCULATE TRIP DAYS
// ==========================================

function getTripDays() {

    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);

    const difference =
        end - start;

    const days =
        Math.floor(
            difference / (1000 * 60 * 60 * 24)
        ) + 1;

    return days;
}


const numberOfDays = getTripDays();

console.log("Number of trip days:", numberOfDays);

// ==========================================
// GENERATE ITINERARY DAYS
// ==========================================

const itineraryContainer =
    document.getElementById("itineraryContainer");


// ==========================================
// GET ACTIVITIES BASED ON INTERESTS AND DAYS
// ==========================================


function getActivitiesForDay(destination, day) {

    // The suggested day plans for this destination come from the catalog
    // (loaded by loadCatalogPlans below). null means it is not in the catalog.



    const destinationPlan = catalogPlans;


    // ------------------------------------------
    // DESTINATION NOT AVAILABLE
    // ------------------------------------------

    if (!destinationPlan) {

        return {

            title: "Explore " + destination,

            items: [
                {
                    icon: "📍",
                    name: "Explore the City",
                    description: "Discover popular attractions and local experiences.",
                    interests: ["Nature"]
                },

                {
                    icon: "🍴",
                    name: "Local Cuisine",
                    description: "Try some of the destination's local food.",
                    interests: ["Food"]
                },

                {
                    icon: "🌅",
                    name: "Evening Exploration",
                    description: "Enjoy a relaxed evening around the destination.",
                    interests: ["Nature"]
                }
            ]

        };

    }


    // ------------------------------------------
    // USER'S SELECTED INTERESTS
    // ------------------------------------------

    const userInterests =
        Array.isArray(trip.interests)
            ? trip.interests
            : [];


    // ------------------------------------------
    // CREATE A UNIQUE ORDER OF DAY PLANS
    // ------------------------------------------

    const orderedPlans = [];


    // First add plans that match user interests
    destinationPlan.forEach(function (plan) {

        const matchingActivities =
            plan.items.filter(function (activity) {

                return activity.interests.some(
                    function (interest) {

                        return userInterests.includes(
                            interest
                        );

                    }
                );

            });


        if (
            userInterests.length === 0 ||
            matchingActivities.length > 0
        ) {

            orderedPlans.push({
                title: plan.title,
                items:
                    matchingActivities.length > 0
                        ? matchingActivities
                        : plan.items
            });

        }

    });


    // If nothing matched, use all available plans
    if (orderedPlans.length === 0) {

        destinationPlan.forEach(function (plan) {

            orderedPlans.push(plan);

        });

    }


    // ------------------------------------------
    // SELECT PLAN FOR THIS DAY
    // ------------------------------------------

    const planIndex =
        (day - 1) % orderedPlans.length;


    const selectedPlan =
        orderedPlans[planIndex];


    return selectedPlan;

}


// ==========================================
// STORED ITINERARY
// The plan is saved with the trip. It is generated once (below), then the user can change it.
// ==========================================

const MAX_ACTIVITIES_PER_DAY = 20;

// Asks the backend for this destination's suggested day plans.
// Destinations that are not in the catalog get the generic plan instead.
let catalogPlans = null;
let catalogLoaded = false;

async function loadCatalogPlans() {

    if (catalogLoaded) {
        return;
    }

    try {

        const destination = await OffWeGoAPI.getDestination(trip.destination);

        if (Array.isArray(destination.dayPlans) && destination.dayPlans.length > 0) {

            // the catalog calls them "activities"; the generator below calls them "items"
            catalogPlans = destination.dayPlans.map(function (plan) {
                return { title: plan.title, items: plan.activities };
            });

        }

    } catch (error) {

        if (error.status !== 404) {
            console.error("Could not load destination plans:", error.message);
        }

    }

    catalogLoaded = true;
}


// Builds a suggested plan from the generator above (used the first time and on reset)
async function buildSuggestedItinerary() {

    await loadCatalogPlans();

    const days = [];

    for (let i = 1; i <= numberOfDays; i++) {

        const plan = getActivitiesForDay(trip.destination, i);

        days.push({
            title: plan.title,
            activities: plan.items.map(function (activity) {
                return {
                    icon: activity.icon,
                    name: activity.name,
                    description: activity.description,
                    time: ""
                };
            })
        });

    }

    return days;
}


let itinerary = trip.itinerary;

const statusText = document.getElementById("itineraryStatus");


function setStatus(message, isError) {

    if (!statusText) {
        return;
    }

    statusText.textContent = message;
    statusText.classList.toggle("error", Boolean(isError));
}


// Saves are sent one after another, each one carrying the latest plan
let saveQueue = Promise.resolve();

function persist() {

    saveQueue = saveQueue.then(async function () {

        setStatus("Saving…", false);

        try {

            await OffWeGoAPI.saveItinerary(trip.id, itinerary);

            setStatus("All changes saved ✓", false);

        } catch (error) {

            if (error.status !== 401) {
                setStatus("Not saved: " + error.message, true);
            }

        }

    });

    return saveQueue;
}


// Small helper to create an element with a class and text
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


function dayLabel(dayIndex) {

    // "2026-12-20" -> "Sun, 20 Dec" (UTC so the date never shifts)
    const parts = trip.startDate.split("-").map(Number);
    const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2] + dayIndex));

    return date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        timeZone: "UTC"
    });
}


// The small form used both for adding and for editing an activity
function activityForm(initial, onSave, onCancel) {

    const form = el("div", "activity-form");

    const timeInput = el("input", "activity-input activity-input-time");
    timeInput.type = "time";
    timeInput.value = initial.time || "";

    const nameInput = el("input", "activity-input");
    nameInput.type = "text";
    nameInput.placeholder = "What are you doing?";
    nameInput.maxLength = 100;
    nameInput.value = initial.name || "";

    const descriptionInput = el("input", "activity-input");
    descriptionInput.type = "text";
    descriptionInput.placeholder = "Details (optional)";
    descriptionInput.maxLength = 300;
    descriptionInput.value = initial.description || "";

    const buttons = el("div", "activity-form-buttons");

    const saveButton = el("button", "small-btn primary", "Save");
    saveButton.type = "button";

    const cancelButton = el("button", "small-btn", "Cancel");
    cancelButton.type = "button";

    saveButton.addEventListener("click", function () {

        const name = nameInput.value.trim();

        if (!name) {
            alert("Please enter a name for the activity.");
            nameInput.focus();
            return;
        }

        onSave({
            time: timeInput.value,
            name: name,
            description: descriptionInput.value.trim()
        });

    });

    cancelButton.addEventListener("click", onCancel);

    buttons.appendChild(saveButton);
    buttons.appendChild(cancelButton);

    form.appendChild(timeInput);
    form.appendChild(nameInput);
    form.appendChild(descriptionInput);
    form.appendChild(buttons);

    return form;
}


function changeItinerary() {

    renderItinerary();

    persist();
}


function renderActivity(day, dayIndex, activityIndex) {

    const activity = day.activities[activityIndex];

    const item = el("div", "activity-item");

    item.appendChild(el("span", "activity-icon", activity.icon || "📍"));

    const info = el("div", "activity-info");

    const heading = el("strong");

    if (activity.time) {
        heading.appendChild(el("span", "activity-time", activity.time));
    }

    heading.appendChild(document.createTextNode(activity.name));

    info.appendChild(heading);

    if (activity.description) {
        info.appendChild(el("p", "", activity.description));
    }

    item.appendChild(info);

    const actions = el("div", "activity-actions");

    function actionButton(label, title, onClick, disabled) {

        const button = el("button", "icon-btn", label);
        button.type = "button";
        button.title = title;
        button.disabled = Boolean(disabled);
        button.addEventListener("click", onClick);

        actions.appendChild(button);
    }

    actionButton("↑", "Move up", function () {

        const list = day.activities;
        [list[activityIndex - 1], list[activityIndex]] =
            [list[activityIndex], list[activityIndex - 1]];

        changeItinerary();

    }, activityIndex === 0);

    actionButton("↓", "Move down", function () {

        const list = day.activities;
        [list[activityIndex + 1], list[activityIndex]] =
            [list[activityIndex], list[activityIndex + 1]];

        changeItinerary();

    }, activityIndex === day.activities.length - 1);

    actionButton("✎", "Edit", function () {

        const form = activityForm(
            activity,
            function (values) {

                activity.time = values.time;
                activity.name = values.name;
                activity.description = values.description;

                changeItinerary();

            },
            renderItinerary
        );

        item.replaceWith(form);

    });

    actionButton("✕", "Remove", function () {

        day.activities.splice(activityIndex, 1);

        changeItinerary();

    });

    item.appendChild(actions);

    return item;
}


function renderDay(day, dayIndex) {

    const dayCard = el("div", "itinerary-day");

    const header = el("div", "day-header");
    header.appendChild(el("span", "day-number", "Day " + (dayIndex + 1)));
    header.appendChild(el("span", "day-date", dayLabel(dayIndex)));
    dayCard.appendChild(header);

    const content = el("div", "day-content");
    content.appendChild(el("h3", "", day.title || "Free day"));

    const list = el("div", "activity-list");

    day.activities.forEach(function (activity, activityIndex) {
        list.appendChild(renderActivity(day, dayIndex, activityIndex));
    });

    if (day.activities.length === 0) {
        list.appendChild(el("p", "empty-day", "Nothing planned yet."));
    }

    content.appendChild(list);

    const addArea = el("div", "add-activity-area");

    const addButton = el("button", "small-btn add-btn", "+ Add activity");
    addButton.type = "button";

    if (day.activities.length >= MAX_ACTIVITIES_PER_DAY) {
        addButton.disabled = true;
        addButton.title = "A day can have at most " + MAX_ACTIVITIES_PER_DAY + " activities";
    }

    addButton.addEventListener("click", function () {

        const form = activityForm(
            {},
            function (values) {

                day.activities.push({
                    icon: "📍",
                    name: values.name,
                    description: values.description,
                    time: values.time
                });

                changeItinerary();

            },
            renderItinerary
        );

        addArea.replaceChildren(form);

        form.querySelector("input[type='text']").focus();

    });

    addArea.appendChild(addButton);
    content.appendChild(addArea);

    dayCard.appendChild(content);

    return dayCard;
}


function renderItinerary() {

    itineraryContainer.replaceChildren();

    itinerary.forEach(function (day, dayIndex) {
        itineraryContainer.appendChild(renderDay(day, dayIndex));
    });

}


// Reset button: throw away the edits and go back to the suggested plan
const resetItineraryButton = document.getElementById("resetItineraryButton");

if (resetItineraryButton) {

    resetItineraryButton.addEventListener("click", async function () {

        const sure = confirm(
            "Replace your itinerary with the suggested plan? Your changes will be lost."
        );

        if (!sure) {
            return;
        }

        itinerary = await buildSuggestedItinerary();

        changeItinerary();

    });

}


// First visit to this trip: build a suggested plan and save it
if (itinerary.length === 0) {

    itinerary = await buildSuggestedItinerary();

    renderItinerary();

    await persist();

} else {

    renderItinerary();

}

})();