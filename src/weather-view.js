import { createAirQualitySummary, createForecastAirQuality } from "./features/air-quality/air-quality-view.js";
import { getWeatherTheme } from "./features/appearance/weather-theme.js";

function formatTemperature(celsius, unit) {
  if (celsius == null) return "Unavailable";

  const temperature = unit === "F"
    ? (celsius * 9) / 5 + 32
    : celsius;

  return `${Math.round(temperature)}°${unit}`;
}

function createForecast(forecast, unit, showAirQuality) {
	const list = document.createElement("div");
	list.classList.add("forecast-list");

	forecast.forEach((day) => {
		const card = document.createElement("article");
		card.classList.add("forecast-card");
		card.dataset.weather = getWeatherTheme(day.icon);

		const date = document.createElement("h3");
		date.textContent = new Date(`${day.date}T00:00:00`).toLocaleDateString(
			undefined,
			{
				weekday: "short",
				month: "short",
				day: "numeric",
			},
		);

		const conditions = document.createElement("p");
		conditions.textContent = day.conditions;

		const temperatures = document.createElement("p");
		temperatures.textContent =
			`High: ${formatTemperature(day.high, unit)} / Low: ${formatTemperature(day.low, unit)}`;

		card.append(date, conditions, temperatures);
		if (showAirQuality) card.append(createForecastAirQuality(day.airQuality));
		list.append(card);
	});

	return list;
}

export function renderWeather(weather, unit, showAirQuality = false) {
  const container = document.querySelector("#weather-results");

  const location = document.createElement("h2");
  location.textContent = weather.location;

  const conditions = document.createElement("p");
  conditions.textContent = weather.current.conditions;

  const temperature = document.createElement("p");
  temperature.classList.add("current-temperature");
  temperature.textContent =
    `Temperature: ${formatTemperature(weather.current.temperature, unit)}`;

  const feelsLike = document.createElement("p");
  feelsLike.textContent =
    `Feels like: ${formatTemperature(weather.current.feelsLike, unit)}`;

  const description = document.createElement("p");
  description.textContent = weather.description;
  const forecast = createForecast(weather.forecast, unit, showAirQuality);

  container.replaceChildren(
    location,
    conditions,
    temperature,
    feelsLike,
    description,
  );
  document.querySelector("#forecast-results").replaceChildren(forecast);
  document.querySelector("#air-quality-panel").replaceChildren(createAirQualitySummary(weather));
}
