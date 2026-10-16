export class AppController {
  constructor({ weatherService, renderWeather, startCityClock, form, locationInput,
    unitToggle, weatherError, weatherLoading }) {
    this.weatherService = weatherService;
    this.renderWeather = renderWeather;
    this.startCityClock = startCityClock;
    this.form = form;
    this.locationInput = locationInput;
    this.unitToggle = unitToggle;
    this.weatherError = weatherError;
    this.weatherLoading = weatherLoading;

    this.currentWeather = null;
    this.temperatureUnit = "C";
    this.latestSearchId = 0;
  }

  start() {
    this.locationInput.addEventListener("input", () => {
      this.locationInput.setCustomValidity("");
    });
    this.form.addEventListener("submit", (event) => this.handleSearch(event));
    this.unitToggle.addEventListener("click", () => this.toggleUnit());
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

  async loadLocation(location) {
    const searchId = ++this.latestSearchId;
    this.weatherError.textContent = "";
    this.weatherLoading.hidden = false;

    try {
      const weather = await this.weatherService.getWeather(location);
      if (searchId !== this.latestSearchId) return;

      this.currentWeather = weather;
      this.renderWeather(weather, this.temperatureUnit);
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
      this.renderWeather(this.currentWeather, this.temperatureUnit);
    }
  }
}
