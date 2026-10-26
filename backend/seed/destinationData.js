// Starting data for the destinations catalog. Run: node seed/seedDestinations.js
// Re-running it updates these destinations and adds any new ones; it never deletes anything.

module.exports = [
    {
        "slug": "manali",
        "name": "Manali",
        "country": "India",
        "region": "Himachal Pradesh",
        "currency": "INR",
        "bestSeason": "March to June, and December to February for snow",
        "description": "A Himalayan hill town known for snowy peaks, adventure sports and cafes by the Beas river.",
        "tags": [
            "Shopping",
            "Food",
            "Adventure",
            "Nature",
            "History"
        ],
        "dayPlans": [
            {
                "title": "Arrival & Local Exploration",
                "activities": [
                    {
                        "icon": "🏨",
                        "name": "Hotel Check-in",
                        "description": "Check in and settle into your accommodation.",
                        "interests": [
                            "Nature",
                            "Food",
                            "Adventure",
                            "History",
                            "Shopping",
                            "Nightlife"
                        ]
                    },
                    {
                        "icon": "🌲",
                        "name": "Mall Road",
                        "description": "Explore local shops, cafes and the mountain surroundings.",
                        "interests": [
                            "Shopping",
                            "Food"
                        ]
                    },
                    {
                        "icon": "🍴",
                        "name": "Local Dinner",
                        "description": "Try some local Himachali cuisine.",
                        "interests": [
                            "Food"
                        ]
                    }
                ]
            },
            {
                "title": "Mountains & Adventure",
                "activities": [
                    {
                        "icon": "🏔️",
                        "name": "Solang Valley",
                        "description": "Enjoy mountain views and adventure activities.",
                        "interests": [
                            "Adventure",
                            "Nature"
                        ]
                    },
                    {
                        "icon": "🌲",
                        "name": "Nature Exploration",
                        "description": "Explore the surrounding Himalayan landscape.",
                        "interests": [
                            "Nature"
                        ]
                    },
                    {
                        "icon": "🍴",
                        "name": "Mountain Cafe",
                        "description": "Relax with a meal while enjoying the views.",
                        "interests": [
                            "Food"
                        ]
                    }
                ]
            },
            {
                "title": "Culture & Sightseeing",
                "activities": [
                    {
                        "icon": "🏛️",
                        "name": "Hadimba Temple",
                        "description": "Visit one of Manali's most famous landmarks.",
                        "interests": [
                            "History"
                        ]
                    },
                    {
                        "icon": "🛍️",
                        "name": "Local Market",
                        "description": "Explore local handicrafts and souvenirs.",
                        "interests": [
                            "Shopping"
                        ]
                    },
                    {
                        "icon": "🌅",
                        "name": "Evening Walk",
                        "description": "Enjoy a relaxed evening around Manali.",
                        "interests": [
                            "Nature"
                        ]
                    }
                ]
            }
        ]
    },
    {
        "slug": "goa",
        "name": "Goa",
        "country": "India",
        "region": "Goa",
        "currency": "INR",
        "bestSeason": "November to February",
        "description": "India's beach state, with lively nightlife, Portuguese-era forts and seafood.",
        "tags": [
            "Nature",
            "Food",
            "History",
            "Adventure",
            "Shopping",
            "Nightlife"
        ],
        "dayPlans": [
            {
                "title": "Arrival & Beach Evening",
                "activities": [
                    {
                        "icon": "🏨",
                        "name": "Hotel Check-in",
                        "description": "Check in and settle into your accommodation.",
                        "interests": [
                            "Nature",
                            "Food",
                            "Adventure",
                            "History",
                            "Shopping",
                            "Nightlife"
                        ]
                    },
                    {
                        "icon": "🏖️",
                        "name": "Baga Beach",
                        "description": "Relax by the beach and enjoy the sunset.",
                        "interests": [
                            "Nature"
                        ]
                    },
                    {
                        "icon": "🍴",
                        "name": "Goan Dinner",
                        "description": "Try some local Goan cuisine.",
                        "interests": [
                            "Food"
                        ]
                    }
                ]
            },
            {
                "title": "Beaches & Adventure",
                "activities": [
                    {
                        "icon": "🏖️",
                        "name": "Calangute Beach",
                        "description": "Spend the morning relaxing by the sea.",
                        "interests": [
                            "Nature"
                        ]
                    },
                    {
                        "icon": "🏰",
                        "name": "Fort Aguada",
                        "description": "Explore the historic Portuguese fort.",
                        "interests": [
                            "History"
                        ]
                    },
                    {
                        "icon": "🌊",
                        "name": "Water Activities",
                        "description": "Try exciting activities along the coast.",
                        "interests": [
                            "Adventure"
                        ]
                    }
                ]
            },
            {
                "title": "Panjim & Nightlife",
                "activities": [
                    {
                        "icon": "🏛️",
                        "name": "Panjim",
                        "description": "Explore the colourful streets and architecture.",
                        "interests": [
                            "History"
                        ]
                    },
                    {
                        "icon": "🛍️",
                        "name": "Local Shopping",
                        "description": "Pick up souvenirs and local products.",
                        "interests": [
                            "Shopping"
                        ]
                    },
                    {
                        "icon": "🌙",
                        "name": "Goa Nightlife",
                        "description": "Experience Goa's famous evening atmosphere.",
                        "interests": [
                            "Nightlife"
                        ]
                    }
                ]
            }
        ]
    },
    {
        "slug": "dubai",
        "name": "Dubai",
        "country": "United Arab Emirates",
        "region": "Dubai",
        "currency": "AED",
        "bestSeason": "November to March",
        "description": "A modern desert city of record-breaking towers, huge malls and desert safaris.",
        "tags": [
            "Nature",
            "Food",
            "History",
            "Shopping",
            "Adventure"
        ],
        "dayPlans": [
            {
                "title": "Arrival & Dubai Marina",
                "activities": [
                    {
                        "icon": "🏨",
                        "name": "Hotel Check-in",
                        "description": "Check in and settle into your accommodation.",
                        "interests": [
                            "Nature",
                            "Food",
                            "Adventure",
                            "History",
                            "Shopping",
                            "Nightlife"
                        ]
                    },
                    {
                        "icon": "🌆",
                        "name": "Dubai Marina",
                        "description": "Explore the waterfront and surrounding area.",
                        "interests": [
                            "Nature"
                        ]
                    },
                    {
                        "icon": "🍴",
                        "name": "Dinner",
                        "description": "Enjoy dinner with views of the city.",
                        "interests": [
                            "Food"
                        ]
                    }
                ]
            },
            {
                "title": "Burj Khalifa & Downtown",
                "activities": [
                    {
                        "icon": "🏙️",
                        "name": "Burj Khalifa",
                        "description": "Visit one of Dubai's most famous landmarks.",
                        "interests": [
                            "History"
                        ]
                    },
                    {
                        "icon": "🛍️",
                        "name": "Dubai Mall",
                        "description": "Explore one of the world's largest shopping malls.",
                        "interests": [
                            "Shopping"
                        ]
                    },
                    {
                        "icon": "⛲",
                        "name": "Dubai Fountain",
                        "description": "Enjoy the famous fountain show.",
                        "interests": [
                            "Nature"
                        ]
                    }
                ]
            },
            {
                "title": "Desert Adventure",
                "activities": [
                    {
                        "icon": "🏜️",
                        "name": "Desert Safari",
                        "description": "Experience the desert and its surrounding landscape.",
                        "interests": [
                            "Adventure",
                            "Nature"
                        ]
                    },
                    {
                        "icon": "🐪",
                        "name": "Desert Activities",
                        "description": "Enjoy traditional desert experiences.",
                        "interests": [
                            "Adventure"
                        ]
                    },
                    {
                        "icon": "🌅",
                        "name": "Desert Sunset",
                        "description": "Watch the sunset over the dunes.",
                        "interests": [
                            "Nature"
                        ]
                    }
                ]
            }
        ]
    },
    {
        "slug": "paris",
        "name": "Paris",
        "country": "France",
        "region": "Île-de-France",
        "currency": "EUR",
        "bestSeason": "April to June and September to October",
        "description": "The French capital, famous for the Eiffel Tower, great museums, cafes and shopping.",
        "tags": [
            "History",
            "Nature",
            "Food",
            "Shopping"
        ],
        "dayPlans": [
            {
                "title": "Arrival & Paris Evening",
                "activities": [
                    {
                        "icon": "🏨",
                        "name": "Hotel Check-in",
                        "description": "Check in and settle into your accommodation.",
                        "interests": [
                            "Nature",
                            "Food",
                            "Adventure",
                            "History",
                            "Shopping",
                            "Nightlife"
                        ]
                    },
                    {
                        "icon": "🗼",
                        "name": "Eiffel Tower",
                        "description": "See one of Paris's most iconic landmarks.",
                        "interests": [
                            "History",
                            "Nature"
                        ]
                    },
                    {
                        "icon": "🍴",
                        "name": "French Dinner",
                        "description": "Enjoy a traditional French meal.",
                        "interests": [
                            "Food"
                        ]
                    }
                ]
            },
            {
                "title": "Museums & Culture",
                "activities": [
                    {
                        "icon": "🏛️",
                        "name": "Louvre Museum",
                        "description": "Explore one of the world's most famous museums.",
                        "interests": [
                            "History"
                        ]
                    },
                    {
                        "icon": "🚶",
                        "name": "City Walk",
                        "description": "Walk through the historic streets of Paris.",
                        "interests": [
                            "Nature",
                            "History"
                        ]
                    },
                    {
                        "icon": "🥐",
                        "name": "French Cafe",
                        "description": "Take a break at a traditional Parisian cafe.",
                        "interests": [
                            "Food"
                        ]
                    }
                ]
            },
            {
                "title": "Shopping & Classic Paris",
                "activities": [
                    {
                        "icon": "🏛️",
                        "name": "Arc de Triomphe",
                        "description": "Visit the famous Parisian monument.",
                        "interests": [
                            "History"
                        ]
                    },
                    {
                        "icon": "🛍️",
                        "name": "Champs-Élysées",
                        "description": "Explore one of Paris's most famous avenues.",
                        "interests": [
                            "Shopping"
                        ]
                    },
                    {
                        "icon": "🌅",
                        "name": "Seine River",
                        "description": "Enjoy an evening along the Seine.",
                        "interests": [
                            "Nature"
                        ]
                    }
                ]
            }
        ]
    },
    {
        "slug": "kerala",
        "name": "Kerala",
        "country": "India",
        "region": "Kerala",
        "currency": "INR",
        "bestSeason": "September to March",
        "description": "A green southern state of backwaters, tea hills and spice-scented food.",
        "tags": [
            "History",
            "Food",
            "Nature",
            "Adventure",
            "Shopping"
        ],
        "dayPlans": [
            {
                "title": "Arrival in Kochi",
                "activities": [
                    {
                        "icon": "🏨",
                        "name": "Hotel Check-in",
                        "description": "Check in and settle into your accommodation.",
                        "interests": [
                            "Nature",
                            "Food",
                            "Adventure",
                            "History",
                            "Shopping",
                            "Nightlife"
                        ]
                    },
                    {
                        "icon": "🏛️",
                        "name": "Fort Kochi Walk",
                        "description": "Wander past the Chinese fishing nets, old churches and art cafes.",
                        "interests": [
                            "History"
                        ]
                    },
                    {
                        "icon": "🍴",
                        "name": "Kerala Seafood Dinner",
                        "description": "Try fish curry with appam at a local restaurant.",
                        "interests": [
                            "Food"
                        ]
                    }
                ]
            },
            {
                "title": "Backwaters of Alleppey",
                "activities": [
                    {
                        "icon": "🚤",
                        "name": "Houseboat Cruise",
                        "description": "Drift through the calm backwaters on a traditional houseboat.",
                        "interests": [
                            "Nature"
                        ]
                    },
                    {
                        "icon": "🌴",
                        "name": "Village Canal Walk",
                        "description": "See village life along the canals and coconut groves.",
                        "interests": [
                            "Nature"
                        ]
                    },
                    {
                        "icon": "🍴",
                        "name": "Houseboat Lunch",
                        "description": "Enjoy a freshly cooked Kerala meal on board.",
                        "interests": [
                            "Food"
                        ]
                    }
                ]
            },
            {
                "title": "Munnar Tea Hills",
                "activities": [
                    {
                        "icon": "🍃",
                        "name": "Tea Garden Visit",
                        "description": "Walk through the rolling tea estates around Munnar.",
                        "interests": [
                            "Nature"
                        ]
                    },
                    {
                        "icon": "🏞️",
                        "name": "Hill Viewpoints",
                        "description": "Take in the misty valley views and cool mountain air.",
                        "interests": [
                            "Nature",
                            "Adventure"
                        ]
                    },
                    {
                        "icon": "🛍️",
                        "name": "Spice Market",
                        "description": "Pick up spices, tea and chocolates to take home.",
                        "interests": [
                            "Shopping",
                            "Food"
                        ]
                    }
                ]
            }
        ]
    },
    {
        "slug": "jaipur",
        "name": "Jaipur",
        "country": "India",
        "region": "Rajasthan",
        "currency": "INR",
        "bestSeason": "October to March",
        "description": "The Pink City, with grand forts, palaces and busy bazaars.",
        "tags": [
            "Shopping",
            "Food",
            "History",
            "Nature"
        ],
        "dayPlans": [
            {
                "title": "Arrival & the Old City",
                "activities": [
                    {
                        "icon": "🏨",
                        "name": "Hotel Check-in",
                        "description": "Check in and settle into your accommodation.",
                        "interests": [
                            "Nature",
                            "Food",
                            "Adventure",
                            "History",
                            "Shopping",
                            "Nightlife"
                        ]
                    },
                    {
                        "icon": "🛍️",
                        "name": "Bapu Bazaar",
                        "description": "Shop for textiles, jewellery and handicrafts.",
                        "interests": [
                            "Shopping"
                        ]
                    },
                    {
                        "icon": "🍴",
                        "name": "Rajasthani Dinner",
                        "description": "Try dal baati churma and other regional classics.",
                        "interests": [
                            "Food"
                        ]
                    }
                ]
            },
            {
                "title": "Forts & Palaces",
                "activities": [
                    {
                        "icon": "🏰",
                        "name": "Amber Fort",
                        "description": "Explore the hilltop fort and its mirrored palace halls.",
                        "interests": [
                            "History"
                        ]
                    },
                    {
                        "icon": "🏛️",
                        "name": "City Palace",
                        "description": "Visit the royal residence and its museum collections.",
                        "interests": [
                            "History"
                        ]
                    },
                    {
                        "icon": "🏯",
                        "name": "Hawa Mahal",
                        "description": "See the pink sandstone 'Palace of Winds' façade.",
                        "interests": [
                            "History"
                        ]
                    }
                ]
            },
            {
                "title": "Culture & Sunset",
                "activities": [
                    {
                        "icon": "🔭",
                        "name": "Jantar Mantar",
                        "description": "Look at the giant astronomical instruments built in the 1700s.",
                        "interests": [
                            "History"
                        ]
                    },
                    {
                        "icon": "🎨",
                        "name": "Craft Workshop",
                        "description": "Try block printing or see blue pottery being made.",
                        "interests": [
                            "Shopping"
                        ]
                    },
                    {
                        "icon": "🌅",
                        "name": "Nahargarh Sunset",
                        "description": "Watch the city light up from the hills at dusk.",
                        "interests": [
                            "Nature"
                        ]
                    }
                ]
            }
        ]
    },
    {
        "slug": "london",
        "name": "London",
        "country": "United Kingdom",
        "region": "England",
        "currency": "GBP",
        "bestSeason": "May to September",
        "description": "A historic capital of royal landmarks, museums, markets and theatre.",
        "tags": [
            "Nature",
            "Food",
            "History",
            "Shopping",
            "Nightlife"
        ],
        "dayPlans": [
            {
                "title": "Arrival & the Thames",
                "activities": [
                    {
                        "icon": "🏨",
                        "name": "Hotel Check-in",
                        "description": "Check in and settle into your accommodation.",
                        "interests": [
                            "Nature",
                            "Food",
                            "Adventure",
                            "History",
                            "Shopping",
                            "Nightlife"
                        ]
                    },
                    {
                        "icon": "🎡",
                        "name": "South Bank Walk",
                        "description": "Stroll along the Thames past the London Eye and city views.",
                        "interests": [
                            "Nature"
                        ]
                    },
                    {
                        "icon": "🍴",
                        "name": "Pub Dinner",
                        "description": "Try fish and chips or a classic roast at a traditional pub.",
                        "interests": [
                            "Food"
                        ]
                    }
                ]
            },
            {
                "title": "Royal & Historic London",
                "activities": [
                    {
                        "icon": "🏰",
                        "name": "Tower of London",
                        "description": "Explore the historic fortress and see the Crown Jewels.",
                        "interests": [
                            "History"
                        ]
                    },
                    {
                        "icon": "🌉",
                        "name": "Tower Bridge",
                        "description": "Walk across the famous bridge and enjoy the river views.",
                        "interests": [
                            "History"
                        ]
                    },
                    {
                        "icon": "👑",
                        "name": "Buckingham Palace",
                        "description": "See the royal residence and walk through St James's Park.",
                        "interests": [
                            "History",
                            "Nature"
                        ]
                    }
                ]
            },
            {
                "title": "Museums, Markets & Theatre",
                "activities": [
                    {
                        "icon": "🏛️",
                        "name": "British Museum",
                        "description": "Discover world history across thousands of years.",
                        "interests": [
                            "History"
                        ]
                    },
                    {
                        "icon": "🛍️",
                        "name": "Camden Market",
                        "description": "Browse stalls of fashion, crafts and street food.",
                        "interests": [
                            "Shopping",
                            "Food"
                        ]
                    },
                    {
                        "icon": "🎭",
                        "name": "West End Evening",
                        "description": "Catch a show in London's lively theatre district.",
                        "interests": [
                            "Nightlife"
                        ]
                    }
                ]
            }
        ]
    },
    {
        "slug": "bali",
        "name": "Bali",
        "country": "Indonesia",
        "region": "Bali",
        "currency": "IDR",
        "bestSeason": "April to October",
        "description": "An Indonesian island of beaches, rice terraces, temples and lively beach clubs.",
        "tags": [
            "Nature",
            "Food",
            "Shopping",
            "History",
            "Nightlife"
        ],
        "dayPlans": [
            {
                "title": "Arrival & Seminyak",
                "activities": [
                    {
                        "icon": "🏨",
                        "name": "Hotel Check-in",
                        "description": "Check in and settle into your accommodation.",
                        "interests": [
                            "Nature",
                            "Food",
                            "Adventure",
                            "History",
                            "Shopping",
                            "Nightlife"
                        ]
                    },
                    {
                        "icon": "🏖️",
                        "name": "Seminyak Beach",
                        "description": "Relax on the sand and watch the waves roll in.",
                        "interests": [
                            "Nature"
                        ]
                    },
                    {
                        "icon": "🍴",
                        "name": "Beachside Dinner",
                        "description": "Enjoy fresh seafood with your feet in the sand.",
                        "interests": [
                            "Food"
                        ]
                    }
                ]
            },
            {
                "title": "Ubud Culture & Nature",
                "activities": [
                    {
                        "icon": "🌿",
                        "name": "Tegallalang Rice Terraces",
                        "description": "Walk among the layered green rice fields.",
                        "interests": [
                            "Nature"
                        ]
                    },
                    {
                        "icon": "🐒",
                        "name": "Sacred Monkey Forest",
                        "description": "Wander through a jungle sanctuary with temples and monkeys.",
                        "interests": [
                            "Nature"
                        ]
                    },
                    {
                        "icon": "🎨",
                        "name": "Ubud Art Market",
                        "description": "Shop for crafts, textiles and local art.",
                        "interests": [
                            "Shopping"
                        ]
                    }
                ]
            },
            {
                "title": "Temples & Cliffs",
                "activities": [
                    {
                        "icon": "🛕",
                        "name": "Uluwatu Temple",
                        "description": "Visit the clifftop sea temple above the Indian Ocean.",
                        "interests": [
                            "History"
                        ]
                    },
                    {
                        "icon": "🌅",
                        "name": "Cliffside Sunset",
                        "description": "Watch the sun go down over the ocean from the cliffs.",
                        "interests": [
                            "Nature"
                        ]
                    },
                    {
                        "icon": "🌙",
                        "name": "Beach Club Night",
                        "description": "End the day at a lively beach club with music and drinks.",
                        "interests": [
                            "Nightlife"
                        ]
                    }
                ]
            }
        ]
    }
];