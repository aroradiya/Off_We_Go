// Explore page: browse the destinations catalog with search, filters and sorting

document.addEventListener("DOMContentLoaded", function () {

    renderTopbarAuth();

    const grid = document.getElementById("destGrid");
    const searchInput = document.getElementById("searchInput");
    const countryFilter = document.getElementById("countryFilter");
    const monthFilter = document.getElementById("monthFilter");
    const sortSelect = document.getElementById("sortSelect");
    const tagChips = document.getElementById("tagChips");
    const resultsCount = document.getElementById("resultsCount");
    const clearButton = document.getElementById("clearFilters");

    let allDestinations = [];
    let selectedTag = "";

    const MONTH_LABELS = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    MONTH_LABELS.forEach(function (label, index) {
        const option = document.createElement("option");
        option.value = String(index);
        option.textContent = "Best in " + label;
        monthFilter.appendChild(option);
    });


    /* =========================================
       FILTER OPTIONS (built from the catalog)
    ========================================= */

    function buildFilterOptions() {

        const countries = Array.from(new Set(allDestinations.map(function (d) {
            return d.country;
        }))).sort();

        countries.forEach(function (country) {
            const option = document.createElement("option");
            option.value = country;
            option.textContent = country;
            countryFilter.appendChild(option);
        });

        const tags = Array.from(new Set(allDestinations.reduce(function (list, d) {
            return list.concat(d.tags || []);
        }, []))).sort();

        tagChips.innerHTML = "";
        ["All"].concat(tags).forEach(function (tag) {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "chip" + (tag === "All" ? " selected" : "");
            chip.textContent = tag === "All" ? "All" : (TAG_EMOJI[tag] ? TAG_EMOJI[tag] + " " : "") + tag;
            chip.dataset.tag = tag === "All" ? "" : tag;
            chip.addEventListener("click", function () {
                selectedTag = chip.dataset.tag;
                tagChips.querySelectorAll(".chip").forEach(function (item) {
                    item.classList.toggle("selected", item === chip);
                });
                render();
            });
            tagChips.appendChild(chip);
        });
    }


    /* =========================================
       FILTER + SORT
    ========================================= */

    function getVisibleDestinations() {

        const query = searchInput.value.trim().toLowerCase();
        const country = countryFilter.value;
        const month = monthFilter.value;

        const list = allDestinations.filter(function (d) {

            if (query) {
                const text = (d.name + " " + d.country + " " + (d.region || "")).toLowerCase();
                if (!text.includes(query)) return false;
            }

            if (country && d.country !== country) return false;

            if (selectedTag && !(d.tags || []).includes(selectedTag)) return false;

            if (month !== "") {
                const months = seasonMonths(d.bestSeason);
                // no readable season text: keep it rather than hide it by mistake
                if (months && !months.has(Number(month))) return false;
            }

            return true;
        });

        const sortBy = sortSelect.value;
        list.sort(function (a, b) {
            if (sortBy === "country") {
                return a.country.localeCompare(b.country) || a.name.localeCompare(b.name);
            }
            return a.name.localeCompare(b.name);
        });

        return list;
    }

    function hasActiveFilters() {
        return searchInput.value.trim() !== "" || countryFilter.value !== ""
            || monthFilter.value !== "" || selectedTag !== "";
    }


    /* =========================================
       DRAW THE CARDS
    ========================================= */

    function cardHtml(d) {

        const tags = (d.tags || []).slice(0, 4).map(function (tag) {
            return '<span class="tag">' + escapeHtml(tag) + "</span>";
        }).join("");

        const place = [d.region, d.country].filter(Boolean).join(", ");
        const detailUrl = "destination.html?slug=" + encodeURIComponent(d.slug);

        return '' +
            '<article class="dest-card" data-url="' + escapeHtml(detailUrl) + '">' +
                '<div class="dest-cover" style="background:' + destGradient(d.slug) + '">' + destEmoji(d) + '</div>' +
                '<div class="dest-body">' +
                    '<h3>' + escapeHtml(d.name) + '</h3>' +
                    '<div class="dest-place">' + escapeHtml(place) + '</div>' +
                    '<div class="dest-desc">' + escapeHtml(d.description) + '</div>' +
                    '<div class="tag-row">' + tags + '</div>' +
                    (d.bestSeason ? '<div class="dest-season">🗓 ' + escapeHtml(d.bestSeason) + '</div>' : '') +
                    '<div class="dest-actions">' +
                        '<a class="btn btn-outline" href="' + escapeHtml(detailUrl) + '">View</a>' +
                        '<a class="btn btn-primary" href="' + escapeHtml(planTripUrl(d)) + '">Plan a trip</a>' +
                    '</div>' +
                '</div>' +
            '</article>';
    }

    function render() {

        const list = getVisibleDestinations();

        clearButton.hidden = !hasActiveFilters();

        resultsCount.textContent = list.length + (list.length === 1 ? " destination" : " destinations");

        if (list.length === 0) {
            grid.innerHTML =
                '<div class="state-box"><h3>No destinations match</h3>' +
                '<p>Try a different search or clear the filters.</p></div>';
            return;
        }

        grid.innerHTML = list.map(cardHtml).join("");
    }

    // Clicking anywhere on a card opens it (the buttons keep their own links)
    grid.addEventListener("click", function (event) {
        if (event.target.closest("a")) return;
        const card = event.target.closest(".dest-card");
        if (card) window.location.href = card.dataset.url;
    });


    /* =========================================
       EVENTS
    ========================================= */

    searchInput.addEventListener("input", render);
    countryFilter.addEventListener("change", render);
    monthFilter.addEventListener("change", render);
    sortSelect.addEventListener("change", render);

    clearButton.addEventListener("click", function () {
        searchInput.value = "";
        countryFilter.value = "";
        monthFilter.value = "";
        selectedTag = "";
        tagChips.querySelectorAll(".chip").forEach(function (chip, index) {
            chip.classList.toggle("selected", index === 0);
        });
        render();
    });


    /* =========================================
       LOAD THE CATALOG
    ========================================= */

    function load() {

        grid.innerHTML = '<div class="state-box">Loading destinations...</div>';

        OffWeGoAPI.getDestinations()
            .then(function (catalog) {

                allDestinations = catalog;

                if (allDestinations.length === 0) {
                    grid.innerHTML = '<div class="state-box"><h3>No destinations yet</h3><p>The catalog is empty.</p></div>';
                    resultsCount.textContent = "";
                    return;
                }

                buildFilterOptions();
                render();
            })
            .catch(function (error) {
                grid.innerHTML =
                    '<div class="state-box"><h3>Could not load destinations</h3>' +
                    '<p>' + escapeHtml(error.message) + '</p>' +
                    '<button type="button" class="btn btn-primary" id="retryButton">Try again</button></div>';
                document.getElementById("retryButton").addEventListener("click", load);
            });
    }

    load();

});