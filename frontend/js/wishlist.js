document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =========================================
           GET WISHLIST
        ========================================= */

        let wishlist =
            JSON.parse(
                localStorage.getItem(
                    "offwegoWishlist"
                )
            ) || [];


        const container =
            document.getElementById(
                "wishlistContainer"
            );


        const emptyMessage =
            document.getElementById(
                "emptyWishlist"
            );


        /* =========================================
           DISPLAY WISHLIST
        ========================================= */

        function displayWishlist() {


            container.innerHTML = "";


            /* EMPTY */

            if (wishlist.length === 0) {

                emptyMessage.style.display =
                    "block";

                return;

            }


            /* HAS ITEMS */

            emptyMessage.style.display =
                "none";


            wishlist.forEach(
                function (trip, index) {


                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "wishlist-card";


                    card.innerHTML = `

                        <div class="wishlist-image">

                            <img
                                src="${trip.image}"
                                alt="${trip.name}"
                            >

                            <button
                                class="remove-wishlist"
                                data-index="${index}"
                                title="Remove from wishlist"
                            >
                                ♥
                            </button>

                        </div>


                        <div class="wishlist-info">

                            <h3>
                                ${trip.name}
                            </h3>

                            <p>
                                ${trip.location}
                            </p>

                            <p>
                                ${trip.date}
                            </p>

                            <p>
                                ♟ ${trip.people} People
                            </p>


                            <div class="wishlist-bottom">

                                <span class="wishlist-price">
                                    ${trip.price}
                                </span>

                                <a
                                    href="${trip.page}"
                                    class="view-trip"
                                >
                                    View Trip
                                </a>

                            </div>

                        </div>

                    `;


                    container.appendChild(
                        card
                    );

                }
            );


            /* =====================================
               REMOVE BUTTONS
            ===================================== */

            const removeButtons =
                document.querySelectorAll(
                    ".remove-wishlist"
                );


            removeButtons.forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {


                            const index =
                                Number(
                                    button.dataset.index
                                );


                            wishlist.splice(
                                index,
                                1
                            );


                            saveWishlist();

                        }
                    );

                }
            );

        }


        /* =========================================
           SAVE WISHLIST
        ========================================= */

        function saveWishlist() {

            localStorage.setItem(
                "offwegoWishlist",
                JSON.stringify(
                    wishlist
                )
            );


            displayWishlist();

        }


        /* =========================================
           INITIAL DISPLAY
        ========================================= */

        displayWishlist();

    }
);