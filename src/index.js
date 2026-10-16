import "./styles.css";
import { AppController } from "./app-controller.js";
import { VisualCrossingClient } from "./weather-api.js";
import { WeatherService } from "./weather-service.js";
import { renderWeather } from "./weather-view.js";
import { startCityClock } from "./weather-clock.js";
import { LocationBrowser } from "./features/locations/location-browser.js";

const locationBrowser = new LocationBrowser({
  continentList: document.querySelector("#continent-list"),
  countryPanel: document.querySelector("#country-panel"),
  countryList: document.querySelector("#country-list"),
  countryStatus: document.querySelector("#country-status"),
  onSelectCountry: (country) => app.selectCountry(country),
});

const app = new AppController({
  weatherService: new WeatherService(new VisualCrossingClient()),
  renderWeather,
  startCityClock,
  form: document.querySelector("#weather-form"),
  locationInput: document.querySelector("#location"),
  unitToggle: document.querySelector("#unit-toggle"),
  weatherError: document.querySelector("#weather-error"),
  weatherLoading: document.querySelector("#weather-loading"),
  onLocationChange: (countryCode) => locationBrowser.setSelectedCountry(countryCode),
});

locationBrowser.start();
app.start();
document.querySelector("#copyright-year").textContent = new Date().getFullYear();
document.querySelector("#country-data-license").href = new URL(
  "./data/COUNTRIES-LICENSE.txt", import.meta.url,
).href;
