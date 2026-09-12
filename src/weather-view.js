function formatTemperature(celsius, unit) {
  if (celsius == null) return "Unavailable";

  const temperature = unit === "F"
    ? (celsius * 9) / 5 + 32
    : celsius;

  return `${Math.round(temperature)}°${unit}`;
}

export function renderWeather(weather, unit) {
  const container = document.querySelector("#weather-results");

  const location = document.createElement("h2");
  location.textContent = weather.location;

  const conditions = document.createElement("p");
  conditions.textContent = weather.current.conditions;

  const temperature = document.createElement("p");
  temperature.textContent =
    `Temperature: ${formatTemperature(weather.current.temperature, unit)}`;

  const feelsLike = document.createElement("p");
  feelsLike.textContent =
    `Feels like: ${formatTemperature(weather.current.feelsLike, unit)}`;

  const description = document.createElement("p");
  description.textContent = weather.description;

  container.replaceChildren(
    location,
    conditions,
    temperature,
    feelsLike,
    description,
  );
}