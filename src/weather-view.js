function formatTemperature(celsius, unit) {
  if (celsius == null) return "Unavailable";

  const temperature = unit === "F"
    ? (celsius * 9) / 5 + 32
    : celsius;

  return `${Math.round(temperature)}°${unit}`;
}

function createForecast(forecast, unit) {
	const section = document.createElement("section");
	section.classList.add("forecast");

	const heading = document.createElement("h3");
	heading.textContent = "Daily forecast";

	const list = document.createElement("div");
	list.classList.add("forecast-list");

	forecast.forEach((day) => {
		const card = document.createElement("article");
		card.classList.add("forecast-card");

		const date = document.createElement("h4");
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
		list.append(card);
	});

	section.append(heading, list);

	return section;
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
  const forecast = createForecast(weather.forecast, unit);

  container.replaceChildren(
    location,
    conditions,
    temperature,
    feelsLike,
    description,
    forecast,
  );
}