// Destination page: one destination with facts, suggested day plans and a "plan a trip" button

document.addEventListener("DOMContentLoaded", function () {

    renderTopbarAuth();

    const page = document.getElementById("destinationPage");
    const slug = new URLSearchParams(window.location.search).get("slug");

    function showMessage(title, text) {
        page.innerHTML =
            '<div class="state-box"><h3>' + escapeHtml(title) + '</h3><p>' + escapeHtml(text) + '</p>' +
            '<a class="btn btn-primary" href="explore.html">Back to Explore</a></div>';
    }

    if (!slug) {
        showMessage("No destination chosen", "Pick one from the Explore page.");
        return;
    }


    function dayPlansHtml(dayPlans) {

        if (!dayPlans || dayPlans.length === 0) {
            return "<p>No suggested plan for this destination yet.</p>";
        }

        return dayPlans.map(function (day, index) {

            const activities = (day.activities || []).map(function (activity) {
                return '' +
                    '<div class="activity">' +
                        '<div class="activity-icon">' + escapeHtml(activity.icon || "📍") + '</div>' +
                        '<div><strong>' + escapeHtml(activity.name) + '</strong>' +
                        (activity.description ? '<span class="desc">' + escapeHtml(activity.description) + '</span>' : '') +
                        '</div>' +
                    '</div>';
            }).join("");

            return '' +
                '<div class="day">' +
                    '<div class="day-title"><span>Day ' + (index + 1) + ': ' + escapeHtml(day.title) + '</span>' +
                    '<small>' + (day.activities || []).length + ' activities</small></div>' +
                    activities +
                '</div>';
        }).join("");
    }


    function render(d, similar) {

        document.title = d.name + " - OffWeGo";

        const place = [d.region, d.country].filter(Boolean).join(", ");

        const tags = (d.tags || []).map(function (tag) {
            return '<span class="tag">' + escapeHtml(tag) + "</span>";
        }).join("");

        const similarHtml = similar.map(function (item) {
            return '' +
                '<a class="similar" href="destination.html?slug=' + encodeURIComponent(item.slug) + '">' +
                    '<div class="similar-dot" style="background:' + destGradient(item.slug) + '">' + destEmoji(item) + '</div>' +
                    '<div><strong>' + escapeHtml(item.name) + '</strong><small>' + escapeHtml(item.country) + '</small></div>' +
                '</a>';
        }).join("");

        page.innerHTML = '' +
            '<section class="hero" style="background:' + destGradient(d.slug) + '">' +
                '<div class="hero-emoji">' + destEmoji(d) + '</div>' +
                '<div><h1>' + escapeHtml(d.name) + '</h1><p>' + escapeHtml(place) + '</p></div>' +
            '</section>' +

            '<div class="detail-layout">' +

                '<div>' +
                    '<section class="panel">' +
                        '<h2>About</h2>' +
                        '<p>' + escapeHtml(d.description) + '</p>' +
                        '<div class="tag-row">' + tags + '</div>' +
                    '</section>' +

                    '<section class="panel">' +
                        '<h2>Quick facts</h2>' +
                        '<div class="facts">' +
                            '<div class="fact"><span>Country</span><strong>' + escapeHtml(d.country) + '</strong></div>' +
                            '<div class="fact"><span>Region</span><strong>' + escapeHtml(d.region || "-") + '</strong></div>' +
                            '<div class="fact"><span>Currency</span><strong>' + escapeHtml(d.currency || "-") + '</strong></div>' +
                            '<div class="fact"><span>Best time to visit</span><strong>' + escapeHtml(d.bestSeason || "-") + '</strong></div>' +
                        '</div>' +
                    '</section>' +

                    '<section class="panel">' +
                        '<h2>Suggested plan</h2>' +
                        dayPlansHtml(d.dayPlans) +
                    '</section>' +
                '</div>' +

                '<aside>' +
                    '<section class="panel side-card">' +
                        '<h2>Ready to go?</h2>' +
                        '<p>Pick your dates and budget, and we will build the itinerary.</p>' +
                        '<a class="btn btn-primary" href="' + escapeHtml(planTripUrl(d)) + '">Plan a trip to ' + escapeHtml(d.name) + '</a>' +
                        '<a class="btn btn-outline" href="explore.html">← All destinations</a>' +
                    '</section>' +

                    '<section class="panel">' +
                        '<h2>Coming soon</h2>' +
                        '<div class="soon-list">' +
                            '<div class="soon">🌤 <div><b>Weather forecast</b><br>For your travel dates</div></div>' +
                            '<div class="soon">💱 <div><b>Currency converter</b><br>Budget in ' + escapeHtml(d.currency || "local currency") + '</div></div>' +
                            '<div class="soon">🛡 <div><b>Safety and visa info</b><br>Emergency numbers, entry rules</div></div>' +
                        '</div>' +
                    '</section>' +

                    (similar.length ? '<section class="panel"><h2>You may also like</h2><div class="similar-grid">' + similarHtml + '</div></section>' : '') +
                '</aside>' +

            '</div>';
    }


    // "You may also like": other destinations that share the most tags
    function pickSimilar(current, catalog) {

        const tags = current.tags || [];

        return catalog
            .filter(function (item) { return item.slug !== current.slug; })
            .map(function (item) {
                const shared = (item.tags || []).filter(function (tag) { return tags.includes(tag); }).length;
                return { item: item, shared: shared };
            })
            .sort(function (a, b) { return b.shared - a.shared; })
            .slice(0, 3)
            .map(function (entry) { return entry.item; });
    }


    OffWeGoAPI.getDestination(slug)
        .then(function (destination) {

            // the "similar" list is a bonus: if it fails, the page still shows
            return OffWeGoAPI.getDestinations()
                .then(function (catalog) { return pickSimilar(destination, catalog); })
                .catch(function () { return []; })
                .then(function (similar) { render(destination, similar); });
        })
        .catch(function (error) {
            if (error.status === 404) {
                showMessage("Destination not found", "It may have been removed from the catalog.");
            } else {
                showMessage("Could not load this destination", error.message);
            }
        });

});