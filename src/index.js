import "./styles.css";
import { AppController } from "./app-controller.js";
import { VisualCrossingClient } from "./weather-api.js";
import { WeatherService } from "./weather-service.js";
import { renderWeather } from "./weather-view.js";
import { startCityClock } from "./weather-clock.js";

const app = new AppController({
  weatherService: new WeatherService(new VisualCrossingClient()),
  renderWeather,
  startCityClock,
  form: document.querySelector("#weather-form"),
  locationInput: document.querySelector("#location"),
  unitToggle: document.querySelector("#unit-toggle"),
  weatherError: document.querySelector("#weather-error"),
  weatherLoading: document.querySelector("#weather-loading"),
});

app.start();
document.querySelector("#copyright-year").textContent = new Date().getFullYear();
