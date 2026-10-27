// Small helpers shared by explore.js and destination.js
// (api.js must be loaded before this file)

const DEST_GRADIENTS = [
    "linear-gradient(135deg, #2563eb, #60a5fa)",
    "linear-gradient(135deg, #0f766e, #5eead4)",
    "linear-gradient(135deg, #7c3aed, #c4b5fd)",
    "linear-gradient(135deg, #ea580c, #fdba74)",
    "linear-gradient(135deg, #be185d, #f9a8d4)",
    "linear-gradient(135deg, #1d4ed8, #67e8f9)"
];

const TAG_EMOJI = {
    Adventure: "🏔️",
    Food: "🍜",
    History: "🏛️",
    Nature: "🌿",
    Nightlife: "🌙",
    Shopping: "🛍️"
};

// Destination data is editable by admins, so it is escaped before going into innerHTML
function escapeHtml(text) {
    return String(text == null ? "" : text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Same destination always gets the same colour
function destGradient(slug) {
    let hash = 0;
    const text = String(slug || "");
    for (let i = 0; i < text.length; i++) {
        hash = (hash * 31 + text.charCodeAt(i)) % 1000003;
    }
    return DEST_GRADIENTS[hash % DEST_GRADIENTS.length];
}

function destEmoji(destination) {
    const tags = destination.tags || [];
    for (let i = 0; i < tags.length; i++) {
        if (TAG_EMOJI[tags[i]]) return TAG_EMOJI[tags[i]];
    }
    return "📍";
}

// Right side of the top bar: Dashboard when logged in, Log in otherwise
function renderTopbarAuth() {
    const box = document.getElementById("topbarAuth");
    if (!box) return;

    if (OffWeGoAPI.getToken()) {
        box.innerHTML = '<a href="dashboard.html" class="topbar-btn">Dashboard</a>';
    } else {
        box.innerHTML =
            '<a href="login.html" class="topbar-link">Log in</a>' +
            '<a href="signup.html" class="topbar-btn">Sign up</a>';
    }
}

// Link that opens the trip wizard with this destination already chosen
function planTripUrl(destination) {
    return "trip.html?destination=" + encodeURIComponent(destination.name);
}

// "March to June, and December to February" -> Set of month numbers (0 = January).
// Returns null when the text has no "X to Y" range, so the destination is never wrongly hidden.
const MONTH_NAMES = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

function seasonMonths(text) {
    const months = new Set();
    const pattern = /(january|february|march|april|may|june|july|august|september|october|november|december)\s+(?:to|through|-|–)\s+(january|february|march|april|may|june|july|august|september|october|november|december)/gi;
    let found = false;
    let match;

    while ((match = pattern.exec(String(text || ""))) !== null) {
        found = true;
        let month = MONTH_NAMES.indexOf(match[1].toLowerCase());
        const last = MONTH_NAMES.indexOf(match[2].toLowerCase());
        months.add(month);
        while (month !== last) {
            month = (month + 1) % 12;
            months.add(month);
        }
    }

    return found ? months : null;
}