import "./styles.css";
import { fetchWeather } from "./weather-api.js";
import { processWeatherData } from "./weather-data.js";
import { renderWeather } from "./weather-view.js";

const weatherForm = document.querySelector("#weather-form");
const locationInput = document.querySelector("#location");

const unitToggle = document.querySelector("#unit-toggle");
const weatherError = document.querySelector("#weather-error");

let currentWeather = null;
let temperatureUnit = "C";
let latestSearchId = 0;

async function handleWeatherSearch(event) {
  event.preventDefault();

  const location = locationInput.value.trim();

  if (!location) {
    locationInput.setCustomValidity("Please enter a location.");
    locationInput.reportValidity();
    return;
  }

  const searchId = ++latestSearchId;
  weatherError.textContent = "";

  try {
    const rawData = await fetchWeather(location);

    if (searchId !== latestSearchId) return;

    currentWeather = processWeatherData(rawData);
    renderWeather(currentWeather, temperatureUnit);
  } catch (error) {
    if (searchId !== latestSearchId) return;

    weatherError.textContent = error.message;
  }
}

locationInput.addEventListener("input", () => {
    locationInput.setCustomValidity("");
});

weatherForm.addEventListener("submit", handleWeatherSearch);

unitToggle.addEventListener("click", () => {
    temperatureUnit = temperatureUnit === "C" ? "F" : "C";

    unitToggle.textContent = temperatureUnit === "C"
    ? "Switch to °F"
    : "Switch to °C";

    if (currentWeather) {
    renderWeather(currentWeather, temperatureUnit);
    }
});