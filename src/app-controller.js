import { capitalQuery } from "./features/locations/location-catalog.js";

export class AppController {
  constructor({ weatherService, renderWeather, startCityClock, form, locationInput,
    unitToggle, airQualityToggle, airQualityPanel, weatherError, weatherLoading, onLocationChange = () => {} }) {
    this.weatherService = weatherService;
    this.renderWeather = renderWeather;
    this.startCityClock = startCityClock;
    this.form = form;
    this.locationInput = locationInput;
    this.unitToggle = unitToggle;
    this.airQualityToggle = airQualityToggle;
    this.airQualityPanel = airQualityPanel;
    this.weatherError = weatherError;
    this.weatherLoading = weatherLoading;
    this.onLocationChange = onLocationChange;

    this.currentWeather = null;
    this.temperatureUnit = "C";
    this.showAirQuality = false;
    this.latestSearchId = 0;
  }

  start() {
    this.locationInput.addEventListener("input", () => {
      this.locationInput.setCustomValidity("");
    });
    this.form.addEventListener("submit", (event) => this.handleSearch(event));
    this.unitToggle.addEventListener("click", () => this.toggleUnit());
    this.airQualityToggle.addEventListener("click", () => this.toggleAirQuality());

    const defaultLocation = "Boise, ID";
    this.locationInput.value = defaultLocation;
    return this.loadLocation(defaultLocation);
  }

  handleSearch(event) {
    event.preventDefault();

    const location = this.locationInput.value.trim();
    if (!location) {
      this.locationInput.setCustomValidity("Please enter a location.");
      this.locationInput.reportValidity();
      return;
    }

    return this.loadLocation(location);
  }

  selectCountry(country) {
    const location = capitalQuery(country);
    this.locationInput.value = location;
    this.locationInput.setCustomValidity("");
    return this.loadLocation(location, country.code);
  }

  async loadLocation(location, countryCode = null) {
    const searchId = ++this.latestSearchId;
    this.onLocationChange(countryCode);
    this.weatherError.textContent = "";
    this.weatherLoading.textContent = `Loading weather for ${location}…`;
    this.weatherLoading.hidden = false;

    try {
      const weather = await this.weatherService.getWeather(location);
      if (searchId !== this.latestSearchId) return;

      this.currentWeather = weather;
      this.locationInput.value = weather.location;
      this.renderWeather(weather, this.temperatureUnit, this.showAirQuality);
      this.startCityClock(weather);
    } catch (error) {
      if (searchId !== this.latestSearchId) return;
      this.weatherError.textContent = error.message;
    } finally {
      if (searchId === this.latestSearchId) {
        this.weatherLoading.hidden = true;
      }
    }
  }

  toggleUnit() {
    this.temperatureUnit = this.temperatureUnit === "C" ? "F" : "C";
    this.unitToggle.textContent = this.temperatureUnit === "C"
      ? "Switch to °F"
      : "Switch to °C";

    if (this.currentWeather) {
      this.renderWeather(this.currentWeather, this.temperatureUnit, this.showAirQuality);
    }
  }

  toggleAirQuality() {
    this.showAirQuality = !this.showAirQuality;
    this.airQualityToggle.setAttribute("aria-pressed", String(this.showAirQuality));
    this.airQualityPanel.hidden = !this.showAirQuality;
    if (this.currentWeather) {
      this.renderWeather(this.currentWeather, this.temperatureUnit, this.showAirQuality);
    }
  }
}
