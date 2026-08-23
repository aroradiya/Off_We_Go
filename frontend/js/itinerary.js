// ==========================================
// GET TRIP INDEX FROM URL
// ==========================================

const params = new URLSearchParams(window.location.search);

const tripIndex = Number(params.get("trip"));


// ==========================================
// GET ALL SAVED TRIPS
// ==========================================

const trips =
    JSON.parse(localStorage.getItem("offwegoTrips")) || [];


// ==========================================
// GET SELECTED TRIP
// ==========================================

const trip = trips[tripIndex];


// ==========================================
// CHECK IF TRIP EXISTS
// ==========================================

if (!trip) {

    alert("Trip not found.");

    window.location.href = "dashboard.html";

}


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

    const plans = {

        Manali: [
            {
                title: "Arrival & Local Exploration",
                items: [
                    {
                        icon: "🏨",
                        name: "Hotel Check-in",
                        description: "Check in and settle into your accommodation.",
                        interests: ["Nature"]
                    },
                    {
                        icon: "🌲",
                        name: "Mall Road",
                        description: "Explore local shops, cafes and the mountain surroundings.",
                        interests: ["Shopping", "Food"]
                    },
                    {
                        icon: "🍴",
                        name: "Local Dinner",
                        description: "Try some local Himachali cuisine.",
                        interests: ["Food"]
                    }
                ]
            },

            {
                title: "Mountains & Adventure",
                items: [
                    {
                        icon: "🏔️",
                        name: "Solang Valley",
                        description: "Enjoy mountain views and adventure activities.",
                        interests: ["Adventure", "Nature"]
                    },
                    {
                        icon: "🌲",
                        name: "Nature Exploration",
                        description: "Explore the surrounding Himalayan landscape.",
                        interests: ["Nature"]
                    },
                    {
                        icon: "🍴",
                        name: "Mountain Cafe",
                        description: "Relax with a meal while enjoying the views.",
                        interests: ["Food"]
                    }
                ]
            },

            {
                title: "Culture & Sightseeing",
                items: [
                    {
                        icon: "🏛️",
                        name: "Hadimba Temple",
                        description: "Visit one of Manali's most famous landmarks.",
                        interests: ["History"]
                    },
                    {
                        icon: "🛍️",
                        name: "Local Market",
                        description: "Explore local handicrafts and souvenirs.",
                        interests: ["Shopping"]
                    },
                    {
                        icon: "🌅",
                        name: "Evening Walk",
                        description: "Enjoy a relaxed evening around Manali.",
                        interests: ["Nature"]
                    }
                ]
            }
        ],

        Goa: [
            {
                title: "Arrival & Beach Evening",
                items: [
                    {
                        icon: "🏨",
                        name: "Hotel Check-in",
                        description: "Check in and settle into your accommodation.",
                        interests: ["Nature"]
                    },
                    {
                        icon: "🏖️",
                        name: "Baga Beach",
                        description: "Relax by the beach and enjoy the sunset.",
                        interests: ["Nature"]
                    },
                    {
                        icon: "🍴",
                        name: "Goan Dinner",
                        description: "Try some local Goan cuisine.",
                        interests: ["Food"]
                    }
                ]
            },

            {
                title: "Beaches & Adventure",
                items: [
                    {
                        icon: "🏖️",
                        name: "Calangute Beach",
                        description: "Spend the morning relaxing by the sea.",
                        interests: ["Nature"]
                    },
                    {
                        icon: "🏰",
                        name: "Fort Aguada",
                        description: "Explore the historic Portuguese fort.",
                        interests: ["History"]
                    },
                    {
                        icon: "🌊",
                        name: "Water Activities",
                        description: "Try exciting activities along the coast.",
                        interests: ["Adventure"]
                    }
                ]
            },

            {
                title: "Panjim & Nightlife",
                items: [
                    {
                        icon: "🏛️",
                        name: "Panjim",
                        description: "Explore the colourful streets and architecture.",
                        interests: ["History"]
                    },
                    {
                        icon: "🛍️",
                        name: "Local Shopping",
                        description: "Pick up souvenirs and local products.",
                        interests: ["Shopping"]
                    },
                    {
                        icon: "🌙",
                        name: "Goa Nightlife",
                        description: "Experience Goa's famous evening atmosphere.",
                        interests: ["Nightlife"]
                    }
                ]
            }
        ],

        Dubai: [
            {
                title: "Arrival & Dubai Marina",
                items: [
                    {
                        icon: "🏨",
                        name: "Hotel Check-in",
                        description: "Check in and settle into your accommodation.",
                        interests: ["Nature"]
                    },
                    {
                        icon: "🌆",
                        name: "Dubai Marina",
                        description: "Explore the waterfront and surrounding area.",
                        interests: ["Nature"]
                    },
                    {
                        icon: "🍴",
                        name: "Dinner",
                        description: "Enjoy dinner with views of the city.",
                        interests: ["Food"]
                    }
                ]
            },

            {
                title: "Burj Khalifa & Downtown",
                items: [
                    {
                        icon: "🏙️",
                        name: "Burj Khalifa",
                        description: "Visit one of Dubai's most famous landmarks.",
                        interests: ["History"]
                    },
                    {
                        icon: "🛍️",
                        name: "Dubai Mall",
                        description: "Explore one of the world's largest shopping malls.",
                        interests: ["Shopping"]
                    },
                    {
                        icon: "⛲",
                        name: "Dubai Fountain",
                        description: "Enjoy the famous fountain show.",
                        interests: ["Nature"]
                    }
                ]
            },

            {
                title: "Desert Adventure",
                items: [
                    {
                        icon: "🏜️",
                        name: "Desert Safari",
                        description: "Experience the desert and its surrounding landscape.",
                        interests: ["Adventure", "Nature"]
                    },
                    {
                        icon: "🐪",
                        name: "Desert Activities",
                        description: "Enjoy traditional desert experiences.",
                        interests: ["Adventure"]
                    },
                    {
                        icon: "🌅",
                        name: "Desert Sunset",
                        description: "Watch the sunset over the dunes.",
                        interests: ["Nature"]
                    }
                ]
            }
        ],

        Paris: [
            {
                title: "Arrival & Paris Evening",
                items: [
                    {
                        icon: "🏨",
                        name: "Hotel Check-in",
                        description: "Check in and settle into your accommodation.",
                        interests: ["Nature"]
                    },
                    {
                        icon: "🗼",
                        name: "Eiffel Tower",
                        description: "See one of Paris's most iconic landmarks.",
                        interests: ["History", "Nature"]
                    },
                    {
                        icon: "🍴",
                        name: "French Dinner",
                        description: "Enjoy a traditional French meal.",
                        interests: ["Food"]
                    }
                ]
            },

            {
                title: "Museums & Culture",
                items: [
                    {
                        icon: "🏛️",
                        name: "Louvre Museum",
                        description: "Explore one of the world's most famous museums.",
                        interests: ["History"]
                    },
                    {
                        icon: "🚶",
                        name: "City Walk",
                        description: "Walk through the historic streets of Paris.",
                        interests: ["Nature", "History"]
                    },
                    {
                        icon: "🥐",
                        name: "French Cafe",
                        description: "Take a break at a traditional Parisian cafe.",
                        interests: ["Food"]
                    }
                ]
            },

            {
                title: "Shopping & Classic Paris",
                items: [
                    {
                        icon: "🏛️",
                        name: "Arc de Triomphe",
                        description: "Visit the famous Parisian monument.",
                        interests: ["History"]
                    },
                    {
                        icon: "🛍️",
                        name: "Champs-Élysées",
                        description: "Explore one of Paris's most famous avenues.",
                        interests: ["Shopping"]
                    },
                    {
                        icon: "🌅",
                        name: "Seine River",
                        description: "Enjoy an evening along the Seine.",
                        interests: ["Nature"]
                    }
                ]
            }
        ]
    };


    const destinationPlan = plans[destination];


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


for (let i = 1; i <= numberOfDays; i++) {

    const dayCard =
        document.createElement("div");

    dayCard.classList.add("itinerary-day");

    const activities = getActivitiesForDay(
    trip.destination,
    i
);

dayCard.innerHTML = `
    <div class="day-header">
        <span class="day-number">
            Day ${i}
        </span>
    </div>

    <div class="day-content">

        <h3>
            ${activities.title}
        </h3>

        <div class="activity-list">

            ${activities.items.map(function (activity) {

                return `
                    <div class="activity-item">

                        <span class="activity-icon">
                            ${activity.icon}
                        </span>

                        <div>
                            <strong>
                                ${activity.name}
                            </strong>

                            <p>
                                ${activity.description}
                            </p>
                        </div>

                    </div>
                `;

            }).join("")}

        </div>

    </div>
`;

    itineraryContainer.appendChild(dayCard);

}