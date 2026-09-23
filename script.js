const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weatherDescription");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const message = document.getElementById("message");


// Search button
searchBtn.addEventListener("click", getWeather);


// Enter key
cityInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        getWeather();
    }

});


async function getWeather() {

    const city = cityInput.value.trim();

    if (city === "") {
        message.textContent = "Please enter a city name.";
        return;
    }

    message.textContent = "Loading...";

    try {

        // Find city coordinates
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        const locationData = await locationResponse.json();

        if (!locationData.results) {
            message.textContent = "City not found!";
            return;
        }

        const location = locationData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Get weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
        );

        const weatherData = await weatherResponse.json();

        const currentWeather = weatherData.current;

        // Display information
        cityName.textContent = location.name;

        temperature.textContent = currentWeather.temperature_2m;

        humidity.textContent =
            currentWeather.relative_humidity_2m + "%";

        windSpeed.textContent =
            currentWeather.wind_speed_10m + " km/h";

        weatherDescription.textContent =
            getWeatherDescription(currentWeather.weather_code);

        message.textContent = "";

    } catch (error) {

        message.textContent =
            "Something went wrong. Please try again.";

        console.log(error);
    }
}


// Weather code ko readable text mein convert karta hai
function getWeatherDescription(code) {

    if (code === 0) {
        return "☀️ Clear Sky";
    }

    if (code >= 1 && code <= 3) {
        return "⛅ Partly Cloudy";
    }

    if (code >= 45 && code <= 48) {
        return "🌫️ Foggy";
    }

    if (code >= 51 && code <= 57) {
        return "🌦️ Drizzle";
    }

    if (code >= 61 && code <= 67) {
        return "🌧️ Rainy";
    }

    if (code >= 71 && code <= 77) {
        return "❄️ Snowy";
    }

    if (code >= 80 && code <= 82) {
        return "🌧️ Rain Showers";
    }

    if (code >= 95) {
        return "⛈️ Thunderstorm";
    }

    return "🌤️ Unknown Weather";
}