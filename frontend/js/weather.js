function weatherInfo(code) {
    if (code === 0) return { icon: "☀️", label: "Clear" };
    if (code <= 3) return { icon: "⛅", label: "Partly cloudy" };
    if (code === 45 || code === 48) return { icon: "🌫️", label: "Foggy" };
    if (code === 56 || code === 57 || code === 66 || code === 67) return { icon: "🌧️", label: "Freezing rain" };
    if (code >= 51 && code <= 55) return { icon: "🌦️", label: "Drizzle" };
    if (code >= 61 && code <= 65) return { icon: "🌧️", label: "Rain" };
    if (code === 68 || code === 69) return { icon: "🌨️", label: "Sleet" };
    if (code >= 71 && code <= 77) return { icon: "❄️", label: "Snow" };
    if (code >= 80 && code <= 82) return { icon: "🌧️", label: "Rain showers" };
    if (code === 85 || code === 86) return { icon: "🌨️", label: "Snow showers" };
    if (code >= 95) return { icon: "⛈️", label: "Thunderstorm" };
    return { icon: "🌡️", label: "Weather" };
}

async function addWeatherToCard(card, trip) {
    const box = card.querySelector(".trip-weather");
    if (!box) return;

    const today = new Date().toLocaleDateString("en-CA");
    const startDate = String(trip.startDate).slice(0, 10);
    const endDate = String(trip.endDate).slice(0, 10);

    if (endDate < today) return;

    try {
        const weather = await OffWeGoAPI.getWeather(trip.destination);

        const forecastDay = weather.daily.find(function (day) {
            return day.date === startDate;
        });

        if (startDate > today && forecastDay) {
            const info = weatherInfo(forecastDay.code);
            box.textContent = info.icon + " " + info.label + " · " + forecastDay.min + "° / " + forecastDay.max + "°C";
        } else {
            const info = weatherInfo(weather.code);
            box.textContent = info.icon + " Now " + weather.temp + "°C · " + info.label;
        }
    } catch (error) {
        box.textContent = "";
    }
}